import { parse as parseTemplate } from '@vue/compiler-dom'
import { parse as parseExpression } from '@babel/parser'
import MagicString from 'magic-string'

// 这个插件在 uni 编译器之前运行：模板使用 Vue AST 识别，事件表达式使用 Babel AST 识别。
// 两层 AST 避免正则在引号、修饰符、条件表达式和嵌套调用上误改业务代码。
const CLICK_EVENTS = new Set([
  'click',
  'tap',
  'longpress',
  'longtap',
  'getuserinfo',
  'getphonenumber',
  'contact',
])

const CHANGE_EVENTS = new Set(['blur', 'change', 'confirm'])
const CHANGE_PAYLOAD_TYPE = 'any | null'
const TARGET_ID_VALUE_TYPE = 'string | number | null'
const TARGET_DATASET_VALUE_TYPE = 'string | number | boolean | null'
const IMPORT_CODE =
  "import { gioHandleAutoClick as _gioHandleAutoClick, gioHandleAutoChange as _gioHandleAutoChange } from '@/uni_modules/gio-uniappx-autotracker/plugin.uts'\n"

/** 判断当前 Vite 转换目标是否为 Vue / uvue 单文件组件。 */
function isTargetFile(id) {
  // Vite 会在 id 后追加 ?vue、?v=hash 等查询参数，判断扩展名时必须先去掉它们。
  const cleanId = id.split('?')[0]
  return cleanId.endsWith('.vue') || cleanId.endsWith('.uvue')
}

/** 判断是否为 uni-link-x 的内部实现，避免改写组件内部的 openURL 事件导致递归采集。 */
function isUniLinkComponentFile(id) {
  return id.split('?')[0].replace(/\\/g, '/').endsWith('/uni_modules/uni-link-x/components/uni-link/uni-link.uvue')
}

/** 把模板事件名归并为 SDK 的 CLICK / CHANGE 两类采集动作；未知事件保持原样，不强行插桩。 */
function getEventKind(eventName) {
  const normalized = eventName.toLowerCase()
  if (CLICK_EVENTS.has(normalized)) {
    return 'click'
  }
  if (CHANGE_EVENTS.has(normalized)) {
    return 'change'
  }
  return null
}

/**
 * 定位 SFC 中指定块的完整偏移量。
 * 模板内容随后会交给 AST 解析；这里仅负责保留原文件坐标，以便精确回写。
 */
function findBlock(code, tagName) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'i')
  const open = openRe.exec(code)
  if (open == null) {
    return null
  }
  const start = open.index + open[0].length
  const closeRe = new RegExp(`</${tagName}>`, 'i')
  closeRe.lastIndex = start
  const rest = code.slice(start)
  const close = closeRe.exec(rest)
  if (close == null) {
    return null
  }
  return {
    openStart: open.index,
    contentStart: start,
    contentEnd: start + close.index,
    closeEnd: start + close.index + close[0].length,
  }
}

/**
 * 定位所有 script 块，并优先返回 script setup。
 * 一个合法 SFC 可以同时有普通 script 与 script setup；模板 handler 属于 setup 作用域时，
 * import 和统一分发器必须注入 setup，不能错误地写入第一个普通 script。
 */
function findScriptBlock(code) {
  const blocks = []
  const openRe = /<script\b[^>]*>/gi
  let open = openRe.exec(code)
  while (open != null) {
    const start = open.index + open[0].length
    const closeRe = /<\/script>/i
    const close = closeRe.exec(code.slice(start))
    if (close == null) {
      return null
    }
    blocks.push({
      openStart: open.index,
      openTag: open[0],
      contentStart: start,
      contentEnd: start + close.index,
      closeEnd: start + close.index + close[0].length,
    })
    // 从当前闭合标签之后继续，避免把 script 内容里的字符串误识别为第二个块。
    openRe.lastIndex = start + close.index + close[0].length
    open = openRe.exec(code)
  }
  return blocks.find((block) => isSetupScript(block)) ?? (blocks.length > 0 ? blocks[0] : null)
}

/** 判断脚本是否为 `<script setup>`；两类脚本的可注入位置和调用作用域不同。 */
function isSetupScript(script) {
  return script != null && /\bsetup\b/i.test(script.openTag)
}

/** 去掉 TypeScript/UTS 的类型断言包装，读取真正的函数或对象表达式。 */
function unwrapScriptExpression(node) {
  let current = node
  while (
    current != null &&
    (current.type === 'TSAsExpression' ||
      current.type === 'TSTypeAssertion' ||
      current.type === 'TSNonNullExpression' ||
      current.type === 'ParenthesizedExpression')
  ) {
    current = current.expression
  }
  return current
}

/** 读取对象属性的静态名称；计算属性无法在编译期与模板方法引用可靠对应。 */
function readStaticPropertyName(node) {
  if (node == null || node.computed === true) {
    return null
  }
  if (node.key.type === 'Identifier' || node.key.type === 'StringLiteral') {
    return node.key.name ?? node.key.value
  }
  return null
}

/** 判断 AST 节点是否为具有明确参数个数的函数声明或表达式。 */
function readFunctionParameterCount(node) {
  const target = unwrapScriptExpression(node)
  if (
    target == null ||
    (target.type !== 'FunctionDeclaration' &&
      target.type !== 'FunctionExpression' &&
      target.type !== 'ArrowFunctionExpression' &&
      target.type !== 'ObjectMethod')
  ) {
    return null
  }
  return target.params.length
}

/** 收集 setup 顶层对象中的方法签名，例如 `actions.onClick`。 */
function collectObjectMethodParameterCounts(result, objectNode, prefix) {
  const target = unwrapScriptExpression(objectNode)
  if (target == null || target.type !== 'ObjectExpression') {
    return
  }
  for (const property of target.properties) {
    if (property.type !== 'ObjectProperty' && property.type !== 'ObjectMethod') {
      continue
    }
    const propertyName = readStaticPropertyName(property)
    if (propertyName == null) {
      continue
    }
    const path = `${prefix}.${propertyName}`
    const parameterCount = readFunctionParameterCount(property.type === 'ObjectMethod' ? property : property.value)
    if (parameterCount != null) {
      result.set(path, parameterCount)
      continue
    }
    if (property.type === 'ObjectProperty') {
      collectObjectMethodParameterCounts(result, property.value, path)
    }
  }
}

/** 收集 script setup 暴露给模板的顶层函数签名。 */
function collectSetupHandlerParameterCounts(result, programBody) {
  for (const rawStatement of programBody) {
    const statement = rawStatement.type === 'ExportNamedDeclaration' && rawStatement.declaration != null
      ? rawStatement.declaration
      : rawStatement
    if (statement.type === 'FunctionDeclaration' && statement.id != null) {
      result.set(statement.id.name, statement.params.length)
      continue
    }
    if (statement.type !== 'VariableDeclaration') {
      continue
    }
    for (const declaration of statement.declarations) {
      if (declaration.id.type !== 'Identifier' || declaration.init == null) {
        continue
      }
      const parameterCount = readFunctionParameterCount(declaration.init)
      if (parameterCount != null) {
        result.set(declaration.id.name, parameterCount)
      } else {
        collectObjectMethodParameterCounts(result, declaration.init, declaration.id.name)
      }
    }
  }
}

/** 读取 Options API `methods` 对象中的方法签名。 */
function collectOptionsHandlerParameterCounts(result, programBody) {
  const exportStatement = programBody.find((statement) => statement.type === 'ExportDefaultDeclaration')
  if (exportStatement == null) {
    return
  }
  let options = unwrapScriptExpression(exportStatement.declaration)
  if (options != null && options.type === 'CallExpression' && options.arguments.length > 0) {
    options = unwrapScriptExpression(options.arguments[0])
  }
  if (options == null || options.type !== 'ObjectExpression') {
    return
  }
  const methodsProperty = options.properties.find(
    (property) =>
      property.type === 'ObjectProperty' &&
      readStaticPropertyName(property) === 'methods' &&
      unwrapScriptExpression(property.value)?.type === 'ObjectExpression',
  )
  if (methodsProperty == null || methodsProperty.type !== 'ObjectProperty') {
    return
  }
  const methods = unwrapScriptExpression(methodsProperty.value)
  for (const property of methods.properties) {
    if (property.type !== 'ObjectProperty' && property.type !== 'ObjectMethod') {
      continue
    }
    const methodName = readStaticPropertyName(property)
    const parameterCount = readFunctionParameterCount(property.type === 'ObjectMethod' ? property : property.value)
    if (methodName != null && parameterCount != null) {
      result.set(methodName, parameterCount)
    }
  }
}

/**
 * 从当前 SFC 脚本收集模板可直接引用的方法参数个数。
 * 解析失败时保持空映射，由平台回退规则决定外部/动态引用是否接收 `$event`。
 */
function readHandlerParameterCounts(code, script) {
  const result = new Map()
  if (script == null) {
    return result
  }
  try {
    const program = parseExpression(code.slice(script.contentStart, script.contentEnd), {
      sourceType: 'module',
      plugins: ['typescript'],
    })
    if (isSetupScript(script)) {
      collectSetupHandlerParameterCounts(result, program.program.body)
    } else {
      collectOptionsHandlerParameterCounts(result, program.program.body)
    }
  } catch (_) {
    return result
  }
  return result
}

/**
 * 在普通 Options API 脚本中寻找对象字面量的闭合花括号。
 * 需要跳过字符串、模板字符串及单双行注释，避免业务代码里的 `}` 干扰 methods 注入位置。
 */
function findMatchingBrace(code, openIndex, limit) {
  let depth = 0
  let quote = null
  let escaped = false
  let lineComment = false
  let blockComment = false
  for (let i = openIndex; i < limit; i++) {
    const current = code[i]
    const next = i + 1 < limit ? code[i + 1] : ''
    // 注释、字符串内部的花括号不参与对象层级计数。
    if (lineComment) {
      if (current === '\n') {
        lineComment = false
      }
      continue
    }
    if (blockComment) {
      if (current === '*' && next === '/') {
        blockComment = false
        i++
      }
      continue
    }
    if (quote != null) {
      if (escaped) {
        escaped = false
      } else if (current === '\\') {
        escaped = true
      } else if (current === quote) {
        quote = null
      }
      continue
    }
    if (current === '/' && next === '/') {
      lineComment = true
      i++
      continue
    }
    if (current === '/' && next === '*') {
      blockComment = true
      i++
      continue
    }
    if (current === '"' || current === "'" || current === '`') {
      quote = current
      continue
    }
    if (current === '{') {
      depth++
    } else if (current === '}') {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }
  return -1
}

/** 返回桥接 import 应插入的位置：优先已选 script 开标签之后，无 script 时插入 template 之后。 */
function findScriptInsertionOffset(code, script = null) {
  if (script != null) {
    return script.contentStart
  }
  const template = findBlock(code, 'template')
  return template != null ? template.closeEnd : code.length
}

/**
 * 从任意事件表达式推断用于 xpath 的 handler 名。
 * 推断失败只影响采集标签，不影响原业务表达式执行，因此回退到事件名而不是抛错。
 */
function inferHandlerName(expression, fallback) {
  const source = expression.trim()
  if (source.length === 0) {
    return fallback
  }
  try {
    // Babel 把表达式包装为 Program，统一处理 `foo()`、条件表达式和逗号表达式。
    const program = parseExpression(source, {
      sourceType: 'script',
      plugins: ['typescript'],
    })
    for (const statement of program.program.body) {
      if (statement.type !== 'ExpressionStatement') {
        continue
      }
      const handlerName = findHandlerName(statement.expression)
      if (handlerName != null) {
        return handlerName
      }
    }
  } catch (_) {
    return fallback
  }
  return fallback
}

/** 递归从表达式 AST 中提取第一个可读的方法路径。 */
function findHandlerName(expression) {
  if (expression == null || typeof expression !== 'object') {
    return null
  }
  if (expression.type === 'CallExpression') {
    return readMemberPath(expression.callee)
  }
  if (expression.type === 'Identifier' || expression.type === 'MemberExpression') {
    return readMemberPath(expression)
  }
  if (expression.type === 'ConditionalExpression') {
    // 条件表达式没有唯一静态 handler；调用方未做分支映射时回退到原事件名，不能谎报真分支。
    return null
  }
  if (expression.type === 'LogicalExpression') {
    return findHandlerName(expression.right) ?? findHandlerName(expression.left)
  }
  if (expression.type === 'SequenceExpression') {
    for (const item of expression.expressions) {
      const nested = findHandlerName(item)
      if (nested != null) {
        return nested
      }
    }
    return null
  }
  // 兜底遍历覆盖被 Babel 包装的表达式节点，避免为每一种语法再写一套分支。
  for (const value of Object.values(expression)) {
    if (value == null || typeof value !== 'object') {
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const nested = findHandlerName(item)
        if (nested != null) {
          return nested
        }
      }
      continue
    }
    const nested = findHandlerName(value)
    if (nested != null) {
      return nested
    }
  }
  return null
}

/** 将 `foo.bar` 这类非计算成员访问转换为稳定文本路径；`foo[key]` 不可静态推断。 */
function readMemberPath(node) {
  if (node == null || typeof node !== 'object') {
    return null
  }
  if (node.type === 'Identifier') {
    return node.name
  }
  if (node.type === 'MemberExpression' && node.computed !== true) {
    const objectPath = readMemberPath(node.object)
    const propertyPath = readMemberPath(node.property)
    return objectPath != null && propertyPath != null ? `${objectPath}.${propertyPath}` : null
  }
  return null
}

/** 按模板原有引号风格生成 UTS 字符串字面量，并转义会破坏表达式的字符。 */
function quoteString(value, attrQuote) {
  if (attrQuote === '"') {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }
  return JSON.stringify(value)
}

/** 将空的静态元数据统一输出为 UTS `null`，避免把空字符串误当成有效字段。 */
function quoteNullableString(value, attrQuote) {
  return value != null && value.length > 0 ? quoteString(value, attrQuote) : 'null'
}

/** 把其他属性上的动态表达式安全嵌入当前事件属性，避免引号截断模板。 */
function escapeBoundExpression(value, attrQuote) {
  return attrQuote === '"' ? value.replace(/"/g, '&quot;') : value.replace(/'/g, '&#39;')
}

/** 为 Options API 新建 export default 时生成完整的桥接 methods 对象。 */
function buildBridgeMethodsObject(indent = '  ') {
  return `${indent}methods: {\n${indent}  gioHandleAutoClick(event : any | null, eventName : string, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}) : boolean {\n${indent}    return _gioHandleAutoClick(event, eventName, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore)\n${indent}  },\n${indent}  gioHandleAutoChange(event : any | null, eventName : string, elementType : string | null, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}, changePayload : ${CHANGE_PAYLOAD_TYPE}, pickerRange : ${CHANGE_PAYLOAD_TYPE}) : boolean {\n${indent}    return _gioHandleAutoChange(event, eventName, elementType, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange)\n${indent}  },\n${indent}  gioHandleAutoConditionalClick(event : any | null, condition : boolean, consequentEventName : string, alternateEventName : string, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}) : boolean {\n${indent}    _gioHandleAutoClick(event, condition ? consequentEventName : alternateEventName, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore)\n${indent}    return condition\n${indent}  },\n${indent}  gioHandleAutoConditionalChange(event : any | null, condition : boolean, consequentEventName : string, alternateEventName : string, elementType : string | null, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}, changePayload : ${CHANGE_PAYLOAD_TYPE}, pickerRange : ${CHANGE_PAYLOAD_TYPE}) : boolean {\n${indent}    _gioHandleAutoChange(event, condition ? consequentEventName : alternateEventName, elementType, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange)\n${indent}    return condition\n${indent}  },\n${indent}},\n`
}

/** 为已有 Options API methods 块生成待插入的方法条目。 */
function buildBridgeMethodsEntries(indent = '    ') {
  return `\n${indent}gioHandleAutoClick(event : any | null, eventName : string, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}) : boolean {\n${indent}  return _gioHandleAutoClick(event, eventName, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore)\n${indent}},\n${indent}gioHandleAutoChange(event : any | null, eventName : string, elementType : string | null, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}, changePayload : ${CHANGE_PAYLOAD_TYPE}, pickerRange : ${CHANGE_PAYLOAD_TYPE}) : boolean {\n${indent}  return _gioHandleAutoChange(event, eventName, elementType, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange)\n${indent}},\n${indent}gioHandleAutoConditionalClick(event : any | null, condition : boolean, consequentEventName : string, alternateEventName : string, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}) : boolean {\n${indent}  _gioHandleAutoClick(event, condition ? consequentEventName : alternateEventName, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore)\n${indent}  return condition\n${indent}},\n${indent}gioHandleAutoConditionalChange(event : any | null, condition : boolean, consequentEventName : string, alternateEventName : string, elementType : string | null, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}, changePayload : ${CHANGE_PAYLOAD_TYPE}, pickerRange : ${CHANGE_PAYLOAD_TYPE}) : boolean {\n${indent}  _gioHandleAutoChange(event, condition ? consequentEventName : alternateEventName, elementType, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange)\n${indent}  return condition\n${indent}},`
}
/** 识别可在编译期确定的字面量绑定值；其余表达式保留到模板运行时求值。 */
function normalizeStaticBoundValue(value) {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }
  const literal = /^(['"])([\s\S]*?)\1$/.exec(trimmed)
  if (literal != null) {
    return literal[2]
  }
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed) || trimmed === 'true' || trimmed === 'false') {
    return trimmed
  }
  return null
}

/** 从 Vue 模板 AST 读取普通静态属性；空属性不作为有效采集元数据。 */
function readStaticAttribute(node, name) {
  const attribute = node.props.find((prop) => prop.type === 6 && prop.name === name)
  if (attribute == null || attribute.value == null) {
    return null
  }
  return attribute.value.content.length > 0 ? attribute.value.content : null
}

/** 从 Vue 模板 AST 读取 `:name` / `v-bind:name` 的表达式文本。 */
function readBoundAttribute(node, name) {
  const attribute = node.props.find(
    (prop) => prop.type === 7 && prop.name === 'bind' && prop.arg != null && prop.arg.isStatic && prop.arg.content === name,
  )
  return attribute != null && attribute.exp != null ? attribute.exp.content : null
}

/** 判断属性是否存在，空字符串也算存在，用于避免重复注入 data-* 属性。 */
function hasAttribute(node, name) {
  return node.props.some(
    (prop) =>
      (prop.type === 6 && prop.name === name) ||
      (prop.type === 7 && prop.name === 'bind' && prop.arg != null && prop.arg.isStatic && prop.arg.content === name),
  )
}

/** 读取模板属性，静态/字面量值保存文本，动态绑定保留原表达式。 */
function readTemplateAttribute(node, name) {
  const staticValue = readStaticAttribute(node, name)
  if (staticValue != null) {
    return { kind: 'static', value: staticValue }
  }
  const boundValue = readBoundAttribute(node, name)
  if (boundValue == null) {
    return null
  }
  const expression = boundValue.trim()
  if (expression.length === 0) {
    return null
  }
  const normalized = normalizeStaticBoundValue(boundValue)
  return normalized != null
    ? { kind: 'static', value: normalized }
    : { kind: 'expression', value: expression }
}

/** 为没有 data-src 的 uni-link 生成等价属性，保留静态/绑定两种写法。 */
function buildHrefDatasetAttribute(node) {
  const staticValue = readStaticAttribute(node, 'href')
  if (staticValue != null) {
    return `data-src="${staticValue.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`
  }
  const boundValue = readBoundAttribute(node, 'href')
  if (boundValue != null) {
    return `:data-src="${boundValue.replace(/"/g, '&quot;')}"`
  }
  return ''
}

/** 判断 uni-link 是否声明了 href（包含绑定形式）。 */
function hasHrefAttribute(node) {
  return hasAttribute(node, 'href')
}

/** 判断业务是否已显式提供 data-src，显式值优先级高于 href 推导。 */
function hasDataSrcAttribute(node) {
  return hasAttribute(node, 'data-src')
}

/** 汇总模板节点的 id、dataset 与链接元数据，动态绑定在点击时直接求值。 */
function readTargetMetadata(node) {
  const datasetSrc = readTemplateAttribute(node, 'data-src')
  return {
    id: readTemplateAttribute(node, 'id'),
    index: readTemplateAttribute(node, 'data-index'),
    title: readTemplateAttribute(node, 'data-title'),
    src: datasetSrc ?? (hasDataSrcAttribute(node) ? null : readTemplateAttribute(node, 'href')),
    growingTrack: readTemplateAttribute(node, 'data-growing-track'),
    growingIgnore: readTemplateAttribute(node, 'data-growing-ignore'),
  }
}

/**
 * 读取 change 值的组件语义。input 等节点优先保留显式 type；
 * switch / picker 额外传入组件名，供桥接层恢复平台差异后的真实业务值。
 */
function readChangeElementType(element) {
  const explicitType = normalizeStaticBoundValue(readBoundAttribute(element, 'type') ?? '')
    ?? readStaticAttribute(element, 'type')
  if (explicitType != null) {
    return explicitType
  }
  if (element.tag === 'switch' || element.tag === 'picker' || element.tag === 'picker-view') {
    return element.tag
  }
  return null
}

/** 将 change 组件语义转成生成 UTS 代码所需的字面量。 */
function buildChangeElementTypeArgument(elementType, attrQuote) {
  return elementType != null ? quoteString(elementType, attrQuote) : 'null'
}

/** 从 `v-for="item in items"` / `v-for="item of items"` 中取出列表表达式。 */
function readVForSource(node) {
  const directive = node.props.find((prop) => prop.type === 7 && prop.name === 'for' && prop.exp != null)
  if (directive == null || directive.exp == null) {
    return null
  }
  const match = directive.exp.content.match(/\s+(?:in|of)\s+(.+)$/)
  if (match == null) {
    return null
  }
  const source = match[1].trim()
  return source.length > 0 ? source : null
}

/** picker-view 的每个 column 从其首个 v-for 子节点读取列表来源。 */
function readPickerViewColumnRangeSource(column) {
  let source = null
  visitTemplateNodes(column, (node) => {
    if (source == null) {
      source = readVForSource(node)
    }
  })
  return source
}

/**
 * 把 picker 的可见候选项显式传入桥接层。
 * picker-view 没有 range 属性，需从每个 column 的 v-for 数据源恢复；缺失时保留组件原始下标。
 */
function buildPickerRangeArgument(element, attrQuote) {
  if (element.tag === 'picker') {
    const range = readBoundAttribute(element, 'range')
    return range != null && range.trim().length > 0 ? `(${escapeBoundExpression(range, attrQuote)})` : 'null'
  }
  if (element.tag !== 'picker-view') {
    return 'null'
  }
  const columns = []
  for (const child of element.children) {
    if (child.type !== 1 || child.tag !== 'picker-view-column') {
      continue
    }
    const source = readPickerViewColumnRangeSource(child)
    if (source == null) {
      return 'null'
    }
    columns.push(`(${escapeBoundExpression(source, attrQuote)})`)
  }
  return columns.length > 0 ? `[${columns.join(', ')}]` : 'null'
}

/** 把单个模板元数据转成桥接实参；动态表达式仍在 v-for 等模板作用域内求值。 */
function buildTargetArgument(metadata, attrQuote) {
  if (metadata == null) {
    return 'null'
  }
  if (metadata.kind === 'static') {
    return quoteNullableString(metadata.value, attrQuote)
  }
  return `(${escapeBoundExpression(metadata.value, attrQuote)})`
}

/** 按 plugin.uts 的固定参数顺序构造模板 target 参数，防止调用点自行拼错位置。 */
function buildTargetArguments(metadata, attrQuote) {
  return [
    buildTargetArgument(metadata.id, attrQuote),
    buildTargetArgument(metadata.index, attrQuote),
    buildTargetArgument(metadata.title, attrQuote),
    buildTargetArgument(metadata.src, attrQuote),
    buildTargetArgument(metadata.growingTrack, attrQuote),
    buildTargetArgument(metadata.growingIgnore, attrQuote),
  ].join(', ')
}

/**
 * 模板统一透传原始事件，由 JS 桥接层归一化 detail.value。
 * 不同内置组件的 change 结构并不一致：input/switch 是标量、checkbox-group/picker-view
 * 是数组、swiper 则只有 current/source。模板层直接读取 detail.value 会让不含 value 的组件
 * 在 UTS 生成阶段报错，也会把平台事件差异扩散到每个改写点。
 */
function buildChangeEventValueArgument() {
  return '$event'
}

/** 读取纯方法引用路径，如 `onTap` 或 `actions.onTap`；其他表达式返回 null。 */
function readMethodReferencePath(expression) {
  try {
    const program = parseExpression(expression.trim(), {
      sourceType: 'script',
      plugins: ['typescript'],
    })
    if (program.program.body.length !== 1 || program.program.body[0].type !== 'ExpressionStatement') {
      return null
    }
    return readMemberPath(program.program.body[0].expression)
  } catch (_) {
    return null
  }
}

/**
 * Vue 只会对未改写的纯方法引用自动透传事件；插桩后必须显式补回调用。
 * UTS 又要求参数个数严格匹配，因此本地签名优先，无法解析时仅 Web 按 JS 语义透传事件。
 */
function buildMethodReferenceCall(source, handlerParameterCounts, unresolvedMethodReferencesReceiveEvent) {
  const handlerPath = readMethodReferencePath(source)
  if (handlerPath == null) {
    return null
  }
  const receivesEvent = handlerParameterCounts.has(handlerPath)
    ? handlerParameterCounts.get(handlerPath) > 0
    : unresolvedMethodReferencesReceiveEvent
  return receivesEvent ? `${source}($event)` : `${source}()`
}

/** 判断表达式是否为内联回调；这类表达式需要显式传入事件才能保持原语义。 */
function isCallbackExpression(expression) {
  try {
    const program = parseExpression(expression.trim(), {
      sourceType: 'script',
      plugins: ['typescript'],
    })
    if (program.program.body.length !== 1 || program.program.body[0].type !== 'ExpressionStatement') {
      return false
    }
    const node = program.program.body[0].expression
    return node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression'
  } catch (_) {
    return false
  }
}

/**
 * 解析最外层三元表达式，并保留 test / consequent / alternate 的原始源码。
 * 只有最外层三元表达式能安全映射为两个 action；嵌套表达式仍按普通表达式处理。
 */
function readTopLevelConditionalParts(expression) {
  const source = expression.trim()
  try {
    const program = parseExpression(source, {
      sourceType: 'script',
      plugins: ['typescript'],
    })
    if (program.program.body.length !== 1 || program.program.body[0].type !== 'ExpressionStatement') {
      return null
    }
    const node = program.program.body[0].expression
    if (node.type !== 'ConditionalExpression') {
      return null
    }
    return {
      test: source.slice(node.test.start, node.test.end),
      consequent: source.slice(node.consequent.start, node.consequent.end),
      alternate: source.slice(node.alternate.start, node.alternate.end),
    }
  } catch (_) {
    return null
  }
}

/**
 * 为 Options API 事件表达式拼接采集调用。
 * 普通方法引用按已声明参数精确补回调用；内联回调必须立即以 `$event` 调用，不能只返回函数对象。
 */
function buildWrappedExpression(kind, expression, eventName, attrQuote, elementType = null, pickerRange = 'null', metadata, options) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const bridge = kind === 'change' ? 'gioHandleAutoChange' : 'gioHandleAutoClick'
  const targetArgs = buildTargetArguments(metadata, attrQuote)
  const args = kind === 'change'
    ? `$event, ${quoteString(handlerName, attrQuote)}, ${buildChangeElementTypeArgument(elementType, attrQuote)}, ${targetArgs}, ${buildChangeEventValueArgument()}, ${pickerRange}`
    : `$event, ${quoteString(handlerName, attrQuote)}, ${targetArgs}`
  const trackCall = `${bridge}(${args})`
  const methodReferenceCall = buildMethodReferenceCall(
    source,
    options.handlerParameterCounts,
    options.unresolvedMethodReferencesReceiveEvent,
  )
  if (methodReferenceCall != null) {
    return `${trackCall}; ${methodReferenceCall}`
  }
  if (isCallbackExpression(source)) {
    return `${trackCall}; (${source})($event)`
  }
  return `${trackCall}; ${source}`
}

/** Options API 的三元表达式通过返回原条件值的桥接 method 选择真实 handler 名。 */
function buildConditionalWrappedExpression(kind, parts, eventName, attrQuote, elementType = null, pickerRange = 'null', metadata) {
  const bridge = kind === 'change' ? 'gioHandleAutoConditionalChange' : 'gioHandleAutoConditionalClick'
  const consequentName = inferHandlerName(parts.consequent, eventName)
  const alternateName = inferHandlerName(parts.alternate, eventName)
  const targetArgs = buildTargetArguments(metadata, attrQuote)
  const args = kind === 'change'
    ? `$event, ${parts.test}, ${quoteString(consequentName, attrQuote)}, ${quoteString(alternateName, attrQuote)}, ${buildChangeElementTypeArgument(elementType, attrQuote)}, ${targetArgs}, ${buildChangeEventValueArgument()}, ${pickerRange}`
    : `$event, ${parts.test}, ${quoteString(consequentName, attrQuote)}, ${quoteString(alternateName, attrQuote)}, ${targetArgs}`
  return `${bridge}(${args}) ? ${parts.consequent} : ${parts.alternate}`
}

/**
 * 为 script setup 事件表达式前置统一采集调用。
 * 原业务表达式必须留在模板上下文，让 Vue 编译器继续负责 Ref 自动解包等模板语义。
 */
function buildSetupWrappedExpression(kind, expression, action, attrQuote, pickerRange, metadata, options) {
  const source = expression.trim()
  const changePayload = kind === 'change' ? buildChangeEventValueArgument() : 'null'
  const trackCall = `_gioAutoTrackDispatch($event, ${action}, ${changePayload}, ${pickerRange}, ${buildTargetArguments(metadata, attrQuote)})`
  const methodReferenceCall = buildMethodReferenceCall(
    source,
    options.handlerParameterCounts,
    options.unresolvedMethodReferencesReceiveEvent,
  )
  if (methodReferenceCall != null) {
    return `${trackCall}; ${methodReferenceCall}`
  }
  if (isCallbackExpression(source)) {
    return `${trackCall}; (${source})($event)`
  }
  return `${trackCall}; ${source}`
}

/**
 * 条件值只在模板上下文求值一次：分发器据此选择真实 action，并把同一布尔值返回给业务三元表达式。
 * 这样既保留 Ref 自动解包，也不会把 false 分支错误上报为 true handler。
 */
function buildSetupConditionalWrappedExpression(kind, parts, consequentAction, alternateAction, attrQuote, pickerRange, metadata) {
  const changePayload = kind === 'change' ? buildChangeEventValueArgument() : 'null'
  return `_gioAutoTrackDispatch($event, ${consequentAction}, ${changePayload}, ${pickerRange}, ${buildTargetArguments(metadata, attrQuote)}, ${parts.test}, ${alternateAction}) ? ${parts.consequent} : ${parts.alternate}`
}

/** 生成 script setup 统一分发器中的一个 action 分支；这里只采集，不执行原业务表达式。 */
function buildSetupDispatchCase(kind, expression, eventName, attrQuote, elementType, action) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const bridge = kind === 'change' ? '_gioHandleAutoChange' : '_gioHandleAutoClick'
  const args = kind === 'change'
    ? `event, ${quoteString(handlerName, attrQuote)}, ${buildChangeElementTypeArgument(elementType, attrQuote)}, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange`
    : `event, ${quoteString(handlerName, attrQuote)}, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore`
  return `  if (selectedAction == ${action}) {\n    ${bridge}(${args})\n    return resolvedCondition\n  }\n`
}

/** 为没有显式 click 的 uni-link 生成仅采集、不执行业务回调的分发分支。 */
function buildSetupTrackOnlyDispatchCase(eventName, attrQuote, action) {
  return `  if (selectedAction == ${action}) {\n    _gioHandleAutoClick(event, ${quoteString(eventName, attrQuote)}, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore)\n    return resolvedCondition\n  }\n`
}

/** 将所有 setup 采集分支收敛为一个显式类型的 UTS 函数。 */
function buildSetupDispatcher(cases) {
  return `\nfunction _gioAutoTrackDispatch(event : any | null, action : number, changePayload : ${CHANGE_PAYLOAD_TYPE}, pickerRange : ${CHANGE_PAYLOAD_TYPE}, templateId : ${TARGET_ID_VALUE_TYPE}, templateIndex : ${TARGET_DATASET_VALUE_TYPE}, templateTitle : ${TARGET_DATASET_VALUE_TYPE}, templateSrc : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingTrack : ${TARGET_DATASET_VALUE_TYPE}, templateGrowingIgnore : ${TARGET_DATASET_VALUE_TYPE}, condition : boolean | null = null, alternateAction : number | null = null) : boolean {\n  const resolvedCondition : boolean = condition != null ? condition : true\n  let selectedAction : number = action\n  if (!resolvedCondition && alternateAction != null) {\n    selectedAction = alternateAction as number\n  }\n${cases.join('')}  return resolvedCondition\n}\n`
}

/** 为 Options API 的自动 uni-link click 生成内联采集表达式。 */
function buildClickExpression(eventName, attrQuote, metadata) {
  return `gioHandleAutoClick($event, ${quoteString(eventName, attrQuote)}, ${buildTargetArguments(metadata, attrQuote)})`
}

/** 筛选具有静态事件名和表达式的 v-on 指令；动态事件名无法在编译期可靠分类。 */
function getEventBindings(node) {
  return node.props.filter(
    (prop) => prop.type === 7 && prop.name === 'on' && prop.arg != null && prop.arg.isStatic && prop.exp != null,
  )
}

/**
 * 找到元素开标签的属性插入点。
 * Vue AST 提供元素起点但不提供开标签结尾位置，因此扫描时要跳过属性值中的 `>`。
 */
function findElementInsertionOffset(content, element) {
  let quote = null
  let escaped = false
  const start = element.loc.start.offset
  for (let index = start; index < content.length; index++) {
    const current = content[index]
    if (quote != null) {
      if (escaped) {
        escaped = false
      } else if (current === '\\') {
        escaped = true
      } else if (current === quote) {
        quote = null
      }
      continue
    }
    if (current === '"' || current === "'") {
      quote = current
      continue
    }
    if (current === '>') {
      // 自闭合标签必须在 `/` 前插入属性，保持 `<input ... />` 的合法结构。
      return content[index - 1] === '/' ? index - 1 : index
    }
  }
  return -1
}

/** 深度遍历模板元素与 if 分支；文本、注释节点不参与事件改写。 */
function visitTemplateNodes(node, visit) {
  if (node == null || typeof node !== 'object') {
    return
  }
  if (node.type === 1) {
    visit(node)
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      visitTemplateNodes(child, visit)
    }
  }
  if (Array.isArray(node.branches)) {
    for (const branch of node.branches) {
      visitTemplateNodes(branch, visit)
    }
  }
}

/** 保持原事件属性的引号风格，降低生成代码和业务源码的视觉差异。 */
function getAttributeQuote(attribute) {
  const source = attribute.loc.source
  const doubleQuote = source.indexOf('"')
  const singleQuote = source.indexOf("'")
  return doubleQuote >= 0 && (singleQuote < 0 || doubleQuote < singleQuote) ? '"' : "'"
}

/**
 * 基于模板 AST 收集所有改写，不立即修改整个 SFC。
 * 返回的坐标始终相对于原 SFC，最后由 applyReplacements 从后向前统一应用。
 */
function collectTemplateReplacements(code, options = {
  skipEventBindings: false,
  useSetupDispatcher: false,
  handlerParameterCounts: new Map(),
  unresolvedMethodReferencesReceiveEvent: false,
}) {
  const template = findBlock(code, 'template')
  if (template == null || options.skipEventBindings) {
    return {
      replacements: [],
      needsBridge: false,
    }
  }
  // 模板 AST 的 loc.offset 相对 template 内容，因此 MagicString 也只操作这一段内容。
  const content = code.slice(template.contentStart, template.contentEnd)
  const templateAst = parseTemplate(content, { comments: true })
  const transformed = new MagicString(content)
  const attributeInsertions = new Map()
  const setupDispatcherCases = []
  let changed = false
  let needsBridge = false

  /** 延迟收集一个开标签属性，避免多次字符串拼接造成属性顺序和坐标错乱。 */
  function addAttribute(element, value) {
    if (value.length === 0) {
      return
    }
    const offset = findElementInsertionOffset(content, element)
    if (offset < 0) {
      return
    }
    // 同一元素可能同时补 href 和 click，先聚合再一次插入。
    const values = attributeInsertions.get(offset) ?? []
    values.push(value)
    attributeInsertions.set(offset, values)
  }

  visitTemplateNodes(templateAst, (element) => {
    const bindings = getEventBindings(element)
    const hasClickBinding = bindings.some((binding) => getEventKind(binding.arg.content) === 'click')
    if (element.tag === 'uni-link') {
      if (hasHrefAttribute(element) && !hasDataSrcAttribute(element)) {
        addAttribute(element, buildHrefDatasetAttribute(element))
      }
      if (!hasClickBinding) {
        const metadata = readTargetMetadata(element)
        if (options.useSetupDispatcher) {
          const action = setupDispatcherCases.length
          // action 直接写入模板调用参数，不再从跨端事件对象反查 dataset/type。
          setupDispatcherCases.push(buildSetupTrackOnlyDispatchCase('openURL', '"', action))
          addAttribute(element, `@click="_gioAutoTrackDispatch($event, ${action}, null, null, ${buildTargetArguments(metadata, '"')})"`)
        } else {
          addAttribute(element, `@click="${buildClickExpression('openURL', '"', metadata)}"`)
        }
        changed = true
        needsBridge = true
      }
    }

    for (const binding of bindings) {
      const eventName = binding.arg.content
      const kind = getEventKind(eventName)
      const expression = binding.exp.content
      if (
        kind == null ||
        expression.trim().length === 0 ||
        expression.includes('gioHandleAutoClick') ||
        expression.includes('gioHandleAutoChange')
      ) {
        // 已经是桥接调用的表达式视为幂等，避免 Vite 重复转换时再次套一层。
        continue
      }
      const attributeQuote = getAttributeQuote(binding)
      const elementType = readChangeElementType(element)
      const pickerRange = kind === 'change' ? buildPickerRangeArgument(element, attributeQuote) : 'null'
      const metadata = readTargetMetadata(element)
      if (options.useSetupDispatcher) {
        const conditionalParts = readTopLevelConditionalParts(expression)
        if (conditionalParts != null) {
          const consequentAction = setupDispatcherCases.length
          setupDispatcherCases.push(buildSetupDispatchCase(kind, conditionalParts.consequent, eventName, attributeQuote, elementType, consequentAction))
          const alternateAction = setupDispatcherCases.length
          setupDispatcherCases.push(buildSetupDispatchCase(kind, conditionalParts.alternate, eventName, attributeQuote, elementType, alternateAction))
          transformed.overwrite(
            binding.exp.loc.start.offset,
            binding.exp.loc.end.offset,
            buildSetupConditionalWrappedExpression(kind, conditionalParts, consequentAction, alternateAction, attributeQuote, pickerRange, metadata),
          )
        } else {
          const action = setupDispatcherCases.length
          setupDispatcherCases.push(buildSetupDispatchCase(kind, expression, eventName, attributeQuote, elementType, action))
          // 采集由统一分发器完成，原表达式留在模板上下文，避免破坏 Ref 自动解包等语义。
          transformed.overwrite(
            binding.exp.loc.start.offset,
            binding.exp.loc.end.offset,
            buildSetupWrappedExpression(kind, expression, action, attributeQuote, pickerRange, metadata, options),
          )
        }
      } else {
        const conditionalParts = readTopLevelConditionalParts(expression)
        transformed.overwrite(
          binding.exp.loc.start.offset,
          binding.exp.loc.end.offset,
          conditionalParts != null
            ? buildConditionalWrappedExpression(kind, conditionalParts, eventName, attributeQuote, elementType, pickerRange, metadata)
            : buildWrappedExpression(kind, expression, eventName, attributeQuote, elementType, pickerRange, metadata, options),
        )
      }
      changed = true
      needsBridge = true
    }

  })

  for (const [offset, values] of attributeInsertions) {
    // appendLeft 保留开标签中原有属性的相对顺序，避免破坏 Vue AST 已解析的表达式。
    transformed.appendLeft(offset, ` ${values.join(' ')}`)
    changed = true
  }

  if (!changed) {
    return { replacements: [], needsBridge: false }
  }
  return {
    replacements: [{ start: template.contentStart, end: template.contentEnd, value: transformed.toString() }],
    needsBridge,
    setupDispatcherCases,
  }
}

/**
 * 生成从 plugin.uts 导入私有桥接函数的替换片段。
 * 任何部分占用私有别名都报错，防止生成代码与业务导入发生难以定位的重名。
 */
function buildImportReplacement(code) {
  const reservedAliases = ['_gioHandleAutoClick', '_gioHandleAutoChange']
  const presentAliasCount = reservedAliases.filter((alias) => code.includes(alias)).length
  if (presentAliasCount === reservedAliases.length) {
    return null
  }
  if (presentAliasCount > 0) {
    throw new Error(`gio autotrack reserves generated imports: ${reservedAliases.join(', ')}`)
  }
  const script = findScriptBlock(code)
  if (script == null) {
    // 没有 script 时同时创建最小 Options API 脚本，保证模板桥接有可调用的 methods。
    const offset = findScriptInsertionOffset(code)
    return {
      start: offset,
      end: offset,
      value: `\n<script lang="uts">\n${IMPORT_CODE}\nexport default {\n${buildBridgeMethodsObject('  ')}}\n</script>\n`,
    }
  }
  const offset = findScriptInsertionOffset(code, script)
  if (isSetupScript(script)) {
    return {
      start: offset,
      end: offset,
      value: `\n${IMPORT_CODE}`,
    }
  }
  return {
    start: offset,
    end: offset,
    value: `\n${IMPORT_CODE}`,
  }
}

/** 将统一分发函数追加到 script setup 末尾，保证它在用户 handler 声明之后。 */
function buildSetupDispatcherReplacement(code, cases) {
  if (cases.length === 0) {
    return null
  }
  const script = findScriptBlock(code)
  if (!isSetupScript(script)) {
    return null
  }
  if (code.includes('_gioAutoTrackDispatch')) {
    throw new Error('gio autotrack reserves _gioAutoTrackDispatch for generated setup dispatch')
  }
  return {
    start: script.contentEnd,
    end: script.contentEnd,
    value: buildSetupDispatcher(cases),
    priority: 1,
  }
}

/**
 * 为 Options API 暴露桥接 methods。
 * 已有 methods 时只插入条目；没有 export default 时补最小对象，避免覆盖业务对象。
 */
function buildOptionsBridgeExposureReplacement(code) {
  const script = findScriptBlock(code)
  if (script == null || isSetupScript(script)) {
    return null
  }
  const content = code.slice(script.contentStart, script.contentEnd)
  if (/methods\s*:\s*{[\s\S]*gioHandleAutoClick/.test(content)) {
    return null
  }
  const exportOffsetInContent = content.indexOf('export default')
  if (exportOffsetInContent < 0) {
    return {
      start: script.contentEnd,
      end: script.contentEnd,
      value: `\nexport default {\n${buildBridgeMethodsObject('  ')}}\n`,
    }
  }
  const exportStart = script.contentStart + exportOffsetInContent
  const objectStart = code.indexOf('{', exportStart)
  if (objectStart < 0 || objectStart >= script.contentEnd) {
    return null
  }
  // export default 对象可能含字符串和注释，使用状态机匹配而不是简单 lastIndexOf('}')。
  const objectEnd = findMatchingBrace(code, objectStart, script.contentEnd)
  if (objectEnd < 0) {
    return null
  }
  const objectContent = code.slice(objectStart + 1, objectEnd)
  const methods = /methods\s*:\s*{/.exec(objectContent)
  if (methods != null) {
    const start = objectStart + 1 + methods.index + methods[0].length
    return {
      start,
      end: start,
      value: buildBridgeMethodsEntries('    '),
    }
  }
  return {
    start: objectStart + 1,
    end: objectStart + 1,
    value: `\n${buildBridgeMethodsObject('  ')}`,
  }
}

/**
 * 从后向前应用替换，避免前面的插入改变后续原始坐标。
 * 同一坐标处优先应用 priority 更高的片段，确保 import 位于 dispatcher 之前。
 */
function applyReplacements(code, replacements) {
  const ordered = replacements.slice().sort((a, b) => b.start - a.start || (b.priority ?? 0) - (a.priority ?? 0))
  let result = code
  for (const item of ordered) {
    result = result.slice(0, item.start) + item.value + result.slice(item.end)
  }
  return result
}

/** 创建 Vite pre 插件；pre 阶段保证 uni 编译器看到的是已经注入桥接的模板。 */
export function gioUniappxAutoTrack() {
  return {
    name: 'gio-uniappx-autotracker:auto-track',
    enforce: 'pre',
    transform(code, id) {
      if (!isTargetFile(id)) {
        return null
      }
      // setup 页面使用统一分发器；Options API 保留 methods 桥接，避免改变其 this 语义。
      const script = findScriptBlock(code)
      const platform = `${process.env.UNI_PLATFORM ?? ''}`.toLowerCase()
      const transformResult = collectTemplateReplacements(code, {
        skipEventBindings: isUniLinkComponentFile(id),
        useSetupDispatcher: isSetupScript(script),
        handlerParameterCounts: readHandlerParameterCounts(code, script),
        // Web/JS 允许额外实参，无法解析的导入或动态成员仍应保持 Vue 的原始事件透传语义。
        unresolvedMethodReferencesReceiveEvent: platform === 'web' || platform === 'h5',
      })
      const replacements = transformResult.replacements
      if (replacements.length === 0) {
        return null
      }
      if (transformResult.needsBridge) {
        const importReplacement = buildImportReplacement(code)
        if (importReplacement != null) {
          replacements.push(importReplacement)
        }
        // 模板、import、script 尾部函数是三个独立替换，统一在原始坐标系中收集。
        const setupDispatcherReplacement = buildSetupDispatcherReplacement(code, transformResult.setupDispatcherCases ?? [])
        if (setupDispatcherReplacement != null) {
          replacements.push(setupDispatcherReplacement)
        }
        const bridgeExposureReplacement = buildOptionsBridgeExposureReplacement(code)
        if (bridgeExposureReplacement != null) {
          replacements.push(bridgeExposureReplacement)
        }
      }
      return {
        code: applyReplacements(code, replacements),
        map: null,
      }
    },
  }
}
