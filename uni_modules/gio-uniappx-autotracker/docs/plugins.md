# 功能插件

SDK 的插件能力需要在初始化成功后通过 `registerPlugins` 显式启用。请在业务调用插件 API 前完成注册。

| 插件 | 适用平台 | 用途 | 文档 |
| --- | --- | --- | --- |
| `gioEventAutoTracking` | Web、Android App、iOS App、HarmonyOS App、微信小程序 | 无埋点点击和变更采集 | [无埋点](./event-autotracking.md) |
| `gioABTest` | Web、Android App、iOS App、HarmonyOS App、微信小程序 | 获取实验层变量和自动上报实验命中 | [ABTest](./abtest.md) |
| `gioShareTracking` | 微信小程序 | 采集分享、朋友圈和收藏 | [本页](#giosharetracking) |

`registerPlugins` 会忽略没有 `name` 的插件项。至少成功启用一个可用插件时返回 `true`；重复注册同名插件会被跳过。

## gioShareTracking

`gioShareTracking` 用于微信小程序分享、朋友圈和收藏采集。

适用平台：微信小程序。

不适用平台：Web、Android App、iOS App、HarmonyOS App。

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

事件属性包括分享标题、分享路径、分享查询参数、分享来源和目标等字段。SDK 会优先使用业务页面返回的分享信息，取不到时使用当前页面信息。

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
    name: 'gioEventAutoTracking'
  },
  {
    name: 'gioABTest',
    options: {
      abServerUrl: 'https://ab.growingio.com'
    } as UTSJSONObject
  },
  {
    name: 'gioShareTracking'
  }
] as Array<UTSJSONObject>)
```

注册时机：初始化之后、业务 API 调用之前。
