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
- `originalSource`
- `idMapping`

对应源码见 [main.uts](./main.uts)。

当前 demo 会默认通过 `gdp('registerPlugins', [{ name: 'gioABTest', options }])` 注册 `gioABTest` 插件，并额外提供一个 ABTest 页面做最小联调入口。该页面按单实例方式演示 `gdp('getABTest', layerId, callback)`，不包含 `trackingId` 多实例调用。

如果你要调试当前 demo，直接在仓库根目录运行：

```bash
npm run dev:demo-web
```

这条命令会直接打开根目录 demo，不需要再把 SDK 安装到 demo 里，也不需要额外的 symlink / copy 步骤。

如果你想在 web 本地地址 ready 后自动打开浏览器，可以执行：

```bash
npm run dev:demo-web -- --open-browser
```

其它平台也有同风格命令：

```bash
npm run dev:demo-mp
npm run dev:demo-android
npm run dev:demo-ios
npm run dev:demo-harmony
```

如果你要调试 `iOS` demo，本机还需要满足这两个前置条件：

- 安装完整 `Xcode`，不能只有 `CommandLineTools`
- `xcode-select -p` 需要指向 `Xcode.app/Contents/Developer`，并且 `xcrun simctl list devices available` 能正常返回

否则 HBuilderX 很容易退回到“iOS 真机未签名标准基座”这条链路，demo 不会真正进入模拟器运行。

如果你只想准备环境，不真正拉起 HBuilderX，可以执行：

```bash
npm run demo:debug -- --no-open
```

## SDK 单独打包

如果你要单独打包 SDK，而不是调 demo，可以直接运行：

```bash
npm run build:sdk
```

这会把 `uni_modules/gio-uniappx-autotracker` 打成 `dist/uni_modules/gio-uniappx-autotracker`，然后再执行：

```bash
npm run verify:bundle
```

来检查五端入口和产物元数据是否齐全。

