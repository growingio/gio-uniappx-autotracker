# gio-uniappx-autotracker

这是一个面向 uni-app x 的最小跨端采集 SDK 骨架，目前保留了以下基础能力：

- 初始化
- 自定义事件采集
- `sessionId` / `userId` / `userKey` 管理
- `forceLogin` / `identify` 最小链路
- `VISIT`、`PAGE`、`APP_CLOSED` 三个关键事件的基础上报

当前对外 API 只有：

- `initialize(options)`
- `track(eventName, properties = null)`
- `setUserId(userId, userKey = null)`
- `setUserAttributes(userAttributes)`
- `identify(assignmentId)`
- `clearUserId()`
- `registerPlugins(plugins)`
- `getABTest(layerId, callback)`
- `wrapShareAppMessage(handler)` / `wrapShareTimeline(handler)` / `wrapAddToFavorites(handler)`（仅 `mp-weixin`）

当前允许的初始化配置只有：

- `projectId`
- `dataSourceId`
- `appId`
- `serverUrl`
- `appVersion`
- `debug`
- `forceLogin`
- `idMapping`
- `followShare`
- `sessionExpires`

`idMapping` 控制 `setUserId(userId, userKey)` 里的 `userKey` 是否真正生效，默认 `false`。未开启时如果仍传入 `userKey`，SDK 只打印 warning，不会持久化，也不会带进后续事件。

`followShare` 控制小程序「分享 / 收藏」事件是否采集，**仅 `mp-weixin` 端生效**：初始化时 mp-weixin 默认 `true`（用户未显式关闭时），其余端一律置 `false`。

其中 `sessionExpires` 单位为分钟，默认值如下：

- `web`：`30`
- `mp-weixin`：`5`
- `app-android` / `app-ios` / `app-harmony`：`0.5`

当前请求体已经按小程序独立 SDK 的核心风格对齐：上传时直接发送事件数组，请求 URL 带 `stm` / `compress` 查询参数，`CUSTOM` 事件使用 `eventName + attributes` 结构，`LOGIN_USER_ATTRIBUTES` 会单独作为用户属性事件发送，`sessionId` / `userId` / `userKey` 会在每次构建事件时直接从存储读取。
其中 `mp-weixin` 会额外按独立 SDK 的思路补 `scene` 场景值读取，优先从启动上下文同步读取，并把结果写进事件的 `appChannel=scn:<scene>`。

`mp-weixin` 还独有「分享 / 分享朋友圈 / 加收藏」三个事件。各端独有逻辑统一收敛到平台目录：实现与公开 API 都在 `utssdk/mp-weixin/share.uts`，公共层只通过 `GioShareHost` 暴露发事件 / 取页上下文 / 翻 `shareOut` / 读 `followShare` 等平台无关能力。

对齐独立小程序 SDK「只代理已定义对应钩子的页面」：uni-app x 没有 `Page()` 构造拦截，而全局 mixin 注入 `onShareAppMessage` 会让**所有**页面都出现转发菜单。因此改为 **wrap 包装器**——业务页把自己的 handler 交给对应 wrap 函数，只有定义了钩子的页面才被代理、才采集，且能拿到业务方返回值：

```ts
// #ifdef MP-WEIXIN
import { wrapShareAppMessage } from '@/uni_modules/gio-uniappx-autotracker'
// #endif
export default {
  // #ifdef MP-WEIXIN
  onShareAppMessage: wrapShareAppMessage((options) => {
    return { title: '...', path: '/pages/x/x?id=1' }
  })
  // #endif
}
```

字段集对齐独立 SDK：

- `onShareAppMessage` → `$mp_on_share`（`$from` / `$target` / `$share_title` / `$share_path` / `$share_query`），并置位 `shareOut`：分享给朋友往返期间 `onAppShow` 不重写 `originalSource` 首次来源，下一次 page `onShow` 复位。
- `onShareTimeline` → `$mp_share_timeline`（`$target` / `$share_title` / `$share_path` / `$share_query`，无 `$from`）。
- `onAddToFavorites` → `$mp_add_favorites`（`$share_title` / `$share_path` / `$share_query`）。

`$share_title` / `$share_path` / `$share_query` 优先取业务方 handler 返回值（`path` 串按 `?` 拆出 path 与 query），**取不到则兜底当前页面**的 title / path / query；`$from` / `$target` 取自微信回传的 `options`。注：wrap 返回的包装函数不保留页面 `this`（与历史代理实现一致），handler 内请勿依赖 `this`。

`demos/growingio-showcase` 有「分享 / 朋友圈 / 收藏」演示页（`pages/share/share`），入口仅在小程序端首页显示。

以下旧能力已经不再对外透出，也不允许调用或传参：

- `flush`
- `autoTrackLifecycle`
- `requestTimeoutMs`
- `maxQueueSize`
- `storagePrefix`
- `header`

当前插件层只考虑 `gioABTest`，并且对外注册思路先按小程序独立 SDK 对齐。
当前 `gioABTest` 只按单实例场景收敛，不考虑 `trackingId` 多实例能力；对外调用方式保持为 `registerPlugins([{ name: 'gioABTest', options }]) + getABTest(layerId, callback)`。
当前不会额外提供 `createGioABTestPlugin(options)` 这类插件项工厂函数，注册入口只保留 `registerPlugins([...])`。

首屏 `VISIT` 和 `PAGE` 事件不会在上下文未就绪时抢先发送。设备信息和网络信息必须先通过官方异步 API 回来，事件才会真正构建并进入发送队列。

当前源码已经补齐 `web`、`app-js`、`app-android`、`app-ios`、`app-harmony`、`mp-weixin` 的 `utssdk` 平台入口，公共采集逻辑统一复用一份实现。

为了贴合官方 UTS 硬性规则，SDK 源码层已经去掉 `?` 可选参数 / 可选属性语义；所有非必填配置项统一显式使用 `null` 占位，不依赖 `undefined`。

如果你想先看完整设计、分层思路和后续扩展方向，请直接看下面这份中文设计文档。

详细设计说明见 [docs/uniappx-sdk-design.md](/Users/anoiv/Workspace/gio-uniappx-autotracker/docs/uniappx-sdk-design.md)。

项目级硬性约束见 [AGENTS.md](/Users/anoiv/Workspace/gio-uniappx-autotracker/AGENTS.md)。

## 打包流程

当前仓库已经补齐了最小可用的打包链路：

- `npm run build`
  把当前源码整理成 `dist/uni_modules/gio-uniappx-autotracker/`
- `npm run verify:bundle`
  校验 `dist` 产物是否包含五端入口和必要的模块元数据
- `npm run dev:demo-web`
  按 `develop` 分支同风格启动 web demo 调试入口
- `npm run dev:demo-mp`
  启动微信小程序 demo 调试入口
- `npm run dev:demo-android`
  启动 Android demo 调试入口
- `npm run dev:demo-ios`
  启动 iOS demo 调试入口
- `npm run dev:demo-harmony`
  启动 Harmony demo 调试入口
- `npm run demo:debug`
  一条命令准备默认 showcase demo 调试环境，并尽量自动用 HBuilderX 打开项目
- `npm run install-to-demo`
  把 `dist` 里的模块安装到 demo 的 `uni_modules/` 目录
- `npm run release`
  先构建、再校验产物结构，最后把 `dist/uni_modules/gio-uniappx-autotracker/` 打成 `dist/release/*.tgz`

### 产物结构

构建后会生成：

```text
dist/
  uni_modules/
    gio-uniappx-autotracker/
      index.uts
      plugin.uts
      package.json
      uni_modules.json
      utssdk/
        index.uts
        app-js/
        web/
          package.json
        app-android/
        app-ios/
        app-harmony/
        mp-weixin/
      README.md
      readme.md
```

### 常用命令

```bash
npm run build
npm run verify:bundle
npm run dev:demo-web
npm run dev:demo-web -- --open-browser
npm run dev:demo-mp
npm run dev:demo-android
npm run dev:demo-ios
npm run dev:demo-harmony
npm run demo:debug
npm run demo:debug -- --no-open
npm run install-to-demo
npm run install-to-demo -- --demo=/absolute/path/to/your-demo
npm run release
```

### 说明

- `build` 会顺手把最新的 `dist` 产物复制到 `demos/growingio-showcase/uni_modules/gio-uniappx-autotracker`
- `verify:bundle` 只校验打包结构和平台声明，不等价于真实 HBuilderX 五端编译通过
- `dev:demo-web` 会先构建并校验 SDK，然后调用 HBuilderX `launch web`；默认保持监听模式
- `dev:demo-web -- --open-browser` 会在识别到本地调试 URL 后自动打开浏览器
- `dev:demo-mp` / `dev:demo-android` / `dev:demo-ios` / `dev:demo-harmony` 会先构建并校验 SDK，再调用对应平台的 HBuilderX 开发构建入口
- 上述 `dev:demo-*` 命令都支持 `--prepare-only`，只做环境准备，不真正拉起 HBuilderX
- 上述 `dev:demo-*` 命令都支持 `--no-watch`，只启动一次，不进入监听模式
- `demo:debug` 默认会清理 `demos/growingio-showcase/unpackage`，并尝试执行 `open -a HBuilderX demos/growingio-showcase`
- 如果你只想准备环境、不自动拉起 HBuilderX，可以使用 `npm run demo:debug -- --no-open`
- 如果你不想清掉 demo 的 `unpackage`，可以使用 `npm run demo:debug -- --keep-unpackage`
- `install-to-demo` 适合把当前 SDK 装到别的 uni-app x demo 里做冒烟验证
- `release` 产出的 `.tgz` 可以直接交给业务项目解压到自己的 `uni_modules/` 目录
- 当前已经具备五端平台入口，但是否“五端都能编译并稳定上报”，仍然要以实际 HBuilderX 构建验证结果为准
