# gio-uniappx-autotracker

GrowingIO uni-app x Autotracker Lite 是一个以 `uni_modules` 形态交付的轻量 SDK，面向 uni-app x 工程提供自动访问采集、页面采集、自定义事件、用户身份、ABTest 和微信小程序分享采集能力。HarmonyOS App 为正式支持平台。

运行要求：使用 HBuilderX / uni-app x `5.08` 或更高版本打开和编译业务工程。发布包只包含本目录 `uni_modules/gio-uniappx-autotracker`，不包含仓库根目录 demo 及其 `uni-link-x` / `uts-openSchema` 示例依赖；手工复制并启用无埋点时，还需按[集成与初始化配置](./docs/integration.md)安装 SDK 的 Vite 插件依赖。

SDK 覆盖以下平台：

- `web`
- `app-android`
- `app-ios`
- `app-harmony`
- `mp-weixin`

HarmonyOS App 使用 SDK 内置的 `utssdk/app-harmony` 原生入口；请完整复制插件目录，并在目标工程中使用 HBuilderX 重新编译后完成真实上报验证。无埋点的通用能力可用，tabBar 点击采集仅在 Harmony VDOM 下可用，Harmony Vapor 没有等价的框架 hook。详见[无埋点](./docs/event-autotracking.md)。

## 文档目录

- [SDK 使用指南](./docs/README.md)
- [集成与初始化配置](./docs/integration.md)
- [数据采集 API](./docs/apis.md)
- [无埋点](./docs/event-autotracking.md)
- [ABTest](./docs/abtest.md)
- [功能插件](./docs/plugins.md)

## 快速开始

把整个插件目录放入业务工程：

```text
uni_modules/gio-uniappx-autotracker
```

在 `main.uts` 创建 Vue app 后初始化 SDK：

```uts
import { createSSRApp } from 'vue'
import App from './App.uvue'
import { gdp } from '@/uni_modules/gio-uniappx-autotracker/gdp.uts'

export function createApp() {
  const app = createSSRApp(App)

  gdp('init', {
    app: app,
    projectId: 'YOUR_PROJECT_ID',
    dataSourceId: 'YOUR_DATA_SOURCE_ID',
    appId: 'YOUR_APP_ID',
    serverUrl: 'https://napi.growingio.com',
    appVersion: '1.0.0',
    dataCollect: true,
    debug: false,
    forceLogin: false,
    idMapping: false
  })

  return { app }
}
```

然后按需调用公开 API：

```uts
gdp('track', 'buy_click', {
  product_id: 'sku-1001',
  price: 99
} as UTSJSONObject)

gdp('setUserId', 'user-1001')
```

无埋点点击/变更采集需要完成 Vite 配置并注册 `gioEventAutoTracking`，详见 [无埋点](./docs/event-autotracking.md)。

完整配置项、API 参数和插件用法见上方文档目录。
