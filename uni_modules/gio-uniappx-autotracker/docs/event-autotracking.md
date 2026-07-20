# 无埋点

`gioEventAutoTracking` 用于采集页面中已绑定的点击和变更事件，并上报 `VIEW_CLICK` 或 `VIEW_CHANGE`。未绑定受支持事件的节点不会被采集。

适用平台：Web、Android App、iOS App、Harmony App、微信小程序。

## 接入

业务工程需要在根目录 `vite.config.js` 显式配置无埋点插件，且应排在 `uni()` 前：

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

初始化成功后注册插件：

```uts
gdp('registerPlugins', [
  {
    name: 'gioEventAutoTracking'
  }
] as Array<UTSJSONObject>)
```

插件没有配置项。未注册时，不会产生无埋点事件。

## 采集范围

| 模板事件 | 上报事件 |
| --- | --- |
| `click`、`tap`、`longpress`、`longtap`、`getuserinfo`、`getphonenumber`、`contact` | `VIEW_CLICK` |
| `blur`、`change`、`confirm` | `VIEW_CHANGE` |

## 采集标记

以下标记必须写在绑定受支持事件的节点上：

```vue
<navigator
  url="/pages/order/detail?id=1001"
  data-title="订单详情"
  data-index="1"
  data-src="/pages/order/detail?id=1001"
  @tap="openOrder"
/>

<switch data-growing-track @change="onEnabledChange" />

<view data-growing-ignore @tap="openInternalPanel">内部入口</view>
```

| 标记 | 作用 |
| --- | --- |
| `id` | 用于标识采集元素。 |
| `data-title` | 点击事件的 `textValue`；变更事件没有可采集组件值时作为 `textValue` 兜底。 |
| `data-index` | 列表或重复节点索引；必须是大于 `0`、小于 `2147483647` 的整数。 |
| `data-src` | 点击目标地址，写入 `hyperlink`，最多保留前 320 个字符。 |
| `data-growing-track` | 允许变更事件写入值；支持动态绑定。 |
| `data-growing-ignore` | 忽略当前节点触发的无埋点事件；支持动态绑定。 |

`uni-link` 支持自动采集点击事件；未设置 `data-src` 时，会使用 `href` 作为跳转地址。

## 变更值与隐私

`VIEW_CHANGE` 会在绑定的变更事件触发时采集；只有节点标记了 `data-growing-track` 时，SDK 才会上报组件当前值。

- `input`、`textarea`、`switch`、`slider`、`radio-group` 和 `picker` 支持采集当前值；`picker` 优先上报当前选项文案。
- `checkbox-group`、`picker-view` 支持采集当前选择；`picker-view` 会优先上报选项文案。
- `swiper` 等没有可采集值的组件仍会上报 `VIEW_CHANGE`；如果标记了 `data-title`，会把标记值写入 `textValue`。
- 标记 `data-growing-track` 的 `type="password"` 输入框也绝不会上报输入内容。
- 自动播放触发的变更事件默认忽略；明确标记 `data-growing-track` 时才采集。

## 去重与平台边界

短时间内重复触发的同类事件会自动去重。

tabBar 点击在 Web、微信小程序和 Harmony VDOM 中支持采集。Android、iOS 和 Harmony Vapor 暂不支持 tabBar 点击采集。

无埋点的标记语义参考 [GrowingIO 小程序无埋点文档](https://growingio.github.io/growingio-sdk-docs/docs/miniprogram/plugins/eventAutoTracking)，平台范围和事件边界以本页为准。
