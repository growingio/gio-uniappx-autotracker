import assert from 'node:assert/strict'
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

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick as _gioHandleAutoClick/)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onSimpleTrack', null, null, null, null, null, null\)/)
  assert.match(output, /function gioHandleAutoClick\(event : any \| null, eventName : string, staticId : string \| null[\s\S]*return _gioHandleAutoClick\(event, eventName, staticId, staticIndex, staticTitle, staticSrc, staticGrowingTrack, staticGrowingIgnore\)\s*}/)
  assert.doesNotMatch(output, /methods\s*:\s*{[\s\S]*gioHandleAutoClick/)
  assert.match(output, /onSimpleTrack\(\)/)
  assert.doesNotMatch(output, /\(\$event\)\s*=>/)
  assert.doesNotMatch(output, /onSimpleTrack\(\$event\)/)
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
  </template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onLongPress', 'press', null, 'longpress 区域', null, null, null\); onLongPress\(\)/)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onLongTap', 'tap', null, 'longtap 区域', null, null, null\); onLongTap\(\)/)
}

{
  const code = `<template><uni-link id="doc_link" href="https://doc.dcloud.net.cn" data-title="文档">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="gioHandleAutoClick\(\$event, 'openURL', 'doc_link', null, '文档', 'https:\/\/doc\.dcloud\.net\.cn', null, null\)"/)
}

{
  const code = `<template><uni-link id="dynamic_link" :href="docUrl">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /:data-src="docUrl"/)
  assert.match(output, /@click="gioHandleAutoClick\(\$event, 'openURL', 'dynamic_link', null, null, null, null, null\)"/)
}

{
  const code = `<template><uni-link id="custom_link" href="https://doc.dcloud.net.cn" data-src="https://example.com/custom">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="gioHandleAutoClick\(\$event, 'openURL', 'custom_link', null, null, 'https:\/\/example\.com\/custom', null, null\)"/)
}

{
  const code = `<template><uni-link id="dynamic_custom_link" href="https://doc.dcloud.net.cn" :data-src="customUrl">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.match(output, /@click="gioHandleAutoClick\(\$event, 'openURL', 'dynamic_custom_link', null, null, null, null, null\)"/)
}

{
  const code = `<template><uni-link id="explicit_link" href="https://doc.dcloud.net.cn" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onLinkClick', 'explicit_link', null, null, 'https:\/\/doc\.dcloud\.net\.cn', null, null\); onLinkClick\(\)/)
  assert.match(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
  assert.equal(output.match(/gioHandleAutoClick\(\$event/g)?.length, 1)
}

{
  const code = `<template><uni-link id="explicit_custom_link" href="https://doc.dcloud.net.cn" data-src="https://example.com/custom" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onLinkClick', 'explicit_custom_link', null, null, 'https:\/\/example\.com\/custom', null, null\); onLinkClick\(\)/)
  assert.doesNotMatch(output, /data-src="https:\/\/doc\.dcloud\.net\.cn"/)
}

{
  const code = `<template><uni-link id="explicit_dynamic_custom_link" href="https://doc.dcloud.net.cn" :data-src="customUrl" @click="onLinkClick">文档</uni-link></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onLinkClick', 'explicit_dynamic_custom_link', null, null, null, null, null\); onLinkClick\(\)/)
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
  assert.match(output, /gioHandleAutoChange\(\$event, 'onPasswordBlur', 'password', null, null, null, null, null, null\)/)
}

{
  const code = `<template><input :type="'password'" @change="onDynamicLiteralType" /></template><script setup lang="uts"></script>`
  const output = transform(code)
  assert.match(output, /gioHandleAutoChange\(\$event, 'onDynamicLiteralType', 'password', null, null, null, null, null, null\)/)
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
  assert.match(output, /gioHandleAutoClick\(\$event, 'onConditionalTrue', 'auto_call_conditional', '16', '条件表达式', '\/pages\/autotrack\/autotrack\?case=conditional', null, null\)/)
  assert.match(output, /conditionEnabled \? onConditionalTrue\(\) : onConditionalFalse\(\)/)
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
