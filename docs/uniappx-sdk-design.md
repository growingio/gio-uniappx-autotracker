# uni-app x 跨端采集 SDK 设计方案

## 1. 目标

构建一个面向 uni-app x 的跨端采集 SDK。当前版本以 `uni_modules/gio-uniappx-autotracker` 为源代码与集成包事实源，优先保证公开入口、生命周期桥接、事件构建、上传、用户身份、插件能力和平台边界稳定。

当前基线能力包括：

- 初始化
- 自定义事件采集
- 用户身份管理：`sessionId`、`userId`、`userKey`
- 关键生命周期事件：`VISIT`、`PAGE`、`APP_CLOSED`
- 事件上报
- `dataCollect` 运行时开关
- 非 web 端经纬度字段设置
- 单实例 `gioABTest`
- 微信小程序分享 / 朋友圈 / 收藏包装器

这份设计文档描述当前仓库状态，不作为历史计划记录。后续如果能力继续演进，应同步更新本文件、根 README 和 QA 文档。

## 2. 参考来源提炼

优先级说明：

- 第一优先级：uni-app x 官方 UTS 与 API 文档
- 第二优先级：`uni-stat` 的目录组织和插件接入方式
- 第三优先级：`gio-miniprogram-autotracker` 的事件模型和调用习惯

也就是说，独立 SDK 现在更适合作为“行为参考”和“协议参考”，但所有 API 调用方式、语法约束、跨端可编译性判断，都要以官方文档为准。

### 来自 `uni-stat`

参考的 `uni-stat` 模块主要提供了目录组织方式：

- 使用 `uni_modules` 风格的包结构
- 对外收口 `gdp(...)` 作为统一调用入口，`plugin.uts` 仅保留内部生命周期桥接实现
- 对外 API 放在 `utssdk/index.uts`
- 共享运行时代码放在 `utssdk/common`
- 平台编译入口需要落到 `utssdk/<platform>/index.uts`
- 生命周期桥接放在 mixin 中，而不是把入口逻辑硬写进核心类
- 生命周期桥接进入 `utssdk/` 之前，必须先在 JS 编译层把页面实例和启动参数归一化成稳定的普通对象快照，不能直接透传 `this` 或原始 `options`

### 来自 `gio-miniprogram-autotracker`

小程序独立 SDK 主要提供了事件方向和核心职责拆分：

- 关键事件名称应沿用 `VISIT`、`PAGE`、`APP_CLOSED`
- 需要一个顶层 orchestrator 负责统一调度
- 需要独立的 `userStore`
- 需要独立的 `uploader`
- 页面和应用生命周期应在“事件构建层”处理，而不是混进上传逻辑

当前实现已经在这些基线之上补充了 `dataCollect`、web 存储配置、微信小程序分享包装器和单实例 ABTest。多实例、曝光、性能采集和更完整的自动采集仍不属于当前基线。

## 3. 当前非目标

- 完整对齐 GrowingIO 线上协议
- 覆盖独立 SDK 的全部 API
- 完整页面 / 组件自动采集能力
- 曝光采集
- 多实例支持
- 离线重试持久化
- 通用运行时配置修改入口；`setOptions` 当前只允许修改 `dataCollect`

## 4. 目录结构

```text
gio-uniappx-autotracker/
  package.json
  plugin.uts
  utssdk/
    index.uts
    interface.uts
    common/
      config.uts
      route.uts
      core/
        tracker.uts
        uploader.uts
      dataStore/
        index.uts
        context/
          system-context.uts
        eventBuilder/
          index.uts
        page/
          page-store.uts
      plugins/
        gio-abtest.uts
      runtime/
        index.uts
      storage/
        encrypt.uts
        index.uts
      userStore/
        index.uts
      utils/
        base.uts
        debug.uts
        request.uts
        system.uts
        validate.uts
    web/
      package.json
      index.uts
      runtime.uts
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
      miniprogram.uts
      share.uts
```

## 5. 对外 API

### 函数式 API

- `gdp('init', { app, ...options })`
- `gdp('track', eventName, properties = null)`
- `gdp('identify', assignmentId)`
- `gdp('setUserId', userId, userKey = null)`
- `gdp('setOptions', { dataCollect })`
- `gdp('setLocation', latitude, longitude)`（非 web 端）
- `gdp('setUserAttributes', userAttributes)`
- `gdp('clearUserId')`
- `gdp('registerPlugins', plugins)`
- `gdp('getABTest', layerId, callback = null)`

微信小程序端额外导出包装器：

- `wrapShareAppMessage(handler)`
- `wrapShareTimeline(handler)`
- `wrapAddToFavorites(handler)`

web 端额外支持两个初始化项：

- `storageType`：浏览器存储策略，默认 `cookie`
- `cookieDomain`：cookie 域名，仅在 `storageType = cookie` 时生效

跨端配置项补充：

- `originalSource`：默认 `true`
- `followShare`：仅 `mp-weixin` 生效，默认 `true`；其他端固定关闭
- `dataCollect`：默认 `true`，也可通过 `setOptions({ dataCollect })` 动态切换

UTS 约束说明：

- 为了避免落入 `undefined` 语义，所有“非必填”字段统一显式声明为 `| null`
- 对外传入的配置对象不再依赖 `?` 可选属性
- `idMapping` 默认 `false`；只有显式开启后，`setUserId(userId, userKey)` 里的 `userKey` 才会持久化并参与后续事件上报
- `track` 直接按独立 SDK 风格使用 `gdp('track', eventName, properties)`
- `setOptions` 参数必须显式包含布尔字段 `dataCollect`，当前不允许借此修改其他初始化项
- `setLocation` 只接受合法经纬度数字：`latitude` 范围 `-90..90`，`longitude` 范围 `-180..180`；web 端调用会返回 `false`
- `flush`、`autoTrackLifecycle`、`requestTimeoutMs`、`maxQueueSize`、`storagePrefix`、`header` 都不再对外透出，也不允许传入初始化配置
- 当前插件层只支持 `gioABTest`
- 插件注册方式先按小程序独立 SDK 思路对齐：先 `gdp('registerPlugins', [...])`，再调用 `gdp('getABTest', ...)`
- 微信小程序分享采集通过显式包装器完成，不用全局 mixin 注入分享钩子

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
- 调用路由解析模块，统一维护 `path` / `query` / `title` / `referralPage`
- 等待异步设备信息和网络信息就绪后，再真正构建事件并入队
- 首屏 `VISIT` / `PAGE` 也不能例外，必须等上下文 ready 后才能发送
- 只消费稳定的初始化配置、页面快照、启动参数快照，不直接依赖原始页面实例
- 只编排 `setLocation` 的校验和平台限制，实际经纬度状态由 `dataStore` 保存并进入事件构建

边界约束：

- `tracker` 只做编排，不直接承担平台页面实例适配
- 页面实例字段提取、`this`/`options` 浅拷贝、`referrerInfo` 兼容处理，统一放在 `plugin.uts` 或独立解析模块里
- 小程序入口来源、scene、referrer 的兜底解析应沉到独立模块，不要继续堆进 `tracker.uts`

web 端会从初始化配置里读取 `storageType` / `cookieDomain`，用于选择浏览器存储实现和 cookie 域名。

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
- `identify(assignmentId)` 生效后持久化新的 `deviceId`

存储键约定：

- `deviceId`：`gdp_user_id_gioenc`
- `sessionId`：`${projectId}_gdp_session_id`
- `userId`：`${projectId}_gdp_cs1_gioenc`
- `userKey`：`${projectId}_gdp_user_key_gioenc`
- `eventSequenceId`：`${projectId}_gdp_sequence_ids`
- `sessionExpiresAt`：`${projectId}_gdp_session_id_expire`

说明：

- 以上核心 key 按 web 独立 SDK 的命名规则对齐
- `deviceId` 使用全局 key，不带 `projectId` 前缀
- `deviceId`、`userId`、`userKey` 这三个 `_gioenc` 字段会按 web 独立 SDK 规则加密存储：真实存储 key 去掉 `_gioenc` 后缀，value 按 `gioenc-` + 异或编码写入
- `sessionExpiresAt` 是 uni-app x 这边为了补齐本地过期判断增加的辅助 key，web 独立 SDK 对应能力主要依赖带过期时间的存储封装

### 6.3 `GioUploader`

这是上传边界层。

职责：

- 保存待上报事件队列
- 在 `forceLogin` 开启时暂存积压队列
- 控制队列上限
- 序列化批量请求体
- 通过 `uni.request` 发起请求
- 避免并发重复 flush
- `identify` 成功后把积压队列释放到正式发送队列

当前实现选择“积极 flush”策略：

- `VISIT` 后 flush
- `PAGE` 后 flush
- `APP_CLOSED` 后 flush
- `track` 后 flush

这样做的好处是当前基线逻辑简单、易观察、易调试。后续如果需要更强的 batching 或 retry，再在上传层继续演进即可。

当前这些发送策略完全由 SDK 内部固定控制，不提供外部手动 `flush()` 入口。

`mp-weixin` 端会对 flush 做固定节流，避免小程序端高频事件触发过密请求；其他端是否延迟 flush 由平台 runtime resolver 决定。

### `forceLogin` / `identify`

最小对齐策略：

- 初始化时如果 `forceLogin = true`，事件先进入积压队列，不立刻发送
- 调用 `identify(assignmentId)` 后：
- 使用 `assignmentId` 覆盖后续事件的 `deviceId`
- 把积压事件的 `deviceId` 统一改成新的 `assignmentId`
- 关闭 `forceLogin`，并立即补发积压事件

当前版本只实现独立 SDK 中最核心的 force-login 行为链路，并补齐了 `setUserAttributes` 的基础上报能力；但仍然不覆盖多实例复制或更复杂的兼容层。

### 6.4 `gioABTest`

当前插件层先只支持一个插件：`gioABTest`。

当前版本的 ABTest 能力按“小程序独立 SDK 的单实例主流程”对齐，不引入 `trackingId` 多实例语义。

对外约束：

- 只支持通过 `gdp('registerPlugins', [{ name: 'gioABTest', options }])` 注册
- 不提供 `createGioABTestPlugin(options)` 这类先生成插件项、再二次注册的包装入口
- 注册成功后，通过 `gdp('getABTest', layerId, callback)` 获取实验数据
- 如果没有注册插件就调用 `gdp('getABTest', ...)`，会按小程序 SDK 的方向报错并回调空对象
- 当前只考虑单实例场景，不支持 `gdp('getABTest', trackingId, layerId, callback)` 这类多实例调用方式

当前对齐到的小程序核心逻辑：

- `abServerUrl` 默认回退到 `https://ab.growingio.com`
- `requestInterval` 默认 `5` 分钟
- `requestTimeout` 默认 `1000ms`
- 使用“单实例 + `projectId` + `deviceId` + `layerId`”生成缓存 hash key
- 命中节流 key 使用 `_gdp_abt_sign`
- 实验数据缓存 key 使用 `_gdp_abtd`
- 请求失败时保留“超时直接失败、非超时最多重试 2 次”的策略
- 只有接口返回的新实验数据和本地缓存不一致时，才补发 `$exp_hit`
- `$exp_hit` 只在网络响应路径触发，不会因为读缓存命中而重复上报

当前刻意没有补齐的点：

- 多实例 trackingId 维度的 ABTest 地址映射
- 多实例下的 `getABTest(trackingId, layerId, callback)` 调用方式
- 更通用的插件安装器和插件生命周期
- 除 `gioABTest` 以外的其他插件

### 6.5 微信小程序分享包装器

微信小程序端提供三个显式包装器：

- `wrapShareAppMessage`
- `wrapShareTimeline`
- `wrapAddToFavorites`

设计原则：

- 只代理业务页已经定义的分享 / 收藏钩子，不通过全局 mixin 让所有页面都出现转发菜单
- 包装器先执行业务 handler，保留业务返回值，再补充 SDK 需要的分享字段
- `followShare` 仅在 `mp-weixin` 生效，默认开启；其他端固定关闭
- `onShareAppMessage` 会维护分享往返状态，用于保护回流场景下的 `originalSource`

当前事件名对齐小程序独立 SDK：

- `$mp_on_share`
- `$mp_share_timeline`
- `$mp_add_favorites`

### 6.6 `system-context.uts`

这是设备与网络上下文的集中管理文件。

职责：

- 按官方 uni-app x 文档调用 `uni.getSystemInfo(options)` 获取设备和系统信息
- 按官方 uni-app x 文档调用 `uni.getNetworkType(options)` 获取网络状态
- 监听 `uni.onNetworkStatusChange`，在网络变化后刷新后续事件上下文
- 在首轮系统信息和网络信息完成前，暂存待构建事件回调
- 只有在上下文 ready 后，才允许 `tracker` 真正构建事件对象

这样做的目的，是保证进入请求体的 `deviceBrand`、`deviceModel`、`networkState`、`platform`、`platformVersion` 等字段，来自异步 API 的最终结果，而不是先用空值建事件、再在发送阶段补救。
这条约束同样适用于首屏 `VISIT` 和首个 `PAGE`：上下文没 ready 时，它们只能等待，不能抢先发送不完整事件。

### 6.7 `route.uts`

这是当前页面路由解析的集中管理文件。

职责：

- 统一消费 JS 编译层传入的页面快照，而不是直接读取原始页面实例
- 统一从 `route`、`$scope.route`、`fullPath`、`url` 等多个候选字段中提取页面路径
- 统一从 `onLoad(options)` 快照、`page.options` 快照、`$scope.options` 快照、URL query 中提取页面参数
- 统一归一化 `query` 的上报格式，最终始终输出字符串
- 生成路由签名，用于判断“同一路径但 query 已变化”的场景
- 为 `tracker` 提供 `path` / `query` / `title` / `signature` 这一组稳定结果

演进规则：

- 如果后续还有新平台字段需要参与路由解析，先扩展 JS 层快照结构，再让 `route.uts` 消费新增字段
- 不允许为了省事回退到在 `utssdk/` 里直接接页面实例或直接假设 `UniPage`

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
- `latitude`
- `longitude`
- `networkState`
- `operatingSystem`
- `path`
- `platform`
- `platformVersion`
- `protocolType`
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

`eventSequenceId` 当前按独立 SDK 的全局事件序号思路实现：普通事件从 `1` 开始递增并持久化到 `${projectId}_gdp_sequence_ids`；`LOGIN_USER_ATTRIBUTES` 和 `APP_CLOSED` 不带这个字段。

同时，设备信息和网络信息不会在 `init` 后立即同步写死到内存事件模板中，而是先等待异步 API 回调完成，再参与事件构建。这样请求体里看到的字段值会更接近真实端能力返回结果。
其中首屏 `VISIT` 和首个 `PAGE` 事件也不会提前发出，必须在这些异步上下文回填后才允许真正入队和上报。

其中 `protocolType` 按独立 web SDK 的行为对齐：只在 `web` 端的 `PAGE` 事件上报，例如 `http`、`https`；其他事件和其他平台都不带这个字段。

其中 `latitude` / `longitude` 由 `gdp('setLocation', latitude, longitude)` 写入运行时状态。该 API 仅非 web 端支持，设置后影响后续事件构建；当前不做持久化，运行时重建后需要业务重新设置。

对外 API 直接按独立 SDK 风格使用 `gdp('track', eventName, properties)`。业务传入的 `properties` 在真正构建请求体时会被归一化后映射到独立 SDK 风格的 `attributes` 字段。

其中 `query` 的当前契约是“普通字符串”，例如 `from=banner&source=home`，不会上报成 JSON 字符串。

### 关键内置事件

- `VISIT`
- `PAGE`
- `APP_CLOSED`

### 其他事件类型

- `CUSTOM`
- `LOGIN_USER_ATTRIBUTES`

## 8. 生命周期策略

### 生命周期桥接总原则

- `plugin.uts` 是 JS 编译层桥接器，只负责监听生命周期、做浅拷贝、构造快照并转发
- `utssdk/` 是原生编译层，只接收稳定的普通对象，不直接接收 `this`、页面实例或原始 `options`
- 页面快照当前最小字段集合为 `route`、`$scope.route`、`options`、`$scope.options`、`title`
- 启动参数快照当前最小字段集合为 `path`、`scene`、`query`、`referrerInfo` / `refererInfo`
- 如果后续能力需要更多字段，先补快照结构，再补 `tracker` / `route` 的消费逻辑
- `plugin.uts` 不重复实现 session、事件构建、上报策略；`tracker` 也不反向接管桥接细节

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

当前实现补充规则：

- 路由解析统一走 `route.uts`
- `onLoad`、`onShow`、`onHide`、`onUnload` 进入 `utssdk/` 时统一使用 JS 层快照对象，不直接传页面实例
- `referralPage` 的切换判断不只看 `path`，而是看 `path + query` 组成的路由签名
- 同一路径但 query 变化时，会被当成新的路由状态处理
- 新页面如果暂时还没有标题，不会继续沿用上一个页面的标题

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
- 当 `forceLogin = true` 时，先继续采集事件但暂不发送，直到 `identify()` 成功
- `identify()` 成功后会把新的 `assignmentId` 持久化为 `deviceId`，并补发之前积压的事件
- 当 `setUserId()` 把登录用户从 A 切到 B 时，也会切新 session，并在后续事件前补发新的 `VISIT`
- 页面 `onShow` 是首屏和后续前台页面采集的主要触发点
- 自定义 `track` 也会重新检查 session，避免漏掉新的访问边界
- `sessionId`、`userId`、`userKey` 的最终取值始终以存储中的值为准，不依赖内存态缓存

`sessionExpires` 不作为对外初始化配置暴露，session 过期策略由 SDK 内部按平台默认规则处理。

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
    "latitude": 31.2304,
    "longitude": 121.4737,
    "networkState": "wifi",
    "operatingSystem": "uni-app-x-iOS",
    "path": "pages/home/index",
    "platform": "app",
    "platformVersion": "18.0",
    "query": "from=banner",
    "referralPage": "pages/index/index",
    "screenHeight": 844,
    "screenWidth": 390,
    "sdkVersion": "0.1.0",
    "sessionId": "...",
    "timestamp": 1710000000000,
    "timezoneOffset": "-480",
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
    "timezoneOffset": "-480",
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
- `setUserId()` 不会单独发一条身份事件，而是更新存储中的 `userId`，并在 `idMapping = true` 时更新 `userKey`；必要时切换 session
- 非法 `userId`（如空串、`null`、`undefined`、`-`）直接返回 `false`，不会借失败路径隐式清空当前登录态
- `query` 当前按普通 query string 上报，不再序列化为 JSON 字符串
- 设备信息和网络信息字段在事件构建前会先等待异步上下文 ready
- `latitude` / `longitude` 仅在业务设置后随事件上报；未设置时会被清理，不进入最终请求体
- `mp-weixin` 会优先读取启动上下文里的 `scene` / `wxShoppingListScene`，并把它映射到 `appChannel`
- 如果后续要继续做更细粒度的 collector 对齐，主要改动点仍然集中在 `uploader.uts` 和 `tracker.uts`

## 11. 为什么这是合适的当前基线

当前基线保留了那些“以后很难回头补”的核心结构：

- 清晰的 uni-app x 模块组织方式
- 独立的身份存储层
- 独立的上传层
- 与独立 SDK 同方向的请求体结构
- 生命周期桥接与上传逻辑分离
- 关键事件命名与独立 SDK 同方向
- 插件层先把最需要对齐的 `gioABTest` 单独补上
- 平台专属能力留在平台目录，例如 `mp-weixin/share.uts` 和 `web/runtime.uts`

同时刻意不去提前做那些需求还没稳定、但设计成本很高的部分：

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
- `setLocation` 持久化策略是否需要对齐独立 SDK

### Phase 3

- 与独立 SDK 更细粒度的字段协议对齐
- 离线队列持久化

### Phase 4

- 曝光、性能、自动视图采集等插件化能力
- 多实例支持
- `web`、`app-android`、`app-ios`、`mp-weixin` 的测试矩阵

## 13. 当前基线的验收标准

- 应用通过 `gdp('init', { app, ...options })` 初始化 SDK
- 新 session 创建时能发出 `VISIT`
- 页面显示时能发出 `PAGE`
- 应用退后台时能发出 `APP_CLOSED`
- 业务事件可通过 `gdp('track', eventName, properties)` 上报
- `userId` 和 `userKey` 可在运行时更新
- `dataCollect` 可通过 `setOptions({ dataCollect })` 动态切换
- 非 web 端可通过 `setLocation(latitude, longitude)` 给后续事件补充经纬度
- 待发送事件会按 SDK 内部发送策略自动上报

## 14. 当前已知缺口

- 不能只凭源码或目录结构声称“五端都能编译并可上报”；必须经过 HBuilderX 五端真实编译验证
- `app-android` 的 `App.uvue` mixin 仍有限制，`APP_CLOSED` 与完整退后台链路还需要继续做真机验证
- 还没有做到与独立 SDK 完整请求体对齐
- 当前 route / title 提取仍然只是“尽力提取”策略，后续还需要结合真实 uni-app x 页面对象继续收敛
- 当前虽然已经把路由解析集中到了 `route.uts`，但不同端的页面对象字段还需要继续补充更多真实样本验证
- 当前设备与网络字段虽然已经切到官方异步 API 驱动，但还需要继续做五端真机 / 模拟器样本校验，确认各端返回字段名没有额外差异
- 当前 `setLocation` 保存在运行时内存，不跨运行时重建持久化；如果后续要长期沿用，需要补存储语义并更新事件构建规则

这些缺口是当前基线的已知边界。对外交付或对齐独立 SDK 前，需要逐项补验证证据，不能把文档里的能力边界当作真实五端通过证明。
