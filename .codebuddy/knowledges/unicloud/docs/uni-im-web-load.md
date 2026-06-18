## 功能概述
帮助开发者以 web-view 的方式，快速将 uni-im 模块集成至项目（支持非unicloud项目），实现客服等相关功能。  

插件下载地址：[https://ext.dcloud.net.cn/plugin?name=uni-im-web-load](https://ext.dcloud.net.cn/plugin?name=uni-im-web-load)  

视频介绍（点击观看）  

<a target="_blank" href="https://www.bilibili.com/video/BV1dQ6EYHEmG">
	<img style="max-width:800px!important;" src="https://web-ext-storage.dcloud.net.cn/doc/im/20251231171927.jpg" />
</a>

### 时序图
<img style="max-width: 800px!important;" src="https://web-ext-storage.dcloud.net.cn/doc/im/im.jpg"></img>  

关键词说明：
### uni-im-web 页面  
此页面已集成在本插件，路径：`/uni_modules/uni-im-web-load/pages/index/index.vue`
### getUserInfo接口@getUserInfo  
由项目的服务端开发语言不同，分为以下两种情况：
1. **由unicloud开发**无需自行编写此接口，按如下操作：  
- 导入本插件，对云函数 `uni-im-getUserInfo`（路径：`/uni_modules/uni-im-web-load/uniCloud/cloudfunctions/uni-im-getUserInfo`）右键`上传部署`。
- 在项目根目录的 uniCloud 目录处右键，选择 `打开 unicloud Web 控制台`，依次点击 `云函数/云对象` -> `函数/对象列表`
- 找到云函数 `uni-im-getUserInfo` 并点击详情，在页面底部的 `云函数 URL 化` 模块，点击“复制路径”即可获得所需接口的链接地址。
2. **由php、java、python等非unicloud开发**，请参照如下说明实现：
- **请求类型**：`POST` 
- **请求参数**：
	```json
	{
		"token": "你在客户端传递的token",
		//... 其他你自定义传的参数例如user_id等
	}
	```
- **成功响应示例**：
	```json
	{
		"errCode": 0,
		"userInfo": {
			"_id": "用户id",
			"nickname": "用户昵称",
			"avatar_file": {
				"url": "https://example.com/avatar.jpg"
			}
		}
	}
	```
	说明：其中“errCode”为0表示成功，此字段保持固定，可根据实际情况自定义其他成功状态码。  
+ **失败响应示例**：
	```json
	{
		"errCode": 10001,
		"errMsg": "用户不存在"
	}
	```
	说明：“errCode”自定义除0以外的数值表示失败，“errMsg”可自定义失败原因描述。

## 使用教程  
### 服务端  
服务端直接通过在线部署实现
1. 首先，打开 [uni-im插件](https://ext.dcloud.net.cn/plugin?id=9711)，点击右侧的“在线部署”按钮。
![](https://web-ext-storage.dcloud.net.cn/doc/im/20241227152920.jpg)
2. 在部署过程中，“集成模式”必须选择“嵌到项目”选项。
3. **用户资料获取途径**：
    - **通过客户端传递**：此模式不校验客户端token，易于集成。直接在客户端传递用户id、昵称、头像，即可。适用于无账号体系的、支持游客临时登录的，或不关心发消息用户身份可靠性的项目。
    - **通过 api 回调地址获取**：此模式会将前端以 get 方式传到 uni-im-web url 后的 token 传递给配置的 getUserInfo 接口，校验项目的 token 验证用户身份的合法性，实现注册/登录操作到uni-im，同时将最新的用户昵称和头像等信息同步到 uni-im模块当中。

提示：在完成部署操作之后，可以在 [插件部署记录](https://ext.dcloud.net.cn/manage/one-click-deployment) 当中查看到刚刚部署的 uni-im的网络地址以及 httpApi 密钥等信息。 

### 客户端  
客户端无需编写额外代码。只需直接导入本插件，然后打开路径`/uni_modules/uni-im-web-load/pages/index/index.vue`，按照注释说明，选择或修改传递至uni-im模块的参数即可。

## 常见问题
1. **如何提前在uni-im统预置一批用户数据**
若要提前在 uni-im系统预置一批用户数据，可通过 http的方式请求uni-im-co的url化链接 执行 login 方法[相关文档参考](./uni-im.md#httpCallImCo)。
2. **商城项目，如何自动向客服发送商品信息**
- 用户在商品页面，点击联系客服时，先向服务端发送一个请求（参数：商品id），服务端根据商品id查询商品的标题、主图、商家user_id。
- 再通过http的方式请求uni-im-co的url化链接 执行 sendMsg 方法[相关文档参考](./uni-im.md#httpCallImCo)模拟用户向商家发送消息，内容：当前用户正在浏览的商品为：${标题},${图片}。
3. **如何实现自动回复**
配置web hook url（即将支持），收到客户端用户发送的消息，然后通过http的方式请求uni-im-co的url化链接 执行 sendMsg 方法[相关文档参考](./uni-im.md#httpCallImCo)回复即可。
