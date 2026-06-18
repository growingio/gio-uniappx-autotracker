import { glob } from 'glob'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * 此脚本用于生成native和dom2的index.d.ts和global.d.ts
 * native和dom2有部分interface需要在global作用域内进行合并
 */

// const globalFile = [
//   'UniPage.d.ts',
//   'UniViewElement.d.ts',
//   'UniTextLayout.d.ts',
//   'UniTextElement.d.ts',
//   'UniScrollViewElement.d.ts',
//   'UniImageElement.d.ts',
//   'UniElement.d.ts',
//   'UniCallbackWrapper.d.ts',
//   'DOMRect.d.ts',
//   'UniAnimation.d.ts',
//   'SnapshotOptions.d.ts',
//   'UniCSSStyleDeclaration.d.ts',
//   'CSSStyleDeclaration.d.ts'
// ]
const globalInterface = [
  'UniPage',
  'UniViewElement',
  'DrawableContext',
  'UniTextLayout',
  'UniLayoutSize',
  'UniTextElement',
  'UniScrollViewElement',
  'UniImageElement',
  'UniElement'
]

async function buildTypeEntry (dir) {

  const cwd = path.join(__dirname, '../', 'types', dir)

  const indexTypePath = path.join(__dirname, '../', 'types', dir, 'index.d.ts')
  const globalTypePath = path.join(__dirname, '../', 'types', dir, 'global.d.ts')

  const files = (await glob('**/*.d.ts', {
    absolute: false,
    cwd
  })).filter(filePath => {
    return filePath !== 'global.d.ts' && filePath !== 'index.d.ts'
  })


  const imports = []
  const declares = []
  const realGlobalFiles = []

  function addImport (item) {
    if (!imports.includes(item)) {
      imports.push(item)
    }
  }

  function addDeclare (item) {
    if (!declares.includes(item)) {
      declares.push(item)
    }
  }

  files.forEach(filePath => {
    let content = fs.readFileSync(path.join(cwd, filePath), 'utf-8')
    if (content.includes('declare global')) {
      realGlobalFiles.push(filePath)
    }
    const res1 = content.matchAll(/\bexport\s+(?:declare\s+)?(class|function|const|enum)\s+(\$?[a-zA-Z0-9_]+)\b(?:<([a-zA-Z0-9_]+)(?:\s*=\s*[a-zA-Z0-9_]+)?>)?/g)
    for (const [_, type, name, arg] of res1) {
      const nameWithOrigin = name === 'UniCSSTransform' ? 'UniCSSTransform_Origin' : `${name}Origin`
      addImport(`  ${name} as ${nameWithOrigin},`)
      addDeclare(`  const ${name}: typeof ${nameWithOrigin}`)
      if (type === 'class' || type === 'enum') {
        const argStr = `<${arg}>`
        addDeclare(`  type ${name}${arg ? argStr : ''} = ${nameWithOrigin}${arg ? argStr : ''}`)
      }
    }
    const res2 = content.matchAll(/\bexport\s+(type|interface)\s+(\$?[a-zA-Z0-9_]+)\b(?:<([a-zA-Z0-9_]+)(?:\s*=\s*[a-zA-Z0-9_]+)?>)?/g)
    for (const [_, _type, name, arg] of res2) {
      const nameWithOrigin = name === 'UniCSSTransform' ? 'UniCSSTransform_Origin' : `${name}Origin`
      addImport(`  ${name} as ${nameWithOrigin},`)
      const argStr = `<${arg}>`
      addDeclare(`  type ${name}${arg ? argStr : ''} = ${nameWithOrigin}${arg ? argStr : ''}`)
    }
  })


  const indexTypeContent = "// 本文件为自动构建生成\n" +
    realGlobalFiles.map(file => `/// <reference path="./${file}" />`).join('\n') + '\n' +
    `${files.map(filePath => `export * from './${filePath.replace(/\.d\.ts$/, '')}'`).join('\n')}` + '\n' + globalInterface.map(name => `export type ${name} = globalThis.${name}`).join('\n')
  fs.writeFileSync(indexTypePath, indexTypeContent, 'utf-8')

  const globalTypeContent = `// 本文件为自动构建生成
import {
${imports.join('\n')}
} from './index'

declare global {
${declares.join('\n')}
}
`
  fs.writeFileSync(globalTypePath, globalTypeContent, 'utf-8')
}

await buildTypeEntry('native')
await buildTypeEntry('dom2-internal')
