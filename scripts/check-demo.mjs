import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const demoPages = [
  'pages/index/index.uvue',
  'pages/custom-event/custom-event.uvue',
  'pages/user/user.uvue',
  'pages/lifecycle/lifecycle.uvue',
  'pages/autotrack/autotrack.uvue',
  'pages/route/route.uvue',
  'pages/abtest/abtest.uvue',
  'pages/datacollect/datacollect.uvue',
  'pages/share/share.uvue',
]

const sdkDir = 'uni_modules/gio-uniappx-autotracker'
const sdkPlatformFiles = [
  'utssdk/web/index.uts',
  'utssdk/web/package.json',
  'utssdk/app-android/index.uts',
  'utssdk/app-android/config.json',
  'utssdk/app-ios/index.uts',
  'utssdk/app-ios/config.json',
  'utssdk/app-harmony/index.uts',
  'utssdk/app-harmony/config.json',
  'utssdk/mp-weixin/index.uts',
]

for (const page of demoPages) {
  assert.ok(existsSync(page), `missing demo page: ${page}`)
}

for (const file of sdkPlatformFiles) {
  assert.ok(existsSync(`${sdkDir}/${file}`), `missing SDK platform file: ${file}`)
}

const sdkPackage = JSON.parse(readFileSync(`${sdkDir}/package.json`, 'utf8'))
assert.ok(
  sdkPackage.uni_modules?.platforms?.client?.['uni-app-x']?.app?.harmony != null,
  'SDK package must declare app-harmony support',
)

const indexSource = readFileSync('pages/index/index.uvue', 'utf8')
assert.match(indexSource, /<!-- #ifdef MP-WEIXIN -->\s*<view[\s\S]*id="home_entry_share"/)

const routeSource = readFileSync('pages/route/route.uvue', 'utf8')
assert.match(routeSource, /<!-- #ifdef WEB -->\s*<view[\s\S]*hash 路由场景/)
assert.match(routeSource, /const value = query\.getString\(key\)/)
assert.doesNotMatch(routeSource, /query\[key\]/)
assert.match(routeSource, /\/\/ #ifdef WEB\s*function goHashPath\(\)/)

const autotrackSource = readFileSync('pages/autotrack/autotrack.uvue', 'utf8')
for (const [id, harmonyHandler, fallbackHandler] of [
  ['auto_blur_input', 'onInputChange', 'onInputBlur'],
  ['auto_password_input', 'onPasswordChange', 'onPasswordBlur'],
]) {
  const expression = new RegExp(
    `<!-- #ifdef APP-HARMONY -->[\\s\\S]*id="${id}"[\\s\\S]*@change="${harmonyHandler}\\(\\$event\\)"[\\s\\S]*<!-- #ifndef APP-HARMONY -->[\\s\\S]*id="${id}"[\\s\\S]*@blur="${fallbackHandler}\\(\\$event\\)"`,
  )
  assert.match(autotrackSource, expression)
}
assert.match(autotrackSource, /function onInputChange\(_event : any \| null\)/)
assert.match(autotrackSource, /function onPasswordChange\(_event : any \| null\)/)

console.log('demo contract checks passed')
