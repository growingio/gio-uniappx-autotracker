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

function transformForPlatform(code, platform, id = '/src/pages/index/index.uvue') {
  const previousPlatform = process.env.UNI_PLATFORM ?? null
  const previousAppPlatform = process.env.UNI_APP_PLATFORM ?? null
  const appPlatform = platform.startsWith('app-') ? platform.slice('app-'.length) : null
  process.env.UNI_PLATFORM = appPlatform != null ? 'app' : platform
  if (appPlatform != null) {
    process.env.UNI_APP_PLATFORM = appPlatform
  } else {
    delete process.env.UNI_APP_PLATFORM
  }
  try {
    return transform(code, id)
  } finally {
    if (previousPlatform == null) {
      delete process.env.UNI_PLATFORM
    } else {
      process.env.UNI_PLATFORM = previousPlatform
    }
    if (previousAppPlatform == null) {
      delete process.env.UNI_APP_PLATFORM
    } else {
      process.env.UNI_APP_PLATFORM = previousAppPlatform
    }
  }
}

function assertSetupDispatcher(output) {
  assert.match(output, /function _gioAutoTrackDispatch\(event : any \| null, action : number, changePayload : any \| null, pickerRange : any \| null, templateId : string \| number \| null, templateIndex : string \| number \| boolean \| null, templateTitle : string \| number \| boolean \| null, templateSrc : string \| number \| boolean \| null, templateGrowingTrack : string \| number \| boolean \| null, templateGrowingIgnore : string \| number \| boolean \| null, condition : boolean \| null = null, alternateAction : number \| null = null\) : boolean/)
  assert.equal(output.match(/function _gioAutoTrackDispatch/g)?.length, 1)
  assert.doesNotMatch(output, /_gioAutoTrackHandler\d+/)
  assert.doesNotMatch(output, /gioReadAutoTrackAction/)
  assert.doesNotMatch(output, /data-gio-auto-track-bound/)
}

function assertSetupDispatcherAfterSource(output, sourceMarker) {
  assert.ok(output.indexOf(sourceMarker) < output.indexOf('function _gioAutoTrackDispatch'))
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script setup lang="uts">function onSimpleTrack(event : any | null) : void {}</script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick as _gioHandleAutoClick/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); onSimpleTrack\(\$event\)"/)
  assert.doesNotMatch(output, /data-gio-auto-track-action=/)
  assert.doesNotMatch(output, /function gioHandleAutoClick\(/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onSimpleTrack', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)\s*return resolvedCondition/)
  assert.doesNotMatch(output, /\(\$event\)\s*=>/)
  assertSetupDispatcher(output)
  assert.ok(output.indexOf('gioHandleAutoClick as _gioHandleAutoClick') < output.indexOf('function _gioAutoTrackDispatch'))
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script lang="uts">export default { methods: { onSimpleTrack(event : any | null) {} } }</script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onSimpleTrack', null, null, null, null, null, null\); onSimpleTrack\(\$event\)/)
}

{
  const code = '<template><view @click="actions.onSimpleTrack"></view></template><script setup lang="uts">const actions = { onSimpleTrack(event : any | null) : void {} }</script>'
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); actions\.onSimpleTrack\(\$event\)"/)
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script setup lang="uts">function onSimpleTrack() : void {}</script>'
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); onSimpleTrack\(\)"/)
}

{
  const code = '<template><view @click="importedHandler"></view></template><script setup lang="uts">import { importedHandler } from \'./handlers.uts\'</script>'
  const output = transformForPlatform(code, 'h5')
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); importedHandler\(\$event\)"/)
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
  assert.match(output, /methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, templateId : string \| number \| null[\s\S]*return _gioHandleAutoClick\(event, eventName, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)[\s\S]*gioHandleAutoChange\(event : any \| null, eventName : string, elementType : string \| null, templateId : string \| number \| null[\s\S]*changePayload : any \| null, pickerRange : any \| null[\s\S]*return _gioHandleAutoChange\(event, eventName, elementType, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
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
  assert.match(output, /@longpress="_gioAutoTrackDispatch\(\$event, 0, null, null, 'press', null, 'longpress 区域', null, null, null\); onLongPress\(\)"/)
  assert.match(output, /@longtap="_gioAutoTrackDispatch\(\$event, 1, null, null, 'tap', null, 'longtap 区域', null, null, null\); onLongTap\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onLongPress', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)\s*return/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onLongTap', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)\s*return/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onButtonLongPress', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)\s*return/)
  assertSetupDispatcher(output)
}

{
  const code = '<template><view @click="onPayload({ $event })"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); onPayload\(\{ \$event \}\)"/)
  assert.doesNotMatch(output, /\$event: event/)
}

{
  const code = '<template><view @click="(payload) => onPayload(payload)"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); \(\(payload\) => onPayload\(payload\)\)\(\$event\)"/)
}

{
  const code = fs.readFileSync('pages/autotrack/autotrack.uvue', 'utf8')
  const output = transform(code, '/src/pages/autotrack/autotrack.uvue')
  assert.match(output, /<view[\s\S]*id="auto_longpress_method"[\s\S]*@longpress="_gioAutoTrackDispatch\(\$event, \d+, null, null, 'auto_longpress_method', '3', 'longpress 区域', '[^']+', null, null\); onLongPress\(\)"/)
  assert.match(output, /<input[\s\S]*id="auto_blur_input"[\s\S]*@blur="_gioAutoTrackDispatch\(\$event, \d+, \$event, null, 'auto_blur_input', '42', 'blur 输入框', '[^']+', 'true', null\); onInputBlur\(\$event\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onInputBlur', null, templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
  assert.doesNotMatch(output.slice(0, output.indexOf('</template>')), /as UTSJSONObject/)
  assertSetupDispatcher(output)
}

{
  const code = fs.readFileSync('pages/autotrack/autotrack.uvue', 'utf8')
  for (const platform of ['app-android', 'app-ios', 'app-harmony', 'mp-weixin', 'web']) {
    const output = transformForPlatform(code, platform, '/src/pages/autotrack/autotrack.uvue')
    const template = output.slice(0, output.indexOf('</template>'))
    assert.match(template, /id="auto_longpress_method"[\s\S]*@longpress="_gioAutoTrackDispatch\(\$event, \d+, null,/)
    assert.match(template, /id="auto_blur_input"[\s\S]*@blur="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(template, /id="component_textarea_confirm"[\s\S]*@confirm="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(template, /id="auto_change_switch"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(output, /_gioHandleAutoChange\(event, 'onSwitchChange', 'switch', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
    assert.match(template, /id="auto_change_slider"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(template, /id="component_radio_group_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(template, /id="component_picker_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(output, /_gioHandleAutoChange\(event, 'recordComponentAction', 'picker', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
    assert.match(template, /id="component_picker_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event, \(pickerItems\),/)
    assert.match(template, /id="component_checkbox_group_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(template, /id="component_picker_view_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event,/)
    assert.match(output, /_gioHandleAutoChange\(event, 'recordComponentAction', 'picker-view', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
    assert.match(template, /id="component_picker_view_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event, \[\(pickerItems\)\],/)
    assert.match(template, /id="component_swiper_change"[\s\S]*@change="_gioAutoTrackDispatch\(\$event, \d+, \$event, null, 'component_swiper_change', null, 'swiper change', null, null, null\)/)
    assert.match(output, /_gioHandleAutoChange\(event, 'recordComponentAction', 'swiper', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
    assert.doesNotMatch(template, /\$event\.detail|as UTSJSONObject/)
    assertSetupDispatcher(output)
  }
}

{
  const code = '<template><input @blur="onBlur($event)" /></template><script setup lang="uts"></script>'
  const output = transformForPlatform(code, 'app-android')
  assert.match(output, /@blur="_gioAutoTrackDispatch\(\$event, 0, \$event, null, null, null, null, null, null, null\); onBlur\(\$event\)"/)
  assert.doesNotMatch(output.slice(0, output.indexOf('</template>')), /detail|as UTSJSONObject/)
  assertSetupDispatcher(output)
}

{
  const code = `<template>
    <switch
      :id="item.id"
      :data-title="item.title"
      :data-growing-track="item.track"
      @change="enabled ? onChangeTrue($event) : onChangeFalse($event)"
    />
  </template><script setup lang="uts"></script>`
  const output = transformForPlatform(code, 'app-android')
  assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0, \$event, null, \(item\.id\), null, \(item\.title\), null, \(item\.track\), null, enabled, 1\) \? onChangeTrue\(\$event\) : onChangeFalse\(\$event\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onChangeTrue', 'switch', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onChangeFalse', 'switch', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)/)
  assert.doesNotMatch(output.slice(0, output.indexOf('</template>')), /detail|as UTSJSONObject/)
  const dispatcher = output.slice(output.indexOf('function _gioAutoTrackDispatch'))
  assert.doesNotMatch(dispatcher, /item\.|enabled/)
  assertSetupDispatcher(output)
}

{
  const code = '<template><slider data-growing-track="true" @change="onSliderChange($event)" /></template><script setup lang="uts"></script>'
  const output = transformForPlatform(code, 'mp-weixin')
  assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0, \$event, null, null, null, null, null, 'true', null\); onSliderChange\(\$event\)"/)
  assertSetupDispatcher(output)
}

{
  const code = `<template>
    <switch data-growing-track @change="onTrackedChange($event)" />
    <switch data-growing-track="false" @change="onUntrackedChange($event)" />
    <view data-growing-ignore @tap="onIgnoredTap" />
    <view data-growing-ignore="false" @tap="onVisibleTap" />
  </template><script setup lang="uts"></script>`
  for (const platform of ['app-android', 'app-ios', 'app-harmony', 'mp-weixin', 'web']) {
    const output = transformForPlatform(code, platform)
    assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0, \$event, null, null, null, null, null, 'true', null\); onTrackedChange\(\$event\)"/)
    assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 1, \$event, null, null, null, null, null, 'false', null\); onUntrackedChange\(\$event\)"/)
    assert.match(output, /@tap="_gioAutoTrackDispatch\(\$event, 2, null, null, null, null, null, null, null, 'true'\); onIgnoredTap\((?:\$event)?\)"/)
    assert.match(output, /@tap="_gioAutoTrackDispatch\(\$event, 3, null, null, null, null, null, null, null, 'false'\); onVisibleTap\((?:\$event)?\)"/)
    assertSetupDispatcher(output)
  }
}

{
  const code = '<template><input @change="onChange($event)" /></template><script lang="uts">export default { methods: { onChange(event : any | null) {} } }</script>'
  const output = transformForPlatform(code, 'app-android')
  assert.match(output, /gioHandleAutoChange\(\$event, 'onChange', null, null, null, null, null, null, null, \$event, null\); onChange\(\$event\)/)
  assert.match(output, /gioHandleAutoChange\(event : any \| null, eventName : string, elementType : string \| null,[\s\S]*changePayload : any \| null/)
}

{
  const code = fs.readFileSync('pages/autotrack/autotrack.uvue', 'utf8')
  const output = transformForPlatform(code, 'app-android', '/src/pages/autotrack/autotrack.uvue')
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, \d+, null, [^;]+\); onEventMethod\(\$event\)"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, \d+, null, [^;]+\); onZeroArgumentMethod\(\)"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, \d+, null, [^;]+\); actions\.onMemberEvent\(\$event\)"/)
  assertSetupDispatcher(output)
}

{
  const code = `<template><uni-link id="doc_link" href="https://doc.dcloud.net.cn" data-title="文档">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'doc_link', null, '文档', 'https:\/\/doc\.dcloud\.net\.cn', null, null\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'openURL', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)/)
}

{
  const code = `<template><uni-link id="dynamic_link" :href="docUrl">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /:data-src="docUrl"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'dynamic_link', null, null, \(docUrl\), null, null\)"/)
}

{
  const code = `<template><uni-link id="custom_link" href="https://doc.dcloud.net.cn" data-src="https://example.com/custom">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'custom_link', null, null, 'https:\/\/example\.com\/custom', null, null\)"/)
}

{
  const code = `<template><uni-link id="dynamic_custom_link" href="https://doc.dcloud.net.cn" :data-src="customUrl">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'dynamic_custom_link', null, null, \(customUrl\), null, null\)"/)
}

{
  const code = `<template><uni-link id="explicit_link" href="https://doc.dcloud.net.cn" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'explicit_link', null, null, 'https:\/\/doc\.dcloud\.net\.cn', null, null\); onLinkClick\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onLinkClick', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)\s*return/)
  assert.match(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assertSetupDispatcher(output)
}

{
  const code = `<template><uni-link id="explicit_custom_link" href="https://doc.dcloud.net.cn" data-src="https://example.com/custom" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'explicit_custom_link', null, null, 'https:\/\/example\.com\/custom', null, null\); onLinkClick\(\)"/)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
}

{
  const code = `<template><uni-link id="explicit_dynamic_custom_link" href="https://doc.dcloud.net.cn" :data-src="customUrl" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'explicit_dynamic_custom_link', null, null, \(customUrl\), null, null\); onLinkClick\(\)"/)
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
  assert.match(output, /gioHandleAutoChange\(\$event, 'onChange', null, null, null, null, null, null, null, \$event, null\)/)
  assert.match(output, /export default\s*{\s*methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, templateId : string \| number \| null/)
  assert.match(output, /onChange\(\$event\)/)
}

{
  const code = '<template><input type="password" @blur="onPasswordBlur($event)" /></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /@blur="_gioAutoTrackDispatch\(\$event, 0, \$event, null, null, null, null, null, null, null\); onPasswordBlur\(\$event\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onPasswordBlur', 'password', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)\s*return/)
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
  assert.match(output, /v-on:tap\.stop="_gioAutoTrackDispatch\(\$event, 0, null, null, 'ast_event', '7', 'AST 事件', null, null, null\); onEventAndLabel\(\$event, '\$event'\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onEventAndLabel', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)\s*return/)
  assertSetupDispatcher(output)
}

{
  const code = `<template>
    <list-view>
      <list-item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :data-index="item.index"
        :data-title="item.title"
        :data-src="item.src"
        :data-growing-track="item.track"
        :data-growing-ignore="item.ignore"
        @click="onItemClick(item)"
      ></list-item>
    </list-view>
  </template><script setup lang="uts"></script>`
  const output = transformForPlatform(code, 'app-android')
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, \(item\.id\), \(item\.index\), \(item\.title\), \(item\.src\), \(item\.track\), \(item\.ignore\)\); onItemClick\(item\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onItemClick', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)/)
  const dispatcher = output.slice(output.indexOf('function _gioAutoTrackDispatch'))
  assert.doesNotMatch(dispatcher, /item\./)
  assertSetupDispatcher(output)
}

{
  const code = `<template><list-item v-for="item in items" :id="item.id" :data-title="item.title" :data-growing-track="item.track" @click="onItemClick(item)"></list-item></template><script lang="uts">export default { methods: { onItemClick(item : UTSJSONObject) {} } }</script>`
  const output = transformForPlatform(code, 'app-android')
  assert.match(output, /gioHandleAutoClick\(\$event, 'onItemClick', \(item\.id\), null, \(item\.title\), null, \(item\.track\), null\); onItemClick\(item\)/)
}

{
  const code = `<template><list-item :data-title='item.title ?? "fallback"' @click="onItemClick(item)"></list-item></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, \(item\.title \?\? &quot;fallback&quot;\), null, null, null\)/)
}

{
  const code = `<template><input :type="'password'" @change="onDynamicLiteralType" /></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0, \$event, null, null, null, null, null, null, null\); onDynamicLiteralType\(\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onDynamicLiteralType', 'password', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore, changePayload, pickerRange\)\s*return/)
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
  assert.match(output, /methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, templateId : string \| number \| null[\s\S]*gioHandleAutoChange\(event : any \| null, eventName : string, elementType : string \| null, templateId : string \| number \| null[\s\S]*go\(name: string\)/)
  assert.match(output, /gioHandleAutoClick\(\$event, 'go', null, null, null, null, null, null\); go\('autotrack'\)/)
}

{
  const code = `<template><button id="auto_call_conditional" :data-index="16" data-title="条件表达式" data-src="/pages/autotrack/autotrack?case=conditional" @click="conditionEnabled ? onConditionalTrue() : onConditionalFalse()">条件表达式</button></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, 'auto_call_conditional', '16', '条件表达式', '\/pages\/autotrack\/autotrack\?case=conditional', null, null, conditionEnabled, 1\) \? onConditionalTrue\(\) : onConditionalFalse\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onConditionalTrue', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onConditionalFalse', templateId, templateIndex, templateTitle, templateSrc, templateGrowingTrack, templateGrowingIgnore\)/)
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
  assert.match(output, /@change="_gioAutoTrackDispatch\(\$event, 0, \$event, null, null, null, null, null, null, null, conditionEnabled, 1\) \? onChangeTrue\(\$event\) : onChangeFalse\(\$event\)"/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onChangeTrue', 'password'/)
  assert.match(output, /_gioHandleAutoChange\(event, 'onChangeFalse', 'password'/)
}

{
  const code = `<template><input @change="conditionEnabled ? onChangeTrue($event) : onChangeFalse($event)" /></template><script lang="uts">export default { data() { return { conditionEnabled: true } }, methods: { onChangeTrue() {}, onChangeFalse() {} } }</script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoConditionalChange\(\$event, conditionEnabled, 'onChangeTrue', 'onChangeFalse', null, null, null, null, null, null, null, \$event, null\) \? onChangeTrue\(\$event\) : onChangeFalse\(\$event\)/)
  assert.match(output, /_gioHandleAutoChange\(event, condition \? consequentEventName : alternateEventName/)
}

{
  const code = `<template><view @click="onClick" @tap="onTap"></view></template><script setup lang="uts">
function onClick() : void {}
function onTap() : void {}
</script>`
  const output = transform(code)
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); onClick\(\)"\s+@tap="_gioAutoTrackDispatch\(\$event, 1, null, null, null, null, null, null, null, null\); onTap\(\)"/)
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
  assert.match(output, /@click="_gioAutoTrackDispatch\(\$event, 0, null, null, null, null, null, null, null, null\); onCardClick\(\)"/)
  assert.match(output, /_gioHandleAutoClick\(event, 'onCardClick'/)
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
  assert.match(output, /export default\s*{\s*methods\s*:\s*{\s*gioHandleAutoClick\(event : any \| null, eventName : string, templateId : string \| number \| null/)
}

{
  const output = plugin.transform('<template><view @scroll="onScroll"></view></template>', '/src/pages/index/index.uvue')
  assert.equal(output, null)
}

{
  const output = plugin.transform('<template><view @click="onTap"></view></template>', '/src/plain.ts')
  assert.equal(output, null)
}

{
  const pluginSource = fs.readFileSync('uni_modules/gio-uniappx-autotracker/plugin.uts', 'utf8')
  assert.doesNotMatch(pluginSource, /installWebDomAutoTrack|documentRef\.addEventListener/)
}

console.log('vite plugin tests passed')
