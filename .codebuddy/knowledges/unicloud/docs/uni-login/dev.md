## 一键登录@univerify

<!--
/// meta
keyword: 手机号
-->

`univerify` 是DCloud 推出的一键登录产品，通过与运营商深度合作，实现APP用户无需输入帐号密码，即可使用本机手机号码自动登录的能力。

`univerify`是替代短信验证登录的下一代登录验证方式，能消除现有短信验证模式等待时间长、操作繁琐和容易泄露的痛点。

>  注意：一键登录必须是手机使用流量的前提下才能获取到手机号码，用Wi-Fi联网时无法获取到手机号码，同时如果是双卡手机，获取到的手机号码是默认移动数据的那个手机卡的号码。

## 重要调整

### 云函数使用一键登录扩展库@extension

自`HBuilderX 3.4.0`起，一键登录相关功能移至扩展库`uni-cloud-verify`内。在一段时间内无论开发者是否使用扩展库云函数都可以正常使用`uniCloud.getPhoneNumber`。HBuilderX 3.4.0及之后的版本上传云函数时如果没有指定使用`uni-cloud-verify`扩展库的云函数将无法调用uniCloud.getPhoneNumber接口。

关于扩展库的说明见：[云函数扩展库](../cf-functions.md?id=extension)

在云函数的package.json内添加`uni-cloud-verify`的引用即可为云函数启用此扩展，无需做其他调整，完整的package.json示例如下：

```js
{
  "name": "univerify",
  "extensions": {
    "uni-cloud-verify": {} // 启用一键登录扩展，值为空对象即可
  }
}
```

## 客户端@client

### uni-app 项目

本文主要介绍uni-app的客户端调用方法。

DCloud还提供了更易用的封装。在[uni-id](https://doc.dcloud.net.cn/uniCloud/uni-id/old.html)里已经预置了`uni一键登录`，并基于`uni-id`提供了[云端一体应用快速开发基本项目模版](https://ext.dcloud.net.cn/plugin?id=5057)，该项目模版内置了包括一键登录在内的各种常用登录示例，开发者可以拿去直接用

接下来继续介绍原始API的用法。

#### 客户端-获取可用的服务提供商

一键登录，和 uni.login 中的微信登录、QQ登录等provider是并列的。

其中一键登录对应的 provider ID为 'univerify'，当获取provider列表时发现包含 'univerify' ，则说明当前环境打包了一键登录的sdk。

> HarmonyOS 不支持，请使用 [univerifyManager](https://uniapp.dcloud.net.cn/api/plugins/login.html#getuniverifymanager)

```js
uni.getProvider({
service: 'oauth',
success: function (res) {
console.log(res.provider)// ['qq', 'univerify']
}
});
```

#### 客户端-预登录（可选）
预登录操作可以判断当前设备环境是否支持一键登录，如果能支持一键登录，此时可以显示一键登录选项，同时预登录会准备好相关环境，显著提升显示授权登录界面的速度。

如果当前设备环境不支持一键登录，此时应该显示其他的登录选项。

如果手机没有插入有效的sim卡，或者手机蜂窝数据网络关闭，都有可能造成预登录校验失败。

> HarmonyOS 不支持，请使用 [univerifyManager](https://uniapp.dcloud.net.cn/api/plugins/login.html#getuniverifymanager)

`uni.preLogin(options)`

```js
uni.preLogin({
provider: 'univerify',
success(){ //预登录成功
// 显示一键登录选项
},
fail(res){ // 预登录失败
// 不显示一键登录选项（或置灰）
// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
console.log(res.errCode)
console.log(res.errMsg)
}
})

```


#### 客户端-请求登录授权

弹出用户授权界面。根据用户操作及授权结果返回对应的回调，拿到 `access_token`

> HarmonyOS 不支持使用 uni.login 调用一键登录，请使用
[univerifyManager](https://uniapp.dcloud.net.cn/api/plugins/login.html#getuniverifymanager)

`uni.login(options);`

```js
uni.login({
provider: 'univerify',
univerifyStyle: { // 自定义登录框样式
//参考`univerifyStyle 数据结构`
},
success(res){ // 登录成功
console.log(res.authResult); // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
},
fail(res){ // 登录失败
console.log(res.errCode)
console.log(res.errMsg)
}
})
```

`uni一键登录`的授权弹出界面是默认是半屏的，也可以配置为全屏。这个界面本质是运营商sdk弹出的，它询问手机用户是否授权自己的手机号给这个App使用。

这个授权弹出界面可以通过 univerifyStyle 设置有限定制。

univerifyStyle 数据结构：

> `HamronyOS` 仅支持 `fullScreen（是否全屏显示）`、`logoPath（自定义 logo 地址）`、`backgroundColor（背景颜色）`、`loginBtnText（登录按钮文本）`

```json
{
"fullScreen": false, // 是否全屏显示，默认值： false
"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）
"icon": {
"path": "static/xxx.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
"width": "60px", //图标宽度 默认值：60px
"height": "60px" //图标高度 默认值：60px
},
"closeIcon": {
"path": "static/xxx.png", // 自定义显示在授权框中的logo，仅支持本地图片
"width": "60px", //图标宽度 默认值：60px (HBuilderX 4.0+ 仅iOS支持)
"height": "60px" //图标高度 默认值：60px (HBuilderX 4.0+ 仅iOS支持)
},
"phoneNum": {
"color": "#202020" // 手机号文字颜色 默认值：#202020
},
"slogan": {
"color": "#BBBBBB" // slogan 字体颜色 默认值：#BBBBBB
},
"authButton": {
"normalColor": "#3479f5", // 授权按钮正常状态背景颜色 默认值：#3479f5
"highlightColor": "#2861c5", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
"disabledColor": "#73aaf5", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff
"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”
"borderRadius": "24px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
},
"otherLoginButton": {
"visible": true, // 是否显示其他登录按钮，默认值：true
"normalColor": "", // 其他登录按钮正常状态背景颜色 默认值：透明
"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明
"textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565
"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”
"borderColor": "", //边框颜色 默认值：透明（仅iOS支持）
"borderRadius": "0px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
},
"privacyTerms": {
"defaultCheckBoxState":true, // 条款勾选框初始状态 默认值： true
"isCenterHint":false, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
"uncheckedImage":"", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
"checkedImage":"", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
"checkBoxSize":12, // 可选 条款勾选框大小
"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB
"termsColor": "#5496E3", // 协议文字颜色 默认值： #5496E3
"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
"privacyItems": [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
{
"url": "https://", // 点击跳转的协议详情页面
"title": "用户服务协议" // 协议名称
}
]
},
"buttons": { // 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
"iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
"list": [
{
"provider": "apple",
"iconPath": "/static/apple.png" // 图标路径仅支持本地图片
},
{
"provider": "weixin",
"iconPath": "/static/wechat.png" // 图标路径仅支持本地图片
}
]
}
}
```

univerifyStyle 属性对应配置的界面指示图

全屏效果 | 非全屏效果
:--------:|:--------:
<img src="https://img.cdn.aliyun.dcloud.net.cn/client/doc/univerify/full_styles_v2.png" width=240> | <img
	src="https://img.cdn.aliyun.dcloud.net.cn/client/doc/univerify/half_styles_v2.png" width=240>

返回数据示例

```json
{
"errMsg": "login:ok",
"authResult": {
"openid": "208E2FBE6EF64DF3B2D377D886EF2A14124262bfd7ae16465ea0f0634554dcee7636",
"access_token": "ZGI4NjkxZWE4YjAyNGUzMjhiMmZiNDcwODBjYjc5MDF8fDJ8djJ8Mg=="
}
}
```


#### 客户端关闭一键登录授权界面

> HarmonyOS 不支持，请使用 [univerifyManager](https://uniapp.dcloud.net.cn/api/plugins/login.html#getuniverifymanager)

请求登录认证操作完成后，不管成功或失败都不会关闭一键登录界面，需要主动调用`closeAuthView`方法关闭。

客户端登录认证完成只是说明获取 `access_token` 成功，需要将此数据提交到服务器获取手机号码，完成业务服务登录逻辑后通知客户端关闭登录界面。

```js
uni.closeAuthView()
```

#### 用户点击一键登录自定义按钮

> HarmonyOS 不支持

`univerifyStyle`中如果配置了`"fullScreen": "true"`和`buttons`选项并且`buttons`数组不为空时，在全屏的时候会渲染出自定义按钮。

当用户点击`自定义按钮`时，会触发`uni.login`的`fail`回调，返回数据如下：

```json
{
"code": "30008",
"errMsg": "用户点击了自定义按钮",
"index": 0, // 第几个按钮
"provider": "apple",
}
```

#### 获取用户是否选中了勾选框（HBuilderX 3.2.5+ 版本支持）

> HarmonyOS 不支持，请使用 [univerifyManager](https://uniapp.dcloud.net.cn/api/plugins/login.html#getuniverifymanager)

`uni.getCheckBoxState(options)`

```js
uni.getCheckBoxState({
success(res){
console.log(res.state) // Boolean 用户是否勾选了选框
console.log(res.errMsg)
},
fail(res){
console.log(res.errCode)
console.log(res.errMsg)
}
})

```

#### univerifyManager

> **3.2.13+ 版本**可以使用全局 [univerifyManager](https://uniapp.dcloud.io/api/plugins/login?id=getuniverifymanager) 来更高效的使用一键登录
>
> 此时点击自定义按钮将不会触发`uni.login`的`fail`回调，也不会自动关闭一键登录弹框

```js
const univerifyManager = uni.getUniverifyManager()

// 预登录
univerifyManager.preLogin()

// 调用一键登录弹框
univerifyManager.login({
univerifyStyle: {
"fullScreen": true,
"buttons": {
"iconWidth": "45px",
"list": [
{
"provider": "apple",
"iconPath": "/static/apple.png"
},
{
"provider": "weixin",
"iconPath": "/static/wechat.png"
}
]
}
},
success (res) {
console.log('login success', res)
}
})

const callback = (res) => {
// 获取一键登录弹框协议勾选状态
univerifyManager.getCheckBoxState({
success(res) {
console.log("getCheckBoxState res: ", res);
if (res.state) {
// 关闭一键登录弹框
univerifyManager.close()
}
}
})
}
// 订阅自定义按钮点击事件
univerifyManager.onButtonsClick(callback)
// 取消订阅自定义按钮点击事件
univerifyManager.offButtonsClick(callback)
```

#### 用access_token换手机号

客户端获取到 `access_token` 后，传递给uniCloud云函数，云函数中通过`uniCloud.getPhoneNumber`方法获取真正的手机号。

这一步有3种方式：
1. uni-app项目开通[uniCloud](https://unicloud.dcloud.net.cn/)服务，在前端直接写 `uniCloud.callFunction` ，将 `access_token` 传给指定的云函数。
2. 使用普通ajax请求提交 `access_token` 给uniCloud的云函数。这种方式uni-app和5+App、wap2app均可使用，但uniCloud上的云函数需要做URL化。
3. 使用普通ajax请求提交 `access_token` 给自己的传统服务器，通过自己的传统服务器再转发给 uniCloud
云函数。这种方式uni-app和5+App、wap2app均可使用，但uniCloud上的云函数需要做URL化。

下面分别提供示例代码：

##### uni-app项目使用uniCloud.callFunction的方式调用云函数

如果是未开通过uniCloud的uni-app项目：
1. 首先开通uniCloud服务空间，[参考](https://unicloud.dcloud.net.cn/)
2. 对项目点右键，创建uniCloud开发环境，然后绑定到上一步创建的服务空间上
3. 对uniCloud/cloudfunctions/点右键，创建云函数
4. 分别在前端和云端复制下列代码
5. 对云函数点右键，上传到服务空间

客户端示例：

```js
// 在得到access_token后，通过callfunction调用云函数
uniCloud.callFunction({
name: 'xxx', // 你的云函数名称
data: {
'access_token': 'xxx', // 客户端一键登录接口返回的access_token
'openid': 'xxx' // 客户端一键登录接口返回的openid
}
}).then(res => {
// res.result = {
// code: '',
// message: ''
// }
// 登录成功，可以关闭一键登录授权界面了
}).catch(err=>{
// 处理错误
})
```

云函数代码示例：
```js
'use strict';
exports.main = async (event, context) => {
// event里包含着客户端提交的参数
const res = await uniCloud.getPhoneNumber({
appid: '_UNI_ABCDEFG', // 替换成自己开通一键登录的应用的DCloud appid
provider: 'univerify',
access_token: event.access_token,
openid: event.openid
})

console.log(res); // res里包含手机号
// 执行用户信息入库等操作，正常情况下不要把完整手机号返回给前端
// 如果数据库在uniCloud上，可以直接入库
// 如果数据库不在uniCloud上，可以通过 uniCloud.httpclient
API，将手机号通过http方式传递给其他服务器的接口，详见：https://doc.dcloud.net.cn/uniCloud/cf-functions?id=httpclient
return {
code: 0,
message: '获取手机号成功'
}
}
```

完整的项目实例源码，可以参考：
1. uni-starter，云端一体应用快速开发基本项目模版：[https://ext.dcloud.net.cn/plugin?id=5057](https://ext.dcloud.net.cn/plugin?id=5057)
2. hello uni-app，打包后直接体验：[https://m3w.cn/uniapp](https://m3w.cn/uniapp)；源码获取：在HBuilderX中新建uni-app项目，选择hello
uni-app模板。一键登录的具体位置在 API - login 栏目中。

**注意**

- 开发期间如果重新获取过appid需要重新编译uni-app项目

##### 通过传统服务器连接uniCloud云函数

开发者也可以在客户端获取到access_token等信息后，传给自己的传统服务器。然后由自己的传统服务器，访问uniCloud的云函数（需将云函数URL化）。

写法类似上面5+项目的云函数url化的方式，但是不同的是需要云函数返回手机号给自己服务器，这样就需要确保数据安全。

下面以一个简单的例子演示如何使用签名验证请求是否合法

```js
// 以nodejs为例
const crypto = require('crypto')

const secret = 'your-secret-string' // 自己的密钥不要直接使用示例值，且注意不要泄露
const hmac = crypto.createHmac('sha256', secret);

// 自有服务器生成签名，并以GET方式发送请求
const params = {
	access_token: 'xxx', // 客户端传到自己服务器的参数
	openid: 'xxx'
}
// 字母顺序排序后拼接签名串
const signStr = Object.keys(params).sort().map(key => {
	return `${key}=${params[key]}`
}).join('&')
hmac.update(signStr);
const sign = hmac.digest('hex')
// 最终请求如下链接，其中https://xxxx/xxx为云函数Url化地址
// https://xxxx/xxx?access_token=xxx&openid=xxx&sign=${sign} 其中${sign}为上一步得到的sign值
```


```js
// 云函数验证签名，此示例中以接受GET请求为例作演示
const crypto = require('crypto')
exports.main = async(event) => {

	const secret = 'your-secret-string' // 自己的密钥不要直接使用示例值，且注意不要泄露
	const hmac = crypto.createHmac('sha256', secret);

	let params = event.queryStringParameters
	const sign = params.sign
	delete params.sign
	const signStr = Object.keys(params).sort().map(key => {
		return `${key}=${params[key]}`
	}).join('&')

	hmac.update(signStr);

	if(sign!==hmac.digest('hex')){
		throw new Error('非法访问')
	}

	const {
	access_token,
	openid
	} = params
	const res = await uniCloud.getPhoneNumber({
		provider: 'univerify',
		appid: 'xxx', // DCloud appid，不同于callFunction方式调用，使用云函数Url化需要传递DCloud appid参数
		access_token: access_token,
		openid: openid
	})
	// 返回手机号给自己服务器
	return res
}
```


##### 返回 res 数据说明
```json
{
	"data": {
		"code": 0,
		"success": true,
		"phoneNumber": "166xxxx6666"
	},
	"statusCode": 200,
	"header": {
		"Content-Type": "application/json; charset=utf-8",
		"Connection": "keep-alive",
		"Content-Length": "53",
		"Date": "Fri, 06 Nov 2020 08:57:21 GMT",
		"X-CloudBase-Request-Id": "xxxxxxxxxxx",
		"ETag": "xxxxxx"
	},
	"errMsg": "request:ok"
}
```


### uni-app x 项目

uni-app x项目请参考：[App一键登录](https://doc.dcloud.net.cn/uni-app-x/api/get-univerify-manager.html)

### 5+ App（Wap2App）项目

5+ App（Wap2App）请另行参考：[5+ App一键登录使用指南](https://ask.dcloud.net.cn/article/38009)


5+（wap2app）项目在用access_token换取手机号时，需要依赖uniCloud云函数的[URL化](https://uniapp.dcloud.io/uniCloud/http)方案，可以把云函数暴露出普通http接口。设置方法参考：[https://uniapp.dcloud.io/uniCloud/http](https://uniapp.dcloud.io/uniCloud/http)

此时客户端代码使用普通ajax写法，示例如下：

```js
const xhr = new plus.net.XMLHttpRequest();
xhr.onload = function(e) {
const {
code,
message
} = JSON.parse(xhr.responseText)
}
xhr.open( "POST", "https://xxx" ); // url应为云函数Url化之后的地址，可以在uniCloud web控制台云函数详情页面看到
xhr.setRequestHeader('Content-Type','application/json');
xhr.send(JSON.stringify({
access_token: 'xxx', // 客户端一键登录接口返回的access_token
openid: 'xxx' // 客户端一键登录接口返回的openid
}));
```

云函数代码：
```js
// 下面仅展示客户端使用post方式发送content-type为application/json请求的场景
exports.main = async(event) => {
let body = event.body
if(event.isBase64Encoded) {
body = Buffer.from(body,'base64')
}
const {
access_token,
openid
} = JSON.parse(body)
const res = await uniCloud.getPhoneNumber({
provider: 'univerify',
appid: 'xxx', // DCloud appid，不同于callFunction方式调用，使用云函数Url化需要传递DCloud appid参数！！！
access_token: access_token,
openid: openid
})
console.log(res); // res里包含手机号
// 如果数据库不在uniCloud上，可以通过 uniCloud.httpclient
API，将手机号通过http方式传递给其他服务器的接口，详见：https://doc.dcloud.net.cn/uniCloud/cf-functions?id=httpclient

return { // 不建议把完整手机号返回给前端
code: 0,
message: '获取手机号成功'
}
}
```


### 运行基座和打包

-
使用`uni一键登录`，安卓平台不需要制作自定义基座，使用HBuilder标准真机运行基座即可，调用时会从你的账户中扣费。iOS平台使用标准基座必须要用`io.dcloud.HBuilder`这个bundleId重签，其他bundleId重签无法登录。

- 云端打包
在项目manifest.json页面“App模块配置”项的“OAuth(登录鉴权)”下勾选“一键登录(uni-verify)”。
![](https://img-cdn-aliyun.dcloud.net.cn/client/doc/univerify/hx.png)

- 离线打包
+ Android平台：[一键登录Android离线打包配置](https://nativesupport.dcloud.net.cn/AppDocs/usemodule/androidModuleConfig/oauth?id=%e4%b8%80%e9%94%ae%e7%99%bb%e5%bd%95)
+ iOS平台：[一键登录iOS离线打包配置](https://nativesupport.dcloud.net.cn/AppDocs/usemodule/iOSModuleConfig/oauth?id=%e4%b8%80%e9%94%ae%e7%99%bb%e5%bd%95%ef%bc%88univerify%ef%bc%89h)
+ HarmonyOS：无

### 错误码

| 错误码 | 错误描述 |处理方案|
| :-: | :-: | :-: |
| -7 | uniAppid 缺失 | 检查是否配置/已通过审核 |
| 1000 | 当前 uniAppid 尚未开通一键登录 | 检查是否配置/已通过审核 |
| 1001 | 应用所有者账号信息异常，请检查账号一键登录服务是否正常 | 检查账号一键登录服务是否正常 |
| 1002 | 应用所有者账号信息异常，请检查账号余额是否充足 | 检查账号余额是否充足|
| 4001 | 请求参数异常 |校验异常，联系官方人员|
| 4003 | 开发者账户appid 校验异常，联系官方人员 |校验异常，联系官方人员|
| 5000 | 取号失败，请检查SIM卡是否停机欠费；token是否过期 | 联系官方人员 |
| 20202 | 终端未开启SIM流量 | 引导用户手动开启设备流量 |
| 30001 | 当前网络环境不适合执行该操作 | 无 |
| 30002 | 用户点击了其他登录方式 | 无 |
| 30003 | 用户关闭验证界面 | 无 |
| 30004 | 其他错误 | [30004章节](#_30004)自查或联系官方人员 |
| 30005 | 预登录失败 | 不具备一键登录的使用前提，设备不支持/未开启数据流量/其他原因 |
| 30006 | 一键登录失败 | 无 |
| 30007 | 获取本机号码校验token失败 | 校验异常，联系官方人员|
| 30008 | 用户点击了自定义按钮 | 无 |
| 40004 | 应用不存在 | 多出现在自定义基座的场景，请确保应用已通过审核后，且已重新打包 |
| 40047 | 一键登录取号失败 | 校验异常，联系官方人员|
| 40053 | 手机号校验失败 | 校验异常，联系官方人员|
| 40101 | 移动-源IP鉴权失败 |检查一下手机卡类型是否是正常运营商手机卡，关闭飞行模式后重新尝试。|
| 40201 | 联通-源IP鉴权失败 |检查一下手机卡类型是否是正常运营商手机卡，关闭飞行模式后重新尝试。|
| 40301 | 电信-源IP鉴权失败 |检查一下手机卡类型是否是正常运营商手机卡，关闭飞行模式后重新尝试。|




## 云函数@cloud

> 自`HBuilderX 3.4.0`起云函数需启用uni-cloud-verify扩展之后才可以调用getPhoneNumber接口，详细说明见：[云函数使用一键登录扩展库](#extension)

客户端调用一键登录接口会获取如下结果

```js
{
    "target": {
        "id": "univerify",
        "description": "一键登录",
        "authResult": {
            "openid": "xxx",
            "access_token": "xxx"
        }
    }
}
```

使用上面结果中的`openid`和`access_token`即可在`云函数`内调用接口获取手机号

云函数内接口调用形式如下

```js
exports.main = async function(event, context){
  const res = await uniCloud.getPhoneNumber({
    provider: 'univerify',
    appid: context.APPID, // 客户端callFunction时携带的AppId信息
    access_token: event.access_token,
    openid: event.openid
  })
  // res形式如下
  // {
  //   code: 0,
  //   message: '',
  //   phoneNumber: '138xxxxxxxx'
  // }
}
```

**相关文档**
- [uniCloud快速上手](https://doc.dcloud.net.cn/uniCloud/quickstart)
- [云函数URL化](https://doc.dcloud.net.cn/uniCloud/http)

**注意**

- 由于历史原因，如果未关联uni-cloud-verify扩展库也可能会在不填写apiKey时提示缺少apiKey，请主动为云函数关联uni-cloud-verify扩展库
- 如下插件需要升级后才不会检查apiKey、apiSecret必填，如果使用uni-id公共模块需要更新到3.3.31版本，如果使用uni-id-pages需要更新到1.1.17版本，如果使用了uni-starter需要更新到2.1.6版本

### uni-app、uni-app x项目@uni-app

如果开发uni-app、uni-app x项目可以使用callFunction的方式调用云函数

```js
// 客户端
uniCloud.callFunction({
  name: 'xxx', // 你的云函数名称
  data: {
    access_token: 'xxx', // 客户端一键登录接口返回的access_token
    openid: 'xxx' // 客户端一键登录接口返回的openid
  }
}).then(res => {
  // res.result = {
  //   code: '',
  //   message: ''
  // }
}).catch(err=>{
  // 处理错误
})

// 云函数
exports.main = async function (event, context){
  const res = await uniCloud.getPhoneNumber({
    appid: context.APPID, // 客户端callFunction时携带的AppId信息
    provider: 'univerify',
    access_token: event.access_token,
    openid: event.openid
  })
  // 执行入库等操作，正常情况下不要把完整手机号返回给前端
  return {
    code: 0,
    message: '获取手机号成功'
  }
}
```

**注意**

- 开发期间如果重新获取过appid需要重新编译uni-app项目

### 5+App（wap2app）项目

5+项目不可使用callFunction请求云函数，这时候可以使用云函数URL化让5+项目通过http请求的方式访问云函数

```js
// 客户端
const xhr = new plus.net.XMLHttpRequest();
xhr.onload = function(e) {
  const {
    code,
    message
  } = JSON.parse(xhr.responseText)
}
xhr.open( "POST", "https://xxx" ); // url应为云函数Url化之后的地址，可以在uniCloud web控制台云函数详情页面看到
xhr.setRequestHeader('Content-Type','application/json');
xhr.send(JSON.stringify({
  access_token: 'xxx', // 客户端一键登录接口返回的access_token
  openid: 'xxx' // 客户端一键登录接口返回的openid
}));

// 云函数，下面仅展示客户端使用post方式发送content-type为application/json请求的场景
exports.main = async function(event){
  let body = event.body
  if(event.isBase64Encoded) {
    body = Buffer.from(body,'base64')
  }
  const {
    access_token,
    openid
  } = JSON.parse(body)
  const res = await uniCloud.getPhoneNumber({
    provider: 'univerify',
    appid: 'xxx', // DCloud appid
    access_token: access_token,
    openid: openid
  })
  // 执行入库等操作，正常情况下不要把完整手机号返回给前端
  return {
    code: 0,
    message: '获取手机号成功'
  }
}
```

### 自有服务器调用

写法类似上面5+项目的云函数url化的方式，但是不同的是需要云函数返回手机号给自己服务器，这样就需要确保数据安全。


下面以一个简单的例子演示如何使用签名验证请求是否合法，使用GET方式发送请求


```js
// 以nodejs为例
const crypto = require('crypto')

const secret = 'your-secret-string' // 自己的密钥不要直接使用示例值，且注意不要泄露
const hmac = crypto.createHmac('sha256', secret);

// 自有服务器生成签名，并以GET方式发送请求
const params = {
  access_token: 'xxx', // 客户端传到自己服务器的参数
  openid: 'xxx'
}
// 字母顺序排序后拼接签名串
const signStr = Object.keys(params).sort().map(key => {
  return `${key}=${params[key]}`
}).join('&')
hmac.update(signStr);
const sign = hmac.digest('hex')
// 最终请求如下链接，其中https://xxxx/xxx为云函数Url化地址
// https://xxxx/xxx?access_token=xxx&openid=xxx&sign=${sign} 其中${sign}为上一步得到的sign值
```


```js
// 云函数验证签名，此示例中以接受GET请求为例作演示
const crypto = require('crypto')
exports.main = async function (event){
  //处理GET请求
  const secret = 'your-secret-string' // 自己的密钥不要直接使用示例值，且注意不要泄露
  const hmac = crypto.createHmac('sha256', secret);

  let params = event.queryStringParameters
  const sign = params.sign
  delete params.sign
  const signStr = Object.keys(params).sort().map(key => {
    return `${key}=${params[key]}`
  }).join('&')

  hmac.update(signStr);

  if(sign!==hmac.digest('hex')){
    throw new Error('非法访问')
  }

  const {
    access_token,
    openid
  } = params
  const res = await uniCloud.getPhoneNumber({
    provider: 'univerify',
    appid: 'xxx', // DCloud appid
    access_token: access_token,
    openid: openid
  })
  // 返回手机号给自己服务器
  return res
}
```
```js
// 云函数验证签名，此示例中以接受POST请求为例作演示
const crypto = require('crypto')
exports.main = async function (event){
  //处理POST请求
  let body = event.body
  if(event.isBase64Encoded) {
    body = Buffer.from(body,'base64')
  }
  let params = JSON.parse(body)
  const secret = 'your-secret-string' // 自己的密钥不要直接使用示例值，且注意不要泄露
  const hmac = crypto.createHmac('sha256', secret);
  const sign = params.sign
  delete params.sign
  const signStr = Object.keys(params).sort().map(key => {
    return `${key}=${params[key]}`
  }).join('&')

  hmac.update(signStr);

  if(sign!==hmac.digest('hex')){
    throw new Error('非法访问')
  }

  const {
    access_token,
    openid
  } = params
  const res = await uniCloud.getPhoneNumber({
    provider: 'univerify',
    appid: 'xxx', // DCloud appid
    access_token: access_token,
    openid: openid
  })
  // 返回手机号给自己服务器
  return res
}
```
## 常见问题@question

 **关于Android应用签名问题**

 Android 应用签名MD5如何获取？[查看详情](https://ask.dcloud.net.cn/article/38778)

 Android应用签名变更 需要注意什么？
- 未审核通过的一键登录应用可以直接修改签名信息，待审核通过后自动生效。
- 已经审核通过的应用要修改签名，需要删除一键登录应用，然后重新添加应用。待重新审核通过后，变更的签名才能生效。 [查看详情](https://ask.dcloud.net.cn/question/186683)

**一键登录应用个数超过限制 如何申请解除限制？**

每个账号均有开通一键登录应用个数的限制(默认为20个)，请合理安排使用。如需提升限额，需先完成企业认证(仅支持面向企业用户提升额度)，然后发邮件到 service@dcloud.io 申请。发送提额邮件时，需说明unicloud.dcloud.net.cn的登录账号，同时需解释公司主营业务，以及为何需要更多的一键登录的额度。

**一键登录应用转让问题**

[查看详情](https://ask.dcloud.net.cn/article/40934)

**新添加的一键登录应用要多久审核通过？**

应用信息需要运营商审核周期约为1-3个工作日。

**获号方法(uniCloud.getPhoneNumber) 遇到的常见的错误**

| 错误描述 | 解决方案 |
| --- | --- |
| 应用所有者账号信息异常，请检查账号uni一键登录服务是否正常| 包含了不必要的参数（apiKey、apiSecret），请删除这两个参数 |
| apiKey值不可为空 |1.检查HBuilderX版本为3.94及以上 2.  如下插件需要升级后才不会检查apiKey、apiSecret必填，如果使用uni-id公共模块需要更新到3.3.31版本，如果使用uni-id-pages需要更新到1.1.17版本，如果使用了uni-starter需要更新到2.1.6版本|
| 获取手机号失败，请稍后重试| 请加群反馈，[加群方式见“常见问题”下方](https://uniapp.dcloud.net.cn/univerify.html#question)|

**一键登录Demo项目**
- uni-id-pages（适用于uni-app的uni-id客户端）[详情查看](../uni-id/app.md)
- uni-id-pages-x（适用于[uni-app x](https://doc.dcloud.net.cn/uni-app-x/)的uni-id客户端）[详情查看](../uni-id/app-x.md)

**其他问题**

[查看详情](https://uniapp.dcloud.net.cn/univerify.html#question)
