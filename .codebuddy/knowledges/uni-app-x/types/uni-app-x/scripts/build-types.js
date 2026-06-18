import { glob } from 'glob'
import { fileURLToPath } from 'url'
import path from 'path'
import 'dotenv/config'
import fs from 'fs'
import fse from 'fs-extra'
import del from 'delete'
import minimist from 'minimist'
import crypto from 'crypto';
import { execSync } from 'child_process'
import { preprocess } from '@dcloudio/uni-preprocess'

const env = process.env
const args = minimist(process.argv.slice(2))
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const targetInfo = {
  core: 'UNI_CORE_DIR',
  'uts-plugin-api': 'UNI_UTS_PLUGIN_API_DIR',
  'uts-plugin-component': 'UNI_UTS_PLUGIN_COMPONENT_DIR',
  'uts-plugin-biz': 'UNI_UTS_PLUGIN_MODULES_DIR'
}
const incremental = args.incremental || false
const target = args.t || 'core'
const envName = targetInfo[target]
let targetDir = env[envName]

const preprocessContext = {
  UNI_APP: false,
  UNI_APP_X: true,
  APP: true,
  APP_ANDROID: true,
  APP_HARMONY: true,
  APP_IOS: false,
  H5: true,
  WEB: true,
  MP: true,
  MP_WEIXIN: true,
  VUE3: true
}

if (incremental) {
  console.log('[syntaxdoc => build-types] incremental mode（为节省编译时间添加，如果和预期不符，可自行停止该模式）');
}

if (!targetDir) {
  throw new Error(`.env ${envName} is required`)
}

const cwd = path.isAbsolute(targetDir) ? targetDir : path.join(__dirname, '../', targetDir)

const files = (
  await glob('**/utssdk/interface.{uts,ts}', {
    absolute: false,
    cwd
  })
).sort((a, b) => a.localeCompare(b))

const rootDir = path.join(
  __dirname,
  `../types/uni/${target}/lib`
)
const tempDir = path.join(rootDir, '../', '.temp')

if (!incremental) {
  del.sync(rootDir, {
    force: true
  })
} else {
  fse.ensureDirSync(tempDir)
}

const DTSTemp = {
  calculateMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  },
  /**
   * @param {string} filePath EX. uni-addPhoneContact/utssdk/interface.uts
   * @param {string} content
   * @returns {boolean}
   */
  ensureMD5(filePath, content) {
    if (!incremental) return false
    const filename = path.basename(filePath)
    const tempDTSDir = path.join(tempDir, path.dirname(filePath))
    fse.ensureDirSync(tempDTSDir)
    const tempDTSPath = path.join(tempDTSDir, filename)

    if (fs.existsSync(tempDTSPath)) {
      const oldContent = fs.readFileSync(tempDTSPath, 'utf-8')
      let res = this.calculateMD5(content)
      let res2 = this.calculateMD5(oldContent)
      if (res !== res2) {
        fs.writeFileSync(tempDTSPath, content, 'utf-8')
        return false
      }
      return true
    }
    fs.writeFileSync(tempDTSPath, content, 'utf-8')
    return false
  }
}

let refContent = ''
let refContentIndex = ''

function setRefContent(filePath) {
  const libPath = path.dirname(filePath).replace(/\\/g, '/')
  refContent += `/// <reference path='./lib/${libPath}/global.d.ts' />\n`
  refContentIndex += `export * from './lib/${libPath}'\n`
}

// UNI_UTS_PLUGIN_COMPONENT_DIR、UNI_UTS_PLUGIN_MODULES_DIR 下 **/components/**/global.uts 生成 d.ts
function componentGlobalUTS2DTS() {
  const TEMP_DIR = path.join(__dirname, '../types/uni/uts-plugin-component/.temp')
  const TAGRET = '**/components/**/global.uts'
  const globalUTSFiles = glob.sync(path.join(env.UNI_UTS_PLUGIN_COMPONENT_DIR, TAGRET))
    .concat(glob.sync(path.join(env.UNI_UTS_PLUGIN_MODULES_DIR, TAGRET)))
  if (!globalUTSFiles.length) {
    return
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }
  globalUTSFiles.forEach(filePath => {
    const componentDir = path.resolve(filePath, '../../../')
    const componentDirName = componentDir.split(/\//g).pop()

    if (!componentDirName) return

    const packageJsonPath = JSON.parse(fs.readFileSync(path.join(componentDir, 'package.json'), 'utf-8'))
    const android = packageJsonPath['uni_modules']?.['components']?.['app-android']
    const ios = packageJsonPath['uni_modules']?.['components']?.['app-ios']
    const harmony = packageJsonPath['uni_modules']?.['components']?.['app-harmony']
    if (android === false && ios === false && harmony === false) {
      // 全部平台禁用则跳过
      return
    }

    let content = fs.readFileSync(filePath, 'utf-8')

    // 需要排除 APP_ANDROID 平台，安卓平台会重写 toJSON 方法
    preprocessContext.APP_ANDROID = false
    // 添加条件编译
    content = preprocess(content, {
      type: 'js',
      context: preprocessContext
    }).code

    const dtsName = `${componentDirName}.ts`
    const dtsPath = path.join(TEMP_DIR, dtsName)
    const interfaceDir = path.join(rootDir, `${componentDirName}-global/utssdk`)
    const interfaceFilePath = path.join(interfaceDir, 'interface.d.ts')
    fs.writeFileSync(dtsPath, content, 'utf-8')

    execSync(`tsc ${dtsName} -d --emitDeclarationOnly -m esnext --noCheck`, { cwd: TEMP_DIR, shell: true, encoding: 'utf-8' })
    if (!fs.existsSync(interfaceDir)) {
      fs.mkdirSync(interfaceDir, { recursive: true })
    }
    fs.writeFileSync(interfaceFilePath, fs.readFileSync(path.join(TEMP_DIR, `${componentDirName}.d.ts`), 'utf8').replace(/\bexport\s+declare\s+/g, 'export '), 'utf8')
    // fs.renameSync(path.join(TEMP_DIR, `${componentDir}.d.ts`), interfaceFilePath)

    setRefContent(path.relative(rootDir, interfaceFilePath))
    generateGlobal(interfaceDir, content)
  })
}
if (target === 'uts-plugin-component') {
  componentGlobalUTS2DTS()
}
preprocessContext.APP_ANDROID = true

function generateGlobal(dir, content) {
  let hasExportUni = false
  if (/\bexport interface Uni\b/.test(content)) { hasExportUni = true }
  const imports = []
  const exports = []
  const types = []
  const res = content.matchAll(/\bexport\s+(?:type|interface|class)\s+(\$?[a-zA-Z0-9_]+)\b(?:<([a-zA-Z0-9_]+)(?:\s*=\s*[a-zA-Z0-9_]+)?>)?/g)
  for (const [_, type, arg] of res) {
    if (type === 'Uni') {
      continue
    }
    const argStr = `<${arg}>`
    exports.push(`  ${type},`)
    imports.push(`  ${type} as ${type}Origin,`)
    types.push(`  type ${type}${arg ? argStr : ''} = ${type}Origin${arg ? argStr : ''}`)
  }
  const globalTypeContent = `// 本文件为自动构建生成
  import {
  ${imports.join('\n')}${hasExportUni ? '\n  Uni as UniOrigin' : ''}
  } from './interface'

  declare global {
  ${types.join('\n')}${hasExportUni ? '\n  interface Uni extends UniOrigin { }' : ''}
  }
  `
  const exportTypeContent = `// 本文件为自动构建生成
  export {
  ${exports.join('\n')}
  } from './interface'
  `
  fs.writeFileSync(path.join(dir, 'global.d.ts'), globalTypeContent, 'utf-8')
  fs.writeFileSync(path.join(dir, 'index.d.ts'), exportTypeContent, 'utf-8')
}

files.forEach(file => {
  let content = fs.readFileSync(path.join(cwd, file), 'utf-8')
  // 添加条件编译
  content = preprocess(content, {
    type: 'js',
    context: preprocessContext
  }).code
  const dir = path.join(rootDir, path.dirname(file))
  const filename = path.basename(file)
  fse.ensureDirSync(dir)
  setRefContent(file)

  if (DTSTemp.ensureMD5(file, content) === true) { return }

  fs.writeFileSync(path.join(dir, filename.replace(/\.u?ts$/, '.d.ts')), content, 'utf-8')
  generateGlobal(dir, content)
})

fs.writeFileSync(path.join(rootDir, '../global.d.ts'), refContent, 'utf-8')
fs.writeFileSync(path.join(rootDir, '../index.d.ts'), refContentIndex, 'utf-8')
