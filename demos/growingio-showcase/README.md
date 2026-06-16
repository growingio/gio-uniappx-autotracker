# growingio-showcase

这是当前最小版 `gio-uniappx-autotracker` 的 demo。页面结构参考了 `develop` 分支的 showcase 首页，但这里只保留当前 SDK 真正已经支持的能力：

- `VISIT`
- `PAGE`
- `APP_CLOSED`
- `track`
- `setUserId`
- `setUserAttributes`
- `setUserKey`
- `clearUserId`
- `identify`
- `registerPlugins`
- `getABTest`

当前 demo 初始化时只会传这几个配置：

- `projectId`
- `dataSourceId`
- `appId`
- `serverUrl`
- `appVersion`
- `debug`
- `forceLogin`
- `sessionExpires`

对应源码见 [main.uts](/Users/anoiv/Workspace/gio-uniappx-autotracker/demos/growingio-showcase/main.uts)。

当前 demo 会默认通过 `registerPlugins([{ name: 'gioABTest', options }])` 注册 `gioABTest` 插件，并额外提供一个 ABTest 页面做最小联调入口。该页面按单实例方式演示 `getABTest(layerId, callback)`，不包含 `trackingId` 多实例调用。

如果本地的 `uni_modules/gio-uniappx-autotracker` 没有同步到当前仓库产物，先执行一次构建，让 demo 里的模块目录刷新成最新副本，再在 HBuilderX 中运行。

推荐先在仓库根目录执行：

```bash
npm run dev:demo-web
```

如果你要直接调 web demo，这条命令会自动完成：

- 构建 SDK
- 校验 `dist` 产物
- 调用 HBuilderX `launch web`
- 进入监听模式；SDK 源码变化后会自动重建 bundle

如果希望在 web 本地地址 ready 后自动打开浏览器，可以执行：

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
npm run dev:demo-web -- --prepare-only
```
