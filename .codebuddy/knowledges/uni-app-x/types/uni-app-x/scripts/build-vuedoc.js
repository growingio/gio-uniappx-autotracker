import { config } from 'dotenv'
import { globSync } from 'glob'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import vueEncryptionTools from "/Applications/HBuilderX-Dev-vuedoc.app/Contents/HBuilderX/plugins/hbuilderx-language-services/vueservice/out/vue/vueEncryptionTools.js"

config()

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const uvuePath = path.resolve(__dirname, '../../uvue/')
const env = process.env
const UNI_UTS_PLUGIN_COMPONENT_DIR = env.UNI_UTS_PLUGIN_COMPONENT_DIR
const DCLOUD_UTS_MODULES_PATH = env.DCLOUD_UTS_MODULES_PATH

const DEFAULT_UNIXVVER = {
  "app": {
    "harmony": {
      "unixvVer": "5.0"
    }
  }
}

const DEFAULT_UNIXVVER_NOT_SUPPORT = {
  "app": {
    "harmony": {
      "unixvVer": "x"
    }
  }
}

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

// 递归合并 json 数据
function deepMerge(a = {}, b = {}) {
  const result = { ...a };

  for (const key of Object.keys(b)) {
    const aVal = a?.[key];
    const bVal = b[key];

    // b 显式为 undefined、null、'' → 不覆盖
    if (bVal == undefined || (typeof bVal === 'string' && bVal.trim().length === 0)) continue;

    // 都是普通对象 → 递归合并
    if (isPlainObject(aVal) && isPlainObject(bVal)) {
      result[key] = deepMerge(aVal, bVal);
    } else {
      // 其他情况：数组 / 基础类型 / null
      result[key] = bVal;
    }
  }

  return result;
}

function isPlainObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isEvent(name) {
  return name.startsWith('[event]')
}

const globalAttributes = JSON.parse(fs.readFileSync(path.resolve(uvuePath, 'globalAttributes.json'), 'utf-8'))
const formGlobalAttributes = ['[event]update:modelValue', 'model-value']

export function parseProjectUniModules() {
  const vuePathsParsed = globSync([`${UNI_UTS_PLUGIN_COMPONENT_DIR}/**/components/**/**.{uvue,vue}`, `${DCLOUD_UTS_MODULES_PATH}/**/components/**/**.{uvue,vue}`])
    .map(uvueFilePath => {
      const parsed = path.parse(uvueFilePath)
      const dirParsed = path.parse(parsed.dir)
      const componentPath = path.resolve(parsed.dir, '../..')
      return {
        ...parsed,
        path: uvueFilePath,
        projectPath: path.resolve(componentPath, '../..'),
        componentPath,
        dirName: dirParsed.name
      }
    })
    .filter(parsed => parsed.name === parsed.dirName)

  vuePathsParsed.forEach(vuePathParsed => {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(vuePathParsed.componentPath, 'package.json'), 'utf-8'))
    const tagData = vueEncryptionTools.createEasycomJson(vuePathParsed.path)
    if (tagData.name == null) {
      tagData.name = packageJson.id.replace(/^uni-/, '')
    }
    const originalTagDataPath = path.resolve(uvuePath, `${tagData.name}.json`)
    if (!tagData.name) return
    if (!fs.existsSync(originalTagDataPath)) {
      if (tagData.description == null) {
        tagData.description = packageJson.description
      }
      fs.writeFileSync(originalTagDataPath, JSON.stringify(tagData, null, 2), 'utf-8')
      return
    }
    const originalTagData = JSON.parse(fs.readFileSync(path.resolve(uvuePath, `${tagData.name}.json`), 'utf-8'))
    // 合并属性
    const mergedAttributes = originalTagData.attributes || [];
    const newAttrNames = [];
    (tagData.attributes || []).forEach(newAttr => {
      if (!isEvent(newAttr.name)) {
        newAttr.name = camelToSnake(newAttr.name)
      }
      if (globalAttributes.findIndex(attr => attr.name === newAttr.name) >= 0 || formGlobalAttributes.includes(newAttr.name)) {
        return
      }
      newAttrNames.push(newAttr.name)
      const existingAttrIndex = mergedAttributes.findIndex(attr => attr.name === newAttr.name)
      const existingAttr = mergedAttributes[existingAttrIndex]
      if (existingAttrIndex >= 0) {
        if (newAttr.description) {
          existingAttr.description = newAttr.description
        }
        if (newAttr.default != null && newAttr.default !== '') {
          existingAttr.default = newAttr.default
        }
        existingAttr.uniPlatform = deepMerge(existingAttr.uniPlatform, newAttr.uniPlatform)

      } else {
        mergedAttributes.push(newAttr)
      }
    })

    originalTagData.attributes = mergedAttributes
    fs.writeFileSync(originalTagDataPath, JSON.stringify(originalTagData, null, 2), 'utf-8')
  })
}

parseProjectUniModules()
