## uni-push 鸿蒙厂商推送专题

### 创建应用@create_app

> 参见华为官方文档[配置AppGallery Connect](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137?ha_source=Dcloud&ha_sourceId=89000448)，完成文档中的内容配置。

1. 登录[AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html?ha_source=Dcloud&ha_sourceId=89000448)网站，选择`我的项目`。点击你应用所在的项目（如无则需先创建项目），点击创建应用，如下图：
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-3.jpg)

2. 填写应用参数，如图
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-4.jpg)

### 开通推送服务@activate
1. 点击左侧“推送服务”选择相应的项目和应用，点击“立即开通“。
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-5.jpg)

2. 点击“项目设置”，可以看到刚创建的鸿蒙应用，点击`添加公钥指纹 (HarmonyOS API 9及以上)`并选择你项目的证书
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-6.jpg)
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-7.jpg)

4. 在这里可以看到您刚才选择的证书文件的指纹信息
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-8.jpg)

5. 在 “项目设置 > 推送服务> 配置 > 选择应用” 中开通 “应用回执状态”，配置个推侧的回调地址。如下
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-9.jpg)
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-16.png)
回执名称可自定义，回调地址(杭州机房，若应用非杭州机房或不清楚应用对应机房请及时与个推技术支持联系。)
    ```
    https://thirdrcp-hz.getui.com/harmony/hw
    ```
6. 点击“提交”，提示“成功”则表示配置成功
  ![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-17.png)
7. 在 “项目设置 > 推送服务> 配置 > 选择应用” 中申请开通 “自分类权益”，并在服务端设置对应的消息分类参数，消息分类标准以及申请流程，详见[鸿蒙消息分类标准](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/push-apply-right-V5?ha_source=Dcloud&ha_sourceId=89000448)。如下
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-10.jpg)

### 创建服务帐号密钥文件@credentials
创建服务帐号密钥文件 ，您在华为开发者联盟的[API Console](https://developer.huawei.com/consumer/cn/console/api/credentials/dev388421841221918485?ha_source=Dcloud&ha_sourceId=89000448)API服务 > 配置，选择你的项目（选择你的鸿蒙应用的所属项目），如下
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-11.jpg)
点击创建服务帐号密钥文件
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-12.jpg)
点击“生成公私钥”，公钥上传，私钥自己保存
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-18.png)
输入名称和相关描述，点击创建并下载JSON，文件会下载到本地
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-13.jpg)
下载文件如下
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-14.jpg)
下载文件内容如下：（如有错误请检查生成服务账号秘钥生成流程，）
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-19.png)

### 获取Client ID@client_id
登录[AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html?ha_source=Dcloud&ha_sourceId=89000448)网站，
选择`我的项目`（点击你应用所在的项目）；在项目设置页面，下拉页面至应用，获取应用的Client ID。
![](https://web-ext-storage.dcloud.net.cn/doc/push/harmony/img-20.png)