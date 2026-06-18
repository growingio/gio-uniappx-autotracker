import * as path from 'path'
import { fileURLToPath } from 'url'
import { Project, Node } from 'ts-morph'
import { config } from 'dotenv'
import fs from 'fs'

config()

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const uniFile = path.join(__dirname, '../types/uni/global.d.ts')
const project = new Project()
project.addSourceFileAtPath(uniFile)
project.resolveSourceFileDependencies()
const sourceFiles = project.getSourceFiles()

const defaultParameters = {}

sourceFiles.forEach(sourceFile => {
  const uni = sourceFile.getVariableDeclaration('uni')
  if (uni) {
    uni.getType().getProperties().forEach(property => {
      const name = property.getName()
      // 以下API在小程序有参数，但android不需要，所以不生成默认参数配置。
      if (["stopPullDownRefresh", "hideToast", "createInnerAudioContext"].includes(name)) {
        return
      }
      const declarationType = property.getDeclarations()[0].getType()
      const declarationText = declarationType.getText()
      console.log(declarationText)
      let moduleName = (declarationText.match(/\/lib\/(\S+?)\//) || [null, 'base'])[1]
      if (!moduleName.startsWith('uni-')) {
        moduleName = 'uni-' + moduleName
      }
      const node = declarationType.getSymbol().getDeclarations()[0]
      if (Node.isFunctionTypeNode(node) || Node.isMethodSignature(node)) {
        const parameters = node.getParameters()
        let isOptional = false
        const values = parameters.map(parameter => {
          isOptional = isOptional || parameter.isOptional()
          return parameter.isOptional() ? 'null' : null
        })
        if (isOptional) {
          const data = defaultParameters[moduleName] = defaultParameters[moduleName] || {}
          data[name] = values
        }
      }
    })
  }
})

console.log(defaultParameters)

const dir = process.env.UNI_COMPLIER_META_DIR
if (!dir) {
  throw new Error(`.env UNI_COMPLIER_META_DIR is required`)
}

fs.writeFileSync(path.join(dir, 'default-parameters.json'), JSON.stringify(defaultParameters, null, 2), 'utf-8')
