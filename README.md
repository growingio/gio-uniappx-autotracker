# growingio-showcase

这是 `gio-uniappx-autotracker` 的根 demo 工程。SDK 以 `uni_modules` 集成包形态放在 `uni_modules/gio-uniappx-autotracker`，调试时直接用 HBuilderX 打开仓库根目录，不再依赖软连接或额外 copy 步骤。

## 当前 SDK 能力

- `gdp('init', { app, ...options })`
- `VISIT`
- `PAGE`
- `APP_CLOSED`
- `gdp('track', ...)`
- `gdp('setUserId', ...)`
- `gdp('setOptions', { dataCollect })`
- `gdp('setLocation', latitude, longitude)`（非 web 端）
- `gdp('clearLocation')`（非 web 端）
- `gdp('setUserAttributes', ...)`
- `gdp('clearUserId')`
- `gdp('identify', ...)`
- `gdp('registerPlugins', ...)`
- `gdp('getABTest', ...)`
- 微信小程序端分享采集插件：注册 `gioShareTracking` 后，自动代理页面已定义的 `onShareAppMessage`、`onShareTimeline`、`onAddToFavorites`

`setLocation` / `clearLocation` 只在非 web 端生效。`setLocation` 参数必须是合法经纬度数字：`latitude` 范围 `-90..90`，`longitude` 范围 `-180..180`。设置后，后续事件会携带 `latitude` / `longitude`；调用 `clearLocation` 后，后续事件不再携带经纬度。该值当前保存在运行时内存中，不做持久化。

`setOptions` 当前只允许动态修改 `dataCollect`，不能作为通用运行时配置入口使用。传入其他字段不会扩展核心状态。

微信小程序分享能力需要先通过 `gdp('registerPlugins', [{ name: 'gioShareTracking' }])` 注册启用。启用后，SDK 会代理业务页已定义的 `onShareAppMessage` / `onShareTimeline` / `onAddToFavorites`；未注册时只透传业务 handler 返回值，不补分享字段、不发送分享 / 收藏事件。SDK 不会给没有定义分享钩子的页面补方法，因此不会让其它页面平白多出转发菜单；`wrapShareAppMessage` / `wrapShareTimeline` / `wrapAddToFavorites` 仍保留为手动兜底 API。

## Demo 初始化

当前 demo 初始化时只会传这几个配置：

- `projectId`
- `dataSourceId`
- `appId`
- `serverUrl`
- `appVersion`
- `debug`
- `forceLogin`
- `idMapping`
- `dataCollect`

对应源码见 [main.uts](./main.uts)。

SDK 入口还会归一化这些配置：

- `originalSource`：默认 `true`
- `storageType`：仅 web 端生效，默认 `cookie`
- `cookieDomain`：仅 web cookie 存储生效

当前 demo 会默认通过 `gdp('registerPlugins', [...])` 注册 `gioShareTracking` 和 `gioABTest` 插件，并额外提供分享页和 ABTest 页面做最小联调入口。ABTest 页面按单实例方式演示 `gdp('getABTest', layerId, callback)`，不包含 `trackingId` 多实例调用。

## 生命周期桥接约束

当前 SDK 的生命周期桥接由 `uni_modules/gio-uniappx-autotracker/plugin.uts` 负责，但桥接层不能直接把页面实例 `this` 或原始 `options` 传进 `utssdk/`：

- iOS 原生侧不认识页面实例本身，它既不是稳定的 `UTSJSONObject`，也不是可依赖的 `UniPage`
- 小程序和 App 的页面实例结构不同，直接透传会把平台差异扩散到 `tracker`
- `utssdk/` 内属于原生编译层，只应该接收显式、稳定、可序列化的普通对象

当前做法是先在 JS 编译层构造“页面快照 / 启动参数快照”，只保留 SDK 真正需要的字段，再交给 `utssdk/`：

- 页面快照：`route`、`$scope.route`、`options`、`$scope.options`、`title`
- 启动参数快照：`path`、`scene`、`query`、`referrerInfo` / `refererInfo`

后续如果继续补生命周期采集或页面路由能力，也必须先补快照字段，不能回退到直接透传原始实例。

如果你要调试当前 demo，用 HBuilderX 打开仓库根目录工程即可，不需要再把 SDK 安装到 demo 里，也不需要额外的 symlink / copy 步骤：

```bash
npm run demo:open
```

这条命令等价于 `open -a HBuilderX .`。打开后，在 HBuilderX 里选择对应的端运行/编译即可：

- `web`
- `mp-weixin`
- `app-android`
- `app-ios`
- `app-harmony`

如果你要调试 `iOS` demo，本机还需要满足这两个前置条件：

- 安装完整 `Xcode`，不能只有 `CommandLineTools`
- `xcode-select -p` 需要指向 `Xcode.app/Contents/Developer`，并且 `xcrun simctl list devices available` 能正常返回

否则 HBuilderX 很容易退回到“iOS 真机未签名标准基座”这条链路，demo 不会真正进入模拟器运行。

## SDK 集成包

SDK 以 `uni_modules` 集成包的形态放在 `uni_modules/gio-uniappx-autotracker`，包含 `web`、`app-android`、`app-ios`、`app-harmony`、`mp-weixin` 五端入口。其它工程要使用时，直接把整个 `uni_modules/gio-uniappx-autotracker` 目录拷贝进去即可，无需额外构建步骤。

当前目录职责约定：

- `gdp.uts`：对外命令分发入口
- `plugin.uts`：JS 编译层生命周期桥接，只做快照提取和转发
- `utssdk/common`：跨端公共核心逻辑
- `utssdk/common/utils`：公共工具函数、容器封装、请求与调试辅助
- `utssdk/<platform>`：平台薄封装与平台注册

入口文件必须保持齐全：

- `utssdk/web/index.uts` 与 `utssdk/web/package.json`
- `utssdk/app-android/index.uts` 与 `utssdk/app-android/config.json`
- `utssdk/app-ios/index.uts` 与 `utssdk/app-ios/config.json`
- `utssdk/app-harmony/index.uts` 与 `utssdk/app-harmony/config.json`
- `utssdk/mp-weixin/index.uts`

补充约束：

- `utssdk/common` 里只放真正无平台语义的公共能力，不放 `miniprogram`、`web-only`、`ios-*` 这类带端命名的文件
- `BoxArray` 这类轻量容器封装，与请求拼装、调试输出、校验函数一样，统一收敛到 `utssdk/common/utils`；不要为了单个小工具再拆一个零散文件
- 某段逻辑如果只服务某一端，即使实现里有可复用片段，也应优先留在对应平台目录，再通过 interface / resolver 注入公共层

## 文档索引

- [QA.md](./QA.md)：高频坑、平台限制、桥接与编译边界
- [设计文档](./docs/uniappx-sdk-design.md)：模块职责、事件模型、生命周期策略
- [UTS 编码规范](./docs/uts-coding-guidelines.md)：类型、`UTSJSONObject`、`uni.request()`、空值模型
