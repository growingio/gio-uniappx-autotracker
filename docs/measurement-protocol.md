# GrowingIO Measurement Protocol（全端）

> 覆盖 **Web / 小程序(MinP) / App(iOS · Android · HarmonyOS)** 三端的事件上报协议。
> 上报方式：`POST` 到 collect 接口，Body 为事件对象数组。每个事件 = 公共字段（context）+ 事件专有字段。

## 1. 事件类型与适用端

| 事件类型 | 含义 | 发送时机 | Web | 小程序 | App |
|---|---|---|:--:|:--:|:--:|
| `VISIT` | 访问事件 | 产生一个新的访问时 | ✅ | ✅ | ✅ |
| `PAGE` | 页面浏览事件 | 打开一个页面时 | ✅ | ✅ | ✅ |
| `CUSTOM` | 自定义事件 | 主动调用 track 接口 | ✅ | ✅ | ✅ |
| `LOGIN_USER_ATTRIBUTES` | 登录用户属性事件 | 调用 setUserAttributes | ✅ | ✅ | ✅ |
| `APP_CLOSED` | 关闭事件 | 应用进入后台/关闭时 | — | ✅ | ✅ |
| `VIEW_CLICK` | 元素点击事件 | 点击页面元素时 | ✅ | ✅ | ✅ |
| `VIEW_CHANGE` | 输入元素改变事件 | 输入元素内容改变时 | ✅ | ✅ | ✅ |

---

## 2. 公共字段（context）

所有事件都携带。`●` 必填　`○` 选填　`—` 该端不携带。

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `deviceId` | string | ● | ● | ● | 设备 ID（访问用户 ID） |
| `userId` | string | ○ | ○ | ○ | 登录用户 ID |
| `userKey` | string | ○ | ○ | ○ | 登录用户 ID 类型：`phone` / `email` / … |
| `sessionId` | string | ● | ● | ● | 访问会话 ID |
| `dataSourceId` | string | ● | ● | ● | 数据源 ID |
| `eventType` | string | ● | ● | ● | 事件类型（见上表枚举） |
| `platform` | string | ● | ● | ● | Web：`web`；小程序：`MinP`；App：`iOS`/`Android`/`HarmonyOS` |
| `platformVersion` | string | — | ● | ● | 小程序：宿主（微信等）版本；App：操作系统版本 |
| `timestamp` | long | ● | ● | ● | 事件时间戳 |
| `domain` | string | ● | ● | ● | Web：网页域名；小程序：appId；App：包标识（iOS BundleID / Android·Harmony 包名）；Hybrid 为 H5 域名 |
| `urlScheme` | string | — | — | ○ | App 链接协议（如 `growing.xxx`）。仅在 init 配置中显式传入时才随事件携带；未配置则不上报，SDK 不会自动生成 |
| `appState` | string | — | — | ● | 应用前后台：`FOREGROUND` / `BACKGROUND` |
| `appName` | string | — | — | ● | 应用名称 |
| `path` | string | ● | ● | ○ | 页面路径。App 仅在 `PAGE`/`VIEW_*` 等关联页面的事件携带 |
| `query` | string | ○ | ○ | ○ | 页面查询参数（App 为 Hybrid 页面 url 的 query） |
| `title` | string | ○ | ○ | ○ | 页面标题（App 仅 `PAGE`） |
| `referralPage` | string | ○ | ○ | ○ | 来源页面。Web 所有事件携带；小程序 / App 仅 `PAGE` 携带 |
| `networkState` | string | — | ● | ● | 网络类型：`2G`/`3G`/`4G`/`5G`/`WIFI`/`UNKNOWN` |
| `appChannel` | string | — | ● | ○ | 小程序：场景值（`scn:xxx`）；App：应用渠道（Android 特有，如“应用宝”） |
| `screenWidth` | int | ● | ● | ● | 屏幕宽度（小程序 / App 为物理像素） |
| `screenHeight` | int | ● | ● | ● | 屏幕高度（小程序 / App 为物理像素） |
| `deviceBrand` | string | — | ● | ● | 设备品牌 |
| `deviceModel` | string | — | ● | ● | 设备型号 |
| `deviceType` | string | — | ● | ● | 设备类型。小程序：`Weixin-Android`/…；App：如 `iPhone`/`iPad` |
| `operatingSystem` | string | — | ● | — | 同 `deviceType`（仅小程序保留，冗余字段） |
| `appVersion` | string | ○ | ● | ● | 应用版本，用户配置 |
| `language` | string | ● | ● | ● | 语言，ISO 639。示例：Web `zh-CN`、小程序 `zh_CN`、App 完整 locale（如 `zh-Hans`） |
| `timezoneOffset` | string | ● | ● | ● | 时区偏移（分钟） |
| `latitude` | double | — | ○ | ○ | 纬度（调用 setLocation 后；Web 不支持） |
| `longitude` | double | — | ○ | ○ | 经度（调用 setLocation 后；Web 不支持） |
| `sdkVersion` | string | ● | ● | ● | SDK 版本号 |

---

## 3. 各事件专有字段

在公共字段之上叠加。`●` 必填　`○` 选填　`—` 不携带。

### 3.1 VISIT（访问事件）

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `eventSequenceId` | long | ● | ● | ● | 事件请求编号 |
| `idfa` | string | — | — | ○ | iOS 广告标识符 |
| `idfv` | string | — | — | ○ | iOS 应用开发商标识符 |
| `oaid` | string | — | — | ○ | Android 广告 ID（国内） |
| `googleAdvertisingId` | string | — | — | ○ | Android Google 广告 ID |
| `androidId` | string | — | — | ○ | Android ID |
| `imei` | string | — | — | ○ | Android IMEI |

### 3.2 PAGE（页面浏览事件）

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `eventSequenceId` | long | ● | ● | ● | 事件请求编号 |
| `orientation` | string | — | — | ● | 屏幕方向：`PORTRAIT` / `LANDSCAPE` |
| `protocolType` | string | ○ | — | ○ | 页面 url 协议头（如 `https`）；App 为 Hybrid 页面 |

> Web 端：同站不同页可能集成不同 SDK，`PAGE` 会再次携带 `sdkVersion` / `appVersion`。

### 3.3 CUSTOM（自定义事件）

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `eventSequenceId` | long | ● | ● | ● | 事件请求编号 |
| `eventName` | string | ● | ● | ● | 自定义事件名称 |
| `pageShowTimestamp` | long | ● | ○ | ○ | 关联页面的显示时间戳 |
| `attributes` | Map<string,string> | ○ | ○ | ○ | 自定义事件属性 |

### 3.4 LOGIN_USER_ATTRIBUTES（登录用户属性事件）

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `attributes` | Map<string,string> | ● | ● | ● | 登录用户属性 |

### 3.5 APP_CLOSED（关闭事件）

无专有字段，仅携带公共字段（Web 无此事件）。

### 3.6 VIEW_CLICK（元素点击事件）

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `eventSequenceId` | long | ● | ● | ● | 事件请求编号 |
| `pageShowTimestamp` | long | ● | ● | ● | 页面显示时间 |
| `textValue` | string | ○ | ○ | ○ | 元素文本内容 |
| `xpath` | string | ● | ● | ● | xpath 标识符 |
| `index` | int | ○ | ○ | ○ | 列表元素序号 |
| `hyperlink` | string | ○ | ○ | ○ | 元素的 href（Hybrid） |

### 3.7 VIEW_CHANGE（输入元素改变事件）

| 字段 | 类型 | Web | 小程序 | App | 说明 |
|---|---|:--:|:--:|:--:|---|
| `eventSequenceId` | long | ● | ● | ● | 事件请求编号 |
| `pageShowTimestamp` | long | ● | ● | ● | 页面显示时间 |
| `textValue` | string | ○ | ○ | ○ | 元素文本内容 |
| `xpath` | string | ● | ● | ● | xpath 标识符 |
| `index` | int | ○ | ○ | ○ | 列表元素序号 |
| `hyperlink` | string | — | — | ○ | 元素的 href（Hybrid） |

---

## 4. 端间口径差异速查

| 维度 | Web | 小程序 | App |
|---|---|---|---|
| `platform` | `web` | `MinP` | `iOS` / `Android` / `HarmonyOS` |
| `domain` | 网页域名 | 小程序 appId | 包标识（BundleID / 包名） |
| `screenWidth/Height` | 逻辑像素 | 物理像素 | 物理像素 |
| `path`/`title`/`referralPage` | 公共字段 | 公共字段 | 仅关联页面的事件 |
| `referralPage` | 所有事件 | 仅 PAGE | 仅 PAGE |
| `appChannel` | 无 | 场景值 | 应用渠道（仅 Android） |
| `operatingSystem` | 无 | 有 | 无 |
| `networkState`/设备型号品牌 | 无 | 有 | 有 |
| `APP_CLOSED` | 无此事件 | 有 | 有 |
| App 专属字段 | — | — | `urlScheme` / `appState` / `appName` |
| App 专属标识 | — | — | `idfa`/`idfv`（iOS）、`oaid`/`androidId`/`imei`（Android） |

---

## 5. 报文示例

### Web — PAGE

```json
{
  "deviceId": "7196f014-d7bc-4bd8-b920-757cb2375ff6",
  "userId": "张三",
  "sessionId": "d5cbcf77-b38b-4223-954f-c6a2fdc0c098",
  "dataSourceId": "ab66825b9f9c701a",
  "eventType": "PAGE",
  "platform": "web",
  "timestamp": 1506069592985,
  "domain": "test-browser.growingio.com",
  "path": "/push/cdp/web.html",
  "query": "a=1&b=2",
  "title": "CDP-Web弹窗",
  "referralPage": "http://test-browser.growingio.com/push/cdp",
  "eventSequenceId": 3,
  "protocolType": "https",
  "screenWidth": 1080,
  "screenHeight": 1920,
  "language": "zh-CN",
  "timezoneOffset": "-480",
  "appVersion": "1.2.4",
  "sdkVersion": "3.0.1"
}
```

### 小程序 — VISIT

```json
{
  "deviceId": "d8367487-404f-41a8-bc20-55d083fc43e7",
  "sessionId": "85830a6a-1651-4b00-ba48-5f1df1d00aa9",
  "dataSourceId": "datasource-id-121212",
  "userId": "4444",
  "eventType": "VISIT",
  "platform": "MinP",
  "platformVersion": "Weixin 7.0.19",
  "timestamp": 1607416671122,
  "domain": "wx265d0fa6fa70fae9",
  "path": "pages/index/index",
  "eventSequenceId": 1,
  "networkState": "WIFI",
  "appChannel": "scn:1001",
  "screenWidth": 1080,
  "screenHeight": 2400,
  "deviceBrand": "HONOR",
  "deviceModel": "BMH-AN10",
  "deviceType": "Weixin-Android",
  "operatingSystem": "Weixin-Android",
  "appVersion": "1.0",
  "language": "zh_CN",
  "timezoneOffset": "-480",
  "sdkVersion": "1.3"
}
```

### App — VISIT

```json
{
  "deviceId": "7196f014-d7bc-4bd8-b920-757cb2375ff6",
  "userId": "张三",
  "sessionId": "d5cbcf77-b38b-4223-954f-c6a2fdc0c098",
  "dataSourceId": "ab66825b9f9c701a",
  "eventType": "VISIT",
  "platform": "Android",
  "platformVersion": "7.1.2",
  "timestamp": 1506069592985,
  "domain": "com.growingio.app",
  "appState": "FOREGROUND",
  "eventSequenceId": 3,
  "networkState": "4G",
  "appChannel": "应用宝",
  "screenWidth": 1080,
  "screenHeight": 1920,
  "deviceBrand": "google",
  "deviceModel": "Nexus 5",
  "deviceType": "PHONE",
  "appName": "看数小助手",
  "appVersion": "1.2.4",
  "language": "zh-Hans",
  "timezoneOffset": "-480",
  "oaid": "eeefbf75-3df7-15e0-ffb5-ff1ff09f1ec3",
  "sdkVersion": "3.0.1"
}
```

### App — PAGE

```json
{
  "deviceId": "7196f014-d7bc-4bd8-b920-757cb2375ff6",
  "userId": "张三",
  "sessionId": "d5cbcf77-b38b-4223-954f-c6a2fdc0c098",
  "dataSourceId": "ab66825b9f9c701a",
  "eventType": "PAGE",
  "platform": "Android",
  "platformVersion": "7.1.2",
  "timestamp": 1506069592985,
  "domain": "com.growingio.app",
  "appState": "FOREGROUND",
  "eventSequenceId": 3,
  "path": "/NestedFragmentActivity/GreenFragment[fragment1]",
  "orientation": "PORTRAIT",
  "title": "GreenFragment",
  "networkState": "4G",
  "appChannel": "应用宝",
  "screenWidth": 1080,
  "screenHeight": 1920,
  "deviceBrand": "google",
  "deviceModel": "Nexus 5",
  "deviceType": "PHONE",
  "appName": "看数小助手",
  "appVersion": "1.2.4",
  "language": "zh-Hans",
  "timezoneOffset": "-480",
  "sdkVersion": "3.0.1"
}
```

### App — APP_CLOSED

```json
{
  "deviceId": "7196f014-d7bc-4bd8-b920-757cb2375ff6",
  "userId": "张三",
  "sessionId": "d5cbcf77-b38b-4223-954f-c6a2fdc0c098",
  "dataSourceId": "ab66825b9f9c701a",
  "eventType": "APP_CLOSED",
  "platform": "Android",
  "platformVersion": "7.1.2",
  "timestamp": 1506069592985,
  "domain": "com.growingio.app",
  "appState": "FOREGROUND",
  "networkState": "4G",
  "appChannel": "应用宝",
  "screenWidth": 1080,
  "screenHeight": 1920,
  "deviceBrand": "google",
  "deviceModel": "Nexus 5",
  "deviceType": "PHONE",
  "appName": "看数小助手",
  "appVersion": "1.2.4",
  "language": "zh-Hans",
  "timezoneOffset": "-480",
  "sdkVersion": "3.0.1"
}
```
