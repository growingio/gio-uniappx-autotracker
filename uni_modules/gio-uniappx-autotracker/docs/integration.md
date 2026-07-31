# 集成与初始化配置

本文档说明 SDK 的集成目录、应用入口初始化方式、初始化配置项和接入检查。

## 1. 放置插件目录

把 SDK 插件目录完整放入业务工程：

```text
uni_modules/gio-uniappx-autotracker
```

业务工程不需要额外构建 SDK。HBuilderX 会随 uni-app x 工程直接编译 `uni_modules` 下的 UTS 代码；业务工程需使用 HBuilderX / uni-app x `5.08` 或更高版本打开和编译，具体版本范围以 SDK 包内 `package.json` 为准。

SDK 发布包只包含 `uni_modules/gio-uniappx-autotracker`，不包含根目录 demo 和 `uni-link-x` / `uts-openSchema` 示例依赖。请完整复制 SDK 目录，不要从 demo 中挑选或依赖这些示例模块。

发布或复制插件时请保留以下关键文件：

```text
uni_modules/gio-uniappx-autotracker/gdp.uts
uni_modules/gio-uniappx-autotracker/plugin.uts
uni_modules/gio-uniappx-autotracker/package.json
uni_modules/gio-uniappx-autotracker/README.md
uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs
uni_modules/gio-uniappx-autotracker/utssdk/index.uts
uni_modules/gio-uniappx-autotracker/utssdk/interface.uts
uni_modules/gio-uniappx-autotracker/utssdk/web/index.uts
uni_modules/gio-uniappx-autotracker/utssdk/web/package.json
uni_modules/gio-uniappx-autotracker/utssdk/mp-weixin/index.uts
uni_modules/gio-uniappx-autotracker/utssdk/app-android/index.uts
uni_modules/gio-uniappx-autotracker/utssdk/app-android/config.json
uni_modules/gio-uniappx-autotracker/utssdk/app-ios/index.uts
uni_modules/gio-uniappx-autotracker/utssdk/app-ios/config.json
uni_modules/gio-uniappx-autotracker/utssdk/app-harmony/index.uts
uni_modules/gio-uniappx-autotracker/utssdk/app-harmony/config.json
```

如果需要启用 `gioEventAutoTracking` 无埋点点击/变更采集，还需要在业务工程根目录 `vite.config.js` 配置 SDK 插件。`uni_modules` 目录里的 Vite 插件不会被 HBuilderX 自动加载，业务工程必须显式配置：

```ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { gioUniappxAutoTrack } from './uni_modules/gio-uniappx-autotracker/build/vite-plugin.mjs'

export default defineConfig({
  plugins: [
    gioUniappxAutoTrack(),
    uni(),
  ],
})
```

插件依赖已在插件目录的 `package.json` 中声明。通过插件市场安装时由安装流程处理；**手工复制且启用无埋点** `uni_modules/gio-uniappx-autotracker` 时，先在该目录执行一次包管理器安装，再启动 HBuilderX 编译：

```bash
cd uni_modules/gio-uniappx-autotracker
npm install --omit=dev
```

不要把生成的 `node_modules` 提交或打进 SDK 发布包；它属于业务工程本地的 Vite 编译依赖。未启用无埋点时，业务工程不会加载 SDK 的 Vite 插件，无需仅为基础采集、ABTest 或微信分享采集安装这些依赖。

## 1.1 平台支持

SDK 正式支持 Web、Android App、iOS App、HarmonyOS App 和微信小程序。HarmonyOS App 直接使用上述 `utssdk/app-harmony` 原生入口；完整复制 SDK 目录即可，不需要业务工程再添加 App JS 回退层。

- 基础自动采集、公开 API、`gioEventAutoTracking` 和 `gioABTest` 均适用于 HarmonyOS App。
- `gioShareTracking` 仅适用于微信小程序。
- Harmony VDOM 支持通过 `onTabItemTap` 采集 tabBar 点击；Harmony Vapor 没有框架等价 hook，因此不支持该单项。详情见[无埋点](./event-autotracking.md#tabbar)。
- 每次升级 SDK、Vite 配置或模板后，都要重新编译实际的 Harmony 目标，并完成一次初始化、页面、交互和上报验证；源码检查不能替代目标端验证。

## 2. 在应用入口初始化

在 `main.uts` 中创建 Vue app 后调用 `gdp('init', options)`。`app` 参数必须传入当前 Vue app 实例，SDK 会通过它安装页面生命周期 mixin。

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
    originalSource: true,
    idMapping: false,
    urlScheme: null,
    dataValidityPeriod: 7
  })

  return { app }
}
```

`gdp('init', ...)` 只允许成功调用一次。重复初始化会返回 `false`，不会刷新配置、重置队列或重复安装生命周期。

## 3. 配置一览

“是否必须传入”表示业务初始化时是否需要主动填写该字段。可选字段不传时，SDK 会在归一化阶段使用默认值或 `null`。

| 参数 | 类型 | 是否必须传入 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `app` | `VueApp` | 是 | 无 | 当前 Vue app 实例。SDK 使用它安装生命周期 mixin。 |
| `projectId` | `string` | 是 | 无 | GrowingIO 项目 ID。 |
| `dataSourceId` | `string` | 是 | 无 | GrowingIO 数据源 ID。 |
| `appId` | `string` | 是 | 无 | 应用 ID。微信小程序填写小程序 AppID。 |
| `serverUrl` | `string` | 否 | `https://napi.growingio.com` | 数据上报服务地址。私有化环境填写对应采集域名。 |
| `appVersion` | `string \| null` | 否 | `1.0.0` | 应用版本号。传空或不传时使用默认值。 |
| `dataCollect` | `boolean` | 否 | `true` | 是否开启数据采集。为 `false` 时事件不会入队上报。 |
| `debug` | `boolean` | 否 | `false` | 调试日志开关。 |
| `forceLogin` | `boolean` | 否 | `false` | 是否启用登录前暂停上报。启用后需调用 `identify`。 |
| `originalSource` | `boolean` | 否 | `true` | 是否记录首次访问来源。 |
| `idMapping` | `boolean` | 否 | `false` | 是否启用 `userKey` 身份映射。 |
| `urlScheme` | `string \| null` | 否 | `null` | App 端 URL Scheme 标识，会写入事件字段。 |
| `dataValidityPeriod` | `number \| null` | 否 | `7` | 本地数据有效期，单位为天，最小 `3`，最大 `30`。 |

业务必须传入且不能为空的字段：

- `app`
- `projectId`
- `dataSourceId`
- `appId`

`app` 为空时，SDK 初始化返回 `false`。`projectId`、`dataSourceId` 或 `appId` 为空时，SDK 初始化也会返回 `false`。`serverUrl` 可以不传，SDK 会使用默认值 `https://napi.growingio.com`。

## 4. 配置项说明

以下说明只展开业务接入时需要理解和选择的配置项。`app`、`projectId`、`dataSourceId`、`appId` 属于基础接入字段，请按 GrowingIO 项目和业务应用实际信息填写。

### serverUrl

`serverUrl` 是数据采集服务地址，SDK 会把事件上报到该地址。

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  serverUrl: 'https://napi.growingio.com'
})
```

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `https://napi.growingio.com`。传非空字符串时，SDK 使用该地址上报事件；传空字符串或不传时，SDK 使用默认值。

### appVersion

`appVersion` 表示业务应用版本号，会写入事件的 `appVersion` 字段，便于在 GrowingIO 中按应用版本分析数据。

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  appVersion: '1.2.3'
})
```

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `1.0.0`。传非空字符串时，SDK 将该值写入事件的 `appVersion` 字段；传 `null`、空字符串或不传时，SDK 使用默认值。

### dataCollect

`dataCollect` 控制事件是否进入上报队列：

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  dataCollect: false
})
```

初始化后也可以通过 `setOptions` 动态修改：

```uts
gdp('setOptions', {
  dataCollect: true
} as UTSJSONObject)
```

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `true`。设置为 `true` 时，事件会进入上报队列。设置为 `false` 时，SDK 仍会完成初始化，但不会上报事件。

### debug

`debug` 控制 SDK 调试日志。

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  debug: true
})
```

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `false`。设置为 `true` 时，SDK 输出初始化、生命周期、系统上下文、请求和请求失败等调试信息。设置为 `false` 时，SDK 不输出 debug 级别调试信息。

### forceLogin

开启 `forceLogin` 后，SDK 会等待业务调用 `identify` 设置登录态标识，再释放暂停的上报队列：

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  forceLogin: true
})

gdp('identify', 'openid-or-unionid')
```

生效条件：`identify` 仅在 `forceLogin: true` 时生效。调用成功后，SDK 将 `forceLogin` 状态改为 `false`。

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `false`。设置为 `false` 时，SDK 按正常流程上报事件。设置为 `true` 时，SDK 暂停上报队列，直到 `identify` 调用成功后释放队列。Web、App 和微信小程序均不限制等待队列长度，也不会因队列长度静默淘汰事件；业务应及时调用 `identify`，避免长时间积压占用内存。

### originalSource

`originalSource` 控制是否记录并回填首次访问来源。

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  originalSource: true
})
```

适用平台：Web、微信小程序。Android App、iOS App、HarmonyOS App 不启用该机制，与独立移动端 SDK 保持一致。

生效行为：默认值为 `true`。设置为 `true` 后，SDK 仅在当前 session 尚未成功发送 `VISIT` 时，于初始化访问链的首个有效页面上下文到来时捕获一次首次来源快照，并在 `VISIT` 事件中优先使用快照里的 `path`、`query` 和 `referralPage`；`title` 始终取事件触发时的当前页面。首次来源被成功发送的 `VISIT` 消费后删除，后续 session 更新与同 session 页面刷新不会重新定义它。

设置为 `false` 后，SDK 只停止首次来源快照的读取和写入，`VISIT` 使用事件触发时的页面上下文；已经存在的历史快照不会被主动清理。

字段规则：首次来源快照只保存 `path`、`query` 和 `referralPage`，不保存 `sessionId` 或 `title`，也不与 session 绑定；捕获前只用当前 session 的 `VISIT` 发送标记避免刷新后误建快照。字段值来自 SDK 在对应平台已解析出的页面上下文，不保证全部非空。

### idMapping

如果业务需要同时传入 `userId` 和 `userKey`，初始化时必须开启 `idMapping`：

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  idMapping: true
})

gdp('setUserId', 'user-1001', 'phone_hash_or_union_key')
```

未开启 `idMapping` 时传入 `userKey`，SDK 会忽略 `userKey` 并打印告警。

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `false`。设置为 `false` 时，`gdp('setUserId', userId, userKey)` 中的 `userKey` 被忽略。设置为 `true` 时，SDK 接收并持久化 `userKey`，事件中携带 `userKey`。

### 身份存储与跨端一致性

`setUserId`、`clearUserId` 等公开身份 API 会通过 SDK 的统一身份存储路径，同时更新持久化存储和当前实例的内存状态。业务代码不要直接修改 SDK 的身份存储 key。

- **Web**：每次构建事件上下文时都重新读取持久化存储中的 `userId` 和 `userKey`。同域页面使用相同 `projectId`，且 `storageType`、`cookieDomain` 等存储配置兼容时，其他标签页或另一 SDK 实例写入的新身份会在本页下一次构建事件时生效，不依赖 `storage` 事件或额外广播。
- **App（Android、iOS、HarmonyOS）和微信小程序**：首次取用身份时从存储恢复，之后由当前 SDK 实例的内存缓存参与事件构建。通过 SDK 身份 API 修改身份时，存储与缓存会同步更新；绕过 SDK 直接修改底层存储不会主动刷新已运行实例的缓存，通常要重新初始化后才能被读取。

### urlScheme

`urlScheme` 用于标记 App 的 URL Scheme，会写入事件的 `urlScheme` 字段。

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  urlScheme: 'myapp'
})
```

适用平台：Web、Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `null`。设置为非空字符串后，SDK 构建事件时把该值写入事件的 `urlScheme` 字段；传 `null` 或不传时，事件的 `urlScheme` 字段为 `null`。

### dataValidityPeriod

`dataValidityPeriod` 控制本地持久化事件的有效期，单位为天。

```uts
gdp('init', {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  dataValidityPeriod: 7
})
```

默认值为 `7`。SDK 会把小于 `3` 的值归一为 `3`，把大于 `30` 的值归一为 `30`。

适用平台：Android App、iOS App、HarmonyOS App。

不适用平台：Web、微信小程序。

生效行为：App 端持久化事件队列时，使用该值计算本地事件过期时间。Web 端和微信小程序端不持久化事件队列，设置该字段不改变这两端的事件保留行为。

## 5. Web 专属扩展

Web 端可在 `gdp('init', options)` 中额外传入页面路径和存储策略字段。App（Android、iOS、HarmonyOS）端和微信小程序端不读取这些字段。

| 参数 | 类型 | 是否必须传入 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `useUnified` | `boolean` | 否 | `true` | Web 端是否使用统一的通用数据规则。当前只影响 Web 端 `path` 字段。 |
| `storageType` | `'cookie' \| 'localStorage'` | 否 | `'cookie'` | Web 主存储类型。Cookie 不可用时会回退到 `localStorage`。 |
| `cookieDomain` | `string` | 否 | 自动探测 | Web Cookie 写入域。 |

Web 专属字段应和其他初始化参数合并到同一次 `gdp('init', initOptions)` 调用中，不要为了设置 Web 字段再次调用 `init`：

```uts
const initOptions = {
  app: app,
  projectId: 'YOUR_PROJECT_ID',
  dataSourceId: 'YOUR_DATA_SOURCE_ID',
  appId: 'YOUR_APP_ID',
  serverUrl: 'https://napi.growingio.com'
} as UTSJSONObject

// #ifdef WEB
initOptions['useUnified'] = true
initOptions['storageType'] = 'localStorage'
initOptions['cookieDomain'] = '.example.com'
// #endif

gdp('init', initOptions)
```

适用平台：Web。

不适用平台：Android App、iOS App、HarmonyOS App、微信小程序。

### useUnified

`useUnified` 控制 Web 端是否使用统一的通用数据规则。当前只影响 Web 端事件里的 `path` 字段。

```uts
// #ifdef WEB
initOptions['useUnified'] = true
// #endif
```

适用平台：Web。

不适用平台：Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `true`。设置为 `true` 时，Web 端优先使用 `UniPage.route` 生成的页面路径，与 App 和微信小程序的页面路径规则保持统一。设置为 `false` 时，Web 端优先使用浏览器 `location`。Android App、iOS App、HarmonyOS App 和微信小程序不读取该配置，始终使用页面 `route` 的既有规则。

### storageType

`storageType` 控制 Web 端主身份和 session 信息优先使用哪种浏览器存储。

```uts
// #ifdef WEB
initOptions['storageType'] = 'localStorage'
// #endif
```

适用平台：Web。

不适用平台：Android App、iOS App、HarmonyOS App、微信小程序。

生效行为：默认值为 `cookie`。合法值只有 `cookie` 和 `localStorage`，大小写不敏感；传入其他值时按 `cookie` 处理。取值为 `cookie` 时，Web 端优先使用 Cookie 保存主身份和 session 信息；Cookie 写入失败时回退到 `localStorage`。取值为 `localStorage` 时，Web 端直接使用 `localStorage`。

### cookieDomain

`cookieDomain` 控制 Web 端 Cookie 写入域。

```uts
// #ifdef WEB
initOptions['cookieDomain'] = '.example.com'
// #endif
```

适用平台：Web。

不适用平台：Android App、iOS App、HarmonyOS App、微信小程序。

生效条件：Web 端主存储使用 Cookie。`storageType` 为 `localStorage` 时，该字段不生效。

生效行为：不配置时，SDK 根据当前 `location.hostname` 自动探测可写 Cookie 域。配置后，SDK 先尝试使用该域写入 Cookie；如果该域不可写，再继续自动探测可写域。

## 6. 验证初始化

调试阶段设置：

```uts
debug: true
```

初始化成功后，控制台会出现 SDK 初始化完成日志。随后进入页面、切换页面或调用自定义事件 API，可在控制台和网络请求中验证事件是否生成并上报。

```uts
gdp('track', 'integration_test', {
  source: 'manual'
} as UTSJSONObject)
```

## 7. 基础接入检查

- `gdp('init', ...)` 在 `createSSRApp(App)` 后、`return { app }` 前调用。
- `app`、`projectId`、`dataSourceId`、`appId` 已传入且不为空。
- 私有化环境已显式配置正确的 `serverUrl`；未配置时 SDK 使用默认采集地址。
- 自定义属性使用 `UTSJSONObject`，不要传数组、函数或嵌套对象作为属性值。
- 开启 `forceLogin` 后，必须调用 `gdp('identify', assignmentId)` 才能释放暂停的上报队列。
- 需要 ABTest 或微信分享采集时，初始化成功后调用 `gdp('registerPlugins', plugins)`。
- 选择的业务目标端已在 HBuilderX 中重新编译并完成一次真实上报验证；根目录 demo 的验证结果不能替代业务工程验证。
