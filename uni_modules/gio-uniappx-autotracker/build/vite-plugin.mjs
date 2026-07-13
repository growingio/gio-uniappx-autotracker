import { parse as parseTemplate } from '@vue/compiler-dom'
import { parse as parseExpression } from '@babel/parser'
import MagicString from 'magic-string'

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
const AUTO_TRACK_BOUND_ATTRIBUTE = 'data-gio-auto-track-bound="true"'
const IMPORT_CODE =
  "import { gioHandleAutoClick as _gioHandleAutoClick, gioHandleAutoChange as _gioHandleAutoChange } from '@/uni_modules/gio-uniappx-autotracker/plugin.uts'\n"

function isTargetFile(id) {
  const cleanId = id.split('?')[0]
  return cleanId.endsWith('.vue') || cleanId.endsWith('.uvue')
}

function isUniLinkComponentFile(id) {
  return id.split('?')[0].replace(/\\/g, '/').endsWith('/uni_modules/uni-link-x/components/uni-link/uni-link.uvue')
}

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

function findScriptBlock(code) {
  const openRe = /<script\b[^>]*>/i
  const open = openRe.exec(code)
  if (open == null) {
    return null
  }
  const start = open.index + open[0].length
  const closeRe = /<\/script>/i
  const rest = code.slice(start)
  const close = closeRe.exec(rest)
  if (close == null) {
    return null
  }
  return {
    openStart: open.index,
    openTag: open[0],
    contentStart: start,
    contentEnd: start + close.index,
    closeEnd: start + close.index + close[0].length,
  }
}

function isSetupScript(script) {
  return script != null && /\bsetup\b/i.test(script.openTag)
}

function findMatchingBrace(code, openIndex, limit) {
  let depth = 0
  let quote = null
  let escaped = false
  let lineComment = false
  let blockComment = false
  for (let i = openIndex; i < limit; i++) {
    const current = code[i]
    const next = i + 1 < limit ? code[i + 1] : ''
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

function findScriptInsertionOffset(code) {
  const scriptRe = /<script\b[^>]*>/i
  const script = scriptRe.exec(code)
  if (script != null) {
    return script.index + script[0].length
  }
  const template = findBlock(code, 'template')
  return template != null ? template.closeEnd : code.length
}

function inferHandlerName(expression, fallback) {
  const source = expression.trim()
  if (source.length === 0) {
    return fallback
  }
  try {
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
    return findHandlerName(expression.consequent) ?? findHandlerName(expression.alternate)
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

function quoteString(value, attrQuote) {
  if (attrQuote === '"') {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }
  return JSON.stringify(value)
}

function quoteNullableString(value, attrQuote) {
  return value != null && value.length > 0 ? quoteString(value, attrQuote) : 'null'
}

function buildBridgeMethodsObject(indent = '  ') {
  return `${indent}methods: {\n${indent}  gioHandleAutoClick(event : any | null, eventName : string, staticId : string | null, staticIndex : string | null, staticTitle : string | null, staticSrc : string | null, staticGrowingTrack : string | null, staticGrowingIgnore : string | null) : boolean {\n${indent}    return _gioHandleAutoClick(event, eventName, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore)\n${indent}  },\n${indent}  gioHandleAutoChange(event : any | null, eventName : string, elementType : string | null, staticId : string | null, staticIndex : string | null, staticTitle : string | null, staticSrc : string | null, staticGrowingTrack : string | null, staticGrowingIgnore : string | null) : boolean {\n${indent}    return _gioHandleAutoChange(event, eventName, elementType, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore)\n${indent}  },\n${indent}},\n`
}

function buildBridgeMethodsEntries(indent = '    ') {
  return `\n${indent}gioHandleAutoClick(event : any | null, eventName : string, staticId : string | null, staticIndex : string | null, staticTitle : string | null, staticSrc : string | null, staticGrowingTrack : string | null, staticGrowingIgnore : string | null) : boolean {\n${indent}  return _gioHandleAutoClick(event, eventName, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore)\n${indent}},\n${indent}gioHandleAutoChange(event : any | null, eventName : string, elementType : string | null, staticId : string | null, staticIndex : string | null, staticTitle : string | null, staticSrc : string | null, staticGrowingTrack : string | null, staticGrowingIgnore : string | null) : boolean {\n${indent}  return _gioHandleAutoChange(event, eventName, elementType, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore)\n${indent}},`
}

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

function readStaticAttribute(node, name) {
  const attribute = node.props.find((prop) => prop.type === 6 && prop.name === name)
  if (attribute == null || attribute.value == null) {
    return null
  }
  return attribute.value.content.length > 0 ? attribute.value.content : null
}

function readBoundAttribute(node, name) {
  const attribute = node.props.find(
    (prop) => prop.type === 7 && prop.name === 'bind' && prop.arg != null && prop.arg.isStatic && prop.arg.content === name,
  )
  return attribute != null && attribute.exp != null ? attribute.exp.content : null
}

function hasAttribute(node, name) {
  return node.props.some(
    (prop) =>
      (prop.type === 6 && prop.name === name) ||
      (prop.type === 7 && prop.name === 'bind' && prop.arg != null && prop.arg.isStatic && prop.arg.content === name),
  )
}

function readStaticDatasetAttribute(node, name) {
  const staticValue = readStaticAttribute(node, `data-${name}`)
  if (staticValue != null) {
    return staticValue
  }
  const boundValue = readBoundAttribute(node, `data-${name}`)
  return boundValue != null ? normalizeStaticBoundValue(boundValue) : null
}

function readStaticHrefAttribute(node) {
  const staticValue = readStaticAttribute(node, 'href')
  if (staticValue != null) {
    return staticValue
  }
  const boundValue = readBoundAttribute(node, 'href')
  return boundValue != null ? normalizeStaticBoundValue(boundValue) : null
}

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

function hasHrefAttribute(node) {
  return hasAttribute(node, 'href')
}

function hasDataSrcAttribute(node) {
  return hasAttribute(node, 'data-src')
}

function readStaticTargetMetadata(node) {
  const datasetSrc = readStaticDatasetAttribute(node, 'src')
  return {
    id: readStaticAttribute(node, 'id'),
    index: readStaticDatasetAttribute(node, 'index'),
    title: readStaticDatasetAttribute(node, 'title'),
    src: datasetSrc ?? (hasDataSrcAttribute(node) ? null : readStaticHrefAttribute(node)),
    growingTrack: readStaticDatasetAttribute(node, 'growing-track'),
    growingIgnore: readStaticDatasetAttribute(node, 'growing-ignore'),
  }
}

function buildChangeElementTypeArgument(elementType, attrQuote) {
  return elementType != null ? quoteString(elementType, attrQuote) : 'null'
}

function buildStaticTargetArguments(metadata, attrQuote) {
  return [
    quoteNullableString(metadata.id, attrQuote),
    quoteNullableString(metadata.index, attrQuote),
    quoteNullableString(metadata.title, attrQuote),
    quoteNullableString(metadata.src, attrQuote),
    quoteNullableString(metadata.growingTrack, attrQuote),
    quoteNullableString(metadata.growingIgnore, attrQuote),
  ].join(', ')
}

function isMethodReference(expression) {
  try {
    const program = parseExpression(expression.trim(), {
      sourceType: 'script',
      plugins: ['typescript'],
    })
    return program.program.body.length === 1 && program.program.body[0].type === 'ExpressionStatement' && readMemberPath(program.program.body[0].expression) != null
  } catch (_) {
    return false
  }
}

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

function buildWrappedExpression(kind, expression, eventName, attrQuote, elementType = null, metadata) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const bridge = kind === 'change' ? 'gioHandleAutoChange' : 'gioHandleAutoClick'
  const staticTargetArgs = buildStaticTargetArguments(metadata, attrQuote)
  const args = kind === 'change'
    ? `$event, ${quoteString(handlerName, attrQuote)}, ${buildChangeElementTypeArgument(elementType, attrQuote)}, ${staticTargetArgs}`
    : `$event, ${quoteString(handlerName, attrQuote)}, ${staticTargetArgs}`
  const trackCall = `${bridge}(${args})`
  if (isMethodReference(source)) {
    return `${trackCall}; ${source}()`
  }
  if (isCallbackExpression(source)) {
    return `${trackCall}; (${source})($event)`
  }
  return `${trackCall}; ${source}`
}

function replaceSetupEventReference(expression) {
  const source = expression.trim()
  let program = null
  try {
    program = parseExpression(source, {
      sourceType: 'script',
      plugins: ['typescript'],
    })
  } catch (error) {
    throw new Error(`gio autotrack cannot parse setup event expression: ${source}; ${error.message}`)
  }
  const transformed = new MagicString(source)
  replaceEventIdentifier(program.program, null, null, transformed)
  return transformed.toString()
}

function replaceEventIdentifier(node, parent, key, transformed) {
  if (node == null || typeof node !== 'object') {
    return
  }
  if (node.type === 'Identifier' && node.name === '$event' && isEventReference(parent, key)) {
    if (parent != null && parent.type === 'ObjectProperty' && parent.shorthand === true && key === 'value') {
      transformed.overwrite(node.start, node.end, '$event: event')
      return
    }
    transformed.overwrite(node.start, node.end, 'event')
    return
  }
  for (const [childKey, value] of Object.entries(node)) {
    if (value == null || typeof value !== 'object') {
      continue
    }
    if (Array.isArray(value)) {
      for (const child of value) {
        replaceEventIdentifier(child, node, childKey, transformed)
      }
      continue
    }
    replaceEventIdentifier(value, node, childKey, transformed)
  }
}

function isEventReference(parent, key) {
  if (parent == null) {
    return true
  }
  if (parent.type === 'MemberExpression' && key === 'property' && parent.computed !== true) {
    return false
  }
  if ((parent.type === 'ObjectProperty' || parent.type === 'ObjectMethod') && key === 'key' && parent.computed !== true) {
    return false
  }
  return true
}

function buildSetupDispatchCase(kind, expression, eventName, attrQuote, elementType, metadata, action) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const bridge = kind === 'change' ? '_gioHandleAutoChange' : '_gioHandleAutoClick'
  const staticTargetArgs = buildStaticTargetArguments(metadata, attrQuote)
  const args = kind === 'change'
    ? `event, ${quoteString(handlerName, attrQuote)}, ${buildChangeElementTypeArgument(elementType, attrQuote)}, ${staticTargetArgs}`
    : `event, ${quoteString(handlerName, attrQuote)}, ${staticTargetArgs}`
  const originalExpression = isMethodReference(source)
    ? `${source}()`
    : isCallbackExpression(source)
      ? `(${replaceSetupEventReference(source)})(event)`
      : replaceSetupEventReference(source)
  return `  if (action == ${action}) {\n    ${bridge}(${args})\n    ${originalExpression}\n    return\n  }\n`
}

function buildSetupTrackOnlyDispatchCase(eventName, attrQuote, metadata, action) {
  return `  if (action == ${action}) {\n    _gioHandleAutoClick(event, ${quoteString(eventName, attrQuote)}, ${buildStaticTargetArguments(metadata, attrQuote)})\n    return\n  }\n`
}

function buildSetupDispatcher(cases) {
  return `\nfunction _gioAutoTrackDispatch(event : any | null, action : number) : void {\n${cases.join('')}}\n`
}

function buildStaticClickExpression(eventName, attrQuote, metadata) {
  return `gioHandleAutoClick($event, ${quoteString(eventName, attrQuote)}, ${buildStaticTargetArguments(metadata, attrQuote)})`
}

function getEventBindings(node) {
  return node.props.filter(
    (prop) => prop.type === 7 && prop.name === 'on' && prop.arg != null && prop.arg.isStatic && prop.exp != null,
  )
}

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
      return content[index - 1] === '/' ? index - 1 : index
    }
  }
  return -1
}

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

function getAttributeQuote(attribute) {
  const source = attribute.loc.source
  const doubleQuote = source.indexOf('"')
  const singleQuote = source.indexOf("'")
  return doubleQuote >= 0 && (singleQuote < 0 || doubleQuote < singleQuote) ? '"' : "'"
}

function collectTemplateReplacements(code, options = { skipEventBindings: false, useSetupDispatcher: false }) {
  const template = findBlock(code, 'template')
  if (template == null || options.skipEventBindings) {
    return {
      replacements: [],
      needsBridge: false,
    }
  }
  const content = code.slice(template.contentStart, template.contentEnd)
  const templateAst = parseTemplate(content, { comments: true })
  const transformed = new MagicString(content)
  const attributeInsertions = new Map()
  const generatedBindingOffsets = new Set()
  const setupDispatcherCases = []
  let changed = false
  let needsBridge = false

  function addAttribute(element, value) {
    if (value.length === 0) {
      return
    }
    const offset = findElementInsertionOffset(content, element)
    if (offset < 0) {
      return
    }
    const values = attributeInsertions.get(offset) ?? []
    values.push(value)
    attributeInsertions.set(offset, values)
  }

  function markGeneratedBinding(element) {
    const offset = findElementInsertionOffset(content, element)
    if (offset < 0 || generatedBindingOffsets.has(offset)) {
      return
    }
    if (hasAttribute(element, 'data-gio-auto-track-bound')) {
      throw new Error('gio autotrack reserves data-gio-auto-track-bound for generated event bindings')
    }
    generatedBindingOffsets.add(offset)
    addAttribute(element, AUTO_TRACK_BOUND_ATTRIBUTE)
  }

  visitTemplateNodes(templateAst, (element) => {
    const bindings = getEventBindings(element)
    const hasClickBinding = bindings.some((binding) => getEventKind(binding.arg.content) === 'click')
    if (element.tag === 'uni-link') {
      if (hasHrefAttribute(element) && !hasDataSrcAttribute(element)) {
        addAttribute(element, buildHrefDatasetAttribute(element))
      }
      if (!hasClickBinding) {
        if (options.useSetupDispatcher) {
          const action = setupDispatcherCases.length
          setupDispatcherCases.push(buildSetupTrackOnlyDispatchCase('openURL', '"', readStaticTargetMetadata(element), action))
          addAttribute(element, `@click="_gioAutoTrackDispatch($event, ${action})"`)
          markGeneratedBinding(element)
        } else {
          addAttribute(element, `@click="${buildStaticClickExpression('openURL', '"', readStaticTargetMetadata(element))}"`)
          markGeneratedBinding(element)
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
        continue
      }
      const attributeQuote = getAttributeQuote(binding)
      const elementType = normalizeStaticBoundValue(readBoundAttribute(element, 'type') ?? '') ?? readStaticAttribute(element, 'type')
      const metadata = readStaticTargetMetadata(element)
      if (options.useSetupDispatcher) {
        const action = setupDispatcherCases.length
        setupDispatcherCases.push(buildSetupDispatchCase(kind, expression, eventName, attributeQuote, elementType, metadata, action))
        transformed.overwrite(
          binding.exp.loc.start.offset,
          binding.exp.loc.end.offset,
          `_gioAutoTrackDispatch($event, ${action})`,
        )
        markGeneratedBinding(element)
      } else {
        transformed.overwrite(
          binding.exp.loc.start.offset,
          binding.exp.loc.end.offset,
          buildWrappedExpression(kind, expression, eventName, attributeQuote, elementType, metadata),
        )
        markGeneratedBinding(element)
      }
      changed = true
      needsBridge = true
    }

  })

  for (const [offset, values] of attributeInsertions) {
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

function buildImportReplacement(code) {
  const reservedAliases = ['_gioHandleAutoClick', '_gioHandleAutoChange']
  const presentAliasCount = reservedAliases.filter((alias) => code.includes(alias)).length
  if (presentAliasCount === reservedAliases.length) {
    return null
  }
  if (presentAliasCount > 0) {
    throw new Error(`gio autotrack reserves generated imports: ${reservedAliases.join(', ')}`)
  }
  const hasScript = /<script\b[^>]*>/i.test(code)
  if (!hasScript) {
    const offset = findScriptInsertionOffset(code)
    return {
      start: offset,
      end: offset,
      value: `\n<script lang="uts">\n${IMPORT_CODE}\nexport default {\n${buildBridgeMethodsObject('  ')}}\n</script>\n`,
    }
  }
  const offset = findScriptInsertionOffset(code)
  const script = findScriptBlock(code)
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

function applyReplacements(code, replacements) {
  const ordered = replacements.slice().sort((a, b) => b.start - a.start || (b.priority ?? 0) - (a.priority ?? 0))
  let result = code
  for (const item of ordered) {
    result = result.slice(0, item.start) + item.value + result.slice(item.end)
  }
  return result
}

export function gioUniappxAutoTrack() {
  return {
    name: 'gio-uniappx-autotracker:auto-track',
    enforce: 'pre',
    transform(code, id) {
      if (!isTargetFile(id)) {
        return null
      }
      const script = findScriptBlock(code)
      const transformResult = collectTemplateReplacements(code, {
        skipEventBindings: isUniLinkComponentFile(id),
        useSetupDispatcher: isSetupScript(script),
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
