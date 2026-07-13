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
  → script setup: _gioAutoTrackDispatch($event, action)
  → plugin.uts: gioHandleAutoClick / gioHandleAutoChange
  → auto-track-bridge.uts: 构建稳定事件快照
  → GioEventAutoTrackingPlugin: 去重、忽略、脱敏、element 构建
  → VIEW_CLICK / VIEW_CHANGE
  → 执行原业务表达式
```

Web 端在上述模板桥接之外，还安装 `document` 级的 `click` / `change` 监听，用于采集未声明模板事件的普通 DOM 节点。已被模板插桩的节点会带 `data-gio-auto-track-bound="true"`，Web 全局监听会跳过它们，避免重复上报。

## 3. 主要差异对比

| 场景 | 之前 | 当前 | 当前优点 | 当前代价或边界 |
| --- | --- | --- | --- | --- |
| 模板识别 | 正则扫描事件属性和标签 | `@vue/compiler-dom` 模板 AST | 修饰符、单双引号、复杂属性和嵌套结构更可靠 | 增加编译期依赖 |
| 事件表达式 | 字符串匹配函数名并拼接 | Babel 表达式 AST | 可处理成员调用、条件表达式、连续语句、`$event` | 表达式无法解析时会明确报编译错误 |
| script setup 函数 | 每个绑定生成 `_gioAutoTrackHandlerN` | 每页一个 `_gioAutoTrackDispatch(event, action)` | 生成代码更少，避免 N 个 UTS 函数 | 大页面 action 分支按顺序判断，复杂度为 O(N) |
| action 定位 | 中间方案从 dataset 和事件 type 反查 | 模板直接传入数值 action | 不依赖 `currentTarget`、dataset、type | 模板生成表达式中会多一个 action 参数 |
| 自定义组件事件 | dataset/type 不完整时可能找不到 action 并提前返回 | action 已确定，照常进入对应分支 | 业务 handler 不再被吞掉 | 自定义组件仍需自行保证其事件参数符合业务需求 |
| `$event` 改写 | 字符串替换存在伤及字符串/属性名风险 | 按 AST 标识符位置改写 | 保留 `'$event'` 字符串和对象 key | 只处理可解析的静态事件表达式 |
| Options API | 内联桥接并注入 methods | 保持内联桥接，但事件与属性识别改为 AST | 保持 `methods` / `this` 语义 | 未使用统一分发器，生成形态与 setup 不同 |
| 双脚本 SFC | 可能把注入内容放到第一个普通 script | 优先选择 `<script setup>` | import 和分发器进入正确作用域 | 非标准、损坏的 SFC 仍应由编译器报错 |
| uni-link | 字符串方式补 click / data-src | AST 读取 href，缺 click 时补桥接 | 静态 href 与绑定 href 均可处理 | 内部 uni-link-x 组件会跳过，避免递归改写 |
| Web 未绑定节点 | 只有显式模板事件可采集 | document click/change 回退采集 | 普通 DOM 节点也可采集 | 仅 Web 有该能力 |
| Web 重复采集 | 无全局监听时无此问题 | 插桩节点加内部 data 标记，document 监听跳过 | 模板事件与 DOM 监听不会双发 | `data-gio-auto-track-bound` 成为保留属性 |
| Web 点击元数据 | 主要来自模板静态 data-* | DOM 回退会读取目标 id、文本及祖先链接 | 未绑定节点具备基本 element 信息 | xpath 仍采用当前 SDK 的 `id#eventName` 模型，不是完整 CSS/DOM xpath |
| 输入值与密码 | `data-growing-track` 时读取 detail/attr 值，password 脱敏 | 保留规则，并补 Web DOM 的 `value/type` 回退 | Web 原生 input 采集更完整 | 未标记 `data-growing-track` 的输入值仍不采集 |
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
<view @tap="_gioAutoTrackDispatch($event, 0)" data-gio-auto-track-bound="true" />
```

脚本尾部追加单个分支：

```uts
function _gioAutoTrackDispatch(event : any | null, action : number) : void {
  if (action == 0) {
    _gioHandleAutoClick(event, 'onTap', null, null, null, null, null, null)
    onTap(event, 'from-card')
    return
  }
}
```

采集发生在业务表达式之前。这样即使业务代码随后发生跳转，点击事件也能优先进入采集链路。

### 4.2 变更类

以下事件会归类为 `VIEW_CHANGE`：

- `blur`
- `change`
- `confirm`

变更事件只有在 `data-growing-track` 为真时才会读取输入内容；`type="password"` 即使被标记采集，也不会写入 `textValue`。

读取优先级为：

1. `detail.value`
2. `target.attr.value`
3. Web DOM target 的直接 `value` 回退

### 4.3 uni-link

`uni-link` 没有显式 click 时，插件会补一个 click 采集入口；若业务未设置 `data-src`，会从静态或绑定 `href` 推导 `data-src`。`uni-link-x` 自身组件会被排除，避免内部 `openURL` 再被改写。

### 4.4 自定义组件

当前方案不再从事件对象中推断 action：

```vue
<tracking-card @click="onCardClick" />
```

会直接改写为：

```vue
<tracking-card @click="_gioAutoTrackDispatch($event, 0)" />
```

因此，即使组件通过 `emit` 传出的参数没有 `currentTarget`、dataset 或 type，仍会执行采集分支与 `onCardClick()`。

## 5. 事件快照与统一插件处理

`plugin.uts` 将模板或 Web DOM 事件转成稳定快照；`auto-track-bridge.uts` 统一收集：

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

| 平台 | 模板 AST 插桩 | Web 全局 DOM 回退 | tabBar 自动采集 | 备注 |
| --- | --- | --- | --- | --- |
| Web | 是 | 是 | 是 | 模板节点会通过内部标记避免与 document 监听双发 |
| Android | 是 | 否 | 否 | 依赖模板事件和原生事件快照 |
| iOS | 是 | 否 | 否 | 依赖模板事件和桥接快照，不能依赖 Web DOM API |
| Harmony VDOM | 是 | 否 | 是 | 支持页面 `onTabItemTap` |
| Harmony Vapor | 是 | 否 | 否 | 框架不挂载等价 tabBar hook |
| 微信小程序 | 是 | 否 | 是 | 事件 target/currentTarget 的 dataset 可用于运行时快照 |

## 7. 当前限制与使用建议

1. 只有静态事件名会被模板插桩；`v-on:[eventName]` 无法在编译期可靠分类。
2. 只有已支持的点击类和变更类事件会生成模板桥接；未知事件不会被强行改写。
3. 纯方法引用如 `@click="onTap"` 会生成 `onTap()`。如果业务依赖框架自动传事件，应显式写为 `@click="onTap($event)"`。
4. Web 全局 fallback 用于扩大覆盖面，但不等同于独立 `gio-web-autotracker` 的完整 DOM xpath / 节点内容采集模型。
5. `data-gio-auto-track-bound` 是内部保留属性，业务页面不得手工设置。
6. Android、iOS、Harmony、小程序的最终可信结论仍需要真实 HBuilderX 编译和设备/模拟器交互验证；源码与 Vite 回归测试不能替代真实平台验证。

## 8. 相关实现

- `uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs`
- `uni_modules/gio-uniappx-autotracker/plugin.uts`
- `uni_modules/gio-uniappx-autotracker/auto-track-bridge.uts`
- `uni_modules/gio-uniappx-autotracker/utssdk/common/plugins/gio-event-autotracking.uts`
