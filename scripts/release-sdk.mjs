#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const sdkName = 'gio-uniappx-autotracker'
const sdkDir = join(rootDir, 'uni_modules', sdkName)
const distDir = join(rootDir, 'dist')
const distUniModulesDir = join(distDir, 'uni_modules')
const stagedSdkDir = join(distUniModulesDir, sdkName)
const releaseDir = join(distDir, 'release')
const checkOnly = process.argv.includes('--check')

const requiredFiles = [
  'package.json',
  'README.md',
  'bridge/auto-track-event.uts',
  'bridge/utils.uts',
  'build/vite-plugin.mjs',
  'plugin.uts',
  'gdp.uts',
  'utssdk/index.uts',
  'utssdk/interface.uts',
  'utssdk/common/config.uts',
  'utssdk/web/index.uts',
  'utssdk/web/package.json',
  'utssdk/mp-weixin/index.uts',
  'utssdk/app-android/index.uts',
  'utssdk/app-android/config.json',
  'utssdk/app-ios/index.uts',
  'utssdk/app-ios/config.json',
  'utssdk/app-harmony/index.uts',
  'utssdk/app-harmony/config.json',
]

const forbiddenInStagedPackage = [
  'App.uvue',
  'main.uts',
  'manifest.json',
  'pages.json',
  'pages',
  'unpackage',
  'dist',
  'node_modules',
]

const requiredVitePluginDependencies = {
  '@babel/parser': '7.28.5',
  '@vue/compiler-dom': '3.5.22',
  'magic-string': '0.30.19',
}

function fail(message) {
  console.error(`[sdk-release] ${message}`)
  process.exitCode = 1
}

function assertFile(baseDir, path) {
  const fullPath = join(baseDir, path)
  if (!existsSync(fullPath) || !statSync(fullPath).isFile()) {
    fail(`missing required file: ${relative(rootDir, fullPath)}`)
  }
}

function assertNoForbidden(baseDir, name) {
  const fullPath = join(baseDir, name)
  if (existsSync(fullPath)) {
    fail(`forbidden demo artifact in SDK package: ${relative(rootDir, fullPath)}`)
  }
}

function readSdkPackage() {
  const packageJsonPath = join(sdkDir, 'package.json')
  if (!existsSync(packageJsonPath)) {
    fail(`missing SDK package.json: ${relative(rootDir, packageJsonPath)}`)
    return null
  }

  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  } catch (error) {
    fail(`invalid SDK package.json: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

function validatePackageJson(packageJson) {
  if (packageJson == null) return

  if (packageJson.name != sdkName) {
    fail(`SDK package name must be ${sdkName}`)
  }
  if (typeof packageJson.version != 'string' || packageJson.version.length == 0) {
    fail('SDK package version must be a non-empty string')
  }
  if (packageJson.private === true) {
    fail('SDK package must not be private for a release artifact')
  }

  for (const [name, version] of Object.entries(requiredVitePluginDependencies)) {
    if (packageJson.dependencies?.[name] !== version) {
      fail(`SDK package.json must declare ${name}@${version} for the Vite autotrack plugin`)
    }
  }

  const platforms = packageJson.uni_modules?.platforms?.client?.['uni-app-x']
  if (platforms == null) {
    fail('SDK package.json must declare uni_modules.platforms.client.uni-app-x')
    return
  }
  if (platforms.web == null) fail('SDK package.json must declare web support')
  if (platforms.mp?.weixin == null) fail('SDK package.json must declare mp-weixin support')
  if (platforms.app?.android == null) fail('SDK package.json must declare app-android support')
  if (platforms.app?.ios == null) fail('SDK package.json must declare app-ios support')
  if (platforms.app?.harmony == null) fail('SDK package.json must declare app-harmony support')
}

function validateSdkVersionContract(packageJson) {
  if (packageJson == null || typeof packageJson.version != 'string') return

  const bridgePath = join(sdkDir, 'gdp.uts')
  const bridgeSource = readFileSync(bridgePath, 'utf8')
  const configPath = join(sdkDir, 'utssdk/common/config.uts')
  const configSource = readFileSync(configPath, 'utf8')
  const eventBuilderPath = join(sdkDir, 'utssdk/common/dataStore/eventBuilder/index.uts')
  const eventBuilderSource = readFileSync(eventBuilderPath, 'utf8')
  const requiredSnippets = [
    [bridgeSource, "import { version as SDK_VERSION } from './package.json'"],
    [bridgeSource, "initOptions['sdkVersion'] = SDK_VERSION"],
    [configSource, "sdkVersion: raw.getString('sdkVersion', '')"],
    [eventBuilderSource, 'sdkVersion: options.sdkVersion'],
  ]
  for (const [source, snippet] of requiredSnippets) {
    if (!source.includes(snippet)) {
      fail(`SDK version injection contract changed unexpectedly: ${snippet}`)
    }
  }
}

function validateSdkShape(baseDir) {
  for (const file of requiredFiles) {
    assertFile(baseDir, file)
  }

  for (const name of forbiddenInStagedPackage) {
    assertNoForbidden(baseDir, name)
  }
}

function countOccurrences(text, pattern) {
  return text.split(pattern).length - 1
}

function validateIdentityStorageContract(baseDir) {
  const userStorePath = join(baseDir, 'utssdk/common/userStore/index.uts')
  if (!existsSync(userStorePath)) {
    fail(`missing user store: ${relative(rootDir, userStorePath)}`)
    return
  }

  const runtimePath = join(baseDir, 'utssdk/common/runtime/index.uts')
  const webRuntimePath = join(baseDir, 'utssdk/web/runtime.uts')
  const mpRuntimePath = join(baseDir, 'utssdk/mp-weixin/runtime.uts')
  for (const path of [runtimePath, webRuntimePath, mpRuntimePath]) {
    if (!existsSync(path)) {
      fail(`missing identity runtime policy source: ${relative(rootDir, path)}`)
      return
    }
  }

  const source = readFileSync(userStorePath, 'utf8')
  const runtimeSource = readFileSync(runtimePath, 'utf8')
  const webRuntimeSource = readFileSync(webRuntimePath, 'utf8')
  const mpRuntimeSource = readFileSync(mpRuntimePath, 'utf8')
  const requiredSnippets = [
    'private cachedUserId : string',
    'private cachedUserKey : string',
    'private identityLoaded : boolean',
    'if (this.identityLoaded)',
    'this.cachedUserId = this.readStoredUserId()',
    'this.cachedUserKey = this.readStoredUserKey()',
    'this.cachedUserId = userId',
    'this.cachedUserKey = userKey',
    'this.identityLoaded = true',
    'this.identityLoaded = false',
  ]

  for (const snippet of requiredSnippets) {
    if (!source.includes(snippet)) {
      fail(`identity cache contract changed unexpectedly: ${snippet}`)
    }
  }

  const userIdResolverStart = source.indexOf('private resolveUserId() : string')
  const userKeyResolverStart = source.indexOf('private resolveUserKey() : string', userIdResolverStart)
  const nextResolverStart = source.indexOf('private readStoredGioId() : string', userKeyResolverStart)
  if (userIdResolverStart < 0 || userKeyResolverStart < 0 || nextResolverStart < 0) {
    fail('identity storage contract changed unexpectedly: identity resolvers not found')
    return
  }
  const userIdResolverSource = source.slice(userIdResolverStart, userKeyResolverStart)
  const userKeyResolverSource = source.slice(userKeyResolverStart, nextResolverStart)
  const resolverContracts = [
    [userIdResolverSource, 'return this.readStoredUserId()', 'return this.cachedUserId'],
    [userKeyResolverSource, 'return this.readStoredUserKey()', 'return this.cachedUserKey'],
  ]
  for (const [resolverSource, storageRead, cacheRead] of resolverContracts) {
    if (!resolverSource.includes('if (shouldReadIdentityFromStorage())')) {
      fail('identity resolver must branch through the platform storage-read policy')
    }
    if (!resolverSource.includes(storageRead)) {
      fail(`web identity resolver must read storage directly: ${storageRead}`)
    }
    if (!resolverSource.includes('this.ensureIdentityLoaded()') || !resolverSource.includes(cacheRead)) {
      fail(`non-web identity resolver must retain the in-memory cache: ${cacheRead}`)
    }
  }

  if (countOccurrences(source, 'setItem(this.getUserIdKey()') != 1) {
    fail('userId storage writes must stay centralized in persistUser()')
  }
  if (countOccurrences(source, 'setItem(this.getUserKeyKey()') != 1) {
    fail('userKey storage writes must stay centralized in persistUser()')
  }
  if (countOccurrences(source, 'this.getMainStorage().removeItem(this.getUserKeyKey())') != 1) {
    fail('userKey storage removal must stay limited to idMapping=false hydration cleanup')
  }

  const runtimeRequiredSnippets = [
    'shouldReadIdentityFromStorage : () => boolean',
    'export function shouldReadIdentityFromStorage() : boolean',
    'return policy != null ? policy.shouldReadIdentityFromStorage() : false',
  ]
  for (const snippet of runtimeRequiredSnippets) {
    if (!runtimeSource.includes(snippet)) {
      fail(`identity runtime policy changed unexpectedly: ${snippet}`)
    }
  }
  if (!webRuntimeSource.includes('shouldReadIdentityFromStorage() : boolean {\n    return true')) {
    fail('web identity must be read from storage for every event context')
  }
  if (!mpRuntimeSource.includes('shouldReadIdentityFromStorage() : boolean {\n    return false')) {
    fail('mp-weixin identity must keep using the in-memory cache')
  }
}

function validateUploadSanitizationContract(baseDir) {
  const uploaderPath = join(baseDir, 'utssdk/common/core/uploader.uts')
  if (!existsSync(uploaderPath)) {
    fail(`missing uploader: ${relative(rootDir, uploaderPath)}`)
    return
  }

  const source = readFileSync(uploaderPath, 'utf8')
  const requiredSnippets = [
    "if (typeof value == 'string')",
    'return value.length > 0 ? value : null',
    'const sanitizedItem = this.sanitizeValue(value[i])',
    'const sanitizedValue = this.sanitizeValue(raw[key])',
    'return UTSJSONObject.keys(sanitized).length > 0 ? sanitized : null',
  ]
  for (const snippet of requiredSnippets) {
    if (!source.includes(snippet)) {
      fail(`upload empty-value sanitization changed unexpectedly: ${snippet}`)
    }
  }

  const sanitizeEventStart = source.indexOf('private sanitizeEvent(')
  const sanitizeEventEnd = source.indexOf('private buildRequestHeader(', sanitizeEventStart)
  if (sanitizeEventStart < 0 || sanitizeEventEnd < 0) {
    fail('upload sanitizer contract changed unexpectedly: sanitizeEvent() not found')
    return
  }

  const sanitizeEventSource = source.slice(sanitizeEventStart, sanitizeEventEnd)
  if (!sanitizeEventSource.includes('const sanitizedValue = this.sanitizeValue(raw[key])')) {
    fail('every upload field must pass through sanitizeValue()')
  }
  if (/if\s*\(\s*key\s*==/.test(sanitizeEventSource)) {
    fail('upload sanitizer must not bypass empty-value filtering for named fields')
  }
}

function validateWebReferralContract(baseDir) {
  const runtimePath = join(baseDir, 'utssdk/web/runtime.uts')
  if (!existsSync(runtimePath)) {
    fail(`missing web runtime: ${relative(rootDir, runtimePath)}`)
    return
  }

  const source = readFileSync(runtimePath, 'utf8')
  const resolverStart = source.indexOf('function resolveBrowserPageContext(')
  const resolverEnd = source.indexOf('function readRawConfigField(', resolverStart)
  if (resolverStart < 0 || resolverEnd < 0) {
    fail('web referral contract changed unexpectedly: page resolver not found')
    return
  }

  const resolverSource = source.slice(resolverStart, resolverEnd)
  if (resolverSource.includes('lastCommittedPageFullUrl =')) {
    fail('web page resolver must not advance the committed referral state')
  }
  const replayRequiredSnippets = [
    'currentHref == lastCommittedPageFullUrl',
    '? lastCommittedReferralPage',
    ': lastCommittedPageFullUrl',
  ]
  for (const snippet of replayRequiredSnippets) {
    if (!resolverSource.includes(snippet)) {
      fail(`same-page PAGE replay must preserve its prior referral: missing ${snippet}`)
    }
  }
  if (countOccurrences(source, 'lastCommittedPageFullUrl = currentHref') != 1) {
    fail('web referral state must advance exactly once after PAGE is formed')
  }
  if (countOccurrences(source, 'lastCommittedReferralPage = event.referralPage') != 1) {
    fail('web referral state must preserve the committed PAGE referral exactly once')
  }

  const shaperStart = source.indexOf('registerEventShaper({')
  const shaperEnd = source.indexOf('function isBeaconSupported()', shaperStart)
  if (shaperStart < 0 || shaperEnd < 0) {
    fail('web referral contract changed unexpectedly: event shaper not found')
    return
  }
  const shaperSource = source.slice(shaperStart, shaperEnd)
  if (!shaperSource.includes("if (event.eventType == 'PAGE')")) {
    fail('web referral state must only advance for PAGE events')
  }
  if (!shaperSource.includes('lastCommittedPageFullUrl = currentHref')) {
    fail('web referral state must advance in the PAGE event shaper')
  }
}

function validateWebUploadTerminationContract(baseDir) {
  const runtimePath = join(baseDir, 'utssdk/web/runtime.uts')
  if (!existsSync(runtimePath)) {
    fail(`missing web runtime: ${relative(rootDir, runtimePath)}`)
    return
  }

  const source = readFileSync(runtimePath, 'utf8')
  const senderStart = source.indexOf('registerEventSender({')
  if (senderStart < 0) {
    fail('web upload termination contract changed unexpectedly: event sender not found')
    return
  }

  const senderSource = source.slice(senderStart)
  const requiredSnippets = [
    'let settled : boolean = false',
    'xhr.timeout = resolveUploadRequestTimeout(DEFAULT_REQUEST_TIMEOUT_MS)',
    'xhr.onerror = finishFail',
    'xhr.ontimeout = finishFail',
    'xhr.onabort = finishFail',
    'catch (_error) {\n      finishFail()',
  ]
  for (const snippet of requiredSnippets) {
    if (!senderSource.includes(snippet)) {
      fail(`web XHR sender must preserve terminal handling: missing ${snippet}`)
    }
  }
  if (countOccurrences(senderSource, 'if (settled)') != 2) {
    fail('web XHR sender must settle success and failure exactly once')
  }
}

function stagePackage() {
  rmSync(stagedSdkDir, { recursive: true, force: true })
  mkdirSync(distUniModulesDir, { recursive: true })
  cpSync(sdkDir, stagedSdkDir, {
    recursive: true,
    filter(source) {
      const basename = source.split('/').pop()
      return basename != '.DS_Store'
    },
  })
}

function createArchive(version) {
  mkdirSync(releaseDir, { recursive: true })
  const archivePath = join(releaseDir, `${sdkName}-${version}.tgz`)
  rmSync(archivePath, { force: true })

  const result = spawnSync('tar', ['-czf', archivePath, '-C', distDir, 'uni_modules'], {
    cwd: rootDir,
    stdio: 'inherit',
  })

  if (result.status != 0) {
    fail(`failed to create archive: ${relative(rootDir, archivePath)}`)
    return null
  }

  return archivePath
}

const packageJson = readSdkPackage()
validatePackageJson(packageJson)
validateSdkShape(sdkDir)
validateSdkVersionContract(packageJson)
validateIdentityStorageContract(sdkDir)
validateUploadSanitizationContract(sdkDir)
validateWebReferralContract(sdkDir)
validateWebUploadTerminationContract(sdkDir)

if (!checkOnly && process.exitCode == null) {
  stagePackage()
  validateSdkShape(stagedSdkDir)
  validateIdentityStorageContract(stagedSdkDir)
  validateUploadSanitizationContract(stagedSdkDir)
  validateWebReferralContract(stagedSdkDir)
  validateWebUploadTerminationContract(stagedSdkDir)
  const archivePath = createArchive(packageJson.version)
  if (archivePath != null) {
    console.log(`[sdk-release] staged: ${relative(rootDir, stagedSdkDir)}`)
    console.log(`[sdk-release] archive: ${relative(rootDir, archivePath)}`)
  }
}

if (process.exitCode == null) {
  console.log(checkOnly ? '[sdk-release] check passed' : '[sdk-release] release package ready')
}
