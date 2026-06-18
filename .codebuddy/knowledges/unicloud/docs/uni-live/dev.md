# 开发指南

## 客户端

uni直播可在uni-app或者uni-app x中快速集成，同时也支持使用第三方推流工具和拉流工具使用，[详见](https://doc.dcloud.net.cn/uniCloud/uni-live/other-live-streaming-methods.html)

### uni-app

以下介绍在uni-app中如何实现推流和拉流，详细的示例代码请[参考](https://gitcode.com/dcloud/uni-live-test-demo)

#### 推流

> 仅支持 App 端与微信小程序端

uni-app 使用 [live-pusher](https://uniapp.dcloud.net.cn/component/live-pusher.html) 组件进行推流。

```vue
<template>
	<live-pusher
		id='livePusher'
		ref="livePusher"
		class="livePusher"
		:url="url"
		mode="SD"
		:muted="true"
		:enable-camera="true"
		:auto-focus="true"
		:beauty="1"
		whiteness="2"
		aspect="9:16"
		@statechange="statechange"
		@netstatus="netstatus"
		@error = "error"
	></live-pusher>
</template>

<script>
	export default {
		data() {
			return {
				url: ""
			}
		},
		onReady() {
			// 注意：需要在onReady中 或 onLoad 延时
			this.context = uni.createLivePusherContext("livePusher", this);
		},
		methods: {
			statechange(e) {
				console.log("statechange:" + JSON.stringify(e));
			},
			netstatus(e) {
				console.log("netstatus:" + JSON.stringify(e));
			},
			error(e) {
				console.log("error:" + JSON.stringify(e));
			},
			start: function () {
				this.context.start({
					success: (a) => {
						console.log("livePusher.start:" + JSON.stringify(a));
					}
				});
			},
			close: function() {
				this.context.close({
					success: (a) => {
						console.log("livePusher.close:" + JSON.stringify(a));
					}
				});
			}
		}
	}
</script>
```

#### 拉流

微信小程序端使用[live-player](https://uniapp.dcloud.net.cn/component/live-player.html)组件进行直播拉流；web/app端，使用[video](https://uniapp.dcloud.net.cn/component/video.html)组件进行直播拉流。

**在web拉流时需注意**
1. 拉流地址为rtmp协议时，在web端不支持播放，需要使用 Flash 播放器或转码为其他格式。
2. 拉流地址视频格式为m3u8时，在web端video组件不支持播放，需要使用三方库[hls.js](https://github.com/video-dev/hls.js)播放。
3. 拉流地址视频格式为flv时，在web端video组件不支持播放，需要使用三方库[flv.js](https://github.com/bilibili/flv.js)播放。

```vue
<template>
	<live-player
		src="rtmp://pull.example.com/live/streamName"
		autoplay
		@statechange="statechange"
		@error="error"
		style="width: 300px; height: 225px;"
	/>
</template>

<script>
    export default {
        methods:{
            statechange(e){
                console.log('live-player code:', e.detail.code)
            },
            error(e){
                console.error('live-player error:', e.detail.errMsg)
            }
        }
    }
</script>
```

### uni-app x

> 在 uni-app x 中推拉流， 需要 HBuilderX 4.81 及以上版本。

::: warning 说明
在 uni-app x 推流前，需要申请授权应用包名与推流地址域名，如需申请请加入[uni直播技术交流群](https://im.dcloud.net.cn/#/?joinGroup=68622a2ba99ae56f95028db1)联系管理员，申请会在一个工作日内处理完。

申请模板：
```
申请 uni-app x 直播授权
应用包名：UNI_XXXXXX
推流域名：rtmp-push.example.com
```
:::

#### 推流

> 仅支持 App 端与微信小程序端

uni-app x 使用 [live-pusher](https://doc.dcloud.net.cn/uni-app-x/component/live-pusher.html) 组件进行推流。

```vue
<template>
	<live-pusher :url="url" mode="FHD" :enable-camera="true" :enable-mic="true" @statechange="handleStateChange"
		@error="handleError" @netstatus="handleNetstatus" id="livePusher" ref="pusher"
		class="live-pusher"></live-pusher>
	<view class="info-wrap">
		<text class="info-item">状态: {{state}}</text>
		<text class="info-item">音频码率: {{audioBitrate}}</text>
		<text class="info-item">网络速度: {{netSpeed}}</text>
		<text class="info-item">视频帧率: {{videoFPS}}</text>
		<text class="info-item">视频码率: {{videoBitrate}}</text>
		<text class="info-item">关键帧率间隔: {{videoGOP}}</text>
	</view>
	<view class="btn-wrap">
		<button @click="start">开始推流</button>
		<button @click="stop">停止推流</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				state: 'unknow',
				audioBitrate: 0,
				netSpeed: 0,
				videoBitrate: 0,
				videoFPS: 0,
				videoGOP: 0,
				context: null as LivePlayerContext | null
			}
		},
		methods: {
			createContext() {
				if (this.context == null) {
					this.context = uni.createLivePusherContext('livePusher')!
				}
			},
			handleStateChange(e : UniLivePusherStatechangeEvent) {
				this.state = e.detail.message
				console.log('handleStateChange', JSON.stringify(e.detail))
			},

			handleError(e : UniLivePusherErrorEvent) {
				this.state = e.detail.errMsg
				console.log('handleError', JSON.stringify(e.detail))

			},
			handleNetstatus(e : UniLivePusherNetstatusEvent) {
				this.audioBitrate = e.detail.audioBitrate
				this.netSpeed = e.detail.netSpeed
				this.videoBitrate = e.detail.videoBitrate
				this.videoFPS = e.detail.videoFPS
				this.videoGOP = e.detail.videoGOP
				this.videoHeight = e.detail.videoHeight
				this.videoWidth = e.detail.videoWidth
				console.log('handleNetstatus', JSON.stringify((e.detail)))
			},
			start() {
				this.createContext()
				this.context!.start({
					success(info ?: UTSJSONObject) {
						console.log("推流成功", JSON.stringify(info))
					},
					fail(info ?: UTSJSONObject) {
						console.log("推流失败", JSON.stringify(info))
					},
					complete() {
						console.log("推流完成")
					}
				} as LivePusherOptions)
			},
			// 停止推流
			stop() {
				this.createContext()
				this.context!.stop({
					success(info ?: UTSJSONObject) {
						console.log("关闭成功")
					},
					fail(info ?: UTSJSONObject) {
						console.log("关闭失败")
					},
					complete() {
						console.log("关闭完成")
					}
				} as LivePusherOptions)
			},
		}
	}
</script>

<style>
	.btn-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 50px;
		display: flex;
		flex-direction: row;
		padding: 0 20px;
	}

	.info-wrap {
		position: fixed;
		left: 0;
		right: 0;
		top: 50px;
		padding: 0 20px;
	}
</style>
```

#### 拉流

app端和小程序都使用[live-player](https://doc.dcloud.net.cn/uni-app-x/component/live-player.html)组件进行直播拉流，web端使用[video](https://doc.dcloud.net.cn/uni-app-x/component/video.html)组件进行直播拉流。

**在web拉流时需注意**
1. 拉流地址为rtmp协议时，在web端不支持播放，请使用其他格式。
2. 拉流地址视频格式为m3u8时，在web端video组件不支持播放，需要使用三方库[hls.js](https://github.com/video-dev/hls.js)播放。
3. 拉流地址视频格式为flv时，在web端video组件不支持播放，需要使用三方库[flv.js](https://github.com/bilibili/flv.js)播放。

```vue

<template>
	<live-player 
        :style="{'width' : '100%','height': '40%'}" 
        ref="liveref"
        :src="url"
        @fullscreenchange="fullscreenCallBack"
        @statechange="statechangeCallBack"
        @error="errorCallBack"
        id="livePlayer"></live-player>
	<button @click="play">播放</button>
	<button @click="pause">暂停</button>
	<button @click="stop">停止</button>
</template>

<script>
  export default {
    data() {
      return {
        url: 'rtmp://rtmp-pull.pcwant.com/6835813bf946a46b27902e06/test',
		context: null as LivePlayerContext | null
      }
    },
    methods: {
	    createContext() {
		    if (this.context == null) {
			    this.context = uni.createLivePlayerContext('livePlayer')!
		    }
	    },
	    play() {
		    this.createContext()
		    this.context!.play({
			    success(info?: UTSJSONObject) {
                    console.log("播放成功")
                },
                fail(info?: UTSJSONObject) {
                    console.log("播放失败")
                },
                complete() {
                    console.log("播放完成")
                }
            } as LivePlayerOptions)
        },
	    pause() {
		    this.createContext()
		    this.context!.pause({
			    success(info?: UTSJSONObject) {
                    console.log("暂停成功")
                },
                fail(info?: UTSJSONObject) {
                    console.log("暂停失败")
                },
                complete() {
                    console.log("暂停完成")
                }
            } as LivePlayerOptions)
	    },
	    stop() {
		    this.createContext()
		    this.context!.stop({
			    success(info?: UTSJSONObject) {
                    console.log("关闭成功")
                },
                fail(info?: UTSJSONObject) {
                    console.log("关闭失败")
                },
                complete() {
                    console.log("关闭完成")
                }
            } as LivePlayerOptions)
	    },
        fullscreenCallBack() {
            console.log("fullscreenCallBack");
        },
        statechangeCallBack(event: LivePlayerStatechangeEvent) {
            console.log("statechangeCallBack", event.detail.code)
        },
        errorCallBack(event: LivePlayerErrorEvent) {
            console.log("error", event)
        },
    }
  }
</script>
```

## 云函数

uni直播除了通过[uniCloud控制台操作](./console.md)外，还可以在云函数中通过API创建推拉流。

### 启用uni-cloud-live扩展库@use-in-function

uni直播是单独的扩展库，开发者需手动将uni-cloud-live扩展库添加到云函数或云对象的依赖中。

操作步骤：

1. 右键需要添加的云函数或云对象
2. 点击-管理公共模块或扩展库依赖
3. 勾选uni-cloud-live扩展库

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272057381.png)


### 生成推拉流地址

uni-cloud-live 扩展库主要的功能就是生成推流地址和拉流地址，生成的地址可以直接在客户端使用。

生成推拉流地址时无需提前创建直播流，生成地址时会自动创建。

```js

module.exports = (event, context) => {
    const liveName = 'testStreamName'
    const liveManager = uniCloud.getLiveManager()
    // 生成推流地址
    const pushUrl = liveManager.stream.generatePushUrl(liveName, 'rtmp-push.example.com')
    // 生成拉流地址
    const pullUrl = liveManager.stream.generatePullUrl(liveName, 'rtmp-pull.example.com')
    return {
        pushUrl: pushUrl[liveName],
        pullUrl: pullUrl[liveName]
    }
}

```


### API@api

#### 获取uni直播对象实例

**API**: `uniCloud.getLiveManager()`

#### 创建直播流

**API**：`liveManager.stream.create(name)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|是|直播流名称|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|-|直播流名称|

**示例**

```js
const liveManager = uniCloud.getLiveManager()

// 创建直播流 live_2025
await liveManager.stream.create('live_2025')
```

#### 获取直播流列表

**API**: `liveManager.stream.list(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|prefix|string|-|否|直播流名称前缀|
|offset|number|0|否|偏移量|
|limit|number|100|否|查询最大数量|
|startedAt|number|-|否|开始时间戳；毫秒级别|
|endedAt|number|-|否|结束时间戳；毫秒级别|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|list|StreamList|[]|否|直播流列表|
|page|number|0|否|当前页面数|
|total|number|0|否|直播流数量|
|pageSize|number|0|否|每页最大查询数|

**StreamList**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|否|直播流名称|
|forbidden|boolean|-|否|直播流是否封禁|
|status|string|-|否|直播流状态；online 在线，offline 离线|
|lastStartAt|number|0|否|最近一次推流时间；unix毫秒时间戳|
|createdAt|number|0|否|创建时间；unix毫秒时间戳|

#### 获取直播流详情

**API**: `liveManager.stream.detail(name: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|是|直播流名称|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|否|直播流名称|
|forbidden|boolean|false|否|直播流是否封禁|
|localAddr|string|-|否|本地流媒体服务地址|
|remoteAddr|string|-|否|推流客户端地址|
|lastStartAt|number|-|否|最近一次推流时间；unix毫秒时间戳|
|lastStartDomain|string|-|否|最近一次推流域名|
|status|string|-|否|直播流状态；online 在线，offline 离线|

#### 删除直播流

**API**: `liveManager.stream.delete(name: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|是|直播流名称|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|

#### 封禁直播流

**API**: `liveManager.stream.forbidden(name: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|是|直播流名称|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|

#### 解封直播流

**API**: `liveManager.stream.release(name: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|是|直播流名称|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|

#### 断开所有用户连接

**API**: `liveManager.stream.stop(name: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|-|是|直播流名称|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|

#### 生成推流地址

**API**: `liveManager.stream.generatePushUrl(name: string | string[], domain: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|string[]|-|是|直播流名称|
|domain|string|-|是|已绑定的推流域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|[name]|string|-|否|直播流名称|

**注意**

如域名开启了时间戳鉴权，生成的连接会带上鉴权信息。

**示例**

```js
const liveManager = uniCloud.getLiveManager()

const result = await liveManager.generatePushUrl('live_test', 'rtmp-push.test.com')

/**
 * result
 * {
 *    "live_test": "rtmp://rtmp-push.test.com/xxxxx/live_test"
 * }
 */

```

#### 生成拉流地址

**API**: `liveManager.stream.generatePullUrl(name: string | string[], domain: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|name|string|string[]|-|是|直播流名称|
|domain|string|-|是|已绑定的拉流域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|[name]|string|-|否|直播流名称|

**注意**

如域名开启了时间戳鉴权，生成的连接会带上鉴权信息。

**示例**

```js
const liveManager = uniCloud.getLiveManager()

const result = await liveManager.generatePullUrl('live_test', 'rtmp-pull.test.com')

/**
 * result
 * {
 *    "live_test": "rtmp://rtmp-pull.test.com/xxxxx/live_test"
 * }
 */

```

#### 获取推流域名详情

**API**: `liveManager.domain.getPushDomainDetail(domain: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|domain|string|-|是|已绑定的拉流域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|domain|string|-|否|域名|
|cname|string|-|否|CNAME域名|
|type|string|-|否|域名类型|
|auth|PushDomainAuth|-|否|防盗链配置参数|
|enable|boolean|-|否|域名是否启用|
|certId|string|-|否|SSL证书id|
|createdAt|number|-|否|创建时间；毫秒时间戳|
|lastModifiedAt|number|-|否|最后更新时间；毫秒时间戳|

**PushDomainAuth**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|primaryKey|string|-|否|主密钥|
|secondaryKey|string|-|否|副密钥|
|expireSeconds|number|-|否|防盗链过期时间秒数|

#### 获取拉流域名详情

**API**: `liveManager.domain.getPullDomainDetail(domain: string)`

**参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|domain|string|-|是|已绑定的拉流域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|domain|string|-|否|域名|
|cname|string|-|否|CNAME域名|
|type|string|-|否|域名类型|
|auth|PullDomainAuth|-|否|防盗链配置参数|
|enable|boolean|-|否|域名是否启用|
|certId|string|-|否|SSL证书id|
|createdAt|number|-|否|创建时间；毫秒时间戳|
|lastModifiedAt|number|-|否|最后更新时间；毫秒时间戳|

**PullDomainAuth**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|primaryKey|string|-|否|主密钥|
|secondaryKey|string|-|否|副密钥|
|expireSeconds|number|-|否|防盗链过期时间秒数|

#### 上传域名SSL证书

**API**: `liveManager.domain.uploadCertificate(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|是|证书ID；须保持唯一|
|domain|string|-|是|证书绑定的域名|
|cert|string|-|是|证书内容|
|key|string|-|是|证书私钥|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|

#### 获取域名SSL证书列表

**API**: `liveManager.domain.listCertificates(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|domain|string|-|是|域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|data|Cert[]|-|否|证书列表数据|
|errMsg|string|-|否|成功提示|

**Cert**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|否|证书ID|
|domain|string|-|否|域名|
|cert|string|-|否|证书内容|
|key|string|-|否|证书私钥|
|effectiveTime|string|-|否|证书生效时间|
|expirationTime|string|-|否|证书过期时间|

#### 删除域名SSL证书

**API**: `liveManager.domain.deleteCertificate(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|是|证书ID；须保持唯一|
|domain|string|-|是|证书绑定的域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|

#### 更新域名SSL证书

**API**: `liveManager.domain.updateCertificate(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|是|证书ID；须保持唯一|
|domain|string|-|是|证书绑定的域名|
|cert|string|-|是|证书内容|
|key|string|-|是|证书私钥|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|errMsg|string|-|否|成功提示|


#### 更新推流域名证书

**API**: `liveManager.domain.updatePushDomainCertificate(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|是|证书ID；上传SSL证书填写的证书ID|
|domain|string|-|是|推流域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|否|更新后的certId|


#### 更新拉流域名证书

**API**: `liveManager.domain.updatePullDomainCertificate(params: Params)`

**Params参数说明**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|是|证书ID；上传SSL证书填写的证书ID|
|domain|string|-|是|拉流域名|

**返回值**

|参数|类型|默认值|必填|说明|
|---|---|---|---|---|
|certId|string|-|否|更新后的certId|

#### 生成直播回放文件@recording-generate

> HBuilderX 5.0 及以上版本支持该接口

**API**: `liveManager.recording.generate(name: string, startTime: number, endTime: number, options?: Options)`

**参数说明**

| 参数        | 类型      | 默认值 | 必填 | 说明      |
|-----------|---------|-----|----|---------|
| name      | string  | -   | 是  | 直播流名称   |
| startTime | string  | -   | 是  | 开始时间    |
| endTime   | string  | -   | 是  | 结束时间    |
| options   | Options | -   | 否  | 文件自定义参数 |

**Options 参数说明**

| 参数               | 类型     | 默认值                              | 必填 | 说明                                                                                                                                                                                   |
|------------------|--------|----------------------------------|----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format           | string | m3u8                             | 否  | 文件格式，可选文件格式为：<br/>m3u8: HLS格式，默认值<br/>flv: FLV格式，将回放切片转封装为单个flv文件，异步模式<br/>mp4: MP4格式，将回放切片转封装为单个mp4文件，异步模式 <br/>异步模式下，生成回放文件需要一定时间                                                  |
| filename         | string | `{startTime}-{endTime}.{format}` | 否  | 录制文件名；为空时会按照`{startTime}-{endTime}`格式生成                                                                                                                                              |
| expireDays       | number | 0                                | 否  | ts文件过期时间；切片文件的生命周期：<br/>0: 默认值，表示不修改ts文件生命周期, 可显著提升接口响应速度<br/>大于0: 表示修改ts文件的的生命周期为 ExpireDays 参数值<br/>-1: 表示修改 ts 文件生命周期属性为永久                                                        |
| firstSegmentType | number | 0                                | 否  | 过滤ts切片文件类型，部分非标准的直播流，在推流初期缺少视频帧或音频帧，过滤功能可以剔除这部分切片，<br/>0: 默认值，不做过滤<br/>1: 第一个ts切片需要是纯视频类型，不符合预期的ts切片将被跳过<br/>2: 第一个ts切片需要是纯音频类型，不符合预期的ts切片将被跳过<br/>3: 第一个ts切片需要是音视频类型，不符合预期的ts切片将被跳过 |

**返回值**

| 参数       | 类型     | 默认值 | 必填 | 说明    |
|----------|--------|-----|----|-------|
| url      | string | -   | 是  | 回放地址  |
| filename | string | -   | 是  | 录制文件名 |
