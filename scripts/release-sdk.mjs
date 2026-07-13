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

function validateIdentityCacheContract(baseDir) {
  const userStorePath = join(baseDir, 'utssdk/common/userStore/index.uts')
  if (!existsSync(userStorePath)) {
    fail(`missing user store: ${relative(rootDir, userStorePath)}`)
    return
  }

  const source = readFileSync(userStorePath, 'utf8')
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

  if (countOccurrences(source, 'setItem(this.getUserIdKey()') != 1) {
    fail('userId storage writes must stay centralized in persistUser()')
  }
  if (countOccurrences(source, 'setItem(this.getUserKeyKey()') != 1) {
    fail('userKey storage writes must stay centralized in persistUser()')
  }
  if (countOccurrences(source, 'this.getMainStorage().removeItem(this.getUserKeyKey())') != 1) {
    fail('userKey storage removal must stay limited to idMapping=false hydration cleanup')
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
validateIdentityCacheContract(sdkDir)

if (!checkOnly && process.exitCode == null) {
  stagePackage()
  validateSdkShape(stagedSdkDir)
  validateIdentityCacheContract(stagedSdkDir)
  const archivePath = createArchive(packageJson.version)
  if (archivePath != null) {
    console.log(`[sdk-release] staged: ${relative(rootDir, stagedSdkDir)}`)
    console.log(`[sdk-release] archive: ${relative(rootDir, archivePath)}`)
  }
}

if (process.exitCode == null) {
  console.log(checkOnly ? '[sdk-release] check passed' : '[sdk-release] release package ready')
}
