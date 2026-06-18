<style>
	.join-group-chat {
		position: relative;
	}

	.join-group-chat img {
		display: none;
	}

	.join-group-chat:hover img {
		position: absolute;
		background: #FFF;
		top: 25px;
		right: 0;
		display: block;
		width: 150px;
		height: 150px;
		box-shadow: #999 0px 0px 20px;
		padding: 3px;
	}
</style>

## 概述

`uni一键登录`是DCloud联合个推公司推出的，整合了三大运营商网关认证能力的服务。

通过运营商的底层SDK，实现App端无需短信验证码直接获取手机号，也就是很多主流App都提供的一键登录功能。

`uni一键登录`是替代短信验证登录的下一代登录验证方式，能消除现有短信验证模式等待时间长、操作繁琐和容易泄露的痛点。

+ 支持版本：HBuilderX 3.0+
+ 支持项目类型：uni-app的App端，5+ App，Wap2App
+ 支持系统平台: Android，iOS，HarmonyOS(4.61)
+ 支持运营商: 中国移动，中国联通，中国电信

![](https://img-cdn-aliyun.dcloud.net.cn/client/doc/univerify/demo.png)

<a id="fullscreen" />

HBuilderX3.1.6+版本授权登录界面支持全屏模式

调用uni.login时设置univerifyStyle中的fullScreen属性值为true即可：

> HarmonyOS 不支持使用 uni.login 调用一键登录，请使用
[univerifyManager](https://uniapp.dcloud.net.cn/api/plugins/login.html#getuniverifymanager)

```js
uni.login({
	provider: 'univerify',
	univerifyStyle: {
		fullScreen: true
	}
})
```

全屏效果如下:

![](https://img-cdn-aliyun.dcloud.net.cn/client/doc/univerify/full.png)

### 产品优势

- **用户体验好**

一键登录，无需等待和复制短信验证码，能有效降低用户流失率，提升用户注册量在App激活量中的转换率。

- **便宜**

使用`uni一键登录`，每次验证仅需2分多！比短信验证码便宜，也比市场上三方提供的一键登录要更便宜。

- **安全**

采用运营商网关认证，避免短信劫持，有效提升安全性

- **开发体验好**

无需原生插件，无需自定义基座（HBuilder标准基座就可以直接运行调试），简单快速完成上线。

### 流程
1. App界面弹出请求授权，询问用户是否同意授权该App获取手机号。这个授权请求界面是运营商sdk弹出的，可以有限定制。
2. 用户同意授权后，SDK底层访问运营商网关鉴权，获得当前设备`access_token`等信息。
3. 在服务器侧通过 uniCloud 将`access_token`等信息 置换为当前设备的真实手机号码。然后服务器直接入库，避免手机号传递到前端发生的不可信情况。

![](https://native-res.dcloud.net.cn/images/univertify/process.png)

前置条件：
+ 手机安装有sim卡
+ 手机开启数据流量（与wifi无关，不要求关闭wifi，但数据流量不能禁用。）
+ 开通uniCloud服务（但不要求所有后台代码都使用uniCloud）


## 开通

开发者需要登录[uniCloud控制台](https://unicloud.dcloud.net.cn/pages/uni-login/login-account)，申请开通一键登录服务。

详细步骤参考：[一键登录服务开通指南](https://doc.dcloud.net.cn/uniCloud/uni-login/service)


::: warning 注意
- 应用开通uni一键登录服务后，需要`等审核通过`后才能正式使用。
- 在审核期间可以使用`HBuilder标准基座`真机运行调用一键登录功能，调用时会从你的账户中扣费；但审核期间不可以使用自定义基座调用一键登录功能，调用时会返回错误。
- `鸿蒙` 不支持使用基座运行到手机调试，需要在`申请开通`一键登录服务后，在`应用管理`添加应用；将所添加应用的包名填写到 `manifest` 中，然后运行到手机上调试查看效果
:::

需要注意的是，一键登录在客户端获取 `access_token` 后，必须通过 [uniCloud云函数](https://doc.dcloud.net.cn/uniCloud/uni-login/dev.html) 换取手机号码。在uniCloud云函数中换取手机号后，你可以灵活使用：

- 如果你的后端业务基于uniCloud开发的，则可以直接在uniClodu代码中使用；
- 如果你的后端业务基于传统java/php等开发的，你可以将获取到的手机号转发给传统服务器处理；
- 可以通过[云函数url化](https://uniapp.dcloud.io/uniCloud/http)方式生成普通的http接口给5+ App（wap2app）项目使用。

::: warning 注意
	**虽然一键登录需要uniCloud，但并不要求开发者把所有的后台服务都迁移到uniCloud**
:::

uniCloud产生的费用对于一键登陆可以忽略，[详见](https://doc.dcloud.net.cn/uniCloud/uni-login/price)

## 常见问题@question

- **预登录有效期**
预登录有效期为10分钟，超过10分钟后预登录失效，此时调用login授权登录相当于之前没有调用过预登录，大概需要等待1-2秒才能弹出授权界面。
预登录只能使用一次，调用login弹出授权界面后，如果用户操作取消登录授权，再次使用一键登录时需要重新调用预登录。

- **双卡手机能否同时获取两个手机号码**
不支持同时获取两个手机号，
双卡手机以开启数据流量的 SIM 卡进行认证。

- **提示“非移动网关ip地址”**
大多数情况 是因为部分特定设备，不支持双卡双待的网络环境。

- **uniCloud费用贵不贵？**
uniCloud产生的费用对于一键登陆可以忽略，[详见](https://doc.dcloud.net.cn/uniCloud/uni-login/price)

- **使用有其他疑问**
欢迎扫码加入 一键登录 微信交流群讨论：
<br /><img src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/Dcloud-%E4%B8%80%E9%94%AE%E8%AE%A4%E8%AF%81.png"
	width="250" />
