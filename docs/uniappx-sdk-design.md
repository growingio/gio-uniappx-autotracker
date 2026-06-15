# uni-app x 跨端采集 SDK 设计方案

## 1. 目标

构建一个面向 uni-app x 的最小可用采集 SDK，先只保留以下基础能力：

- 初始化
- 自定义事件采集
- 用户身份管理：`sessionId`、`userId`、`userKey`
- 关键生命周期事件：`VISIT`、`PAGE`、`APP_CLOSED`
- 事件上报

这份设计并不是要一次性完整对齐 `gio-miniprogram-autotracker`，而是先把 uni-app x 版本最重要的模块边界、运行时分层和数据契约立住，后续再逐步补齐更丰富的上下文、路由采集能力和更高程度的协议对齐。

## 2. 参考来源提炼

### 来自 `uni-stat`

参考的 `uni-stat` 模块主要提供了目录组织方式：

- 使用 `uni_modules` 风格的包结构
- 暴露 `plugin.uts` 作为插件安装入口
- 对外 API 放在 `utssdk/index.uts`
- 共享运行时代码放在 `utssdk/common`
- 平台编译入口需要落到 `utssdk/<platform>/index.uts`
- 生命周期桥接放在 mixin 中，而不是把入口逻辑硬写进核心类

### 来自 `gio-miniprogram-autotracker`

小程序独立 SDK 主要提供了事件方向和核心职责拆分：

- 关键事件名称应沿用 `VISIT`、`PAGE`、`APP_CLOSED`
- 需要一个顶层 orchestrator 负责统一调度
- 需要独立的 `userStore`
- 需要独立的 `uploader`
- 页面和应用生命周期应在“事件构建层”处理，而不是混进上传逻辑

当前第一版只继承这些最基础、最值得提前定下来的部分。多实例、插件管理、ABTest、完整事件上下文构建、force-login 队列等能力仍然暂缓。

## 3. 当前非目标

- 完整对齐 GrowingIO 线上协议
- 覆盖独立 SDK 的全部 API
- 完整页面 / 组件自动采集能力
- 曝光采集
- ABTest
- 插件注册体系
- 多实例支持
- 离线重试持久化

## 4. 目录结构

```text
gio-uniappx-autotracker/
  package.json
  plugin.uts
  utssdk/
    index.uts
    interface.uts
    app-js/
      index.uts
    web/
      package.json
      index.uts
    app-android/
      config.json
      index.uts
    app-ios/
      config.json
      index.uts
    app-harmony/
      config.json
      index.uts
    mp-weixin/
      index.uts
    common/
      config.uts
      utils.uts
      core/
        tracker.uts
        user-store.uts
        uploader.uts
```

## 5. 对外 API

### 插件式接入

当应用希望自动接入 `VISIT` / `PAGE` / `APP_CLOSED` 生命周期事件时，使用插件方式：

```ts
app.use(gioUniappxAutotracker, {
  projectId,
  dataSourceId,
  appId,
  serverUrl,
  debug,
  forceLogin,
  autoTrackLifecycle,
  sessionTimeoutMs,
  requestTimeoutMs: null,
  maxQueueSize: null,
  storagePrefix: null,
  header: null
})
```

### 函数式 API

- `init(options)`
- `track(eventName, properties = null)`
- `identify(assignmentId)`
- `setUserId(userId, userKey = null)`
- `setUserKey(userKey)`
- `clearUserId()`
- `flush()`

UTS 约束说明：

- 为了避免落入 `undefined` 语义，所有“非必填”字段统一显式声明为 `| null`
- 对外传入的配置对象不再依赖 `?` 可选属性
- demo 与插件入口都会显式补齐 `null` 默认值
- `track` 直接按独立 SDK 风格使用 `track(eventName, properties)`

## 6. 运行时架构

### 6.1 `GioTracker`

这是单例形式的顶层入口，也是唯一公开的核心 orchestrator。

职责：

- 校验初始化参数
- 恢复身份状态
- 维护当前页面快照
- 在关键事件和业务事件前检查并续期 session
- 组装统一事件结构
- 将事件放入队列并触发上报
- 把应用和页面生命周期桥接为 `VISIT`、`PAGE`、`APP_CLOSED`

### 6.2 `GioUserStore`

这是身份信息的单一事实来源。

职责：

- 持久化 `deviceId`
- 持久化 `userId`
- 持久化 `userKey`
- 持久化 `sessionId`
- 持久化 `sessionExpiresAt`
- 判断当前是否需要创建新 session
- 每次构建事件时都从存储重新读取 `sessionId` / `userId` / `userKey`

存储键约定：

- `${storagePrefix}:deviceId`
- `${storagePrefix}:sessionId`
- `${storagePrefix}:sessionExpiresAt`
- `${storagePrefix}:userId`
- `${storagePrefix}:userKey`

### 6.3 `GioUploader`

这是上传边界层。

职责：

- 保存待上报事件队列
- 在 `forceLogin` 开启时暂存积压队列
- 控制队列上限
- 序列化批量请求体
- 通过 `uni.request` 发起请求
- 避免并发重复 flush

当前实现选择“积极 flush”策略：

- `VISIT` 后 flush
- `PAGE` 后 flush
- `APP_CLOSED` 后 flush
- `track` 后 flush

这样做的好处是第一版逻辑简单、易观察、易调试。后续如果需要更强的 batching 或 retry，再在上传层继续演进即可。

### `forceLogin` / `identify`

最小对齐策略：

- 初始化时如果 `forceLogin = true`，事件先进入积压队列，不立刻发送
- 调用 `identify(assignmentId)` 后：
- 使用 `assignmentId` 覆盖后续事件的 `deviceId`
- 把积压事件的 `deviceId` 统一改成新的 `assignmentId`
- 关闭 `forceLogin`，并立即补发积压事件

当前版本只实现独立 SDK 中这条最核心的 force-login 行为链路，不额外补 `setUserAttributes`、多实例复制或更复杂的兼容层。

## 7. 事件模型

每个事件都会携带一组稳定的基础上下文字段：

- `appChannel`
- `appVersion`
- `dataSourceId`
- `deviceBrand`
- `deviceId`
- `deviceModel`
- `deviceType`
- `domain`
- `eventName`
- `eventSequenceId`
- `eventType`
- `language`
- `networkState`
- `operatingSystem`
- `path`
- `platform`
- `platformVersion`
- `query`
- `referralPage`
- `screenHeight`
- `screenWidth`
- `sdkVersion`
- `sessionId`
- `timestamp`
- `timezoneOffset`
- `title`
- `userId`
- `userKey`
- `attributes`

其中 `sessionId`、`userId`、`userKey` 不是从运行时内存缓存里拿，而是在构建事件时即时从存储读取。这样即使页面刷新、运行时局部重建、或者别的流程先一步改写了存储，最终进入请求体的仍然是当前存储里的真实值。

对外 API 直接按独立 SDK 风格使用 `track(eventName, properties)`。业务传入的 `properties` 在真正构建请求体时会被归一化后映射到独立 SDK 风格的 `attributes` 字段。

### 关键内置事件

- `VISIT`
- `PAGE`
- `APP_CLOSED`

### 其他事件类型

- `CUSTOM`

## 8. 生命周期策略

### `VISIT`

触发时机：

- 应用第一次创建 session
- 已有 session 过期后重新创建 session

上下文来源：

- 如果当前已经有页面快照，则带上页面上下文
- 否则只带基础身份和应用上下文

### `PAGE`

触发时机：

- 页面 `onShow`

上下文来源：

- 页面路由
- 页面标题
- 页面 load query
- 上一个页面路径，作为 `referralPage`

### `APP_CLOSED`

触发时机：

- 应用 `onHide`

上下文来源：

- 当前页面快照
- 当前页面前台停留时长，写入 `duration`

## 9. Session 模型

规则：

- `deviceId` 首次生成后长期持久化
- `sessionId` 在初始化时创建
- 当 `sessionExpiresAt <= now` 时续期并切新 session
- 每次切新 session 都会补发 `VISIT`
- 当 `setUserId()` 把登录用户从 A 切到 B 时，也会切新 session，并在后续事件前补发新的 `VISIT`
- 页面 `onShow` 是首屏和后续前台页面采集的主要触发点
- 自定义 `track` 也会重新检查 session，避免漏掉新的访问边界
- `sessionId`、`userId`、`userKey` 的最终取值始终以存储中的值为准，不依赖内存态缓存

默认值：

- `sessionTimeoutMs = 30min`

## 10. 上报协议

当前请求体结构：

```json
[
  {
    "appChannel": "scn:NA",
    "appVersion": "1.0.0",
    "dataSourceId": "demo-source",
    "deviceBrand": "Apple",
    "deviceId": "...",
    "deviceModel": "iPhone",
    "deviceType": "mobile",
    "domain": "demo-app",
    "eventSequenceId": 12,
    "eventType": "PAGE",
    "language": "zh-Hans",
    "networkState": "wifi",
    "operatingSystem": "uni-app-x-iOS",
    "path": "pages/home/index",
    "platform": "app",
    "platformVersion": "18.0",
    "query": "{\"from\":\"banner\"}",
    "referralPage": "pages/index/index",
    "screenHeight": 844,
    "screenWidth": 390,
    "sdkVersion": "0.1.0",
    "sessionId": "...",
    "timestamp": 1710000000000,
    "timezoneOffset": -480,
    "title": "Home",
    "userId": "user-123"
  },
  {
    "appChannel": "scn:NA",
    "appVersion": "1.0.0",
    "dataSourceId": "demo-source",
    "deviceBrand": "Apple",
    "deviceId": "...",
    "deviceModel": "iPhone",
    "deviceType": "mobile",
    "domain": "demo-app",
    "eventName": "purchase_submit",
    "eventSequenceId": 13,
    "eventType": "CUSTOM",
    "language": "zh-Hans",
    "networkState": "wifi",
    "operatingSystem": "uni-app-x-iOS",
    "path": "pages/order/confirm",
    "platform": "app",
    "platformVersion": "18.0",
    "screenHeight": 844,
    "screenWidth": 390,
    "sdkVersion": "0.1.0",
    "sessionId": "...",
    "timestamp": 1710000000200,
    "timezoneOffset": -480,
    "title": "确认订单",
    "userId": "user-123",
    "attributes": {
      "skuCount": 2,
      "payableAmount": 199
    }
  }
]
```

当前 URL 结构：

```text
{serverUrl}/v3/projects/{projectId}/collect?stm={timestamp}&compress=0
```

说明：

- 当前上报 body 已经按独立 SDK 的核心结构对齐为“事件数组直传”，不再包一层 `{ events: [...] }`
- `CUSTOM` 事件会使用 `eventName + attributes` 结构；`VISIT` / `PAGE` / `APP_CLOSED` 不再额外带 `eventName`
- `setUserId()` 不会单独发一条身份事件，而是更新存储中的 `userId` / `userKey`，必要时切换 session
- 如果后续要继续做更细粒度的 collector 对齐，主要改动点仍然集中在 `uploader.uts` 和 `tracker.uts`

## 11. 为什么这是合适的第一版

这版先保留了那些“以后很难回头补”的核心结构：

- 清晰的 uni-app x 模块组织方式
- 独立的身份存储层
- 独立的上传层
- 与独立 SDK 同方向的请求体结构
- 生命周期桥接与上传逻辑分离
- 关键事件命名与独立 SDK 同方向

同时刻意不去提前做那些需求还没稳定、但设计成本很高的部分：

- 更复杂的路由解析
- 字段级别的完全协议对齐
- 重试持久化
- 多实例行为
- 插件生态

## 12. 后续建议阶段

### Phase 2

- 更准确的页面停留时长计算
- 更丰富的设备 / 应用上下文字段
- 手动 `sendPage` / `sendVisit` API
- 定时批量上报和 retry backoff

### Phase 3

- 与独立 SDK 更细粒度的字段协议对齐
- force-login 队列语义
- 离线队列持久化

### Phase 4

- 曝光、性能、自动视图采集等插件化能力
- 多实例支持
- `web`、`app-android`、`app-ios`、`mp-weixin` 的测试矩阵

## 13. 当前基线的验收标准

- 应用可以通过 `plugin.uts` 或直接 `init` 初始化 SDK
- 新 session 创建时能发出 `VISIT`
- 页面显示时能发出 `PAGE`
- 应用退后台时能发出 `APP_CLOSED`
- 业务事件可通过 `track` 上报
- `userId` 和 `userKey` 可在运行时更新
- 待发送事件可通过 `flush` 主动上报

## 14. 当前已知缺口

- 还没有跑过 HBuilderX 编译验证
- 平台入口虽然已经补齐，但还没有经过五端逐一编译验证
- 还没有做到与独立 SDK 完整请求体对齐
- 当前 route / title 提取仍然只是“尽力提取”策略，后续还需要结合真实 uni-app x 页面对象继续收敛

这些缺口在当前阶段是可接受的，因为目标本来就是“保留基本功能”的第一版，而不是一次性做成完整对齐版本。
