# gio-uniappx-autotracker

GrowingIO uni-app x Autotracker Lite 是一个以 `uni_modules` 形态交付的轻量 SDK，面向 uni-app x 工程提供自动访问采集、页面采集、自定义事件、用户身份、ABTest 和微信小程序分享采集能力。

SDK 覆盖以下平台：

- `web`
- `app-android`
- `app-ios`
- `mp-weixin`

## 文档目录

- [SDK 使用指南](./docs/README.md)
- [集成与初始化配置](./docs/integration.md)
- [数据采集 API](./docs/apis.md)
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

无埋点点击/变更采集需要同时接入 `build/vite-plugin.mjs` 并注册 `gioEventAutoTracking`，详见 [功能插件](./docs/plugins.md)。

完整配置项、API 参数和插件用法见上方文档目录。
