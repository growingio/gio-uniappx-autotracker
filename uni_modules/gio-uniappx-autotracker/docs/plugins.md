# 功能插件

SDK 的插件能力需要通过 `registerPlugins` 显式启用。

注册时机：`gdp('init', options)` 成功后、业务 API 调用前。

```uts
gdp('registerPlugins', [
  {
    name: 'gioABTest',
    options: {
      abServerUrl: 'https://ab.growingio.com'
    } as UTSJSONObject
  }
] as Array<UTSJSONObject>)
```

`registerPlugins` 会忽略没有 `name` 的插件项。至少成功启用一个可用插件时返回 `true`。

## gioEventAutoTracking

`gioEventAutoTracking` 用于采集页面模板中已绑定的点击和变更事件，并上报 `VIEW_CLICK` / `VIEW_CHANGE`。

适用平台：Web、Android App、iOS App、Harmony App、微信小程序。

### 编译期接入

无埋点事件依赖编译期改写模板事件绑定。业务工程需要在根目录 `vite.config.js` 显式接入：

```ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { gioUniappxAutoTrack } from './uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs'

export default defineConfig({
  plugins: [
    gioUniappxAutoTrack(),
    uni(),
  ],
})
```

对于 `<script setup lang="uts">` 页面，插件会基于模板 AST 改写事件绑定，并只在页面中追加一个显式类型的 `_gioAutoTrackDispatch`。每个模板绑定把自己的静态 action 作为函数参数传入，因此不会依赖 `event.type`、`currentTarget` 或 `dataset` 来反查分支；自定义组件事件和不完整事件对象也不会吞掉原业务表达式。不会按每个事件绑定生成额外 UTS 函数，原有业务函数仍保留在源代码位置，避免触发 UTS 的函数声明顺序问题。

变更类事件在模板中统一透传原始 `$event`，不会直接展开 `$event.detail.value`。桥接层再按组件事件类型读取标量或数组值，因此 `checkbox-group`、`picker-view` 以及没有 `detail.value` 的 `swiper` 都不会因为模板插桩本身导致 UTS 编译失败。

模板上的 `id`、`data-index`、`data-title`、`data-src`、`data-growing-track`、`data-growing-ignore` 会在事件触发时直接求值并传入桥接层，包含 `v-for` 内的动态绑定。事件对象若已携带对应值则以事件对象为准；Android `list-item` 等事件对象缺少动态属性时，使用模板实参补齐。

Web 与其他平台遵循相同的采集边界：只有模板中声明了受支持事件的节点才会被编译期插桩并触发无埋点采集。SDK 不安装 `document` 级监听，也不会采集未绑定事件的页面容器或普通节点。

### 注册插件

```uts
gdp('registerPlugins', [
  {
    name: 'gioEventAutoTracking'
  }
] as Array<UTSJSONObject>)
```

第一版不支持插件 options。插件未注册时，编译期插入的桥接函数会直接返回，不产生 `VIEW_CLICK` / `VIEW_CHANGE`。

### 字段规则

点击事件上报 `VIEW_CLICK`，变更事件上报 `VIEW_CHANGE`。SDK 内部按小程序独立 SDK 先组装 `element`，最终上报时会把首个 `element` 内的字段平铺到事件顶层：

| 字段 | 来源 |
| --- | --- |
| `xpath` | `id#handlerName` |
| `index` | `data-index`，必须是大于 `0` 且小于 `2147483647` 的整数 |
| `textValue` | 点击事件读取 `data-title`；变更事件仅在 `data-growing-track` 为真时优先读取 `detail.value`、缺失时回退 `target.attr.value`，数组值序列化为 JSON 字符串，合法的 `0` / `false` 会保留；没有 value 的 change 事件不写入；标记了 `data-growing-track` 的 `type="password"` 输入框强制不采集输入内容 |
| `hyperlink` | `data-src`，最多保留前 320 个字符 |

变更事件是否上报不受输入类型影响，仍按统一的 change 触发和忽略规则执行。唯一的 password 特殊逻辑是：标记了 `data-growing-track` 的 `type="password"` 输入框即使触发 `VIEW_CHANGE`，也不会写入 `textValue`。

根目录 demo 的 `pages/autotrack/autotrack` 是统一的无埋点回归页，覆盖基础组件 click/tap/longpress、方法引用、input/textarea/switch/slider/radio-group/picker 标量值、checkbox-group/picker-view 数组值、swiper 非 value 型 change，以及 list-view、image、navigator 等组件场景。由于 picker 的 Android/iOS 支持从 5.08 开始，根 demo 的 engines 以 HBuilderX / uni-app x 5.08 为最低版本；该示例页不随 SDK 发布包分发，因此不改变 SDK 包自身的最低版本。

tabBar 点击仅在 Web、微信小程序、HarmonyOS VDOM 挂载页面 `onTabItemTap` hook 并上报 `VIEW_CLICK`；Android、iOS、HarmonyOS Vapor 当前框架不提供等价 hook，因此 SDK 不会伪造 tab 点击事件。事件字段中 `xpath` 固定为 `#onTabItemTap`，`textValue` 取 tab 文案，`index` 取 tab 下标加一，`hyperlink` 取 `pagePath`。

忽略规则：

- `data-growing-ignore` 为真时忽略当前事件。
- `detail.source == 'autoplay'` 且没有 `data-growing-track` 时忽略当前事件。
- 同类型事件 `timeStamp` 间隔小于 `10ms` 时按重复触发忽略。

仅支持 `growingTrack` / `data-growing-track`，不支持 `growingtrack` 小写变体。

## gioABTest

`gioABTest` 用于获取指定实验层的变量结果。

### 注册插件

```uts
gdp('registerPlugins', [
  {
    name: 'gioABTest',
    options: {
      abServerUrl: 'https://ab.growingio.com',
      requestInterval: 5,
      requestTimeout: 1000
    } as UTSJSONObject
  }
] as Array<UTSJSONObject>)
```

配置项：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `abServerUrl` | `string \| null` | `https://ab.growingio.com` | ABTest 服务地址。 |
| `requestInterval` | `number \| null` | `5` | 同一实验层请求间隔，单位为分钟。允许范围 `0` 到 `1440`。 |
| `requestTimeout` | `number \| null` | `1000` | 请求超时时间，单位为毫秒。允许范围 `100` 到 `5000`。 |

### 获取实验结果

```uts
gdp('getABTest', 'layer-1001', (result : any) => {
  const raw = result as UTSJSONObject
  const variables = raw.getJSON('variables')
  const buttonColor = variables != null
    ? variables.getString('buttonColor', 'blue')
    : 'blue'
  console.log('buttonColor', buttonColor)
})
```

返回结果字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `layerId` | `string` | 实验层 ID。 |
| `strategyId` | `string` | 策略 ID。 |
| `experimentId` | `string` | 实验 ID。 |
| `layerName` | `string \| null` | 实验层名称。 |
| `experimentName` | `string \| null` | 实验名称。 |
| `strategyName` | `string \| null` | 策略名称。 |
| `variables` | `UTSJSONObject \| null` | 实验变量。 |

注意：

- 调用 `getABTest` 前必须先注册 `gioABTest`。
- `layerId` 不能为空；数字类型不能小于等于 `0`。
- SDK 会缓存实验结果和请求标记；请求间隔内会优先返回缓存结果。
- 请求失败或参数不合法时，回调会收到空对象。

## gioShareTracking

`gioShareTracking` 用于微信小程序分享、朋友圈和收藏采集。

适用平台：微信小程序。

不适用平台：Web、Android App、iOS App。

### 注册插件

```uts
gdp('registerPlugins', [
  {
    name: 'gioShareTracking'
  }
] as Array<UTSJSONObject>)
```

插件启用后，SDK 会采集以下系统事件：

| 微信生命周期 | 事件名 |
| --- | --- |
| `onShareAppMessage` | `$mp_on_share` |
| `onShareTimeline` | `$mp_share_timeline` |
| `onAddToFavorites` | `$mp_add_favorites` |

事件属性包括分享标题、分享路径、分享查询参数、分享来源和目标等字段。SDK 会优先读取业务分享 handler 返回值，取不到时回退到当前页面上下文。

### 自动包装

插件安装后，SDK 会自动包装业务页面已经声明的分享相关 hook：

```uts
export default {
  onShareAppMessage(options : any | null) : any | null {
    return {
      title: '分享标题',
      path: '/pages/index/index?from=share'
    } as UTSJSONObject
  }
}
```

SDK 不会给未声明分享能力的页面强行补 hook，避免让页面意外出现转发入口。

## 同时注册多个插件

```uts
gdp('registerPlugins', [
  {
    name: 'gioShareTracking'
  },
  {
    name: 'gioABTest',
    options: {
      abServerUrl: 'https://ab.growingio.com'
    } as UTSJSONObject
  }
] as Array<UTSJSONObject>)
```

注册时机：初始化之后、业务 API 调用之前。
