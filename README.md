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

