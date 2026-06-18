# LESSONS_LEARNED

> 只记「跑起来才知道」的坑（core-protocol §5）。每条注明触发场景 + 规则。

## 协议 conformance 失败会级联成 Vite「Expected a semicolon」假语法错 —— 2026-06-14（iOS recompile 实证）

类（→Swift class）`implements` 接口（→Swift protocol）时若**任一方法的形参可空性 / 数组可选性不符**
（不止 boolean 字段：这次是 `track` 接口 `items?: unknown[]`→`[Any]?` vs 实现 `items: unknown[] = []`→`[Any]`），
报 `type 'X' does not conform to protocol 'Y'`。**真正坑在级联**：conformance 失败会**中断该文件的 UTS→Swift
transform**，Vite 随后按**纯 JS** 解析下一个 `.uts`（如 plugins.uts），撞上第一个**类型注解**
（`: boolean` / `: string`）就报 `[plugin:uts] Expected a semicolon (Note that you need plugins to import
files that are not JavaScript)`，**指向一个完全无辜的位置**（本例 plugins.uts:56 的 `hasOwn(...): boolean`）。

**规则**：recompile 同时报「does not conform」+「Expected a semicolon / 非 JS 文件」时，**只查 conformance**，
那条 semicolon 几乎必是级联噪声（指向的行往往只是个普通类型注解），修好 conformance 它自动消失，别去那行找语法错。
接口/实现对齐照本仓 §「必填可空」套路：两侧都收**必填**（数组 `T[]`、可空值 `X | null`，**不写** `x?`），
实现侧保留 `= null` / `= []` 默认供具体类调用方省略；要错位排参就把可空必填项前置（必填不能跟在可选后）。
数组字面量默认 `= []` native 已验可用（eventBuilder.build / track 同款过 recompile），但对象默认 `= {}` 仍不可用（用 `| null = null`）。

## UTS native 无 `Object` 全局；取键 / 判存在 / 对象下标 —— 2026-06-13（iOS recompile #22 实证）

`Object.keys/values/entries/Object.prototype.hasOwnProperty.call/Object.prototype.toString.call`
在 UTS native（Swift）下全部失败：`cannot find 'Object' in scope`。**Kotlin/Android 能过、Swift 不过**
（跨端差异，故 `pnpm build` + 早期只验 Android 时漏掉；`verify-uts-subset` 当时只 ban
`Object.fromEntries`/`Object.hasOwn`，未 ban keys/values/entries/prototype）。转译器只做类型层转换
（`Record<string,unknown>`→`UTSJSONObject`），表达式层 `Object.*` 原样透传 → 必须**源码层**修。

**已 recompile 实证的可用原语**（收口在 `shared/utils/object.ts`，全仓统一走）：
- 取键：`for (const k in obj)`（UTSJSONObject 支持 for-in；**key 变量类型是 `any`**，不是 string）。
  封装为 `objectKeys(x): string[]`（for-in + push）。取代 `Object.keys`。
- 判 key 存在（含值为 null 的 key，保 null vs absent 区分）：`objectKeys(x).includes(key)`。
  封装为 `hasOwn(x, key)`。**不要内联 for-in 后 `k === key`** —— for-in 的 `k` 是 any，
  `any === string` 触发 `String→NSNumber`。
- 判非数组对象：`isRecord(x)`（形参位 typeof）。取代 `Object.prototype.toString.call(x)==='[object Object]'`。
- `Object.values(x)` → `objectKeys(x).map((k) => asStringKeyed(x)[k])`。
- `Object.entries(x).forEach(([k,v])=>)` / `.reduce((acc,[k,v])=>)` →
  `objectKeys(x).forEach((k)=>{ const v = asStringKeyed(x)[k]; ... })` —— 顺带消除 UTS 不支持的**参数位数组解构** `[k,v]`。

**对象下标读写**：`UTSJSONObject`（含由 `Record<string,unknown>` 转译来的、或 `asStringKeyed(x)` 投出的）
下标 `obj[k]` 读写**可用**（cloneObject 实证）；但**泛型擦除后的 `any`**（如 `Partial<T>`/`T` 形参）
下标报 `value of type 'Any' has no subscripts`——须先 `asStringKeyed(x)`（或声明为 `Record<string,unknown>`）
再下标。**规则**：写对象下标前确认 receiver 是 UTSJSONObject 而非 any；是 any 就先 `asStringKeyed`。

> 没有 `UTSJSONObject` 的 ambient 声明，源码 TS **不能**写 `(x as UTSJSONObject).keys()/.toMap()`（tsc 过不了）；
> 故用 for-in（两端都合法）。`in` 运算符（`'k' in obj`）Swift 实测 `resolveInOperator` 失败，**勿用**。

## UTS boolean 字段的可空性在 protocol vs class 发散 —— 2026-06-13（iOS recompile #21 实证）

接口（→Swift protocol）里 `x: boolean | null` 编成**非可选** `var x: Bool { get set }`；
而类（→Swift class）里 `x: boolean | null = null` 编成**可选** `var x: Bool? = nil`。
二者放在「接口 + 实现」两侧 → `does not conform to protocol`（读生成 `index.swift` protocol:Bool vs class:Bool? 定性）。
而 `?: boolean`（可选 boolean 字段）在 class 编成非可选 `Bool = false`、在 protocol 编成 `Bool?`（lesson 见下文构造器节），
组合同样发散，且 `?: boolean`(=boolean|undefined) 与实现 `boolean|null` 在 **tsc** 下还 null↔undefined 不兼容。

**规则**：UTS 接口属性 + 实现属性若是 boolean，**两侧一律用非可选 `boolean` + 默认值**
（接口 `x: boolean`、实现 `x: boolean = false`），勿用 `?:` 或 `| null`。仅当确实需要三态（true/false/未知）
才考虑可空，且须接口/实现同形并 recompile 验。布尔标志位（"已安装"等）用 false 默认即可，不需要 null。

## UTS 条件编译（`#ifdef`/`#ifndef`/`#endif`）—— 2026-06-13（iOS recompile 实测）

源码里的条件编译指令是 `//` 注释，构建流水线**原样透传进 `.uts`**，由 HBuilderX 编译期处理。
两个只有真机 recompile 才暴露的坑：

1. **`#endif` 不能是「会被丢弃的 re-export」的前置注释**。
   `stripModuleBoundary` 铺平/丢弃 `export { X } from '...'`（re-export）时，会连同它的**前置注释**
   （包括紧贴其上的 `// #endif`）一起丢掉 → HBuilderX 报「缺少配对的 #endif」、条件编译失配。
   - **规则**：`#ifdef`/`#ifndef … #endif` 块要让 `#endif` 紧贴一个**存活声明**之前
     （`export function` / `export class` / `export const` / 普通语句），**不要**紧贴 `export {} ` re-export。

2. **注释 prose 里写 `#ifdef`/`#ifndef <TOKEN>`/`#endif` 字样会被预处理器当成真指令计数** → 失配。
   含 **backtick 包引号**（如 `` `import '...'` ``）会触发 `Unbalanced left delimiter`。
   - **规则**：进 bundle 的源码注释**绝不写** `#ifdef`/`#ifndef`/`#endif` 字样（尤其带平台 token 的），
     也不要在注释里写 backtick 包单/双引号。要描述就用「条件编译 / 闭合指令 / 非 iOS 端」等中性词。
   - 例外：token-less 的 `` `#ifdef` ``（只有关键字、无平台 token、且在 backtick 里）预处理器不计数，安全
     （如 globalScope.ts 旧注释）；但**新写一律避开**最稳。

## UTS 子类构造器 override —— 2026-06-13（iOS recompile 实测）

Swift 要求子类「覆写父类指定构造器」（同签名）时显式 `override init`。`RuntimeInstanceAppBase`
`constructor(platform){ super(platform) }` 覆写 `RuntimeInstanceBase` 同签名构造器 → Swift 报
"overriding declaration requires an 'override' keyword"。**两条 transpile 路都不通**（均经 recompile 实证）：

1. **加 `override constructor`** → UTS transform 阶段直接拒 `'override' modifier cannot appear on a constructor`。
2. **删纯转发子类构造器**（想让 Swift 继承父类 init）→ UTS 的构造器 override codegen 反而误判：它的行为是
   **「父类有显式构造器 → 子类构造器不加 override；父类无显式构造器 → 子类构造器加 override」**。删了 AppBase
   构造器后，其子类 `RuntimeInstanceIOS.constructor()` 被 UTS 加上 override，但 AppBase 已无 init() 可覆写 →
   新错 `initializer does not override a designated initializer`。

**结论：UTS 对构造器 override 的 codegen 有限制，transpile 层无干净解**。**别再试上面两条路。**

**已解（2026-06-13 第十次 recompile 实测，commit `fe932f4`）—— 错开中间类构造器签名**：
碰撞只发生在「父子两层**同签名**构造器」。给中间类 `RuntimeInstanceAppBase` 构造器加第二实参
（`constructor(platform: string, wirePlatform: string)`），使其签名 ≠ 父类 `(platform)` → Swift 不再判为
override（UTS 不发 override 也就对了）；Kotlin 侧仍是合法显式构造器（满足 §131）。叶子类
（IOS/Android/Harmony）`constructor()` 无参，签名本就 ≠ 中间类，不受影响。第二实参顺带收敛
wire-format 平台串（取代各叶子的 `override readonly wirePlatform` 字段）。**规则：UTS 多层继承链里，
若某层构造器需「与父类同签名转发」又因 Kotlin §131 不能删，就给它加一个有意义的额外形参错开签名，
即可同时满足 Swift（非 override）与 Kotlin（显式构造器）。**

> 连带：接口里「实现侧恒赋值」的属性别声明成可选——Swift 协议属性要求类型精确匹配，接口
> `wirePlatform?: string`（`String?`）vs 实现 `wirePlatform: string`（`String`）会触发
> `does not conform to protocol`。接口与实现的可选性必须一致（commit `1d7443d`，第十一次 recompile 待验）。

## UTS 注释 / 条件编译预处理（见上节）

> 验证手段：`pnpm build` 出的 `dist/uni_modules/.../utssdk/app-ios/index.uts` 里数
> `grep -cE "^\s*// #(ifdef|ifndef) [A-Z]"`（开）vs `grep -cE "^\s*// #endif\s*$"`（闭），须相等；
> 且 `grep -nE "#(ifdef|ifndef|endif)" | grep -v "real directive"` 确认无 prose 误写。
> 但**最终只有 HBuilderX recompile 能定性**（pnpm build 不跑 HBuilderX 预处理器）。
