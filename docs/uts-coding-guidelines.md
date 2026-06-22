# UTS 多端编码规范

本文档是 `gio-uniappx-autotracker` 项目中编写 UTS 代码的强制规范。所有 `.uts` 文件（含 demo 的 `.uvue`）都必须遵守。

来源：[UTS 官方文档](https://doc.dcloud.net.cn/uni-app-x/uts/)、[UTS 与 TS 差异](https://doc.dcloud.net.cn/uni-app-x/uts/uts_diff_ts.html)、[UTSJSONObject 文档](https://doc.dcloud.net.cn/uni-app-x/uts/buildin-object-api/utsjsonobject.html)、项目踩坑经验。

## 本地 UTS 知识库

本地知识库根目录：`.codebuddy/knowledges`（下文用 `{KB}` 代指）。

| 文档 | 路径 |
|------|------|
| UTS 与 TS 差异 | `{KB}/uni-app-x/docs/uts/uts_diff_ts.md` |
| UTSJSONObject API | `{KB}/uni-app-x/docs/uts/buildin-object-api/utsjsonobject.md` |
| 编译器已知问题 | `{KB}/uni-app-x/docs/uts/compiler-known-issues.md` |
| uni-app-x 类型定义 | `{KB}/uni-app-x/types/` |

遇到任何 UTS 语法或编译问题时，优先查询上述文档。

---

## 0. 生命周期桥接边界

`gio-uniappx-autotracker` 当前明确区分两层：

- `plugin.uts` / `gdp.uts`：JS 编译层
- `utssdk/`：native 编译层

这条边界直接影响可编译性，不能模糊处理。

### 0.1 不能把页面实例直接传进 `utssdk/`

页面生命周期里的 `this`、原始 `options`、以及平台页面实例，都不能直接透传给 `utssdk/`。

原因：

- iOS 原生侧不认识这些实例，它们不是稳定的 `UTSJSONObject`
- 各端页面实例结构不同，直接透传会把平台差异扩散进核心逻辑
- `utssdk/` 应只消费稳定、显式、可序列化的普通对象

### 0.2 统一先做浅拷贝快照

当前正确做法是在 `plugin.uts` 先构造快照，再转发给 `utssdk/`：

- 页面快照：`route`、`$scope.route`、`options`、`$scope.options`、`title`
- 启动参数快照：`path`、`scene`、`query`、`referrerInfo` / `refererInfo`

如果后续需要补更多字段，先扩展快照结构，不要回退到“直接传 `this` / `options`”。

---

## 1. 类型选择

### 1.1 尽可能不使用 `any`

`any` 会丢失类型安全，在 Kotlin/Swift 端可能产生不可预期的运行时行为。仅在以下情况使用：

- mixin 生命周期的 `this`（各端页面实例类型不同，`any` 是唯一方案）
- 跨端存储 API 的 `getItem` 返回值（uni 存储返回类型不确定）

其他场景一律定义自定义类型。

```uts
// ✗ 错误
function processData(data : any) : any { ... }

// ✓ 正确
type ProcessResult = { count : number, items : Array<string> }
function processData(data : UTSJSONObject) : ProcessResult { ... }
```

### 1.2 优先使用 UTS 系统类型

UTS 中不存在 `Int`、`Float`、`Double`，统一使用 `number`。`string`、`boolean` 同理。

```uts
// ✗ 错误 — Int/Float/Double 在 UTS 中不存在
let count : Int = 5

// ✓ 正确
let count : number = 5
```

### 1.3 可空类型必须显式声明

如果字段可能为 `null`，必须声明为 `T | null`。不要依赖 `undefined`。

```uts
// ✗ 错误 — undefined 在 UTS 中不支持
let name : string | undefined

// ✓ 正确
let name : string | null = null
```

---

## 2. 空值处理

### 2.1 不使用 `undefined`

UTS 不支持 `undefined`。所有"未赋值"、"未传入"、"不存在"的语义统一用 `null` 表达。

```uts
// ✗ 错误
function greet(name? : string) { ... }

// ✓ 正确
function greet(name : string | null) { ... }
```

### 2.2 不使用 `?` 可选属性

对外配置对象和事件对象使用显式 `null`，不用 `?` 可选属性。

```uts
// ✗ 错误
type Config = {
  debug? : boolean
}

// ✓ 正确
type Config = {
  debug : boolean | null
}
```

### 2.3 系统函数返回值一律按可空处理

`charAt`、`slice`、`toString` 等系统函数在 Kotlin 端返回值可能是可空类型。统一按 `| null` 处理。

```uts
// ✗ 错误 — charAt 返回值在 Kotlin 可能为 null
const ch : string = text.charAt(0)

// ✓ 正确
const ch : string | null = text.charAt(0)
if (ch != null) { ... }
```

---

## 3. 数值类型兼容

### 3.1 `arr.length` 等属性需要 `as number`

Swift 中 `arr.length` 返回 `Int`，而 UTS 的 `number` 映射到 Swift 的 `NSNumber`，类型不匹配。不能直接赋值，也不能用 `Number()` 构造（Kotlin 中 `Number` 是 abstract class）。

```uts
// ✗ 错误 — Swift 编译失败
const count : number = arr.length

// ✗ 错误 — Kotlin 中 Number 是 abstract class，不能实例化
const count : number = Number(arr.length)

// ✓ 正确
const count : number = arr.length as number
```

---

## 4. 关键字规避

### 4.1 避免 Swift/Kotlin 关键字作为方法名/变量名

| 关键字 | 语言 | 替代方案 |
|---|---|---|
| `init` | Swift | `initialize`、`setup` |
| `self` | Swift | `this`（UTS 统一使用 `this`） |
| `class` | Kotlin/Swift | `className`、`type` |
| `object` | Kotlin | `target`、`instance` |
| `val` | Kotlin | `value`、`val_` |
| `fun` | Kotlin | `fn`、`func`、`handler` |

```uts
// ✗ 错误 — init 是 Swift 关键字
function init(options : GioInitOptions) { ... }

// ✓ 正确
function initialize(options : GioInitOptions) { ... }
```

---

## 5. UTSJSONObject 与自定义 type 转换

### 5.1 UTSJSONObject 不能直接 `as` 转自定义 type

`as` 转换在运行时会 crash。必须通过 `JSON.stringify` + `JSON.parse` 中转。

```uts
// ✗ 错误 — 运行时 crash
let user = jsonObj as User

// ✓ 正确 — UTSJSONObject => 自定义 type
let user = JSON.parse<User>(JSON.stringify(jsonObj)!)

// ✓ 正确 — 自定义 type => UTSJSONObject
let utsJson = JSON.parseObject(JSON.stringify(user)!)
```

### 5.2 UTSJSONObject 属性访问

优先使用类型化的 getter 方法，避免 `as` 强转。

```uts
// ✗ 不推荐 — 需要 as 强转，且 null 时会 crash
let name : string = raw['name'] as string

// ✓ 推荐 — 类型安全，null 时返回 null
let name : string | null = raw.getString('name')
let age : number | null = raw.getNumber('age')
let nested : UTSJSONObject | null = raw.getJSON('config')
let items : Array<string> | null = raw.getArray<string>('tags')
```

带默认值的 getter：

```uts
let name : string = raw.getString('name', '')
let debug : boolean = raw.getBoolean('debug', false)
let timeout : number = raw.getNumber('timeout', 3000)
```

### 5.3 原始类型 → UTSJSONObject：禁止直接 `as`（存储场景）

在存储场景中，绝不能将 string 或 number 直接 `as UTSJSONObject`：

```uts
// ✗ 错误：Kotlin 中 String/Number 不是 UTSJSONObject 的子类，抛 ClassCastException
storage.setItem(key, "hello" as UTSJSONObject, null)
storage.setItem(key, 123 as UTSJSONObject, null)

// ✓ 正确：包装为真正的 UTSJSONObject
const wrapper: UTSJSONObject = {}
wrapper['v'] = "hello"  // 或 wrapper['v'] = 123
storage.setItem(key, wrapper, null)

// 读取时解包
const wrapper = storage.getItem(key)
if (wrapper == null) return ''
const v = wrapper['v']
return v != null ? `${v}` : ''
```

### 5.4 原生存储 API 的坑

`uni.getStorageSync()` 在 Android/iOS 返回原始 `String`，不能直接 `as UTSJSONObject`：

```uts
// ✗ 错误：value 是 String，不是 UTSJSONObject
const value = uni.getStorageSync(key) as UTSJSONObject

// ✓ 正确：先判断类型再处理
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

---

## 6. 条件语句

### 6.1 条件必须是布尔类型

UTS 不支持 truthy/falsy 隐式转换。

```uts
// ✗ 错误
if (arr.length) { ... }
if (str) { ... }

// ✓ 正确
if (arr.length > 0) { ... }
if (str.length > 0) { ... }
```

### 6.2 避免 `typeof + ===` 组合

`===` 在 Swift 中翻译为身份相等（`===`），而非值相等（`==`）。`typeof` 返回 `String` 值类型，应使用 `==`。

```uts
// ✗ 错误 — Swift 编译失败，String 不能转 NSNumber
if (typeof value === 'number') { ... }

// ✓ 正确 — 使用 == 做值比较
if (typeof value == 'number') { ... }

// ✓ 更好 — 使用 UTSJSONObject 的类型化 getter
let numValue = raw.getNumber('key')
if (numValue != null) { ... }
```

---

## 7. 对象字面量

### 7.1 对象字面量默认推导为 `UTSJSONObject`

```uts
// 推导为 UTSJSONObject
const person = { name: 'Tom', age: 30 }

// ✗ 不能直接 . 访问（除第一层外）
console.log(person.name)   // 第一层可以
console.log(person.address.city) // 第二层不行

// ✓ 正确
console.log(person['name'] as string)
```

### 7.2 只有 `type` 可以承接对象字面量

`interface` 不能用于对象字面量赋值。

```uts
// ✗ 错误
interface Person { name : string }
const p : Person = { name: 'Tom' }

// ✓ 正确
type Person = { name : string }
const p : Person = { name: 'Tom' }
```

### 7.3 `type` 不支持嵌套对象字面量

```uts
// ✗ 错误
type News = { author : { id : number, name : string } }

// ✓ 正确
type Author = { id : number, name : string }
type News = { author : Author }
```

---

## 8. 多端兼容写法

### 8.1 不依赖单端 API

所有公共逻辑（`utssdk/common`）不能使用只有某个平台才有的 API。平台特有逻辑放在对应的平台目录（`utssdk/web`、`utssdk/mp-weixin` 等）。

### 8.2 不使用 `var`

统一使用 `let` / `const`。`var` 在各端行为不一致。

### 8.3 函数声明不提升

所有变量和函数必须先声明后使用。

```uts
// ✗ 错误
foo()
function foo() { ... }

// ✓ 正确
function foo() { ... }
foo()
```

### 8.4 条件编译

使用 `#ifdef` / `#ifndef` 做平台特有代码隔离：

```uts
// #ifdef MP-WEIXIN
import { wrapShareAppMessage } from './mp-weixin/share.uts'
// #endif
```

---

## 9. uni.request() 显式类型标注

在 uts 插件环境中，编译器无法默认推断 `uni.request()` 的泛型参数，必须显式标注泛型、回调参数类型，并对整个 options 对象做类型断言。

```uts
// ✓ 正确：完整显式类型标注
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

// ✗ 错误：缺少泛型参数和 options 类型断言
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

---

## 10. 调试辅助

### 10.1 查看编译产物辅助排查

遇到编译问题时，查看各端编译产物辅助判断：

- iOS Swift: `unpackage/dist/dev/app-ios/uni_modules/gio-uniappx-autotracker/utssdk/app-ios/index.swift`
- Android Kotlin: `unpackage/dist/dev/app-android/uni_modules/gio-uniappx-autotracker/utssdk/app-android/index.kt`

---

## 11. Checklist

写完 UTS 代码后，自检以下项：

- [ ] 没有使用 `undefined`
- [ ] 没有使用 `?` 可选属性/参数（对外契约层）
- [ ] 可能为 `null` 的值声明了 `| null`
- [ ] 系统函数返回值按可空处理
- [ ] 没有使用 `Int`/`Float`/`Double`
- [ ] 数值属性赋值使用了 `as number`
- [ ] 没有使用 Swift/Kotlin 关键字命名
- [ ] UTSJSONObject 没有直接 `as` 转自定义 type
- [ ] 原始类型（string/number）没有直接 `as UTSJSONObject`（存储场景用包装对象）
- [ ] 原生存储 API 返回值先判类型再处理
- [ ] 条件语句使用布尔表达式，不用 truthy/falsy
- [ ] 没有 `typeof + ===` 组合
- [ ] 对象字面量用 `type` 而非 `interface` 承接
- [ ] 公共逻辑没有依赖单端 API
- [ ] `uni.request()` 调用有完整泛型 + `as RequestOptions<T>` 标注
