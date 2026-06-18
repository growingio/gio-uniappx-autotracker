# uni直播控制台操作指南

## 业务开通@open

1. 登录[uniCloud web控制台](https://unicloud.dcloud.net.cn/)
2. 在顶部菜单选择**uni直播**菜单项

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506301632925.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506301631369.png)

## 业务充值@recharge

### 充值保证金

uni直播是延迟计费的，使用前需要先充值200元保证金，用于欠费的担保。保证金是账号级的、可在不同业务间复用，若你在使用其他uniCloud服务时 ，已充值保证金，则无需重复充值。

在uniCloud web控制台前往【费用中心】-【按量余额充值】充值保证金（若保证金账户余额≥200元则无需充值）

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/3707/429.png)

### 充值余额

在uni直播控制台前往【账户信息】-点击【充值】按钮充值余额。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081917763.png)

## 直播设置

### 域名设置

> 在使用uni直播服务前，必须先添加至少一个推流域名和一个拉流域名，并配置域名解析。
> 一个域名只能设置为一种类型，不能同时作为推流域名和拉流域名。

#### 添加推流域名

1. 登录[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/stream)。
2. 点击左侧菜单**直播设置**。
3. 点击顶部**域名管理**选项卡。
4. 点击**绑定推流域名**卡片后的**绑定域名**按钮，打开绑定推流域名弹窗。
    - **推流域名**：推流域名用于推送直播流。加速域名不允许重复添加，不支持泛域名。
    - **推流协议**：支持 RTMP、SRT、WHIP协议。
      ![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271829285.png)

   ![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271830417.png)
5. 点击**确定绑定**按钮，绑定域名，绑定成功后会在列表中看到推流域名的CNAME，在域名服务商处添加CNAME解析。

#### 推流域名配置

##### 时间戳防盗链

> 开启时间戳防盗链可以对推流地址进行请求鉴权，减少恶意推流，保护用户资产。
>
> 建议开启此功能！

1. 点击推流域名操作按钮**配置**，跳转至配置页面

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272008766.png)

2. 点击顶部**防盗链设置**选项卡，开启时间戳防盗链

    - **主密钥**：防盗链主密钥
    - **副密钥**：防盗链副密钥
    - **过期时间**：鉴权连接过期时间

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272009129.png)

##### SSL证书管理

> 设置推流域名SSL证书

1. 首次设置请先在**证书管理**中上传域名的SSL证书

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272014354.png)

2. 选择**证书上传**，填写证书ID、证书内容和证书私钥，点击保存即可。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272015893.png)

3. 添加完成证书后选择已上传的SSL证书ID，保存即可。

### 录制设置

#### 直播存储

开通uni直播服务时，直播存储功能默认开启，同时会创建直播专用的存储空间。

直播存储中会保存直播TS切片，截图文件及回放.m3u8或者.mp4文件。

直播TS切片文件不会一直保存，保存时间由**存储过期天数**控制，过期文件会自动清理。

修改过期时间仅对新生成的直播内容生效。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272022867.png)

#### 截图设置

直播截图功能默认不开启，开启后在直播过程中会按照设置的截图间隔生成截图文件。

截图文件仅支持 JPG 和 PNG 格式图片。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081739264.png)

### 空间授权

> 空间授权只有在使用云函数调用uni直播扩展库时才需要配置。
> 
> 在云函数中使用uni直播扩展库时，需要授权服务空间允许访问uni直播服务，否则无法在云函数中使用uni直播扩展库。

1. 登录[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/stream)。
2. 点击左侧菜单**直播设置**。
3. 点击顶部**空间授权**选项卡。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081740338.png)

4. 点击**添加服务空间**按钮，打开添加服务空间弹窗。
5. 选择要授权访问的服务空间，点击服务空间的选择按钮。
6. 点击选择后该服务空间即可访问uni直播服务。

### 回调设置

> 开启后，推流开始、结束时发送通知请求到指定的 URL 地址
>
> 如需录制截图、需要提前开启回调设置

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081741467.png)

### 安全设置

> Referer 防盗链设置

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081742306.png)

## 直播流管理

> uni直播流管理提供直播流的创建、删除、封禁流等功能，同时支持推拉流地址生成。

### 直播流列表

1. 登录[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/stream)。
2. 直播流支持按照 **最近一次推流时间** 和 **直播流名称** 查询。
    - **直播流名称**：支持直播流名称前缀查询。
3. 点击 **查询**，查询当前已创建的直播流。
4. 通过右侧操作按钮可对直播流进行管理操作。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271734044.png)

**数据-直播记录**：可查询直播流的历史直播记录。

**数据-流数据**：查询推流的帧率和码率等信息。

**封禁**直播流：在遇到鉴权推流地址暴露、用户恶意推流等情况的时候，可以对直播进行封禁操作。

**删除**直播流：只有在直播流离线时才可删除直播流。

### 创建直播流

1. 在[直播流](https://unicloud.dcloud.net.cn/pages/uni-live/stream)页面，点击**创建直播流**按钮。
2. 在弹出的弹窗中，输入直播流名称，并点击**创建**按钮。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271746745.png)

## 地址生成器

> uni直播支持自动创建推流及拉流地址，无需提前创建直播流。
> 只要添加了推流域名和拉流域名，并且完成域名解析、鉴权（可选）等操作。
> 即可快速生成推流地址和拉流地址。

1. 登录[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/stream)。
2. 点击左侧菜单**地址生成器**
3. 输入**直播流名称**和**鉴权时长**后，点击**生成**按钮。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271810049.png)

4. 生成的推流地址和拉流地址将在下方展示。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506271817020.png)

## 直播存储

> 直播过程中会生成直播TS切片文件，截图文件和回放文件，这些文件会保存在直播存储中。
>
> 在播放回放时，需要提前在**直播设置**-**录制设置**中，绑定回放域名。

### 直播回放

直播开始后会自动录制直播流，并在直播结束生成回放文件，格式为 `.m3u8`。

在直播存储中以目录形式展示，目录名为直播流名称。每个直播流目录下保存每一次直播的回放文件。

回放文件的名称格式为：`[直播开始时间]-[直播结束时间].m3u8`。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081748156.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081748411.png)

uni直播控制台提供了回放的预览功能，点击回放文件后面的**预览**按钮，即可在新窗口中预览回放。

### 直播截图

默认不启用直播截图，如需启用请在**直播设置**-**录制设置**中开启截图功能。

在直播存储中以目录形式展示，目录名为直播流名称。每个直播流目录下保存该直播流的所有截图文件。

回放文件的名称格式为：`[截图时间毫秒时间戳].[格式]`。


![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081754107.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081754523.png)

### 域名设置

播放回放时，需要在域名设置中绑定回放域名。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081802034.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202508081909585.png)

## 直播统计

### 用量统计

> 用量统计服务提供了推流域名和拉流域名消耗的流量查询及峰值带宽查询。
>
> 数据延迟时间为：5分钟左右

用量统计支持按照**域名**和**直播流名称**以及**时间范围**查询。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272044456.png)

### 直播记录

查询一段时间内的推流记录，最大支持查询最近30天内的直播记录。

直播记录支持按照**域名**和**直播流名称**以及**时间范围**查询。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272049338.png)

### 直播流数据

查询某个直播流在推流过程中的数据，支持查询播放带宽、播放次数、推流码率及音视频帧率。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272052635.png)

### 推流质量

查询某个域名或者直播流的推流质量

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202506272054485.png)


## 服务协议@agreements

七牛云提供了服务等级协议（SLA），以七牛云官网标准协议为准。

- 七牛直播云服务等级协议（SLA）：[https://www.qiniu.com/agreements/sla/pili](https://www.qiniu.com/agreements/sla/pili)

- 七牛云用户协议：[https://www.qiniu.com/agreements/user-agreement](https://www.qiniu.com/agreements/user-agreement)

- 隐私政策：[https://www.qiniu.com/agreements/privacy-right](https://www.qiniu.com/agreements/privacy-right)

如果您购买了七牛云版的uni直播的，且七牛云未满足其承诺的服务标准，则可以索赔。

DCloud将负责为您协调七牛云的赔偿。赔偿标准和相关规定见上述服务等级协议。

