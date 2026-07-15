# 无埋点处理逻辑：当前方案与之前方案对比

本文档说明 `gio-uniappx-autotracker` 当前无埋点实现的处理链路、与之前实现的差异，以及不同场景和平台下的优缺点。

## 1. 版本口径

为避免“之前”指向不同阶段，本文使用以下三种口径：

1. **早期方案**：主要通过正则识别模板事件；`<script setup>` 页面为每个事件生成一个 `_gioAutoTrackHandlerN`。
2. **中间统一分发方案**：改为单个 `_gioAutoTrackDispatch`，但通过 `event.currentTarget.dataset` 和 `event.type` 反查事件对应的 action。
3. **当前方案**：模板与表达式均使用 AST 分析；`<script setup>` 保留单个分发器，但模板直接把静态 action 作为函数参数传入。

## 2. 当前整体链路

```text
模板事件
  → Vite 编译期模板 AST 改写
  → script setup 模板表达式: _gioAutoTrackDispatch($event, action); 原业务表达式
  → plugin.uts: gioHandleAutoClick / gioHandleAutoChange
  → bridge/auto-track-event.uts: 构建稳定事件快照
  → GioEventAutoTrackingPlugin: 去重、忽略、脱敏、element 构建
  → VIEW_CLICK / VIEW_CHANGE
  → 在原模板上下文执行原业务表达式
```

Web 与其他平台遵循相同的采集边界：只有模板中声明了受支持事件的节点才会被编译期插桩并触发无埋点采集，不安装 `document` 级监听。

## 3. 主要差异对比

| 场景 | 之前 | 当前 | 当前优点 | 当前代价或边界 |
| --- | --- | --- | --- | --- |
| 模板识别 | 正则扫描事件属性和标签 | `@vue/compiler-dom` 模板 AST | 修饰符、单双引号、复杂属性和嵌套结构更可靠 | 增加编译期依赖 |
| 事件表达式 | 字符串匹配函数名并拼接 | Babel 表达式 AST | 可处理成员调用、条件表达式、连续语句、`$event` | 表达式无法解析时会明确报编译错误 |
| script setup 函数 | 每个绑定生成 `_gioAutoTrackHandlerN` | 每页一个 `_gioAutoTrackDispatch`；普通事件一个 action，三元表达式两个 action | 生成代码更少，并能按真实条件分支选择 handler | 大页面 action 分支按顺序判断，复杂度为 O(N) |
| action 定位 | 中间方案从 dataset 和事件 type 反查 | 模板直接传入数值 action | 不依赖 `currentTarget`、dataset、type | 模板生成表达式中会多一个 action 参数 |
| Ref / computed 条件 | 业务表达式移入脚本分发器后会失去模板自动解包 | 分发器只采集，原表达式留在模板 | 保留 Vue 的 Ref、computed 与模板作用域语义 | 模板事件属性会变成长一些的连续表达式 |
| 自定义组件事件 | dataset/type 不完整时可能找不到 action 并提前返回 | action 已确定，照常进入对应分支 | 业务 handler 不再被吞掉 | 自定义组件仍需自行保证其事件参数符合业务需求 |
| `$event` | 搬入脚本时需要把 `$event` 改成函数参数 | 原表达式留在模板，不再改写 `$event` | 字符串、对象 key、修饰符与模板事件语义保持不变 | 只处理可解析的静态事件表达式 |
| Options API | 内联桥接并注入 methods | 保持内联桥接，但事件与属性识别改为 AST | 保持 `methods` / `this` 语义 | 未使用统一分发器，生成形态与 setup 不同 |
| 双脚本 SFC | 可能把注入内容放到第一个普通 script | 优先选择 `<script setup>` | import 和分发器进入正确作用域 | 非标准、损坏的 SFC 仍应由编译器报错 |
| uni-link | 字符串方式补 click / data-src | AST 读取 href，缺 click 时补桥接 | 静态 href 与绑定 href 均可处理 | 内部 uni-link-x 组件会跳过，避免递归改写 |
| 未绑定节点 | 不采集 | 不采集 | 五端采集边界一致 | 需要在模板声明受支持事件 |
| 输入值与密码 | `data-growing-track` 时读取 detail/attr 值，password 脱敏 | 保留规则 | 五端输入采集口径一致 | 未标记 `data-growing-track` 的输入值仍不采集 |
| 去重和忽略 | 已有 | 不变 | 规则集中在统一插件层 | 所有入口都必须先转成快照 |
| tabBar | Web、MP、Harmony VDOM 有 `onTabItemTap` | 不变，且明确记录边界 | 不伪造不存在的框架事件 | Android、iOS、Harmony Vapor 没有等价 tab 点击采集 |

## 4. 各类模板事件的当前处理

### 4.1 点击类

以下事件会归类为 `VIEW_CLICK`：

- `click`
- `tap`
- `longpress`
- `longtap`
- `getuserinfo`
- `getphonenumber`
- `contact`

`<script setup>` 示例：

```vue
<view @tap="onTap($event, 'from-card')" />
```

编译后等价为：

```vue
<view
  @tap="_gioAutoTrackDispatch($event, 0); onTap($event, 'from-card')"
/>
```

脚本尾部追加单个分支：

```uts
function _gioAutoTrackDispatch(
  event : any | null,
  action : number,
  condition : boolean | null = null,
  alternateAction : number | null = null
) : boolean {
  const resolvedCondition : boolean = condition != null ? condition : true
  let selectedAction : number = action
  if (!resolvedCondition && alternateAction != null) {
    selectedAction = alternateAction as number
  }
  if (selectedAction == 0) {
    _gioHandleAutoClick(event, 'onTap', null, null, null, null, null, null)
    return resolvedCondition
  }
  return resolvedCondition
}
```

统一分发器只执行采集，业务表达式仍由模板编译器处理。两者在同一个事件表达式中按“先采集、后业务”的顺序执行，因此业务代码随后跳转时，点击事件仍会优先进入采集链路，同时不会破坏模板中的 Ref 自动解包。

### 4.2 变更类

以下事件会归类为 `VIEW_CHANGE`：

- `blur`
- `change`
- `confirm`

变更事件只有在 `data-growing-track` 为真时才会读取输入内容；`type="password"` 即使被标记采集，也不会写入 `textValue`。

读取优先级为：

1. `detail.value`
2. `target.attr.value`

### 4.3 uni-link

`uni-link` 没有显式 click 时，插件会补一个 click 采集入口；若业务未设置 `data-src`，会从静态或绑定 `href` 推导 `data-src`。`uni-link-x` 自身组件会被排除，避免内部 `openURL` 再被改写。

### 4.4 自定义组件

当前方案不再从事件对象中推断 action：

```vue
<tracking-card @click="onCardClick" />
```

会直接改写为：

```vue
<tracking-card @click="_gioAutoTrackDispatch($event, 0); onCardClick()" />
```

因此，即使组件通过 `emit` 传出的参数没有 `currentTarget`、dataset 或 type，仍会执行采集分支与 `onCardClick()`。

### 4.5 Ref / computed 条件表达式

条件表达式必须保留模板语义。例如：

```vue
<button @click="conditionEnabled ? onConditionalTrue() : onConditionalFalse()" />
```

其中 `conditionEnabled` 是 `ref(true)`。当前输出为：

```vue
<button
  @click="_gioAutoTrackDispatch($event, 0, conditionEnabled, 1) ? onConditionalTrue() : onConditionalFalse()"
/>
```

`conditionEnabled` 在模板上下文只求值一次并由 Vue 自动解包。分发器在 true 时选择 action 0、上报 `onConditionalTrue`，在 false 时选择 action 1、上报 `onConditionalFalse`，然后把同一个布尔值返回给业务三元表达式。这样业务分支和上报 xpath 使用完全相同的条件结果。

旧实现存在两层问题：第一层是把条件搬进普通 UTS 函数后，Ref 对象恒为真；第二层是即使业务表达式留在模板，若仍只有一个静态 action，xpath 也会固定为编译期找到的第一个 `onConditionalTrue`。当前两个问题都已消除。Options API 使用等价的条件桥接 method，同样根据一次条件求值选择真实 handler 名。

## 5. 事件快照与统一插件处理

`plugin.uts` 将模板事件转成稳定快照；`bridge/auto-track-event.uts` 统一收集：

- action：`CLICK` 或 `CHANGE`
- eventName
- currentTarget / target
- id、dataset、type、attr、detail
- 静态 id、index、title、src、growingTrack、growingIgnore 回填

随后 `GioEventAutoTrackingPlugin` 处理：

| 规则 | 行为 |
| --- | --- |
| 插件未注册 | 直接拒绝快照，不上报 |
| `dataCollect = false` | tracker 不入队 |
| `data-growing-ignore` | 忽略当前事件 |
| autoplay 且未显式 track | 忽略当前事件 |
| 同类型事件间隔小于 10ms | 视为重复事件 |
| `data-index` | 校验范围必须大于 0、小于 2147483647 |
| password | 永不写入变更内容 |

## 6. 平台差异

| 平台 | 模板 AST 插桩 | 未绑定节点采集 | tabBar 自动采集 | 备注 |
| --- | --- | --- | --- | --- |
| Web | 是 | 否 | 是 | 与其他平台一样，仅采集已绑定的受支持事件 |
| Android | 是 | 否 | 否 | 依赖模板事件和原生事件快照 |
| iOS | 是 | 否 | 否 | 依赖模板事件和桥接快照，不能依赖 Web DOM API |
| Harmony VDOM | 是 | 否 | 是 | 支持页面 `onTabItemTap` |
| Harmony Vapor | 是 | 否 | 否 | 框架不挂载等价 tabBar hook |
| 微信小程序 | 是 | 否 | 是 | 事件 target/currentTarget 的 dataset 可用于运行时快照 |

## 7. 对移动端的具体影响

### 7.1 影响范围与结论

当前改造的主体是**编译期插桩方式**。Web、Android、iOS、Harmony 和微信小程序都只采集可由模板事件到达的节点，不提供未绑定节点的全局兜底采集。

对移动端而言，最重要的变化是：事件在编译期就已被归类为 `CLICK` 或 `CHANGE`，运行时不再依赖 `event.currentTarget.dataset` 与 `event.type` 推断应走哪个采集分支。原业务表达式仍在采集调用之后执行。

| 维度 | 早期 / 中间方案 | 当前 AST 方案 | 对移动端的实际影响 |
| --- | --- | --- | --- |
| 编译时开销 | 正则扫描，或生成多个独立 handler | 解析模板与表达式 AST | 构建期略增加解析工作；不在点击热路径执行 |
| 生成代码 | setup 页面可生成多个 `_gioAutoTrackHandlerN` | 每页单个 dispatcher 和多个 action 分支 | 减少函数数量与重复签名；超大页面仍会线性匹配 action |
| 点击运行时定位 | 依赖 `currentTarget`、dataset、`event.type` | 数值 action 作为绑定参数直接传入 | 自定义组件、包装组件的事件形态不完整时更稳定 |
| 事件快照 | 从原始宿主事件中读取字段 | 保持快照桥接，只改 action 的来源 | Android / iOS / Harmony 仍不会把页面、组件或原生句柄传进 `utssdk` |
| 未绑定节点 | 无 | 无 | 未声明支持事件的节点不会自动采集 |
| 业务行为 | 业务表达式可能被搬入脚本函数 | 先采集，再在原模板上下文执行表达式 | Ref / computed 自动解包和模板作用域保持；依赖自动注入 `$event` 的纯方法引用仍建议显式写出 `$event` |

### 7.2 Android

| 项目 | 影响 |
| --- | --- |
| 采集覆盖 | 仅模板中已支持的静态事件名；没有 DOM 全局监听。`click`、`tap`、`longpress`、`change` 等由模板插桩进入桥接。 |
| 稳定性收益 | 原生事件对象的字段形态可能因组件不同而变化。当前 action 直接传入，避免因 `currentTarget`、dataset 或 `type` 缺失而无法决定 click/change 分支。 |
| 快照边界 | `bridge/utils.uts` 在 Android 对动态字段使用序列化后的安全读取，随后只把纯 `UTSJSONObject` 快照传给 `utssdk`；不会把页面或原生事件实例跨层传递。 |
| 性能 | AST 只影响编译期；运行时每次已插桩事件仍会创建快照、执行去重和忽略规则，这部分与原有采集模型相同。单 dispatcher 用 action 顺序判断，页面内绑定极多时存在很小的线性分支成本。 |
| 仍需关注 | Android 没有框架等价的 tabBar 点击 hook，因此 tabBar 点击不属于本次无埋点覆盖范围；必须在真机/模拟器验证各组件事件的快照字段。 |

### 7.3 iOS

| 项目 | 影响 |
| --- | --- |
| 采集覆盖 | 与 Android 相同：由模板插桩提供事件入口，不提供未绑定节点的全局事件兜底，也不应调用 `document` 等 Web API。 |
| 稳定性收益 | 直接 action 分发减少了对 iOS 事件对象内部字段的假设。原始事件会在 JS 桥接层被裁剪为快照，再进入 Swift 编译层，降低把 `Optional`、页面实例或原生对象带入核心层的风险。 |
| UTS 约束 | 本次目录收拢不改变 iOS 平台入口；`app-ios/index.uts` 仍应保持纯 re-export，不能为无埋点注册加入文件顶层表达式。 |
| 性能 | 不再为每个绑定生成一个独立 handler，生成的页面函数数量更可控；实际 Swift 产物大小、首屏和点击耗时仍需要真实 iOS 编译与设备侧测量确认。 |
| 仍需关注 | iOS 不能以源码结构推断可用性。需验证 input 的 `detail.value` / `attr.value`、自定义组件 emit、页面跳转前采集以及后台切换等真实事件链路。 |

### 7.4 Harmony（VDOM 与 Vapor）

| 项目 | 影响 |
| --- | --- |
| 采集覆盖 | 两种渲染模式都依赖模板静态事件插桩；均不提供未绑定节点的全局事件兜底。 |
| 稳定性收益 | Harmony 对动态对象和 `any` 的约束更严格。action 不再靠运行时 dataset/type 反查，减少了需要从宿主事件动态读取字段的步骤；桥接层仍负责将其余字段规范化。 |
| tabBar | VDOM 支持页面 `onTabItemTap`，可采集 tabBar；Vapor 没有等价 hook，不能承诺 tab 点击自动采集。 |
| 编译风险 | ArkTS 对动态字段、可空值及类型断言更严格。虽然此次主要是目录移动和模板输出形态调整，仍必须以 Harmony 真编译确认 import、条件编译分支与生成代码。 |
| 仍需关注 | 自定义组件事件、`change` 的输入值、VDOM/Vapor 的 tabBar 差异都应分别回归，不能用另一种渲染模式替代验证。 |

### 7.5 微信小程序

| 项目 | 影响 |
| --- | --- |
| 采集覆盖 | 继续由模板事件插桩采集，不增加全局事件监听。小程序 `target/currentTarget.dataset` 仍用于补充快照，而非确定 action。 |
| 稳定性收益 | 旧的 dataset/type 反查失败时可能跳过目标采集分支；当前 action 已由模板写死，自定义组件 `emit` 的事件对象不完整也不会影响 click/change 的分类。 |
| tabBar | 保留 `onTabItemTap` 自动采集能力。 |
| 数据语义 | `data-index`、`data-src`、`data-growing-track` 与 `data-growing-ignore` 仍会被读取并进入统一插件规则；password 仍绝不写入变更内容。 |
| 仍需关注 | 小程序宿主对象不是真正的 `UTSJSONObject`，读取必须留在小程序/桥接适配范围内，不能把这类读取方式下沉进 `utssdk/common`。 |

### 7.6 移动端场景矩阵

| 场景 | Android / iOS | Harmony VDOM | Harmony Vapor | 微信小程序 | 当前处理与影响 |
| --- | --- | --- | --- | --- | --- |
| 普通静态 `@tap` / `@click` | 支持 | 支持 | 支持 | 支持 | 模板 AST 写入固定 action；事件字段不完整也能归类为 CLICK。 |
| `@change` / `@blur` / `@confirm` | 支持 | 支持 | 支持 | 支持 | 固定 action 归类为 CHANGE；仅 `data-growing-track` 时采集值，password 脱敏。 |
| 自定义组件 `emit('click')` | 支持 | 支持 | 支持 | 支持 | 不再依赖 emit 参数存在 dataset/type；原业务 handler 仍需自己适配参数。 |
| Ref / computed 条件表达式 | 支持 | 支持 | 支持 | 支持 | 条件只求值一次；true/false 分别映射独立 action，业务分支和上报 handler/xpath 保持一致。 |
| `uni-link` | 支持 | 支持 | 支持 | 支持 | AST 补充 click 和静态 href 推导；跳过内部 `uni-link-x`。 |
| 动态事件名 `v-on:[name]` | 不支持自动插桩 | 不支持自动插桩 | 不支持自动插桩 | 不支持自动插桩 | 编译期无法可靠决定 CLICK/CHANGE；需显式使用已支持的静态事件。 |
| 无模板事件的原生节点 | 不支持 | 不支持 | 不支持 | 不支持 | 未声明受支持事件时不会触发无埋点采集。 |
| tabBar 点击 | 不支持 | 支持 | 不支持 | 支持 | 由框架是否提供 `onTabItemTap` 决定，与 AST 插桩无关。 |

### 7.7 跨端成本与后续优化点

1. 单 dispatcher 显著减少了生成函数数量，但 action 用顺序 `if` 匹配；一个三元表达式会占用两个 action。一般页面影响可忽略；若存在数百个事件绑定的页面，可评估生成 `switch` 或按 action 直接索引的结构，前提是保持 UTS 五端生成代码兼容。
2. AST 插桩提升的是“已声明模板事件”的可靠性，不等同于原生端全量无埋点。若要覆盖无事件绑定的可点击节点，需要另行定义跨端能力和数据契约。
3. 所有平台结论都需要以 HBuilderX 的真实编译和设备、模拟器或浏览器交互为准；Vite 回归测试只能证明转换结果，不证明运行时事件形态。

## 8. 当前限制与使用建议

1. 只有静态事件名会被模板插桩；`v-on:[eventName]` 无法在编译期可靠分类。
2. 只有已支持的点击类和变更类事件会生成模板桥接；未知事件不会被强行改写。
3. 纯方法引用如 `@click="onTap"` 会生成 `onTap()`。如果业务依赖框架自动传事件，应显式写为 `@click="onTap($event)"`。
4. Android、iOS、Harmony、小程序和 Web 的最终可信结论仍需要真实 HBuilderX 编译和设备、模拟器或浏览器交互验证；源码与 Vite 回归测试不能替代真实平台验证。

## 9. 相关实现

- `uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs`
- `uni_modules/gio-uniappx-autotracker/plugin.uts`
- `uni_modules/gio-uniappx-autotracker/bridge/auto-track-event.uts`
- `uni_modules/gio-uniappx-autotracker/bridge/utils.uts`
- `uni_modules/gio-uniappx-autotracker/utssdk/common/plugins/gio-event-autotracking.uts`
