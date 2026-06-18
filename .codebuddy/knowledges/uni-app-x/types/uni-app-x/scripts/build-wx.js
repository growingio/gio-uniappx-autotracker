// @ts-check
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import jsoncParser from "jsonc-parser"
import {
  Project,
  ModuleDeclaration,
  InterfaceDeclaration,
  Type,
  MethodSignature,
  FunctionTypeNode,
  PropertySignature,
  JSDocableNode,
  Node,
  JSDoc,
  TypeAliasDeclaration,
  SourceFile,
  TypeNode,
  TypeLiteralNode,
  StructureKind,
  ParameterDeclaration,
  ScriptKind,
  UnionTypeNode,
} from "ts-morph"
import { globSync } from "glob"
import { createUniPlatformMPOnlyWeixin, createUniPlatformMPWeixin, NOT_SUPPORT_VER, SUPPORT_VER, PERCH_VER } from "../../scripts/wx/utils.js"
import { execSync } from "child_process"

let WX_UNIAPP_X_SUPPORT = "4.41" // "-" 将默认 unixVer 改为支持
let WX_UNIAPP_SUPPORT = SUPPORT_VER
const uniNamespaceName = "UniNamespace"
const uniInterfaceName = "Uni"
const wxNamespaceName = "WechatMiniprogram"
const wxNamespaceReg = new RegExp(`\\b${wxNamespaceName}\\.(\\w+)\\b`, "g")
const __dirname = fileURLToPath(new URL(".", import.meta.url))
const { wxInterface, wxNamespace } = getWX()

const UniJsDocUniPlatformTagName = "uniPlatform"
const UniJsDocWXHyperlinkTagName = "tutorial_weixin"
const UniJsDocParamUniPlatformTagName = "param_uniPlatform"
const WXBaseRepoVersionTagName = "hostVer"

const CallbackFunctionNames = ["success", "fail", "complete"]
const DeclarationTypeNames = ["interface", "property", "typeAlias", "function", "docs", "union"]

// #region declaration
/**
 * @typedef {{
        declarationType: 'function',
        declaration: FunctionTypeNode | MethodSignature,
        docs: ReturnType<typeof getDocs>,
        name: string,
        parameters: DeclarationParameter[],
        return: ReturnType<typeof getType>,
 * }} DeclarationFunction
 */

/**
 * @typedef {{
        declarationType: 'parameter',
        declaration: ParameterDeclaration,
        name: string,
        type: ReturnType<typeof getType>,
        hasQuestionToken: boolean,
        parent: DeclarationFunction
 * }} DeclarationParameter
 */

/**
 * @typedef {{
        declarationType: 'typeAlias',
        declaration: TypeNode,
        name: string,
        type:  ReturnType<typeof getType>,
        docs: ReturnType<typeof getDocs>,
 * }} DeclarationType
 */

/**
 * @typedef {{
        declarationType: 'property',
        declaration: PropertySignature,
        name: string,
        type: ReturnType<typeof getType>,
        hasQuestionToken: boolean,
        docs: ReturnType<typeof getDocs>,
        parent: DeclarationInterface
 * }} DeclarationProperty
 */

/**
 * @typedef {{
        declarationType: 'interface',
        declaration: InterfaceDeclaration | TypeLiteralNode,
        name: string,
        properties:  DeclarationProperty[],
        methods: ReturnType<typeof getMethods>,
        docs: ReturnType<typeof getDocs>,
 * }} DeclarationInterface
 */

/**
 * @typedef {{
        declarationType: 'union',
        declaration: Type,
        typeNode?: UnionTypeNode,
        types: Array<ReturnType<typeof getType>>,
        typeText: string
 * }} DeclarationUnion
 */

/**
 * @typedef {{
        declarationType: 'string',
        declaration: Type,
        typeText: string
 * }} DeclarationString
 */

/**
 * @typedef {{
    declarationType: 'docs';
    declaration: JSDoc[];
    comment: string;
 * }} DeclarationDocs
 */

/**
 * 处理 declaration
 * @param {string} typeText
 * @param {string} typeName
 * @param {ModuleDeclaration | SourceFile} namespace
 * @param {InterfaceDeclaration | TypeAliasDeclaration | TypeLiteralNode} declaration
 * @returns {DeclarationFunction | DeclarationType | DeclarationInterface | DeclarationUnion | string}
 */
function getDeclaration(typeText, typeName, namespace, declaration) {
  if (Node.isTypeAliasDeclaration(declaration)) {
    const typeNode = declaration.getTypeNode()
    if (!typeNode) return typeText
    if (Node.isFunctionTypeNode(typeNode)) {
      return createTypeNodeDeclarationFunction(typeName, typeNode, namespace, declaration)
    }
    if (Node.isTypeLiteral(typeNode)) {
      return getDeclaration(typeText, typeName, namespace, typeNode)
    }
    if (Node.isUnionTypeNode(typeNode)) {
      const type = typeNode.getType()
      return {
        declarationType: "union",
        declaration: type,
        types: type.getUnionTypes().map((t) => getType(t, namespace)),
        typeText,
      }
    }
    return {
      declarationType: "typeAlias",
      declaration: typeNode,
      name: typeName,
      type: getType(typeNode.getType(), namespace, typeNode), // OpenLocationOptions 死循环
      docs: getDocs(declaration),
    }
  }
  if (Node.isInterfaceDeclaration(declaration) || Node.isTypeLiteral(declaration)) {
    const properties = declaration.getProperties()
    /** @type {DeclarationInterface} */
    const returnDeclaration = {
      declarationType: "interface",
      declaration,
      name: typeName,
      get properties() {
        return properties.map(
          /**
           * @param {PropertySignature} prop
           * @returns {DeclarationProperty}
           */
          (prop) => {
            return {
              declarationType: "property",
              declaration: prop,
              name: prop.getName(),
              get type() {
                return getType(prop.getType(), namespace, prop.getTypeNode())
              },
              hasQuestionToken: prop.hasQuestionToken(),
              docs: getDocs(prop),
              parent: returnDeclaration,
            }
          }
        )
      },
      methods: getMethods(declaration, namespace),
      docs: Node.isJSDocable(declaration) ? getDocs(declaration) : null,
    }
    return returnDeclaration
  }
  return typeText
}
/**
 * @param {string} typeName
 * @param {FunctionTypeNode} typeNode
 * @param {ModuleDeclaration | SourceFile} namespace
 * @param {InterfaceDeclaration | TypeAliasDeclaration | JSDocableNode} [declaration]
 * @returns {DeclarationFunction}
 */
function createTypeNodeDeclarationFunction(typeName, typeNode, namespace, declaration) {
  /** @type {DeclarationFunction} */
  const returnDeclaration = {
    declarationType: "function",
    docs: null,
    declaration: typeNode,
    name: typeName,
    get parameters() {
      return typeNode.getParameters().map(
        /**
         * @param {ParameterDeclaration} parameter
         * @returns {DeclarationParameter}
         */
        (parameter) => {
          return {
            declarationType: "parameter",
            declaration: parameter,
            name: parameter.getName(),
            get type() {
              return getType(parameter.getType(), namespace, parameter.getTypeNode())
            },
            hasQuestionToken: parameter.hasQuestionToken(),
            parent: returnDeclaration,
          }
        }
      )
    },
    get return() {
      return getType(typeNode.getReturnType(), namespace, typeNode.getReturnTypeNode())
    },
  }
  if (declaration) {
    returnDeclaration.docs = getDocs(declaration)
  }
  return returnDeclaration
}
/**
 * @param {Type} declaration
 * @param {string} typeText
 * @returns {DeclarationString}
 */
function createDeclarationString(declaration, typeText) {
  return {
    declarationType: "string",
    declaration,
    typeText: wxNamespaceReg.test(typeText) ? "any" : typeText,
  }
}
// #endregion declaration

// #region type

/**
 * 递归处理类型
 * @param {Type} type
 * @param {ModuleDeclaration | SourceFile} namespace
 * @param {TypeNode} [typeNode]
 * @returns { DeclarationFunction | DeclarationType | DeclarationInterface | DeclarationUnion | DeclarationString}
 */
function getType(type, namespace, typeNode) {
  const typeText = type.getText()
  const promisifyReg = /PromisifySuccessResult(<.+?>)?/g
  if (promisifyReg.test(typeText)) {
    return createDeclarationString(type, "void")
  }
  if (typeText === "T") {
    const constraint = type.getConstraint()
    if (constraint) {
      return getType(constraint, namespace)
    }
    console.error("type is null")
    return createDeclarationString(type, "any")
  }
  let typeName = ""
  if (Node.isSourceFile(namespace)) {
    typeName = typeText.replace(new RegExp(`import\\("${namespace.getFilePath().replace(/\.d\.ts$/, "")}"\\)\\.`), "")
  }
  if (wxNamespaceReg.test(typeText)) {
    typeName = typeText.replace(wxNamespaceReg, "$1")
  }
  const findInterface = namespace.getInterface(typeName)
  if (findInterface) {
    const res = getDeclaration(typeText, typeName, namespace, findInterface)
    if (isString(res)) return createDeclarationString(type, res)
    return res
  }
  const typeAlias = namespace.getTypeAlias(typeName) ?? wxNamespace.getTypeAlias(typeName)
  if (typeAlias) {
    const res = getDeclaration(typeText, typeName, namespace, typeAlias)
    if (isString(res)) return createDeclarationString(type, res)
    return res
  }
  if (type.isUnion()) {
    /** @type {DeclarationUnion} */
    return {
      declarationType: "union",
      declaration: type,
      typeNode: Node.isUnionTypeNode(typeNode) ? typeNode : undefined,
      types: type.getUnionTypes().map((t) => getType(t, namespace)),
      typeText,
    }
  }
  const symbol = type.getSymbol()
  if (symbol) {
    const typeNode = symbol.getDeclarations()[0]
    if (Node.isFunctionTypeNode(typeNode)) {
      return createTypeNodeDeclarationFunction(typeName, typeNode, namespace)
    }
  }

  return createDeclarationString(type, typeText)
}
/**
 * 获取方法
 * @param {InterfaceDeclaration | TypeLiteralNode} interfaceDeclaration
 * @param {ModuleDeclaration | SourceFile} namespace
 * @param {(value: MethodSignature, index: number, array: MethodSignature[]) => unknown} [filter]
 * @returns {DeclarationFunction[]}
 */
function getMethods(interfaceDeclaration, namespace, filter) {
  const methods = interfaceDeclaration.getMethods()
  /**@type {DeclarationFunction[]} */
  const interfaceMethods = []
  methods.filter(filter || ((method) => method)).forEach((method) => {
    const name = method.getName()
    interfaceMethods.push({
      declarationType: "function",
      declaration: method,
      name,
      // @ts-expect-error
      get parameters() {
        return method.getParameters().map((parameter) => {
          return {
            declarationType: "parameter",
            declaration: parameter,
            name: parameter.getName(),
            type: getType(parameter.getType(), namespace, parameter.getTypeNode()),
            hasQuestionToken: parameter.hasQuestionToken(),
          }
        })
      },
      get return() {
        return getType(method.getReturnType(), namespace, method.getReturnTypeNode())
      },
      docs: getDocs(method),
    })
  })
  return interfaceMethods
}
/**
 * 解析联合类型。uni-app-x 只支持 string、 number、boolean 联合
 * @param {DeclarationUnion} type
 * @param {ReturnType<getType> | DeclarationProperty} [parent]
 */
function resolveUnionType(type, parent) {
  const declaration = type.declaration
  const unionLiteralTypeTexts = declaration.getUnionTypes().map((u) => u.getBaseTypeOfLiteralType().getText())
  let unionTypeText = unionLiteralTypeTexts[0]
  if (unionLiteralTypeTexts.find((i) => i !== unionTypeText)) {
    unionTypeText = "any"

    if (parent && "docs" in parent && parent.docs) {
      docsAddNewTag(parent.docs, "type", unionTypeText)
    }
  }
  if (["string", "number", "boolean"].includes(unionTypeText)) {
    /**
     * "a" | "b" | "c" => string
     * 1 | 2 | 3 => number
     * true | false => boolean
     */
    return type.typeText
  }
  return unionTypeText
}
// #endregion type

// #region jsDoc
/**
 *
 * @param {JSDocableNode} object
 * @returns {DeclarationDocs| null}
 */
function getDocs(object) {
  const docs = object.getJsDocs()
  if (docs.length) {
    const firstDoc = docs[0]
    let doc = firstDoc.getComment()
    if (!isString(doc)) return null
    // 替换微信示例代码为 uni
    doc = doc.replace(/\[wx\./g, "[uni.").replace(/`wx`/, "uni")
    const docArray = doc.split("\n")
    // 文档链接统一移动到末尾
    const reg = /\[.+?\]\((https{0,1}:\/\/developers\.weixin\.qq\.com\S+?)\)/
    if (reg.test(docArray[0])) {
      const url = (docArray[0].match(reg) || [])[1]
      if (url) {
        docArray.shift()
        docArray.push("", `@${UniJsDocWXHyperlinkTagName} ${url}`)
      }
    }
    // 删除示例代码
    const start = docArray.indexOf("**示例代码**")
    let end = docArray.lastIndexOf("```")
    if (end === -1) {
      // 微信有一处错误使用
      end = docArray.lastIndexOf("``")
    }
    if (start >= 0 && end >= 0) {
      docArray.splice(start, end - start + 1)
    }
    const uniPlatformTag = firstDoc.getTags().find((t) => t.getTagName() === UniJsDocUniPlatformTagName)
    if (!uniPlatformTag) {
      const tag = jsDocAddNewUniPlatform(getWxHostVerFromDocs(doc))

      firstDoc.addTag(tag)
      docArray.push("", `@${UniJsDocUniPlatformTagName} ${tag.text}`)
    } else {
      const commentText = uniPlatformTag.getCommentText()
      commentText && docArray.push("", `@${UniJsDocUniPlatformTagName} ${JSON.stringify(jsoncParser.parse(commentText), null, 2)}`)
    }
    // 强制使用多行文档
    return {
      declarationType: "docs",
      get declaration() {
        return object.getJsDocs()
      },
      comment: docArray.join("\n"),
    }
  }
  return null
}
/**
 * 添加新的 uniPlatform
 * @param {string} [hostVer]
 * @param {string} [unixVer]
 * @param {string} [uniVer]
 * @returns {import("ts-morph").JSDocTagStructure & { text: string }}
 */
function jsDocAddNewUniPlatform(hostVer, unixVer, uniVer) {
  const text = JSON.stringify({ mp: createUniPlatformMPOnlyWeixin(hostVer, uniVer ?? WX_UNIAPP_SUPPORT, unixVer ?? WX_UNIAPP_X_SUPPORT) }, null, 2)
  return {
    kind: StructureKind.JSDocTag,
    tagName: UniJsDocUniPlatformTagName,
    text,
  }
}
/**
 * 重写文档
 * @param {DeclarationDocs} declarationDocs
 * @param {string} text
 */
function docsAddNewTag(declarationDocs, tagName, text) {
  declarationDocs[0]?.addTag({
    tagName,
    text,
  })
  declarationDocs.comment = `${declarationDocs.comment}\n\n@${tagName} ${text}`
}
/**
 * 添加注释的 * 号
 * @param {DeclarationDocs['comment']} [comment]
 */
function commentInsertAsterisk(comment) {
  if (!comment) return
  return ["\n/**", ...comment.split("\n").map((line) => `* ${line}`), "*/"].join("\n")
}
/**
 * 解析 hostVer
 * @param {string} [docs] 微信的注释
 * @returns {string}
 */
function getWxHostVerFromDocs(docs) {
  if (!docs) return SUPPORT_VER
  const hostVer = (docs.match(/基础库[：:]?\s*`(\S+)`/) || [])[1]
  return hostVer ? hostVer : SUPPORT_VER
}
// #endregion jsDoc

// #region utils
// 字符串首字母大写
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
// 判断是 string 类型
function isString(value) {
  return typeof value === "string"
}
// #endregion utils

// #region Class Patch
class Patch {
  /** @type {string[]} */
  resolveTypeNames = []
  /** @type {SourceFile} */
  sourcefile
  /** @type {ModuleDeclaration | SourceFile} */
  namespace
  /** @type {InterfaceDeclaration} */
  appendInterface
  /** @type {string | undefined} */
  namespaceName

  /**
   * @param {string} filePath
   * @param {string} interfaceName
   * @param {SourceFile | string} [namespace] SourceFile 或 namespace 名称
   */
  constructor(filePath, interfaceName, namespace) {
    this.appendInterface = this.createPatchInterface(filePath, interfaceName)
    if (typeof namespace !== "undefined") {
      if (isString(namespace)) {
        this.namespaceName = namespace
        const module = this.sourcefile.getModule(namespace)
        if (module) {
          this.namespace = module
        } else {
          this.namespace = this.sourcefile.addModule({
            name: namespace,
            isExported: true,
          })
        }
      } else {
        this.namespace = namespace
      }
    } else {
      this.namespace = this.sourcefile
    }
  }

  /**
   * @param {string} filePath
   * @param {string} interfaceName
   */
  createPatchInterface(filePath, interfaceName) {
    const patchDTSPath = filePath //path.join(__dirname, "../types/uni/uts-plugin-extend/lib/uni-patches/wx.d.ts")
    const patchProject = new Project()
    if (fs.existsSync(patchDTSPath)) {
      this.sourcefile = patchProject.addSourceFileAtPath(patchDTSPath)
    } else {
      this.sourcefile = patchProject.createSourceFile(filePath, "", {
        overwrite: true,
        scriptKind: ScriptKind.TS,
      })
    }
    let patchUniInterface = this.sourcefile.getInterface(interfaceName)
    if (!patchUniInterface) {
      patchUniInterface = this.sourcefile.addInterface({
        name: interfaceName,
        isExported: true,
      })
    }
    return patchUniInterface
  }

  /**
   * @param {MethodSignature[]} methods
   * @param {Parameters<typeof this.createPatchMethods>[1]} filter
   */
  async begin(methods, filter) {
    this.appendInterface.addMethods(this.createPatchMethods(methods, filter))

    this.sourcefile.fixUnusedIdentifiers()
    this.removeUnUsedDeclaration()
    this.sourcefile.formatText()
    await this.sourcefile.save()
    await this.sourcefile.emit()
  }

  /**
   * @param {MethodSignature[]} methods
   * @param {(value: MethodSignature, index: number, array: MethodSignature[]) => unknown} [filter]
   * @returns
   */
  createPatchMethods(methods, filter) {
    /** @type {import("ts-morph").OptionalKind<import("ts-morph").MethodSignatureStructure>[]} */
    const interfaces = []
    methods.filter(filter || ((method) => method)).forEach((method) => {
      const doc = getDocs(method)?.comment
      const name = method.getName()
      console.log("insert method name :>> ", name)

      interfaces.push(
        Object.assign(
          {
            name,
            parameters: method.getParameters().map((parameter) => {
              return {
                name: parameter.getName(),
                type: this.checkType(parameter.getType()),
                hasQuestionToken: parameter.hasQuestionToken(),
              }
            }),
            returnType: this.checkType(method.getReturnType()),
          },
          doc ? { docs: [doc] } : {}
        )
      )
    })
    return interfaces
  }

  /**
   * 递归追加类型
   * @param {Type} type
   * @returns {string}
   */
  checkType(type) {
    if (!type) return "any"
    const typeName = type.getText()
    const promisifyReg = /PromisifySuccessResult(<.+?>)?/g
    if (promisifyReg.test(typeName)) {
      return "void"
    }
    if (typeName === "T") {
      const constraint = type.getConstraint()
      if (constraint) {
        return this.checkType(constraint)
      }
      console.error("checkType type is null")
      return "any"
    }
    let notFound
    if (wxNamespaceReg.test(typeName)) {
      const typeNames = typeName.match(wxNamespaceReg)
      if (typeNames == null) {
        notFound = true
      } else {
        typeNames.forEach((typeName) => {
          typeName = typeName.replace(wxNamespaceReg, "$1")
          // fix: 递归无限循环
          if (this.resolveTypeNames.includes(typeName)) return typeName
          const wxInterface = wxNamespace.getInterface(typeName)
          if (wxInterface) {
            this.resolveTypeNames.push(typeName)
            const properties = wxInterface.getProperties()
            const doc = getDocs(wxInterface)?.comment
            this.namespace.addInterface({
              name: typeName,
              properties: properties.map((prop) => {
                const doc = getDocs(prop)?.comment
                return {
                  name: prop.getName(),
                  type: this.checkType(prop.getType()),
                  hasQuestionToken: prop.hasQuestionToken(),
                  docs: doc ? [doc] : undefined,
                }
              }),
              methods: this.createPatchMethods(wxInterface.getMethods()),
              docs: doc ? [doc] : undefined,
            })
            return
          }
          const typeAlias = wxNamespace.getTypeAlias(typeName)
          if (this.namespace.getInterface(typeName)) return typeName
          if (typeAlias) {
            this.resolveTypeNames.push(typeName)
            const typeNode = typeAlias.getTypeNode()
            if (typeNode) {
              if (Node.isFunctionTypeNode(typeNode)) {
                typeNode.getParameters().forEach((parameter) => this.checkType(parameter.getType()))
                this.checkType(typeNode.getReturnType())
              }
              const doc = getDocs(typeAlias)?.comment
              this.namespace.addTypeAlias({
                name: typeName,
                type: typeNode.getText(),
                docs: doc ? [doc] : undefined,
              })
              return
            }
          }
          // console.error(type.getText(), typeName)
          notFound = true
        })
      }
    } else if (typeName !== "any" && type.isAny()) {
      // console.error(type.getText(), "any")
      notFound = true
    }
    return notFound ? "any" : typeName.replace(wxNamespaceReg, this.namespaceName ? `${this.namespaceName}.$1` : "$1")
  }

  removeUnUsedDeclaration() {
    const interfaces = this.namespace.getInterfaces()
    const typeAliases = this.namespace.getTypeAliases()
    const removeTypeNames = []

    interfaces.forEach((interfaceDeclaration) => {
      if (interfaceDeclaration.hasExportKeyword()) return
      const references = interfaceDeclaration.findReferences()[0].getReferences()
      if (references.length === 1) {
        interfaceDeclaration.remove()
      }
    })
    typeAliases.forEach((typeAlias) => {
      const references = typeAlias.findReferences()[0].getReferences()
      if (references.length === 1) {
        typeAlias.remove()
      }
    })

    return removeTypeNames
  }
}
// #endregion Class Patch

// #region Class Merge
class Merge {
  /** @type {SourceFile} */
  sourceFile
  /** @type {MethodSignature} */
  wxMethod
  /** @type {ReturnType<typeof resolveUniMembers>[number]} */
  uniMember
  actions = []

  /**
   *
   * @param {SourceFile} sourceFile
   * @param {MethodSignature} wxMethod
   * @param {ReturnType<typeof resolveUniMembers>[number]} uniMember
   */
  constructor(sourceFile, wxMethod, uniMember) {
    this.sourceFile = sourceFile
    this.wxMethod = wxMethod
    this.uniMember = uniMember
  }

  begin() {
    if (this.sourceFile) {
      try {
        this.resolveJsDocs(this.wxMethod.getJsDocs(), this.uniMember.getJsDocs())
        this.resolveMethodParameters(this.wxMethod, this.uniMember.getNode())
        this.resolveMethodReturn(this.wxMethod, this.uniMember.getNode())

        if (this.actions.length) {
          this.sourceFile.addTypeAliases(this.actions.map((action) => action.structure)).forEach((typeAlias) => {
            typeAlias.formatText()
          })
        }
      } catch (error) {
        console.error("interfaceDTSPath :>> ", this.sourceFile.getFilePath(), error)
      }
    }
  }

  /**
   * 处理方法参数
   * @param {MethodSignature | FunctionTypeNode} [uniMethod]
   * @param {MethodSignature} wxMethod
   */
  resolveMethodParameters(wxMethod, uniMethod) {
    if (!uniMethod) return
    const methodName = wxMethod.getName()
    const uniMethodParameters = uniMethod.getParameters()
    // const uniMethodParametersLength = uniMethodParameters.length
    const wxMethodParameters = wxMethod.getParameters()
    for (let index = 0; index < wxMethodParameters.length; index++) {
      // if (index >= uniMethodParametersLength) break
      const originUniParameter = uniMethodParameters[index]
      const originWxParameter = wxMethodParameters[index]
      const wxParameter = getType(originWxParameter.getType(), wxNamespace, originWxParameter.getTypeNode())
      if (originUniParameter) {
        const uniParameter = getType(originUniParameter.getType(), this.sourceFile, originWxParameter.getTypeNode())
        if (uniParameter.declarationType === wxParameter.declarationType) {
          this.mergeDeclaration(uniParameter, wxParameter, methodName, (typeText) => {
            originUniParameter.setType(typeText)
          })
        } else {
          // TODO uni 的参数是 any，则使用 wx 的参数类型（不修改 any 参数）
          /* if (uniParameter.declarationType === "string" && uniParameter.typeText === "any") {
            const typeText = this.uniSourceFileAddTypeAlias(methodName, originUniParameter.getName(), wxParameter)
            typeText && originUniParameter.setType(typeText)
          } else {
            console.error("declarationType not equal =>", uniParameter.declarationType !== wxParameter.declarationType)
            continue
          } */
        }
      } else {
        // TODO 移除新增 wx 方法参数
        /* const wxParameterName = originWxParameter.getName()
        if (Node.isMethodSignature(uniMethod)) {
          const wxJsDoc = wxMethod.getJsDocs()[0]
          const jsDoc = uniMethod.getJsDocs()[0]
          jsDoc.addTag({
            tagName: `${UniJsDocParamUniPlatformTagName} ${wxParameterName}`,
            text: JSON.stringify(
              { mp: createUniPlatformMPOnlyWeixin(getWxHostVerFromDocs(wxJsDoc.getText()), WX_UNIAPP_SUPPORT, WX_UNIAPP_X_SUPPORT) },
              null,
              2
            ),
          })
        }
        const paramType = this.uniSourceFileAddTypeAlias(methodName, wxParameterName, wxParameter)
        uniMethod.addParameter({
          kind: StructureKind.Parameter,
          name: wxParameterName,
          hasQuestionToken: true,
          type: paramType ? paramType : "any",
        }) */
      }
    }
  }
  /**
   * 处理方法返回值
   * @param {MethodSignature | FunctionTypeNode} [uniMethod]
   * @param {MethodSignature} wxMethod
   */
  resolveMethodReturn(wxMethod, uniMethod) {
    if (!uniMethod) return
    const methodName = wxMethod.getName()
    const uniReturn = getType(uniMethod.getReturnType(), this.sourceFile, uniMethod.getReturnTypeNode())
    const wxReturn = getType(wxMethod.getReturnType(), wxNamespace, wxMethod.getReturnTypeNode())
    if (uniReturn.declarationType === wxReturn.declarationType) {
      this.mergeDeclaration(uniReturn, wxReturn, methodName, (typeText) => {
        uniMethod.setReturnType(typeText)
      })
    }
  }
  /**
   * 解析微信基础库信息、文档链接添加到 uni 中
   * @param {JSDoc[]} wxMethodJsDocs
   * @param {JSDoc[]} uniMethodJsDocs
   */
  resolveJsDocs(wxMethodJsDocs, uniMethodJsDocs) {
    if (uniMethodJsDocs.length && wxMethodJsDocs.length) {
      // TODO 默认只解析第一项
      const uniJsDoc = uniMethodJsDocs[0]
      const uniJsDocTags = uniJsDoc.getTags()

      const wxJsDoc = wxMethodJsDocs[0]
      const wxComment = wxJsDoc.getCommentText()

      if (!wxComment) return

      /**@type {Array<{tagName: string, text: string}>} */
      const newJsDocTags = []
      const commentLine = wxComment.split("\n").filter(Boolean)
      commentLine.forEach((line, index) => {
        if (newJsDocTags.length >= 2) return
        // TODO 默认微信文档链接在第一行
        if (index === 0) {
          if (uniJsDocTags.every((tag) => tag.getTagName() !== UniJsDocWXHyperlinkTagName)) {
            let hyperlink = (line.match(/\]\((https:\/\/developers.weixin.qq.com\S+\.html)\)/) || [])[1]
            if (hyperlink) {
              newJsDocTags.push({
                tagName: UniJsDocWXHyperlinkTagName,
                text: hyperlink,
              })
            }
          }
        } else if (!newJsDocTags.some((tag) => tag.tagName === WXBaseRepoVersionTagName)) {
          newJsDocTags.push({
            tagName: WXBaseRepoVersionTagName,
            text: getWxHostVerFromDocs(line),
          })
        }
      })
      if (newJsDocTags.length) {
        for (let index = 0; index < newJsDocTags.length; index++) {
          const tag = newJsDocTags[index]

          const { tagName, text } = tag
          // weixin hostVer
          if (tagName === WXBaseRepoVersionTagName) {
            const uniPlatformTag = uniJsDocTags.find((tag) => tag.getTagName() === UniJsDocUniPlatformTagName)
            if (uniPlatformTag) {
              const uniPlatformTagCommentText = uniPlatformTag.getCommentText()
              if (uniPlatformTagCommentText) {
                const uniPlatform = jsoncParser.parse(uniPlatformTagCommentText)
                if (!uniPlatform.mp) {
                  uniPlatform.mp = createUniPlatformMPOnlyWeixin(text, WX_UNIAPP_SUPPORT, WX_UNIAPP_X_SUPPORT)
                } else {
                  if (!uniPlatform.mp.weixin) {
                    uniPlatform.mp.weixin = createUniPlatformMPWeixin(text, WX_UNIAPP_SUPPORT, WX_UNIAPP_X_SUPPORT)
                  } else if ([SUPPORT_VER, NOT_SUPPORT_VER].includes(uniPlatform.mp.weixin.hostVer)) {
                    uniPlatform.mp.weixin.hostVer = text
                  }
                }
                // mp-weixin hostVer uniVer unixVer
                if (uniPlatform.mp && uniPlatform.mp.weixin) {
                  if (!isString(uniPlatform.mp.weixin.hostVer)) {
                    uniPlatform.mp.weixin.hostVer = text
                  }
                  if (!isString(uniPlatform.mp.weixin.uniVer)) {
                    uniPlatform.mp.weixin.uniVer = WX_UNIAPP_SUPPORT
                  }
                  if (!isString(uniPlatform.mp.weixin.unixVer)) {
                    uniPlatform.mp.weixin.unixVer = WX_UNIAPP_X_SUPPORT
                  }
                }
                /* const res = jsoncParser.applyEdits(
                  uniPlatformTagCommentText,
                  jsoncParser.modify(uniPlatformTagCommentText, ["mp", "weixin", WXBaseRepoVersionTagName], text, {
                    formattingOptions: {
                      insertSpaces: true,
                      tabSize: 2,
                    },
                  })
                ) */
                uniPlatformTag.set({
                  tagName: UniJsDocUniPlatformTagName,
                  text: JSON.stringify(uniPlatform, null, 2),
                })
              } else {
                uniJsDoc.addTag(jsDocAddNewUniPlatform(getWxHostVerFromDocs(wxComment)))
              }
            } else {
              uniJsDoc.addTag(jsDocAddNewUniPlatform(getWxHostVerFromDocs(wxComment)))
            }
            continue
          }
          uniJsDoc.addTag(tag)
        }
      }
    }
  }

  /**
   *  合并声明
   * @param {ReturnType<getType>} uniDeclaration
   * @param {ReturnType<getType>} wxDeclaration
   * @param {string} methodName
   * @param {(typeText: string) => void} setTypeText
   */
  mergeDeclaration(uniDeclaration, wxDeclaration, methodName, setTypeText) {
    if (uniDeclaration.declarationType === "interface" && wxDeclaration.declarationType === "interface") {
      this.mergeDeclarationInterface(uniDeclaration, wxDeclaration, methodName)
    }
    if (uniDeclaration.declarationType === "function" && wxDeclaration.declarationType === "function") {
      this.mergeDeclarationFunction(uniDeclaration, wxDeclaration, methodName)
    }
    if (uniDeclaration.declarationType === "union" && wxDeclaration.declarationType === "union") {
      if (uniDeclaration.typeText !== wxDeclaration.typeText) {
        const res = this.mergeDeclarationUnion(uniDeclaration, wxDeclaration, methodName)
        res && setTypeText(res)
      }
    }
    if (uniDeclaration.declarationType === "typeAlias" && wxDeclaration.declarationType === "typeAlias") {
      // NOTE 忽略 DeclarationTypeAlias
      console.error(`DeclarationTypeAlias not equal => uniDeclaration: ${uniDeclaration.name}, wxDeclaration: ${wxDeclaration.name}`)
    }
    if (uniDeclaration.declarationType === "string") {
      if (wxDeclaration.declarationType === "string") {
        if (uniDeclaration.typeText !== wxDeclaration.typeText) {
          // NOTE 忽略 DeclarationString
          console.error(`DeclarationString not equal => uniDeclaration: ${uniDeclaration.typeText}, wxDeclaration: ${wxDeclaration.typeText}`)
        }
      } else {
        // TODO uni 的属性是 any，则使用 wx 的属性类型（去除逻辑，不修改原有数据）
        /* if (uniDeclaration.typeText === "any") {
          if (wxDeclaration.declarationType === "interface" || wxDeclaration.declarationType === "function") {
            const typeText = this.uniSourceFileAddTypeAlias(methodName, wxDeclaration.name, wxDeclaration)
            typeText && setTypeText(typeText)
          }
          if (wxDeclaration.declarationType === "union") {
            const typeText = resolveUnionType(wxDeclaration)
            if (typeText !== "any") {
              setTypeText(typeText)
            }
          }
        } else {
          console.error(`DeclarationString not equal => uniDeclaration: ${uniDeclaration.typeText}, wxDeclaration: ${wxDeclaration}`)
        } */
      }
    }
  }
  /**
   * 合并接口声明
   * @param {DeclarationInterface} uniInterface
   * @param {DeclarationInterface} wxInterface
   * @param {string} methodName
   */
  mergeDeclarationInterface(uniInterface, wxInterface, methodName) {
    const uniInterfaceName = uniInterface.name
    const uniProperties = uniInterface.properties
    const uniDeclaration = uniInterface.declaration
    const uniPropertyNames = uniProperties.map((prop) => prop.name)

    const wxProperties = wxInterface.properties
    const wxPropertyNames = wxProperties.map((prop) => prop.name)

    const actions = []

    for (let index = 0; index < wxPropertyNames.length; index++) {
      const wxPropertyName = wxPropertyNames[index]
      if (wxPropertyName === 'errMsg') continue
      const wxInUniPropertyIndex = uniPropertyNames.indexOf(wxPropertyName)
      if (wxInUniPropertyIndex > -1) {
        /**
         * wx 中的属性在 uni 中存在
         */
        const wxProperty = wxProperties[index]
        const uniProperty = uniProperties[wxInUniPropertyIndex]
        this.resolveJsDocs(uniProperty.docs?.declaration ?? [], wxProperty.docs?.declaration ?? [])
        this.mergeDeclaration(uniProperty.type, wxProperty.type, methodName, (typeText) => {
          uniProperty.declaration.setType(typeText)
        })
      } else {
        /**
         * wx 中的属性在 uni 中不存在。但也是支持的
         */
        const wxProperty = wxProperties[index]
        const addTypeAliasRes = this.uniSourceFileAddTypeAlias(uniInterfaceName, wxProperty.name, wxProperty.type, wxProperty, true)
        if (addTypeAliasRes.length) {
          actions.push({
            type: "property",
            /** @type {import("ts-morph").PropertySignatureStructure} */
            structure: {
              kind: StructureKind.PropertySignature,
              hasQuestionToken: true,
              name: wxProperty.name,
              docs: [wxProperty.docs?.comment ?? ""],
              type: `${addTypeAliasRes ? addTypeAliasRes : "any"} | null`,
            },
          })
        }
      }
    }

    if (actions.length) {
      uniDeclaration.addProperties(actions.map((action) => action.structure))
    }
  }
  /**
   * 合并函数声明
   * @param {DeclarationFunction} uniFunction
   * @param {DeclarationFunction} wxFunction
   * @param {string} methodName
   */
  mergeDeclarationFunction(uniFunction, wxFunction, methodName) {
    const uniParameters = uniFunction.parameters
    const wxParameters = wxFunction.parameters

    for (let index = 0; index < wxParameters.length; index++) {
      const wxParameter = wxParameters[index]
      const uniParameter = uniParameters[index]
      if (uniParameter) {
        if (uniParameter.declarationType === wxParameter.declarationType) {
          this.mergeDeclaration(uniParameter.type, wxParameter.type, methodName, (typeText) => {
            uniParameter.declaration.setType(typeText)
          })
        } else {
          // TODO 如果参数类型不一致，则不处理
          console.error(
            `FunctionDeclaration parameter type not equal => uniParameter: ${uniParameter.declarationType}, wxParameter: ${wxParameter.declarationType}`
          )
        }
      } else {
        // TODO
        /**
         * wx 中的参数在 uni 中不存在
         */
        /* const addTypeAliasRes = this.uniSourceFileAddTypeAlias(methodName, wxParameter.name, wxParameter.type, uniFunction, true)
        uniFunction.declaration.addParameter({
          kind: StructureKind.Parameter,
          hasQuestionToken: true,
          name: wxParameter.name,
          type: addTypeAliasRes ? addTypeAliasRes : "any",
        }) */
      }
    }

    const uniReturn = uniFunction.return
    const wxReturn = wxFunction.return
    if (uniReturn.declarationType === wxReturn.declarationType) {
      this.mergeDeclaration(uniReturn, wxReturn, methodName, (typeText) => {
        uniFunction.declaration.setReturnType(typeText)
      })
    } else {
      // TODO 如果参数类型不一致，则不处理
      console.error(`FunctionDeclaration return type not equal => uniParameter: ${uniReturn.declarationType}, wxParameter: ${wxReturn.declarationType}`)
    }
  }
  /**
   * 合并联合类型声明
   * @param {DeclarationUnion} uniUnion
   * @param {DeclarationUnion} wxUnion
   * @param {string} methodName
   * @returns {string}
   */
  mergeDeclarationUnion(uniUnion, wxUnion, methodName) {
    const uniDeclaration = uniUnion.declaration
    const wxDeclaration = wxUnion.declaration
    const uniTypeText = uniUnion.typeText
    const wxTypeText = wxUnion.typeText
    if (uniTypeText === wxTypeText) return ""
    const wxUnionTypeText = resolveUnionType(wxUnion)
    if (wxUnionTypeText !== "any") {
      /** @type {string[]} */
      let uniUnionTypeNodes = []
      if (uniUnion.typeNode) {
        uniUnionTypeNodes = uniUnion.typeNode.getTypeNodes().map((typeNode, index) => {
          // 联合类型第一个不要注释
          if (index === 0) {
            return typeNode.getText()
          }
          return typeNode.getFullText().replace(/^\n\s*/g, "")
        })
      }
      const uniUnionLiteralValues = uniDeclaration.getUnionTypes().map((u) => u.getLiteralValue())
      /** @type {Array<string | number>} */
      const wxFilterUnionLiteralValues = wxDeclaration
        .getUnionTypes()
        .map((u) => u.getLiteralValue())
        .filter((v) => !uniUnionLiteralValues.includes(v))
        .filter((v) => typeof v === "string" || typeof v === "number")
      if (wxFilterUnionLiteralValues.length) {
        const { tagName, text } = jsDocAddNewUniPlatform()
        const typeText = uniUnionTypeNodes
          .concat(
            wxFilterUnionLiteralValues.map(
              (value) => `${commentInsertAsterisk(`@${tagName} ${text}`)?.replace(/^\n\s*/g, "")}\n${isString(value) ? JSON.stringify(value) : value}`
            )
          )
          .join(" |\n")
        return typeText
      }
      return ""
    }
    return ""
  }

  /**
   * 向 uni sourcefile 中添加类型别名
   * @param {string} uniInterfaceName 父接口名称
   * @param {string} propertyName 属性名称
   * @param {ReturnType<getType>} type 属性类型
   * @param {ReturnType<getType> | DeclarationProperty} [parent] 父级属性
   * @param {boolean} [optional = false] 当是在合并接口声明时，属性是可选的
   * @returns {string} 返回 string 类型的名称
   */
  uniSourceFileAddTypeAlias(uniInterfaceName, propertyName, type, parent, optional = false) {
    const newTypeAliasName = `${capitalize(uniInterfaceName)}${capitalize(propertyName)}`
    if (this.sourceFile.getTypeAlias(newTypeAliasName)) {
      console.error(`Type alias(${propertyName}) is exist(${uniInterfaceName})`)
      return newTypeAliasName
    }
    /**@type {import("ts-morph").OptionalKind<import("ts-morph").TypeAliasDeclarationStructure>} */
    const typeAliasStructure = {
      kind: StructureKind.TypeAlias,
      isExported: true,
      name: newTypeAliasName,
      type: "any",
    }
    switch (type.declarationType) {
      case "string":
        return type.typeText
      case "union":
        if (wxNamespaceReg.test(type.typeText)) {
          return ""
        }
        return resolveUnionType(type, parent)
      case "function":
        const paramTypes = type.parameters.map((parameter) => {
          const hasQuestionToken = optional || parameter.hasQuestionToken
          return `${parameter.name}${hasQuestionToken ? "?" : ""}: ${this.uniSourceFileAddTypeAlias(newTypeAliasName, parameter.name, parameter.type)}${
            hasQuestionToken ? " | null" : ""
          }`
        })
        const returnType = this.uniSourceFileAddTypeAlias(newTypeAliasName, `${newTypeAliasName}Return`, type.return)
        const functionStructure = {
          type: `(${paramTypes.join(", ")}) => ${returnType}`,
          docs: type.docs?.comment ? [type.docs?.comment] : undefined,
        }
        this.actions.push({
          type: "typeAlias",
          /** @type {import("ts-morph").OptionalKind<import("ts-morph").TypeAliasDeclarationStructure>} */
          structure: Object.assign(typeAliasStructure, functionStructure),
        })
        // this.sourceFile.addTypeAlias(Object.assign(typeAliasStructure, functionStructure)).formatText()
        return newTypeAliasName
      case "interface":
        const interfaceStructure = {
          type: `{ ${type.properties
            .map((prop) => {
              const addTypeAliasRes = this.uniSourceFileAddTypeAlias(newTypeAliasName, prop.name, prop.type, prop)
              if (addTypeAliasRes) {
                const hasQuestionToken = optional || prop.hasQuestionToken
                return `${commentInsertAsterisk(prop.docs?.comment) ?? ""}\n${prop.name}${hasQuestionToken ? "?" : ""}: ${addTypeAliasRes}${
                  hasQuestionToken ? " | null" : ""
                }`
              }
              return false
            })
            .filter(Boolean)
            .join("; ")} }`,
          docs: type.docs?.comment ? [type.docs?.comment] : undefined,
        }
        this.actions.push({
          type: "typeAlias",
          /** @type {import("ts-morph").OptionalKind<import("ts-morph").TypeAliasDeclarationStructure>} */
          structure: Object.assign(typeAliasStructure, interfaceStructure),
        })
        // this.sourceFile.addTypeAlias(Object.assign(typeAliasStructure, interfaceStructure)).formatText()
        return newTypeAliasName
      case "typeAlias":
        return this.uniSourceFileAddTypeAlias(newTypeAliasName, type.name, type.type, type)
    }
  }
}
// #endregion Class Merge

// #region run
/**
 * @return {{
 *    wxNamespace: ModuleDeclaration,
 *    wxInterface: InterfaceDeclaration
 * }}
 */
function getWX() {
  /* const wxToUniPath = path.join(__dirname, "../types/uni/uts-plugin-extend", "wx/index.d.ts")
  const wxToUniProject = new Project()
  const wxToUniSourceFile = wxToUniProject.createSourceFile(wxToUniPath, "", {
    overwrite: true,
  })
  const wxUniNamespace = wxToUniSourceFile.addModule({
    name: uniNamespaceName,
    hasDeclareKeyword: true,
  })
  const wxUniInterface = wxToUniSourceFile.addInterface({
    name: uniInterfaceName,
  }) */

  const wxPath = path.join(__dirname, "../node_modules", "miniprogram-api-typings", "**/*.ts")
  const wxProject = new Project()
  wxProject.addSourceFilesAtPaths(wxPath)
  const wxSourceFile = wxProject.getSourceFileOrThrow("lib.wx.api.d.ts")
  const wxNamespace = wxSourceFile.getModuleOrThrow(wxNamespaceName)
  const wxInterface = wxNamespace.getInterfaceOrThrow("Wx")

  return { wxInterface, wxNamespace }
}
/**
 * 获取 Uni 的方法
 * @param {(import("ts-morph").TypeElementTypes)[]} uniMembers
 * @returns {{
 *  methodName: string,
 *  getNode: () => MethodSignature | FunctionTypeNode | undefined,
 *  getJsDocs: () => JSDoc[]
 * }[]}
 */
function resolveUniMembers(uniMembers) {
  return uniMembers
    .map((member) => {
      if (Node.isPropertyDeclaration(member) || Node.isPropertySignature(member)) {
        /**
         * Ex.
         * interface Uni {
         *  preloadPage: PreloadPage;
         *  preLoadPage2: (options: PreloadPageOptions) => void
         * }
         */
        return {
          methodName: member.getName(),
          getNode: () => {
            const memberType = member.getType()
            const symbol = memberType.getSymbol()
            if (symbol) {
              const declaration = symbol.getDeclarations()[0]
              if (Node.isFunctionTypeNode(declaration)) {
                return declaration
              }
            }
          },
          getJsDocs: () => member.getJsDocs(),
        }
      }
      if (Node.isMethodSignature(member)) {
        /**
         * Ex.
         * interface Uni {
         *  preLoadPage(options: PreloadPageOptions): void
         * }
         */
        return {
          methodName: member.getName(),
          getNode: () => member,
          getJsDocs: () => member.getJsDocs(),
        }
      }
    })
    .filter((item) => typeof item !== "undefined")
}

function run() {
  const wxMethods = wxInterface.getMethods()
  const wxMethodNames = wxMethods.map((method) => method.getName())
  const interfaceDTSPaths = globSync(path.join(__dirname, "../types/uni/**/lib/**/utssdk/interface.d.ts"))

  // const patch = new Patch(path.join(__dirname, "../types/uni/uts-plugin-extend/lib/uni-patches/wx/interface.d.ts"), uniInterfaceName, uniNamespaceName)

  const changeFilePathList = execSync("git status -s", { encoding: "utf-8" })
    .trim()
    .split(/\r*\n/)
    .map((line) => {
      if (!line) return ""
      let [tag, realPath] = line.trim().split(/\s+/)
      return path.join(__dirname, "../", realPath).replace(/\\/g, "/")
    })
    .filter(Boolean)

  console.time("MERGE_API")
  const project = new Project({
    compilerOptions: { noEmit: true, skipLibCheck: true, checkJs: false },
  })
  project.addSourceFilesAtPaths(interfaceDTSPaths)
  project.resolveSourceFileDependencies()
  const sourceFiles = project.getSourceFiles()

  // 合并 uni 和 wx 的方法
  sourceFiles.forEach((sourceFile) => {
    const sourcePath = sourceFile.getFilePath()
    if (!changeFilePathList.includes(sourcePath)) return
    console.log(`interfaceDTSPath :>> ${sourcePath}`)

    const uniInterface = sourceFile.getInterface(uniInterfaceName)
    const uniMembers = uniInterface?.getMembers() ?? []

    if (uniMembers.length) {
      resolveUniMembers(uniMembers).forEach((member) => {
        const { methodName: uniMethodName } = member
        const wxMethodIndex = wxMethodNames.indexOf(uniMethodName)
        if (wxMethodIndex > -1) {
          // wx patch
          // patch.appendInterface.getMethod(uniMethodName)?.remove()
          wxMethodNames[wxMethodIndex] = ""
          console.time("MERGE")
          new Merge(sourceFile, wxMethods[wxMethodIndex], member).begin()
          console.timeEnd("MERGE")
        } else {
          // wx patch
          /* if (patch.appendInterface.getMethod(uniMethodName)) {
              wxMethodNames[wxMethodIndex] = ""
            } */
          console.log("Method not found in WeiXin interface :>> ", uniMethodName)
        }
      })

      sourceFile.saveSync()
      sourceFile.emitSync()
    }
  })
  console.timeEnd("MERGE_API")

  /**
   * 将微信的方法添加到 uni 中
   */
  // TODO 移除 patch
  /* console.time("CREATE_WX_PATCH")
    WX_UNIAPP_X_SUPPORT = NOT_SUPPORT_VER
    const wxPatchedUniMethodNames = patch.appendInterface.getMethods().map((method) => method.getName())
    await patch.begin(wxMethods, (method) => {
      const methodName = method.getName()
      return wxMethodNames.includes(methodName) && !wxPatchedUniMethodNames.includes(methodName)
    })
    console.timeEnd("CREATE_WX_PATCH") */
}

run()
// #endregion run
