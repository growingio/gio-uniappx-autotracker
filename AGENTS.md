# Project Constraints

本文件是 `gio-uniappx-autotracker` 的项目级硬性规则文档。

## 官方规则来源

- UTS 官方文档：<https://doc.dcloud.net.cn/uni-app-x/uts/>
- UTS 与 TypeScript 差异：<https://doc.dcloud.net.cn/uni-app-x/uts/uts_diff_ts.html>
- UTS 插件开发规范：<https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html>
- 项目 UTS 编码规范：[docs/uts-coding-guidelines.md](docs/uts-coding-guidelines.md)

以上文档是本项目的强约束来源。实现、重构、修复、补 demo、补文档时，都必须优先服从这些规则，不能按普通 TypeScript / JavaScript 习惯自行放宽。

## 硬性规则

- 目标是让 SDK 在 `web`、`app-android`、`app-ios`、`app-harmony`、`mp-weixin` 五个端都能正确产出；任何代码改动都不能只按单端思路实现。
- `utssdk` 目录结构必须保持多端入口齐全：`app-js`、`web`、`app-android`、`app-ios`、`app-harmony`、`mp-weixin`。
- `web` 目录必须保留 `utssdk/web/package.json`，`app-android`、`app-ios`、`app-harmony` 目录必须保留各自的 `config.json`。
- 不要依赖 `undefined` 语义。所有非必填字段统一显式使用 `null`，不要使用 `?` 可选属性或可选参数表达运行时缺省。
- 对外配置对象和事件对象要使用稳定、显式的字段结构，避免让生成器自行推断可选字段形态。
- 不要把 `UTSJSONObject` 直接当强类型配置对象使用；需要先做显式归一化，再进入核心逻辑。
- 尽量避免使用容易在 UTS 生成阶段出现歧义的 TypeScript 风格写法，尤其是复杂的类型体操、依赖 `undefined` 的分支、以及仅靠类型断言维持正确性的接口设计。
- 能用 `type` 明确表达的数据结构，不要为了 TS 习惯随手写 `interface` 并直接承接对象字面量。
- 跨端公共逻辑优先收敛在 `utssdk/common`，平台入口只做必要的薄封装，不要无序分叉实现。
- 用户身份相关字段 `sessionId`、`userId`、`userKey` 必须持久化到存储里，并且每次构建事件时都要从存储重新读取，不能只靠内存态维护。
- 关键事件与公开能力基线必须保留：`VISIT`、`PAGE`、`APP_CLOSED`、`track`、`setUserId`、`clearUserId`、`identify`、`registerPlugins`、`getABTest`。

## 验证规则

- 不能因为源码编译通过，就默认五端可用。
- 每次改动后，至少要在 HBuilderX 里打开根目录工程（`npm run demo:open`），对受影响的端做编译验证。
- SDK 以 `uni_modules/gio-uniappx-autotracker` 集成包形态直接随工程编译，不依赖额外的构建/打包脚本；要保证该目录五端入口结构完整。
- 如果要声称“五端都能编译并可上报”，必须经过真实的 HBuilderX 五端编译验证，不能只根据源码结构做结论。

## 当前项目约定

- 当前 SDK 采用“显式 `null`”模型，不使用 `undefined` 作为对外契约。
- 当前插件入口通过 `normalizeInitOptions()` 做配置归一化，再进入 `GioTracker`。
- 当前 demo 也必须遵守同样的 UTS 规则，不能因为只是示例就退回普通 TS 写法。

## 架构与职责边界

- `GioTracker` 只负责编排：初始化校验、生命周期调度、session 边界、事件派发、插件协调。不要继续把平台字段解析、存储细节、请求参数组装直接堆进 `tracker.uts`。
- 页面路由、页面快照、系统上下文、事件构建、上传、用户身份必须各自留在独立模块中；如果一个函数同时在做取状态、改状态、发事件、拼请求，优先拆开。
- 跨端共用逻辑优先抽到 `utssdk/common`；平台目录只做注册、薄封装和平台差异适配，不复制完整实现。
- `utssdk/common` 内禁止出现带平台语义的文件名或实现（如 `miniprogram`、`web-only`、`ios-*`）；如果某段逻辑只服务某一端，即使算法可复用，也应放回对应平台目录，或先抽象成真正无平台语义的公共工具。
- `utssdk/common/utils` 是唯一的公共工具收口目录；像 `BoxArray` 这种轻量容器封装、请求辅助、调试辅助、校验函数都应收在这里，优先并入已有工具文件，不要为了单个小工具拆出零散文件。
- `utssdk/` 内是原生编译层，`plugin.uts` / `gdp.uts` 是 JS 编译层。JS 层只允许做生命周期桥接、命令分发、参数预处理，不要重复实现核心业务逻辑。

## 生命周期桥接规则

- `plugin.uts` 的 mixin 必须显式桥接 `onLaunch`、`onLoad`、`onShow`、`onHide`、`onUnload` 到 `utssdk` 导出的对应入口，不能留空壳 hook。
- `App.uvue` 在 `app-android` 不支持 mixins，全局 mixins 也不会对 `App.uvue` 生效；任何依赖 App mixin 的能力都必须明确标注平台限制，不能默认五端一致。
- 页面生命周期可以走 mixin；App 生命周期如果受平台限制，必须让降级行为可见，不能让 `APP_CLOSED`、首屏来源等能力处于“代码看起来接了、实际没接上”的状态。

## 日志与调试规则

- 默认常驻日志只保留真正有价值的 `warn`、`error` 和必要的初始化提示；热路径里的 `info` 日志必须受 `debug` 开关控制。
- 禁止在 `track`、`onShow`、页面上下文构建、命令分发等高频路径里无条件打印对象、JSON 字符串或运行态快照。
- 为定位单端问题临时加入的日志，修复完成后必须收回到 `debugLog()` 或删除，不能残留在主逻辑里。

## 模块重构规则

- 发现重复实现时，优先抽到 `utssdk/common` 再由平台目录复用；不要在多个入口文件各修一份。
- `setOptions`、`registerPlugins`、`identify` 这类公开入口必须先做显式参数归一化，再进入核心逻辑；参数不合法时直接失败，不能静默改状态。
- 对外布尔开关如果存在“未提供 / true / false”语义，必须在归一化阶段一次性消解；进入核心状态后尽量保存为确定类型。

## 已验证的高频坑

- `uni.request()` 的 `data` 只接受 `UTSJSONObject | string | ArrayBuffer`；上传数组时先 `JSON.stringify()`，不要把 `Array<UTSJSONObject>` 直接传进去。
- `App.uvue` 无法靠 mixin 可靠监听退后台，尤其是 `app-android`；相关能力必须单独标注平台限制。
- `utssdk` 目录内外分属不同编译层，禁止跨层直接混合 re-export，否则容易出现重复实例或编译异常。
- 页面路径、query、title 的解析必须走统一模块，不要在不同生命周期里各自拼装。
- iOS 对 `index.uts` 的二次 re-export 更敏感；公共导出尽量扁平，避免多层转发。
- Kotlin/Swift 对数组引用语义不同，跨模块共享可变数组时优先使用显式包装类，避免长期直接传裸数组。

## UTS 知识库

本地知识库根目录：`{.codebuddy/knowledges}`，以下用 `{KB}` 代指。

关键文档：

| 文档 | 路径 |
|------|------|
| UTS 与 TS 差异 | `{KB}/uni-app-x/docs/uts/uts_diff_ts.md` |
| UTSJSONObject API | `{KB}/uni-app-x/docs/uts/buildin-object-api/utsjsonobject.md` |
| 编译器已知问题 | `{KB}/uni-app-x/docs/uts/compiler-known-issues.md` |
| uni-app-x 类型定义 | `{KB}/uni-app-x/types/` |
| uni for ios | `{KB}/uni-app-x/docs/plugin/uts-for-ios.md` |
| uni for android | `{KB}/uni-app-x/docs/plugin/uts-for-android.md` |

遇到任何 UTS 语法或编译问题时，优先查询上述文档。

## UTS 类型与写法规则

以下规则是在 `uts_diff_ts.md` 基础上的项目级补充，所有 UTS 代码必须遵守。

### 1. 类型声明

| 规则 | 说明 |
|------|------|
| 尽量避免 `any` | 唯一例外：mixin 注入的 `onPageLoad(this, ...)`，因各端页面实例类型不同。其余场景必须定义明确的 type。 |
| 优先使用 UTS 内置类型 | 如 `UTSJSONObject`、`Array<T>`，不要用平台特有类型（如 Kotlin `HashMap`）。 |
| 可空类型显式标注 | 凡可能接收或返回 `null` 的字段，类型必须写 `T \| null`，不要依赖 `undefined`。 |
| 系统 API 返回值一律按可空处理 | 如 `charAt()` 在 Kotlin 返回可空、Swift 返回非空，统一按 `T \| null` 接住。 |

### 2. 关键字规避

以下关键字 **禁止** 用作方法名或变量名，因为会与 Swift/Kotlin 关键字冲突：

- Swift 关键字：`init`、`self`
- Kotlin 关键字：`init`

替代方案：TS 中的 `init()` 改为 `initialize()`，`self` 直接使用箭头函数或 `this`。

### 3. 数值类型转换

UTS 中不存在 `Int`/`Float`/`Double` 类型。处理数组长度等场景时：

```uts
// ❌ 错误：Swift 中 arr.length 返回 Int，count 变成 NSNumber，类型不匹配
const count: number = arr.length

// ❌ 错误：Kotlin 中 Number 是 abstract class，不能实例化
const count: number = Number(arr.length)

// ✅ 正确：多端兼容
const count: number = arr.length as number
```

### 4. typeof 比较

**禁止**使用 `===` 做 typeof 结果比较。UTS 中 `===` 会被翻译为 Swift 的 `===`（身份相等，用于引用类型），而 `typeof` 返回的是 `String` 值类型。

```uts
// ❌ 错误：=== 在 Swift 中是比较引用身份，String 值类型会出问题
if (typeof value === "number") { ... }

// ✅ 正确：使用 ==（值相等）
if (typeof value == "number") { ... }
```

### 5. 调试编译问题

遇到编译错误时，查看 HBuilderX 生成的中间代码辅助定位：

- Android：`demos/growingio-showcase/unpackage/dist/dev/app-android/uni_modules/gio-uniappx-autotracker/utssdk/app-android/index.kt`
- iOS：`demos/growingio-showcase/unpackage/dist/dev/app-ios/uni_modules/gio-uniappx-autotracker/utssdk/app-ios/index.swift`

对比生成的 Kotlin/Swift 代码与源 UTS 代码，可快速定位类型不匹配、关键字冲突等问题。

### 6. UTSJSONObject 转换规则（⚠️ 高频错误点）

**核心原则：UTS 的 `as` 在编译到 Kotlin/Swift 时是真·运行时类型转换，不是 TS 的类型断言。**

#### 6.1 UTSJSONObject → 自定义 type：禁止直接 `as`

```uts
// ❌ 错误：Kotlin/Swift 中 UTSJSONObject 不是自定义 type 的子类，cast 会抛 ClassCastException
const obj: UTSJSONObject = { name: "Tom" }
const user = obj as User

// ✅ 正确：通过 JSON 序列化/反序列化转换
const user = JSON.parse<User>(JSON.stringify(obj)!)!
```

#### 6.2 自定义 type → UTSJSONObject：使用 JSON.parseObject

```uts
// ❌ 错误：同样不能直接 cast
const jsonObj = user as UTSJSONObject

// ✅ 正确
const jsonObj = JSON.parseObject(JSON.stringify(user)!)!
```

#### 6.3 原始类型（string/number）→ UTSJSONObject：禁止直接 `as`

在存储场景中，绝不能将 string 或 number 直接 `as UTSJSONObject`：

```uts
// ❌ 错误：Kotlin 中 String/Number 不是 UTSJSONObject 的子类，抛 ClassCastException
storage.setItem(key, "hello" as UTSJSONObject, null)
storage.setItem(key, 123 as UTSJSONObject, null)

// ✅ 正确：包装为真正的 UTSJSONObject
const wrapper: UTSJSONObject = {}
wrapper['v'] = "hello"  // 或 wrapper['v'] = 123
storage.setItem(key, wrapper, null)

// 读取时解包
const wrapper = storage.getItem(key)
if (wrapper == null) return ''
const v = wrapper['v']
return v != null ? `${v}` : ''
```

#### 6.4 原生存储 API 的坑

`uni.getStorageSync()` 在 Android/iOS 返回原始 `String`，不能直接 `as UTSJSONObject`：

```uts
// ❌ 错误：value 是 String，不是 UTSJSONObject
const value = uni.getStorageSync(key) as UTSJSONObject

// ✅ 正确：先判断类型再处理
const value = uni.getStorageSync(key)
if (value == null) return null
if (typeof value == 'string') {
    // 字符串：尝试 JSON.parse，失败则包装
    try {
        return JSON.parse(value as string) as UTSJSONObject
    } catch (_) {
        const w: UTSJSONObject = {}
        w['v'] = value as string
        return w
    }
}
return value as UTSJSONObject  // 非字符串类型安全
```

### 7. uni.request() 显式类型标注（⚠️ 高频错误点）

在 uts 插件环境中，编译器无法默认推断 `uni.request()` 的泛型参数，必须显式标注泛型、回调参数类型，并对整个 options 对象做类型断言。

```uts
// ✅ 正确：完整显式类型标注
uni.request<any>({
    url: 'http://xxx',
    method: 'GET',
    success: (res : RequestSuccess<any>) => {
        // ...
    },
    fail(e : RequestFail) {
        // ...
    },
} as RequestOptions<any>)

// ❌ 错误：缺少泛型参数和 options 类型断言
uni.request({
    url: 'http://xxx',
    success: (res) => { ... },
    fail: (err) => { ... },
})
```

**要点：**
- `uni.request<T>({ ... })` — 必须显式指定泛型 `<T>`，否则 Swift 报 `generic parameter 'T' could not be inferred`
- `success: (res : RequestSuccess<T>)` — 回调参数必须注明类型
- `fail(e : RequestFail)` — 失败回调使用简写语法 + 类型标注
- `} as RequestOptions<T>)` — 整个 options 对象末尾做类型断言，避免 `RequestOptions<String>` vs `RequestOptions<Any>` 的泛型冲突

### 8. 多端兼容检查清单

每次提交代码前，确认以下事项：

- [ ] 没有使用 `undefined`（统一用 `null`）
- [ ] 没有 `UTSJSONObject as CustomType`（使用 `JSON.parse<T>(JSON.stringify(...)!)`）
- [ ] 没有 `typeof x === "..."`（使用 `==`）
- [ ] 没有 `init`/`self` 作为标识符
- [ ] 系统 API 返回值按可空类型处理
- [ ] `uni.request()` 调用有关完整的泛型 + `as RequestOptions<T>` 标注
