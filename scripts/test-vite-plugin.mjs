import assert from 'node:assert/strict'
import fs from 'node:fs'
import { gioUniappxAutoTrack } from '../uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs'

const plugin = gioUniappxAutoTrack()

function transform(code, id = '/src/pages/index/index.uvue') {
  const result = plugin.transform(code, id)
  assert.notEqual(result, null)
  return result.code
}

function transformOptional(code, id = '/src/pages/index/index.uvue') {
  return plugin.transform(code, id)
}

function assertSetupDispatcher(output) {
  assert.match(output, /function _gioAutoTrackDispatch\(event : any \| null, action : number, condition : boolean \| null = null, alternateAction : number \| null = null\) : boolean/)
  assert.equal(output.match(/function _gioAutoTrackDispatch/g)?.length, 1)
  assert.doesNotMatch(output, /_gioAutoTrackHandler\d+/)
  assert.doesNotMatch(output, /gioReadAutoTrackAction/)
}

function assertSetupDispatcherAfterSource(output, sourceMarker) {
  assert.ok(output.indexOf(sourceMarker) < output.indexOf('function _gioAutoTrackDispatch'))
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick as _gioHandleAutoClick/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onSimpleTrack\(\)"/)
  assert.match(output, /data-gio-auto-track-bound="true"/)
  assert.doesNotMatch(output, /data-gio-auto-track-action=/)
  assert.doesNotMatch(output, /function gioHandleAutoClick\(/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onSimpleTrack', null, null, null, null, null, null\)\s*return resolvedCondition/)
  assert.doesNotMatch(output, /\(\$event\)\s*=>/)
  assertSetupDispatcher(output)
  assert.ok(output.indexOf('gioHandleAutoClick as _gioHandleAutoClick') < output.indexOf('function _gioAutoTrackDispatch'))
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script setup lang="uts">function gioHandleAutoClick() : void {}</script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick as _gioHandleAutoClick/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onSimpleTrack'/)
  assertSetupDispatcher(output)
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script lang="uts">export default {}</script><script setup lang="uts">function onSimpleTrack() : void {}</script>'
  const output = transform(code)
  const setupStart = output.indexOf('<script setup lang="uts">')
  const setupImport = output.indexOf('gioHandleAutoClick as _gioHandleAutoClick')
  assert.ok(setupImport > setupStart)
  assert.ok(output.indexOf('function onSimpleTrack() : void {}') < output.indexOf('function _gioAutoTrackDispatch'))
  assert.doesNotMatch(output, /methods\s*:\s*{\s*gioHandleAutoClick/)
}

{
  const code = '<template><button @click="foo(); bar()"></button></template><script lang="uts">export default {}</script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'foo', null, null, null, null, null, null\)/)
  assert.match(output, /methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, staticId : string \| null[\s\S]*return _gioHandleAutoClick\(event, eventName, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore\)[\s\S]*gioHandleAutoChange\(event : any \| null, eventName : string, elementType : string \| null, staticId : string \| null[\s\S]*return _gioHandleAutoChange\(event, eventName, elementType, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore\)/)
  assert.match(output, /foo\(\); bar\(\)/)
  assert.doesNotMatch(output, /return foo\(\);/)
  assert.doesNotMatch(output, /\(\$event\)\s*=>/)
}

{
  const code = `<template>
    <view id="press" data-title="longpress 区域" @longpress="onLongPress"></view>
    <view id="tap" data-title="longtap 区域" @longtap="onLongTap"></view>
    <button id="press_button" data-title="button longpress" @longpress="onButtonLongPress"></button>
  </template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@longpress="_gioAutoTrackDispatch\(\$event, 0\); onLongPress\(\)"/)
  assert.match(output, /@longtap="_gioAutoTrackDispatch\(\$event, 1\); onLongTap\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onLongPress', 'press', null, 'longpress 区域', null, null, null\)\s*return/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onLongTap', 'tap', null, 'longtap 区域', null, null, null\)\s*return/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onButtonLongPress', 'press_button', null, 'button longpress', null, null, null\)\s*return/)
  assertSetupDispatcher(output)
}

{
  const code = '<template><view @click="onPayload({ $event })"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onPayload\(\{ \$event \}\)"/)
  assert.doesNotMatch(output, /\$event: event/)
}

{
  const code = '<template><view @click="(payload) => onPayload(payload)"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); \(\(payload\) => onPayload\(payload\)\)\(\$event\)"/)
}

{
  const code = fs.readFileSync('pages/autotrack/autotrack.uvue', 'utf8')
  const output = transform(code, '/src/pages/autotrack/autotrack.uvue')
  assert.match(output, /<view\s+id="auto_longpress_method"[\s\S]*@longpress="_gioAutoTrackDispatch\(\$event, \d+\); onLongPress\(\)"/)
  assertSetupDispatcher(output)
}

{
  const code = `<template><uni-link id="doc_link" href="https://doc.dcloud.net.cn" data-title="文档">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'openURL', 'doc_link', null, '文档', 'https:\/\/doc\.dcloud\.net\.cn', null, null\)/)
}

{
  const code = `<template><uni-link id="dynamic_link" :href="docUrl">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /:data-src="docUrl"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\)"/)
}

{
  const code = `<template><uni-link id="custom_link" href="https://doc.dcloud.net.cn" data-src="https://example.com/custom">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\)"/)
}

{
  const code = `<template><uni-link id="dynamic_custom_link" href="https://doc.dcloud.net.cn" :data-src="customUrl">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\)"/)
}

{
  const code = `<template><uni-link id="explicit_link" href="https://doc.dcloud.net.cn" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onLinkClick\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onLinkClick', 'explicit_link', null, null, 'https:\/\/doc\.dcloud\.net\.cn', null, null\)\s*return/)
  assert.match(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assertSetupDispatcher(output)
}

{
  const code = `<template><uni-link id="explicit_custom_link" href="https://doc.dcloud.net.cn" data-src="https://example.com/custom" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onLinkClick\(\)"/)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
}

{
  const code = `<template><uni-link id="explicit_dynamic_custom_link" href="https://doc.dcloud.net.cn" :data-src="customUrl" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onLinkClick\(\)"/)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
}

{
  const code = `<template><text :href="props.href" @click="openURL"><slot></slot></text></template><script setup lang="uts"></script>`
  const result = transformOptional(code, '/src/uni_modules/uni-link-x/components/uni-link/uni-link.uvue')
  assert.equal(result, null)
}

{
  const code = '<template><input @change="onChange($event)" /></template><script lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoChange\(\$event, 'onChange', null, null, null, null, null, null, null\)/)
  assert.match(output, /export default\s*{\s*methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, staticId : string \| null/)
  assert.match(output, /onChange\(\$event\)/)
}

{
  const code = '<template><input type="password" @blur="onPasswordBlur($event)" /></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /@blur="_gioAutoTrackDispatch\(\$event, 0\); onPasswordBlur\(\$event\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onPasswordBlur', 'password', null, null, null, null, null, null\)\s*return/)
  assertSetupDispatcher(output)
}

{
  const code = `<template>
    <view
      id="ast_event"
      :data-index="7"
      data-title="AST 事件"
      v-on:tap.stop="onEventAndLabel($event, '$event')"
    />
  </template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /v-on:tap\.stop="_gioAutoTrackDispatch\(\$event, 0\); onEventAndLabel\(\$event, '\$event'\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onEventAndLabel', 'ast_event', '7', 'AST 事件', null, null, null\)\s*return/)
  assertSetupDispatcher(output)
}

{
  const code = `<template><input :type="'password'" @change="onDynamicLiteralType" /></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0\); onDynamicLiteralType\(\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onDynamicLiteralType', 'password', null, null, null, null, null, null\)\s*return/)
}

{
  const doubleQuoted = '<template><view @click="onDouble"></view></template><script lang="uts"></script>'
  const singleQuoted = "<template><view @click='onSingle'></view></template><script lang='uts'></script>"
  assert.match(transform(doubleQuoted), /gioHandleAutoClick\(\$event, 'onDouble', null, null, null, null, null, null\)/)
  assert.match(transform(singleQuoted), /gioHandleAutoClick\(\$event, "onSingle", null, null, null, null, null, null\)/)
}

{
  const code = `<template><view @click="go('autotrack')"></view></template><script lang="uts">export default { methods: { go(name: string) {} } }</script>`
  const output = transform(code)
  assert.match(output, /methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, staticId : string \| null[\s\S]*gioHandleAutoChange\(event : any \| null, eventName : string, elementType : string \| null, staticId : string \| null[\s\S]*go\(name: string\)/)
  assert.match(output, /gioHandleAutoClick\(\$event, 'go', null, null, null, null, null, null\); go\('autotrack'\)/)
}

{
  const code = `<template><button id="auto_call_conditional" :data-index="16" data-title="条件表达式" data-src="/pages/autotrack/autotrack?case=conditional" @click="conditionEnabled ? onConditionalTrue() : onConditionalFalse()">条件表达式</button></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, conditionEnabled, 1\) \? onConditionalTrue\(\) : onConditionalFalse\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onConditionalTrue', 'auto_call_conditional', '16', '条件表达式', '\/pages\/autotrack\/autotrack\?case=conditional', null, null\)/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onConditionalFalse', 'auto_call_conditional', '16', '条件表达式', '\/pages\/autotrack\/autotrack\?case=conditional', null, null\)/)
  assert.match(output, /if \(selectedAction == 0\)[\s\S]*onConditionalTrue[\s\S]*if \(selectedAction == 1\)[\s\S]*onConditionalFalse/)
  const dispatcher = output.slice(output.indexOf('function _gioAutoTrackDispatch'))
  assert.doesNotMatch(dispatcher, /conditionEnabled/)
}

{
  const code = `<template><button @click="conditionEnabled ? onConditionalTrue() : onConditionalFalse()">条件表达式</button></template><script lang="uts">export default { data() { return { conditionEnabled: true } }, methods: { onConditionalTrue() {}, onConditionalFalse() {} } }</script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoConditionalClick\(\$event, conditionEnabled, 'onConditionalTrue', 'onConditionalFalse', null, null, null, null, null, null\) \? onConditionalTrue\(\) : onConditionalFalse\(\)/)
  assert.match(output, /gioHandleAutoConditionalClick\(event : any \| null, condition : boolean, consequentEventName : string, alternateEventName : string/)
  assert.match(output, /_gioHandleAutoClick\(event, condition \? consequentEventName : alternateEventName/)
}

{
  const code = `<template><input type="password" @change="conditionEnabled ? onChangeTrue($event) : onChangeFalse($event)" /></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0, conditionEnabled, 1\) \? onChangeTrue\(\$event\) : onChangeFalse\(\$event\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onChangeTrue', 'password'/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onChangeFalse', 'password'/)
}

{
  const code = `<template><input @change="conditionEnabled ? onChangeTrue($event) : onChangeFalse($event)" /></template><script lang="uts">export default { data() { return { conditionEnabled: true } }, methods: { onChangeTrue() {}, onChangeFalse() {} } }</script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoConditionalChange\(\$event, conditionEnabled, 'onChangeTrue', 'onChangeFalse', null, null, null, null, null, null, null\) \? onChangeTrue\(\$event\) : onChangeFalse\(\$event\)/)
  assert.match(output, /_gioHandleAutoChange\(event, condition \? consequentEventName : alternateEventName/)
}

{
  const code = `<template><view @click="onClick" @tap="onTap"></view></template><script setup lang="uts">
function onClick() : void {}
function onTap() : void {}
</script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onClick\(\)"\s+@tap="_gioAutoTrackDispatch\(\$event, 1\); onTap\(\)"/)
  assert.equal(output.match(/data-gio-auto-track-bound="true"/g)?.length, 1)
  assert.match(output, /if \(selectedAction == 0\) \{[\s\S]*_gioHandleAutoClick\(event, 'onClick'/)
  assert.match(output, /if \(selectedAction == 1\) \{[\s\S]*_gioHandleAutoClick\(event, 'onTap'/)
  assertSetupDispatcher(output)
  assertSetupDispatcherAfterSource(output, 'function onTap() : void {}')
}

{
  const code = '<template><view @click="onTap"></view></template><script setup lang="uts">function _gioAutoTrackDispatch(event : any | null) : void {}</script>'
  assert.throws(() => transform(code), /reserves _gioAutoTrackDispatch/)
}

{
  const code = '<template><tracking-card data-gio-auto-track-action="external" @click="onCardClick"></tracking-card></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /data-gio-auto-track-action="external"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0\); onCardClick\(\)"/)
  assert.match(output, /data-gio-auto-track-bound="true"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onCardClick'/)
}

{
  const code = '<template><view data-gio-auto-track-bound="true" @click="onTap"></view></template><script setup lang="uts"></script>'
  assert.throws(() => transform(code), /reserves data-gio-auto-track-bound/)
}

{
  const code = '<template><view @click="onTap"></view></template><script setup lang="uts">const _gioHandleAutoClick = 1</script>'
  assert.throws(() => transform(code), /reserves generated imports/)
}

{
  const code = '<template><view @click="onTap"></view></template>'
  const output = transform(code)
  assert.match(output, /<script lang="uts">/)
  assert.match(output, /gioHandleAutoClick/)
  assert.match(output, /export default\s*{\s*methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, staticId : string \| null/)
}

{
  const output = plugin.transform('<template><view @scroll="onScroll"></view></template>', '/src/pages/index/index.uvue')
  assert.equal(output, null)
}

{
  const output = plugin.transform('<template><view @click="onTap"></view></template>', '/src/plain.ts')
  assert.equal(output, null)
}

console.log('vite plugin tests passed')
