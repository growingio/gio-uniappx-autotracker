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
  "import { gioHandleAutoClick, gioHandleAutoChange } from '@/uni_modules/gio-uniappx-autotracker/plugin.uts'\n"
const EVENT_ATTR_RE =
  /(?:@|v-on:)([A-Za-z][\w-]*)(?:\.[\w-]+)*\s*=\s*(["'])([\s\S]*?)\2/g
const METHOD_PATH_RE = /^[$A-Z_a-z][$\w]*(?:\.[$A-Z_a-z][$\w]*)*$/

function isTargetFile(id) {
  const cleanId = id.split('?')[0]
  return cleanId.endsWith('.vue') || cleanId.endsWith('.uvue')
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
  return fallback
}

function quoteString(value, attrQuote) {
  if (attrQuote === '"') {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }
  return JSON.stringify(value)
}

function buildWrappedExpression(kind, expression, eventName, attrQuote) {
  const source = expression.trim()
  const handlerName = inferHandlerName(source, eventName)
  const bridge = kind === 'change' ? 'gioHandleAutoChange' : 'gioHandleAutoClick'
  const trackCall = `${bridge}($event, ${quoteString(handlerName, attrQuote)})`
  if (METHOD_PATH_RE.test(source)) {
    return `($event) => { ${trackCall}; return ${source}() }`
  }
  return `($event) => { ${trackCall}; ${source} }`
}

function collectTemplateReplacements(code) {
  const template = findBlock(code, 'template')
  if (template == null) {
    return []
  }
  const content = code.slice(template.contentStart, template.contentEnd)
  const replacements = []
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
      replacements.push({
        start,
        end: start + expression.length,
        value: buildWrappedExpression(kind, expression, eventName, match[2]),
      })
    }
    match = EVENT_ATTR_RE.exec(content)
  }
  return replacements
}

function buildImportReplacement(code) {
  if (code.includes('gioHandleAutoClick') || code.includes('gioHandleAutoChange')) {
    return null
  }
  const hasScript = /<script\b[^>]*>/i.test(code)
  if (!hasScript) {
    const offset = findScriptInsertionOffset(code)
    return {
      start: offset,
      end: offset,
      value: `\n<script lang="uts">\n${IMPORT_CODE}</script>\n`,
    }
  }
  const offset = findScriptInsertionOffset(code)
  return {
    start: offset,
    end: offset,
    value: `\n${IMPORT_CODE}`,
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
      const replacements = collectTemplateReplacements(code)
      if (replacements.length === 0) {
        return null
      }
      const importReplacement = buildImportReplacement(code)
      if (importReplacement != null) {
        replacements.push(importReplacement)
      }
      return {
        code: applyReplacements(code, replacements),
        map: null,
      }
    },
  }
}
