# GrowingIO uni-app x SDK 使用指南

本文档面向 SDK 使用者，介绍 `gio-uniappx-autotracker` 在 uni-app x 工程中的集成方式、初始化配置、常用 API 和功能插件。

## 简介

`gio-uniappx-autotracker` 以 `uni_modules` 插件形式交付，不需要业务工程额外构建 SDK。集成后，SDK 会自动采集访问、页面和应用退后台等基础事件，并提供 `gdp(...)` API 用于自定义事件、用户身份、配置和插件能力。

覆盖平台：

| 平台 | 状态 |
| --- | --- |
| Web | 可用 |
| Android App | 可用 |
| iOS App | 可用 |
| 微信小程序 | 可用 |

## 文档导航

| 文档 | 说明 |
| --- | --- |
| [集成与初始化配置](./integration.md) | 安装目录、入口初始化、初始化配置项、基础验证 |
| [数据采集 API](./apis.md) | `track`、用户身份、用户属性、动态开关、地理位置 |
| [无埋点](./event-autotracking.md) | `gioEventAutoTracking` 的接入、标记和采集边界 |
| [ABTest](./abtest.md) | `gioABTest` 的注册、变量读取和缓存行为 |
| [功能插件总览](./plugins.md) | 全部插件及微信小程序分享采集 |

## 最小接入示例

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

## 公开能力一览

```uts
gdp('init', options)
gdp('track', eventName, properties)
gdp('setUserId', userId)
gdp('setUserId', userId, userKey)
gdp('clearUserId')
gdp('identify', assignmentId)
gdp('setUserAttributes', attributes)
gdp('setOptions', options)
gdp('setLocation', latitude, longitude)
gdp('clearLocation')
gdp('registerPlugins', plugins)
gdp('getABTest', layerId, callback)
```

## 身份一致性

- Web 每次构建事件时都会重新读取存储中的 `userId` 和 `userKey`，以感知同域其他标签页或 SDK 实例的身份更新。
- App 和微信小程序首次读取后使用内存缓存；调用 `setUserId`、`clearUserId` 等 SDK API 时，持久化存储和缓存会同步更新。
- 不要直接修改 SDK 的身份存储 key。平台边界和跨标签页生效条件见[身份存储与跨端一致性](./integration.md#身份存储与跨端一致性)。

## 数据发送前提

SDK 初始化成功后才会接收生命周期和 API 调用。初始化失败时，API 调用返回 `false`。`dataCollect: false` 时，事件不进入上报队列。`forceLogin: true` 且 `identify` 尚未调用成功时，事件队列暂停释放。调试阶段可设置 `debug: true`，通过控制台日志确认初始化、生命周期和上报状态。
