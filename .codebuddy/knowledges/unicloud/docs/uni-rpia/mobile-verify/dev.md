# 开发指南

::: warning 注意
- 已支持云端运行，本地运行需HBuilderX 4.35+
- 欢迎加入[uni手机号实名核验技术交流群](https://im.dcloud.net.cn/#/?joinGroup=671228ce50c2166f8b4ec837)
:::

## 添加 uni-cloud-verify 扩展库依赖@extend

在需要调用此API的云函数或云对象右键，添加依赖

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/b866f119-1427-49ba-b3a1-7915cebd5624.png)

勾选 uni-cloud-verify 扩展库依赖

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/665b7307-7506-42ad-ad3f-6c7c1d59569f.png)

## API@api

### 获取uni认证管理对象@getuniverifymanager

云端在操作前，需要先获取 uniVerifyManager 对象实例，然后再通过 uniVerifyManager.xxx 调用对应的API

**云端代码**

```js
const uniVerifyManager = uniCloud.getUniVerifyManager({
	provider: "univerify"
});
```

**请求参数**

|参数名		|类型		|必填	|默认值	|说明														|
|:-:			|:-:		|:-:	|:-:		|:-															|
|provider	|String	|是		|-			|必填，当前固定填写 univerify	即可	|


### 响应公共字段@publicreturn

|字段		|类型		|说明																											|
|:-:		|:-:		|:-																												|
|errCode|Number	|为0代表请求成功，其他均为请求失败，注意，请求成功不代表验证通过	|
|errMsg	|String	|请求失败的错误描述																					|
|data		|Object	| 请求成功时，服务端返回的数据																					|


### 获取手机号二要素认证结果@mobile2eleverify

接口名：mobile2EleVerify

你可以在调用 uniVerifyManager.mobile2EleVerify 前执行一些自己的业务逻辑，判断用户是否有权限执行此API等等

**云端代码**

```js
const uniVerifyManager = uniCloud.getUniVerifyManager({
	provider: "univerify"
});
let verifyRes = await uniVerifyManager.mobile2EleVerify({
	realName: "姓名",
	mobile: "手机号",
});
console.log('认证结果: ', verifyRes.data);
```

**请求参数**

|参数名		|类型		|必填	|默认值	|说明		|
|:-				|:-:		|:-:	|:-:		|:-			|
|realName	|String	|是		|-			|姓名		|
|mobile		|String	|是		|-			|手机号	|

**响应参数**

响应字段如下，响应通用字段已省略，详细见[响应公共字段](#publicreturn)

|名称				|类型		|必须返回	|描述																																												|
|:-					|:-:		|:-:			|:-																																													|
|status			|Number	|是				|认证结果，1-通过 2-不通过 3-查无结果 0-待定																										|
|reasonType	|Number	|否				|原因详情：<br/>2-认证不一致	<br/>3-查无此手机号	<br/>4-认证信息格式错误	<br/>7-结果获取失败，请重试	|
|logId			|String	|是				|本次请求日志id，可以根据该标识在控制台查询结果																									|
|isPayed		|Number	|是				|本次请求是否收费标识，1代表收费，0代表不收费																										|
|mobileType	|String	|是				|运营商类型：1-移动，2-联通，3- 电信，9-未知																										|

**响应体示例**

```json
{
	"errCode": 0,
	"errMsg": "",
	"data": {
		"status": 1,
		"reasonType": 1,
		"logId": "9f9def8638c74506b3f5ef17f893c8b9",
		"isPayed": 1,
		"mobileType": "3",
		"note": ""
	}
} 
```

### 获取手机号三要素（简版）认证结果@mobile3eleverify

接口名：mobile3EleVerify

你可以在调用 uniVerifyManager.mobile3EleVerify 前执行一些自己的业务逻辑，判断用户是否有权限执行此API等等

**云端代码**

```js
const uniVerifyManager = uniCloud.getUniVerifyManager({
	provider: "univerify"
});
let verifyRes = await uniVerifyManager.mobile3EleVerify({
	realName: "姓名",
	idCard: "身份证",
	mobile: "手机号",
});
console.log('认证结果: ', verifyRes.data);
```

**请求参数**

|参数名		|类型		|必填	|默认值	|说明		|
|:-				|:-:		|:-:	|:-:		|:-			|
|realName	|String	|是		|-			|姓名		|
|idCard		|String	|是		|-			|身份证	|
|mobile		|String	|是		|-			|手机号	|

**响应参数**

响应字段如下，响应通用字段已省略，详细见[响应公共字段](#publicreturn)

|名称				|类型		|必须返回	|描述																																																																					|
|:-					|:-:		|:-:			|:-																																																																						|
|status			|Number	|是				|认证结果，1-通过 2-不通过 3-查无结果 0-待定																																																			|
|reasonType	|Number	|否				|原因详情：<br/>2-认证不一致	<br/>3-该手机号查询无记录	<br/>4-认证信息有误		<br/>5-号码状态异常（空号、停机等）<br/>6-解析手机号运营商失败<br/>7-其他出错	|
|logId			|String	|是				|本次请求日志id，可以根据该标识在控制台查询结果																																																	|
|isPayed		|Number	|是				|本次请求是否收费标识，1代表收费，0代表不收费																																																			|
|mobileType	|String	|是				|运营商类型：1-移动，2-联通，3- 电信，9-未知																																																			|

**响应体示例**

```json
{
	"errCode": 0,
	"errMsg": "",
	"data": {
		"status": 1,
		"reasonType": 1,
		"logId": "9f9def8638c74506b3f5ef17f893c8b9",
		"isPayed": 1,
		"mobileType": "3",
		"note": ""
	}
} 
```

### 获取手机号三要素认证（详版）结果@mobile3eleverifypro

接口名：mobile3EleVerifyPro

你可以在调用 uniVerifyManager.mobile3EleVerifyPro 前执行一些自己的业务逻辑，判断用户是否有权限执行此API等等

**详版对比简版优势**

手机号三要素认证（详版）比手机号三要素认证（简版）在响应参数 reasonType 上有区别，以下是详版专属返回的类型

- 20：手机号已实名，姓名正确，但证件号错误
- 21：手机号已实名，证件号正确，但姓名错误
- 22：手机号已实名，但证件号和姓名均非该手机号绑定信息

因此详版优势为：在认证不一致时，会有更多的提示信息，方便用户排查问题。

**云端代码**

```js
const uniVerifyManager = uniCloud.getUniVerifyManager({
	provider: "univerify"
});
let verifyRes = await uniVerifyManager.mobile3EleVerifyPro({
	realName: "姓名",
	idCard: "身份证",
	mobile: "手机号",
});
console.log('认证结果: ', verifyRes.data);
```

**请求参数**

|参数名		|类型		|必填	|默认值	|说明	|
|:-			|:-:		|:-:	|:-:		|:-		|
|realName	|String	|是		|-			|姓名	|
|idCard	|String	|是		|-			|身份证	|
|mobile	|String	|是		|-			|手机号	|

**响应参数**

响应字段如下，响应通用字段已省略，详细见[响应公共字段](#publicreturn)

|名称				|类型		|必须返回	|描述																																																																											|
|:-				|:-:		|:-:			|:-																																																																											|
|status			|Number	|是				|认证结果，1-通过 2-不通过 3-查无结果 0-待定																																																									|
|reasonType	|Number	|否				|原因详情：<br/>2-认证不一致	<br/>3-该手机号查询无记录	<br/>4-认证信息有误		<br/>5-号码状态异常（空号、停机等）<br/>6-解析手机号运营商失败<br/>7-其他出错<br/>以下返回为详版专属<br/>20-手机号已实名，姓名正确，但证件号错误<br/>21-手机号已实名，证件号正确，但姓名错误<br/>22-手机号已实名，但证件号和姓名均非该手机号绑定信息	|
|logId			|String	|是				|本次请求日志id，可以根据该标识在控制台查询结果																																																	|
|isPayed		|Number	|是				|本次请求是否收费标识，1代表收费，0代表不收费																																																									|
|mobileType	|String	|是				|运营商类型：1-移动，2-联通，3- 电信，9-未知																																																									|

**响应体示例**

```json
{
	"errCode": 0,
	"errMsg": "",
	"data": {
		"status": 1,
		"reasonType": 1,
		"logId": "9f9def8638c74506b3f5ef17f893c8b9",
		"isPayed": 1,
		"mobileType": "3",
		"note": ""
	}
} 
```

## 外部系统通过http方式调用接口@http

1. 新建云对象 `uni-cloud-verify-co`，云对象名字可自己修改，这里以 `uni-cloud-verify-co` 为例。

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/56e57aba-9c24-4482-b0f0-328e3b88242d.png)

在弹窗的窗口中选择云对象，输入名称 uni-cloud-verify-co

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/f1575aef-48de-4ea9-bee7-4e73ce8325dc.png)

2. 修改云对象下的 `package.json` 文件，完整替换内容如下

```js
{
  "name": "uni-cloud-verify-co",
  "dependencies": {},
  "extensions": {
    "uni-cloud-verify": {}
  },
	"cloudfunction-config": {
	  "concurrency": 1,
	  "memorySize": 512,
	  "path": "/http/uni-cloud-verify-co",
	  "timeout": 60,
	  "triggers": [],
	  "runtime": "Nodejs18"
	}
}
```

3. 修改云对象下的 `index.obj.js` 文件，完整替换内容如下
 
**注意：请修改变量apiKey的值为你的通讯密钥**

如果你自己有更好的安全验证逻辑，可自行修改 `_before` 内的逻辑

```js
const apiKey = "xxxxxx"; // 请替换为你的通讯密钥

const uniVerifyManager = uniCloud.getUniVerifyManager({
	provider: "univerify",
});

class MyError extends Error {
	constructor(err) {
		super();
		this.err = err;
	}
}

module.exports = {
	_before: function() {
		const params = this.getParams();
		const data = params[0] || params;
		// 验证通讯密钥
		if (data.key !== apiKey) {
			throw new MyError({
				code: -1,
				msg: "非法请求"
			});
		}
	},
	_after: function(error, result) {
		if (error) {
			if (error.err) {
				return error.err;
			}
			throw error;
		}
		return result
	},
	// 手机号三要素认证（简版）
	async mobile3EleVerify(data) {
		let {
			realName,
			idCard,
			mobile,
		} = data;

		const res = await uniVerifyManager.mobile3EleVerify({
			realName,
			idCard,
			mobile
		});

		return res;
	},
	// 手机号三要素认证（详版）
	async mobile3EleVerifyPro(data) {
		let {
			realName,
			idCard,
			mobile,
		} = data;

		const res = await uniVerifyManager.mobile3EleVerifyPro({
			realName,
			idCard,
			mobile
		});

		return res;
	},
	// 手机号二要素认证
	async mobile2EleVerify(data) {
		let {
			realName,
			idCard,
			mobile,
		} = data;

		const res = await uniVerifyManager.mobile2EleVerify({
			realName,
			idCard,
			mobile
		});

		return res;
	}

}
```

4. 上传云对象 `uni-cloud-verify-co`

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/828ae99b-21b1-4967-a987-26ef9eea4824.png)

5. 查看http接口地址，登录 [uniCloud控制台](https://unicloud.dcloud.net.cn/)，进入空间详情，点击左侧菜单 - 云函数/云对象 - 函数/对象列表，进入 uni-cloud-verify-co 的详情

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/8bd9c241-fdea-41a1-9547-86ce03005257.png)

6. 进入详情后点击右下方的复制路径按钮

![](https://web-ext-storage.dcloud.net.cn/unicloud/uni-rpia/133c5359-503f-4d4b-b648-cdf86b5a4c66.png)

假设复制的路径是：`https://xxxxxxxxxx.next.bspapp.com/http/uni-cloud-verify-co`

则

请求手机号三要素认证（简版）的完整http请求地址为：

GET请求

```
https://xxxxxxxxxx.next.bspapp.com/http/uni-cloud-verify-co/mobile3EleVerify?realName=姓名&idCard=身份证&mobile=手机号&key=通讯密钥
```

请求手机号三要素认证（详版）的完整http请求地址为：

GET请求

```
https://xxxxxxxxxx.next.bspapp.com/http/uni-cloud-verify-co/mobile3EleVerifyPro?realName=姓名&idCard=身份证&mobile=手机号&key=通讯密钥
```

请求手机号二要素认证的完整http请求地址为：

GET请求

```
https://xxxxxxxxxx.next.bspapp.com/http/uni-cloud-verify-co/mobile2EleVerify?realName=姓名&mobile=手机号&key=通讯密钥
```