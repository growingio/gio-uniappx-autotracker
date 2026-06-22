# growingio-showcase

这是当前最小版 `gio-uniappx-autotracker` 的 demo。现在仓库根目录就是 demo 工程，SDK 以集成包的形态放在 `uni_modules/gio-uniappx-autotracker` 中，调试时不再依赖软连接或额外 copy 步骤。

页面结构保留了当前 SDK 真正已经支持的能力：

- `gdp('init', { app, ...options })`
- `VISIT`
- `PAGE`
- `APP_CLOSED`
- `gdp('track', ...)`
- `gdp('setUserId', ...)`
- `gdp('setUserAttributes', ...)`
- `gdp('clearUserId')`
- `gdp('identify', ...)`
- `gdp('registerPlugins', ...)`
- `gdp('getABTest', ...)`

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

当前 demo 会默认通过 `gdp('registerPlugins', [{ name: 'gioABTest', options }])` 注册 `gioABTest` 插件，并额外提供一个 ABTest 页面做最小联调入口。该页面按单实例方式演示 `gdp('getABTest', layerId, callback)`，不包含 `trackingId` 多实例调用。

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

补充约束：

- `utssdk/common` 里只放真正无平台语义的公共能力，不放 `miniprogram`、`web-only`、`ios-*` 这类带端命名的文件
- `BoxArray` 这类轻量容器封装，与请求拼装、调试输出、校验函数一样，统一收敛到 `utssdk/common/utils`；不要为了单个小工具再拆一个零散文件
- 某段逻辑如果只服务某一端，即使实现里有可复用片段，也应优先留在对应平台目录，再通过 interface / resolver 注入公共层
