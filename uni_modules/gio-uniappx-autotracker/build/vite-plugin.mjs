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
const IMPORT_CODE =
  "import { gioHandleAutoClick as _gioHandleAutoClick, gioHandleAutoChange as _gioHandleAutoChange } from '@/uni_modules/gio-uniappx-autotracker/plugin.uts'\n"
const EVENT_ATTR_RE =
  /(?:@|v-on:)([A-Za-z][\w-]*)(?:\.[\w-]+)*\s*=\s*(["'])([\s\S]*?)\2/g
const UNI_LINK_OPEN_TAG_RE = /<uni-link\b[^>]*>/gi
const METHOD_PATH_RE = /^[$A-Z_a-z][$\w]*(?:\.[$A-Z_a-z][$\w]*)*$/
const CALL_EXPRESSION_RE = /(?:^|[^\w$])([$A-Z_a-z][$\w]*)\s*\(/g

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
  if (METHOD_PATH_RE.test(source)) {
    return source
  }
  const call = source.match(/^([$A-Z_a-z][$\w]*)\s*\(/)
  if (call != null) {
    return call[1]
  }
  CALL_EXPRESSION_RE.lastIndex = 0
  let nestedCall = CALL_EXPRESSION_RE.exec(source)
  while (nestedCall != null) {
    if (nestedCall[1] !== 'gioHandleAutoClick' && nestedCall[1] !== 'gioHandleAutoChange') {
      return nestedCall[1]
    }
    nestedCall = CALL_EXPRESSION_RE.exec(source)
  }
  return fallback
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

function buildSetupBridgeFunctions(wrapperFunctions = '') {
  return `\nfunction gioHandleAutoClick(event : any | null, eventName : string, staticId : string | null, staticIndex : string | null, staticTitle : string | null, staticSrc : string | null, staticGrowingTrack : string | null, staticGrowingIgnore : string | null) : boolean {\n  return _gioHandleAutoClick(event, eventName, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore)\n}\n\nfunction gioHandleAutoChange(event : any | null, eventName : string, elementType : string | null, staticId : string | null, staticIndex : string | null, staticTitle : string | null, staticSrc : string | null, staticGrowingTrack : string | null, staticGrowingIgnore : string | null) : boolean {\n  return _gioHandleAutoChange(event, eventName, elementType, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore)\n}\n${wrapperFunctions}`
}

function findContainingTagSource(content, offset) {
  const open = content.lastIndexOf('<', offset)
  const previousClose = content.lastIndexOf('>', offset)
  if (open < 0 || open < previousClose) {
    return null
  }
  const close = content.indexOf('>', offset)
  if (close < 0) {
    return null
  }
  return content.slice(open, close + 1)
}

function readStaticTypeAttribute(tagSource) {
  if (tagSource == null) {
    return null
  }
  const match = /(?:^|\s)((?::type)|(?:v-bind:type)|type)\s*=\s*(["'])([\s\S]*?)\2/i.exec(tagSource)
  if (match == null) {
    return null
  }
  const name = match[1].toLowerCase()
  const value = match[3].trim()
  if (name === 'type') {
    return value.length > 0 ? value : null
  }
  const literal = /^(['"])([\s\S]*?)\1$/.exec(value)
  return literal != null && literal[2].length > 0 ? literal[2] : null
}

function readStaticAttribute(tagSource, name) {
  if (tagSource == null) {
    return null
  }
  const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const match = new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i').exec(tagSource)
  return match != null && match[2].length > 0 ? match[2] : null
}

function hasStaticAttribute(tagSource, name) {
  if (tagSource == null) {
    return false
  }
  const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  return new RegExp(`(?:^|\\s)${escaped}\\s*=`, 'i').test(tagSource)
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

function readStaticDatasetAttribute(tagSource, name) {
  const staticValue = readStaticAttribute(tagSource, `data-${name}`)
  if (staticValue != null) {
    return staticValue
  }
  const boundValue =
    readStaticAttribute(tagSource, `:data-${name}`) ??
    readStaticAttribute(tagSource, `v-bind:data-${name}`)
  return boundValue != null ? normalizeStaticBoundValue(boundValue) : null
}

function readStaticHrefAttribute(tagSource) {
  const staticValue = readStaticAttribute(tagSource, 'href')
  if (staticValue != null) {
    return staticValue
  }
  const boundValue =
    readStaticAttribute(tagSource, ':href') ??
    readStaticAttribute(tagSource, 'v-bind:href')
  return boundValue != null ? normalizeStaticBoundValue(boundValue) : null
}

function buildHrefDatasetAttribute(tagSource) {
  const staticValue = readStaticAttribute(tagSource, 'href')
  if (staticValue != null) {
    return ` data-src="${staticValue.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`
  }
  const shorthandValue = readStaticAttribute(tagSource, ':href')
  if (shorthandValue != null) {
    return ` :data-src="${shorthandValue.replace(/"/g, '&quot;')}"`
  }
  const boundValue = readStaticAttribute(tagSource, 'v-bind:href')
  if (boundValue != null) {
    return ` v-bind:data-src="${boundValue.replace(/"/g, '&quot;')}"`
  }
  return ''
}

function hasHrefAttribute(tagSource) {
  return (
    hasStaticAttribute(tagSource, 'href') ||
    hasStaticAttribute(tagSource, ':href') ||
    hasStaticAttribute(tagSource, 'v-bind:href')
  )
}

function hasDataSrcAttribute(tagSource) {
  return (
    hasStaticAttribute(tagSource, 'data-src') ||
    hasStaticAttribute(tagSource, ':data-src') ||
    hasStaticAttribute(tagSource, 'v-bind:data-src')
  )
}

function readStaticTargetMetadata(tagSource) {
  const datasetSrc = readStaticDatasetAttribute(tagSource, 'src')
  return {
    id: readStaticAttribute(tagSource, 'id'),
    index: readStaticDatasetAttribute(tagSource, 'index'),
    title: readStaticDatasetAttribute(tagSource, 'title'),
    src: datasetSrc ?? (hasDataSrcAttribute(tagSource) ? null : readStaticHrefAttribute(tagSource)),
    growingTrack: readStaticDatasetAttribute(tagSource, 'growing-track'),
    growingIgnore: readStaticDatasetAttribute(tagSource, 'growing-ignore'),
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

function buildTrackCall(kind, eventArgument, handlerName, attrQuote, elementType = null, metadata = readStaticTargetMetadata(null)) {
  const bridge = kind === 'change' ? 'gioHandleAutoChange' : 'gioHandleAutoClick'
  const staticTargetArgs = buildStaticTargetArguments(metadata, attrQuote)
  const args = kind === 'change'
    ? `${eventArgument}, ${quoteString(handlerName, attrQuote)}, ${buildChangeElementTypeArgument(elementType, attrQuote)}, ${staticTargetArgs}`
    : `${eventArgument}, ${quoteString(handlerName, attrQuote)}, ${staticTargetArgs}`
  return `${bridge}(${args})`
}

function normalizeWrapperExpression(expression) {
  const source = expression.trim()
  if (METHOD_PATH_RE.test(source)) {
    return `${source}()`
  }
  return replaceEventArgumentReferences(source)
}

function replaceEventArgumentReferences(source) {
  let result = ''
  let quote = null
  let escaped = false
  for (let i = 0; i < source.length; i++) {
    const current = source[i]
    if (quote != null) {
      result += current
      if (escaped) {
        escaped = false
      } else if (current === '\\') {
        escaped = true
      } else if (current === quote) {
        quote = null
      }
      continue
    }
    if (current === '"' || current === "'" || current === '`') {
      quote = current
      result += current
      continue
    }
    if (source.startsWith('$event', i)) {
      const before = i > 0 ? source[i - 1] : ''
      const after = i + 6 < source.length ? source[i + 6] : ''
      const beforeIsIdentifier = /[$\w]/.test(before)
      const afterIsIdentifier = /[$\w]/.test(after)
      if (!beforeIsIdentifier && !afterIsIdentifier) {
        result += 'event'
        i += 5
        continue
      }
    }
    result += current
  }
  return result
}

function buildSetupWrapperFunction(wrapperName, kind, expression, eventName, attrQuote, elementType, metadata) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const trackCall = buildTrackCall(kind, 'event', handlerName, attrQuote, elementType, metadata)
  return `\nfunction ${wrapperName}(event : any | null) : void {\n  ${trackCall}\n  ${normalizeWrapperExpression(source)}\n}\n`
}

function buildSetupTrackOnlyWrapperFunction(wrapperName, kind, eventName, attrQuote, elementType, metadata) {
  const trackCall = buildTrackCall(kind, 'event', eventName, attrQuote, elementType, metadata)
  return `\nfunction ${wrapperName}(event : any | null) : void {\n  ${trackCall}\n}\n`
}

function buildWrappedExpression(kind, expression, eventName, attrQuote, elementType = null, metadata = readStaticTargetMetadata(null)) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const trackCall = buildTrackCall(kind, '$event', handlerName, attrQuote, elementType, metadata)
  if (METHOD_PATH_RE.test(source)) {
    return `${trackCall}; ${source}()`
  }
  return `${trackCall}; ${source}`
}

function buildStaticClickExpression(eventName, attrQuote, metadata) {
  return `gioHandleAutoClick($event, ${quoteString(eventName, attrQuote)}, ${buildStaticTargetArguments(metadata, attrQuote)})`
}

function hasClickEventBinding(tagSource) {
  const eventRe = /(?:@|v-on:)([A-Za-z][\w-]*)(?:\.[\w-]+)*\s*=/g
  let match = eventRe.exec(tagSource)
  while (match != null) {
    if (getEventKind(match[1]) === 'click') {
      return true
    }
    match = eventRe.exec(tagSource)
  }
  return false
}

function collectUniLinkReplacements(content, templateStart, state) {
  const replacements = []
  const wrapperFunctions = []
  let needsBridge = false
  UNI_LINK_OPEN_TAG_RE.lastIndex = 0
  let match = UNI_LINK_OPEN_TAG_RE.exec(content)
  while (match != null) {
    const tagSource = match[0]
    const insertOffset = tagSource.endsWith('/>') ? tagSource.length - 2 : tagSource.length - 1
    const insertPosition = templateStart + match.index + insertOffset
    if (hasHrefAttribute(tagSource) && !hasDataSrcAttribute(tagSource)) {
      replacements.push({
        start: insertPosition,
        end: insertPosition,
        value: buildHrefDatasetAttribute(tagSource),
      })
    }
    if (!tagSource.includes('gioHandleAutoClick') && !hasClickEventBinding(tagSource)) {
      const metadata = readStaticTargetMetadata(tagSource)
      let clickExpression = buildStaticClickExpression('openURL', '"', metadata)
      if (state.useSetupWrappers) {
        const wrapperName = `_gioAutoTrackHandler${state.nextWrapperIndex}`
        state.nextWrapperIndex += 1
        clickExpression = wrapperName
        wrapperFunctions.push(buildSetupTrackOnlyWrapperFunction(wrapperName, 'click', 'openURL', '"', null, metadata))
      }
      replacements.push({
        start: insertPosition,
        end: insertPosition,
        value: ` @click="${clickExpression}"`,
      })
      needsBridge = true
    }
    match = UNI_LINK_OPEN_TAG_RE.exec(content)
  }
  return {
    replacements,
    needsBridge,
    wrapperFunctions,
  }
}

function collectTemplateReplacements(code, options = { skipEventBindings: false, useSetupWrappers: false }) {
  const template = findBlock(code, 'template')
  if (template == null) {
    return {
      replacements: [],
      needsBridge: false,
      wrapperFunctions: [],
    }
  }
  const content = code.slice(template.contentStart, template.contentEnd)
  const state = {
    useSetupWrappers: options.useSetupWrappers === true,
    nextWrapperIndex: 0,
  }
  const uniLinkResult = options.skipEventBindings
    ? { replacements: [], needsBridge: false, wrapperFunctions: [] }
    : collectUniLinkReplacements(content, template.contentStart, state)
  const replacements = uniLinkResult.replacements
  const wrapperFunctions = uniLinkResult.wrapperFunctions
  let needsBridge = uniLinkResult.needsBridge
  if (options.skipEventBindings) {
    return {
      replacements,
      needsBridge,
      wrapperFunctions,
    }
  }
  EVENT_ATTR_RE.lastIndex = 0
  let match = EVENT_ATTR_RE.exec(content)
  while (match != null) {
    const eventName = match[1]
    const kind = getEventKind(eventName)
    const expression = match[3]
    if (
      kind != null &&
      expression.trim().length > 0 &&
      !expression.includes('gioHandleAutoClick') &&
      !expression.includes('gioHandleAutoChange')
    ) {
      const quoteOffset = match[0].indexOf(match[2])
      const start = template.contentStart + match.index + quoteOffset + 1
      const tagSource = findContainingTagSource(content, match.index)
      const metadata = readStaticTargetMetadata(tagSource)
      const elementType = readStaticTypeAttribute(tagSource)
      let value = buildWrappedExpression(kind, expression, eventName, match[2], elementType, metadata)
      if (state.useSetupWrappers) {
        const wrapperName = `_gioAutoTrackHandler${state.nextWrapperIndex}`
        state.nextWrapperIndex += 1
        wrapperFunctions.push(buildSetupWrapperFunction(wrapperName, kind, expression, eventName, match[2], elementType, metadata))
        value = wrapperName
      }
      needsBridge = true
      replacements.push({
        start,
        end: start + expression.length,
        value,
      })
    }
    match = EVENT_ATTR_RE.exec(content)
  }
  return {
    replacements,
    needsBridge,
    wrapperFunctions,
  }
}

function buildImportReplacement(code, wrapperFunctions = '') {
  if (code.includes('gioHandleAutoClick') || code.includes('gioHandleAutoChange')) {
    if (wrapperFunctions.length > 0) {
      return {
        start: findScriptInsertionOffset(code),
        end: findScriptInsertionOffset(code),
        value: wrapperFunctions,
      }
    }
    return null
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
      value: `\n${IMPORT_CODE}${buildSetupBridgeFunctions(wrapperFunctions)}`,
    }
  }
  return {
    start: offset,
    end: offset,
    value: `\n${IMPORT_CODE}`,
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
  const ordered = replacements.slice().sort((a, b) => b.start - a.start)
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
        useSetupWrappers: isSetupScript(script),
      })
      const replacements = transformResult.replacements
      if (replacements.length === 0) {
        return null
      }
      if (transformResult.needsBridge) {
        const importReplacement = buildImportReplacement(code, transformResult.wrapperFunctions.join(''))
        if (importReplacement != null) {
          replacements.push(importReplacement)
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
