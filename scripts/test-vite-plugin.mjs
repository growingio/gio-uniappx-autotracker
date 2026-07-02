import assert from 'node:assert/strict'
import { gioUniappxAutoTrack } from '../uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs'

const plugin = gioUniappxAutoTrack()

function transform(code, id = '/src/pages/index/index.uvue') {
  const result = plugin.transform(code, id)
  assert.notEqual(result, null)
  return result.code
}

{
  const code = '<template><view @click="onSimpleTrack"></view></template><script setup lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'onSimpleTrack'\)/)
  assert.match(output, /return onSimpleTrack\(\)/)
  assert.doesNotMatch(output, /return onSimpleTrack\(\$event\)/)
}

{
  const code = '<template><button @click="foo(); bar()"></button></template><script lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoClick\(\$event, 'foo'\)/)
  assert.match(output, /foo\(\); bar\(\)/)
  assert.doesNotMatch(output, /return foo\(\);/)
}

{
  const code = '<template><input @change="onChange($event)" /></template><script lang="uts"></script>'
  const output = transform(code)
  assert.match(output, /gioHandleAutoChange\(\$event, 'onChange'\)/)
  assert.match(output, /onChange\(\$event\)/)
}

{
  const doubleQuoted = '<template><view @click="onDouble"></view></template><script lang="uts"></script>'
  const singleQuoted = "<template><view @click='onSingle'></view></template><script lang='uts'></script>"
  assert.match(transform(doubleQuoted), /gioHandleAutoClick\(\$event, 'onDouble'\)/)
  assert.match(transform(singleQuoted), /gioHandleAutoClick\(\$event, "onSingle"\)/)
}

{
  const code = '<template><view @click="onTap"></view></template>'
  const output = transform(code)
  assert.match(output, /<script lang="uts">/)
  assert.match(output, /gioHandleAutoClick/)
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
