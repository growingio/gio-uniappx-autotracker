# 快速入门

## 快速开始

uni直播提供了推拉流、直播回放、直播统计等功能。本文档将指导您快速开始使用uni直播。

### 开通服务

参考[uni直播服务开通](uni-live/service.md#open)文档，了解如何开通uni直播服务。

### 步骤一 添加推流域名与拉流域名@step-1

使用uni直播服务前，您需要拥有至少一个已备案的域名。推流域名与拉流域名不能是同一个域名，但可以是同一域名下的两个不同子域名。

::: warning 说明
- 若没有域名，点此[注册购买](https://market.aliyun.com/agents/yscdcloud#J_3368608030)。
- 域名注册完成后，需要进行ICP备案，具体备案操作可参考[阿里云ICP备案流程](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-application-overview)。
:::

1. 准备用于推流的域名和用于拉流的域名，确保这两个域名已备案。
2. 登录[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/settings)。
3. 在域名设置中，依次点击推流域名与拉流域名右侧的**绑定域名**域名按钮。
   - 推流域名示例：`push.example.com`
   - 拉流域名示例：`pull.example.com`

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271829285.png)

4. 在弹出的绑定域名对话框中，输入您的推流域名或拉流域名，并选择相应的协议（RTMP、SRT、WHIP等）。
    - **推流域名**：用于推送直播流的域名。
    - **拉流域名**：用于拉取直播流的域名。
    - **推流协议**：支持 RTMP、SRT、WHIP 协议。
    - **拉流协议**：支持 RTMP、HLS、HDL 等协议。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271830417.png)
_(以RTMP推流为例)_

5. 点击**绑定**按钮完成域名绑定。
6. 在域名管理页面，您可以看到已添加的推流域名和拉流域名。

### 步骤二 配置推拉流域名CNAME@step-2

完成上一步骤后，在域名管理页面，您会看到推流域名和拉流域名的CNAME信息。

现在您需要在域名服务商处添加CNAME解析，将您的推流域名和拉流域名指向uni直播的CDN加速域名。

以下以阿里云为例，说明如何添加CNAME解析：

1. 登录阿里云[云解析DNS控制台](https://dns.console.aliyun.com)。
2. 在左侧菜单选择**权威域名解析**，进入域名解析页面。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507011956730.png)

3. 单击待设置的域名操作列的**解析设置**。
4. 单击添加记录，配置信息如下所示：
    - **记录类型**：选择 CNAME。
    - **主机记录**：填写您的推流域名或拉流域名的子域名部分（例如：`push` 或 `pull`）。
    - **解析请求来源**：选择默认线路或根据需要选择其他线路。
    - **记录值**：填写uni直播提供的CNAME地址。
   
![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507011958347.png)

5. 点击**确定**按钮完成CNAME解析设置。
6. 等待域名解析生效，通常需要几分钟到数小时不等，具体时间取决于您的域名服务商。

#### CNAME 生效验证

可以通过阿里云[网络拨测工具](https://boce.aliyun.com/detect/dns)来验证您的CNAME解析是否生效。

输入您的推流域名或拉流域名，点击**立即检测**按钮，查看解析结果。

解析结果中应显示uni直播提供的CNAME地址，表示CNAME解析已成功生效。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507012002514.png)

#### 配置 SSL 证书（可选）

由于原生浏览器的安全要求，若您需要在浏览器进行直播播放，您需要为推流、播放域名配置SSL证书，具体请[参见](uni-live/console.md#ssl证书管理)

### 步骤三 生成推流地址和拉流地址@step-3

推流地址和拉流地址是用于推送直播流和拉取直播流播放的域名，您可以在**uni直播控制台**中生成，具体生成步骤如下：

1. 登录[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/settings)。
2. 在左侧菜单选择**地址生成器**。
3. 输入直播流名称，设置鉴权时长（单位为小时）。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081915392.png)

4. 点击**生成**按钮，将生成推流地址和拉流地址。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507012015432.png)

### 步骤四 直播推流@step-4

uni-app和uni-app x 均支持使用 live-pusher 组件推流，
也可以在其他第三方推流软件中使用，[详见](/uni-live/other-live-streaming-methods.html)

#### live-pusher 组件推流

参考 [uni-app live-pusher](https://uniapp.dcloud.net.cn/component/live-pusher.html)或[uni-app x live-pusher](https://doc.dcloud.net.cn/uni-app-x/component/live-pusher.html)组件文档，在您的应用中使用live-pusher组件进行直播推流。

```html
<live-pusher
    id='livePusher'
    ref="livePusher"
    class="livePusher"
    url=""
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
```
```html
<script>
    export default {
        data() {
            return {}
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

### 步骤五 直播拉流@step-5

#### live-player 组件拉流

在uni-app 中，小程序端使用[live-player](https://uniapp.dcloud.net.cn/component/live-player.html)组件进行直播拉流；web/app端，使用[video](https://uniapp.dcloud.net.cn/component/video.html)组件进行直播拉流。

在uni-app x中，app端和小程序都使用[live-player](https://doc.dcloud.net.cn/uni-app-x/component/live-player.html)组件进行直播拉流。

**注意**
1. 拉流地址为rtmp协议时，在web端不支持播放，需要使用 Flash 播放器或转码为其他格式。
2. 拉流地址视频格式为m3u8时，在web端video组件不支持播放，需要使用三方库[hls.js](https://github.com/video-dev/hls.js)播放。
3. 拉流地址视频格式为flv时，在web端video组件不支持播放，需要使用三方库[flv.js](https://github.com/bilibili/flv.js)播放。

```html
<live-player
        src="rtmp://pull.example.com/live/streamName"
        autoplay
        @statechange="statechange"
        @error="error"
        style="width: 300px; height: 225px;"
/>
```

```html
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

## 生成推拉流地址

您可以在[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/address-generator)或者使用[uni直播扩展库](/uni-live/dev.md)生成这些地址。

## 直播相关概念

### 直播流

泛指直播音视频数据的传输，它能够被作为一个稳定的和连续的流通过网络传输给观众观看。

### 直播域名

直播地址中的URL域名，通过URL域名进行直播业务VDN分发和加速，域名类型分为RTMP推流、RTMP播放、HLS播放、TS切片、HDL播放及直播封面域名。

### 直播推流

指主播通过业务服务端从直播云平台获取到的推流地址，将采集的流媒体通过推流地址实时的推送至直播云接收端。

### 直播拉流

拉流是指通过直播云平台到用户指定的源站拉取直播流的过程。

### 推流地址

业务服务端从直播云平台获取到RTMP协议的URL地址，用来进行直播推流及加速。

### 播放地址

指观众在观看直播时，播放器使用的播放地址，亦指播放端拉流地址。

### 直播鉴权

通过对推流、播放及对直播流相关处理的URL进行加密，验证用户访问权限。

### 直播转码

直播转码是将视频码流转换成另一个视频码流功能。通过转码，可以改变原始码流的编码格式、分辨率和码率等参数，从而适应不同终端和网络环境的播放。以适配不同的网络带宽、不同的终端处理能力、不同的延时要求，满足不同的用户需求。

### H.264

H.264是由ITU-T视频编码专家组（VCEG）和ISO/IEC动态图像专家组（MPEG）联合组成的联合视频组（JVT）提出的，高度压缩数字视频编解码器标准，同时也是MPEG-4第十部分。拥有低码率、图像质量高、容错能力强和网络适应性强等优点。

### H.265

H.265是ITU-T视频编码专家组（VCEG）继H.264之后所制定的新的视频编码标准。H.265标准围绕着现有的视频编码标准H.264，保留原来的某些技术，同时对一些相关的技术加以改进。新技术使用先进的技术用以改善码流、编码质量、延时和算法复杂度之间的关系，达到最优化设置。

### 推流协议

**RTMP**

RTMP（Real-Time Messaging Protocol）是一种用于音视频数据传输的协议，广泛应用于直播推流。

**SRT**

SRT（Secure Reliable Transport）是一种低延迟、高可靠性的传输协议，适用于直播推流。

**WHIP**

WHIP（WebRTC HTTP Ingest Protocol）是一种基于HTTP的推流协议，适用于WebRTC直播推流。

### 拉流协议

**RTMP**

RTMP（Real-Time Messaging Protocol）是一种用于音视频数据传输的协议，广泛应用于直播拉流。

**HLS**

HLS（HTTP Live Streaming）是一种基于HTTP的流媒体传输协议，适用于直播拉流。

**FLV**

FLV（Flash Video）是一种基于Flash的流媒体传输协议，适用于直播拉流。

**DASH**

DASH（Dynamic Adaptive Streaming over HTTP）是一种基于HTTP的自适应流媒体传输协议，适用于直播拉流。

**WHEP**

WHEP（WebRTC HTTP Egress Protocol）是一种基于HTTP的拉流协议，适用于WebRTC直播拉流。

**SRT**

SRT（Secure Reliable Transport）是一种低延迟、高可靠性的传输协议，适用于直播拉流。
