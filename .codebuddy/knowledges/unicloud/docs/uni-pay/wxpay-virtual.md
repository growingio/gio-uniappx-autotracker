## 简介

此文档是微信小程序虚拟支付的云端API补充，使用此文档的API需要先安装 [uni-pay](./uni-app.md) 插件才能使用，仅 uni-app 项目可用，uni-app-x 项目暂不支持微信支付，也不支持微信小程序虚拟支付

## Api 列表

提示：微信虚拟支付有很多API，当前仅支持以下几个常用的API，后面会陆续增加其他API

**特别说明**

以下API均只能在云端调用，不可以在前端调用

### 充值代币、道具直购

`充值代币` 和 `道具直购` 涉及到前端API，需要搭配 `uni-pay` 组件使用，详情见 [充值代币文档](./uni-app.md#short-series-coin) 、[道具直购文档](./uni-app.md#short-series-goods)

### 查询用户代币余额@queryUserBalance

**接口名**

`queryUserBalance`

**入参说明**

|    参数名     |  类型  |  必填  | 默认值 |    说明    |
| :-----------: | :----: | :---:| :----: |:--------: |
| openid        | String |  是  |   -    | 用户的openid |  
| userIp        | String |  是  |   -    | 用户的ip地址 | 

**返回值说明**

|    参数名         |  类型  |    说明    |
| :-----------:    | :----: | :--------: |
| balance          | Number |  代币总余额，包括有价和赠送部分|  
| presentBalance   | Number |  赠送账户的代币余额  | 
| sumSave          | Number | 累计有价货币充值数量   | 
| sumPresent       | Number | 累计赠送无价货币数量   | 
| sumBalance       | Number | 历史总增加的代币金额   | 
| sumCost          | Number | 历史总消耗代币金额  | 
| firstSaveFlag    | Boolean| 是否满足首充活动标记。0:不满足。1:满足   | 

**使用示例**

```js
// 引入 uni-pay-co 云对象
const uniPayCo = uniCloud.importObject("uni-pay-co");
// 请求微信虚拟支付API
let res = await uniPayCo.requestWxpayVirtualApi({
	method: "queryUserBalance", // 请求方法
	// 请求参数
	data: {
		openid: "", // 用户openid
		userIp: "", // 用户IP
	}
});
console.log('res: ', res);
```

### 扣减代币（一般用于代币支付）@currencyPay

**接口名**

`currencyPay`

**注意**

此API需要用到用户的 `sessionKey`，如果用户长时间没有活跃过小程序，则无法请求扣减代币接口，会报用户sessionKey不存在或已过期，请重新登录的错误

微信小程序虚拟支付退款后，如果退款的是代币充值订单，则退款成功后原本用户充值的代币不会自动扣减，需要执行此API才能扣减，而用户长时间没有活跃过小程序，则无法请求扣减代币接口，因此需要注意退款时间，时间相隔太长可能会导致出现无法扣减代币的尴尬情况

**入参说明**

|    参数名     |  类型  |  必填  | 默认值 |    说明    |
| :-----------: | :----: | :---:| :----: |:--------: |
| openid        | String |  是  |   -    | 用户的openid |  
| userIp        | String |  是  |   -    | 用户的ip地址 | 
| amount        | Number |  是  |   -    | 支付的代币数量 | 
| outTradeNo    | String |  是  |   -    | 订单号 | 
| deviceType    | Number |  是  |   -    | 平台类型1-安卓 2-苹果 | 
| payitem       | String |  否  |   -    | 物品信息。记录到账户流水中。如:[{"productid":"物品id", "unit_price": 单价, "quantity": 数量}],注意只能是json字符串格式 | 
| remark        | String |  否  |   -    | 备注 | 
| sessionKey    | String |  否  |   -    | 用户的sessionKey，不传会尝试自动获取 | 

**返回值说明**

|    参数名         |  类型  |    说明    |
| :-----------:    | :----: | :--------: |
| balance          | Number |  总余额，包括有价和赠送部分|  
| usedPresentAmount   | Number |  使用赠送部分的代币数量  | 
| outTradeNo          | String | 订单号原样返回   | 

**使用示例**

```js
// 引入 uni-pay-co 云对象
const uniPayCo = uniCloud.importObject("uni-pay-co");
let outTradeNo = "test-" + Date.now(); // 商户订单号
// 请求微信虚拟支付API
let res = await uniPayCo.requestWxpayVirtualApi({
	method: "currencyPay", // 请求方法
	// 请求参数
	data: {
		openid: "", // 用户openid
		userIp: "", // 用户IP
		amount: 1, // 扣减的代币数量
		outTradeNo, // 商户订单号
		payitem: JSON.stringify([{ "productid": "test001", "unit_price": 1, "quantity": 1 }]),
		remark: "备注",
		deviceType: 1, // 平台类型1-安卓 仅支持传1
	}
});
console.log('res: ', res);
```

### 代币支付退款（currencyPay接口的逆操作）@cancelCurrencyPay

**接口名**

`cancelCurrencyPay`

**入参说明**

|    参数名     |  类型  |  必填  | 默认值 |    说明    |
| :-----------: | :----: | :---:| :----: |:--------: |
| openid        | String |  是  |   -    | 用户的openid |  
| userIp        | String |  是  |   -    | 用户的ip地址 | 
| amount        | Number |  是  |   -    | 退款金额 | 
| outTradeNo    | String |  是  |   -    | 订单号 | 
| outRefundNo    | String |  是  |   -    | 本次退款单的单号 | 
| deviceType    | Number |  是  |   -    | 平台类型1-安卓 2-苹果 | 

**返回值说明**

|    参数名         |  类型  |    说明    |
| :-----------:    | :----: | :--------: |
| outRefundNo      | String |  退款订单号|  

**使用示例**

```js
// 引入 uni-pay-co 云对象
const uniPayCo = uniCloud.importObject("uni-pay-co");
let outTradeNo = "";
let lastFourDigits = Date.now().toString().substr(-4);
// 请求微信虚拟支付API
let res = await uniPayCo.requestWxpayVirtualApi({
	method: "cancelCurrencyPay", // 请求方法
	// 请求参数
	data: {
		openid: "", // 用户openid
		userIp: "", // 用户IP
		amount: 1, // 撤回扣减的代币数量
		outTradeNo, // 商户订单号
		outRefundNo: `${outTradeNo}-${lastFourDigits}`,
		deviceType: 1, // 平台类型1-安卓 仅支持传1
	}
});
console.log('res: ', res);
```

### 代币赠送@presentCurrency

**接口名**

`presentCurrency`

**入参说明**

|    参数名     |  类型  |  必填  | 默认值 |    说明    |
| :-----------: | :----: | :---:| :----: |:--------: |
| openid        | String |  是  |   -    | 用户的openid |  
| userIp        | String |  是  |   -    | 用户的ip地址 | 
| amount        | Number |  是  |   -    | 退款金额 | 
| outTradeNo    | String |  是  |   -    | 订单号 | 
| deviceType    | Number |  是  |   -    | 平台类型1-安卓 2-苹果 | 

**返回值说明**

|    参数名         |  类型  |    说明    |
| :-----------:    | :----: | :--------: |
| balance          | String |  赠送后用户的代币余额|  
| presentBalance   | String |  用户收到的总赠送金额|  
| outTradeNo       | String |  赠送单号|  

**使用示例**

```js
// 引入 uni-pay-co 云对象
const uniPayCo = uniCloud.importObject("uni-pay-co");
let outTradeNo = "test-" + Date.now(); // 商户订单号
// 请求微信虚拟支付API
let res = await uniPayCo.requestWxpayVirtualApi({
	method: "presentCurrency", // 请求方法
	// 请求参数
	data: {
		openid: "", // 用户openid
		userIp: "", // 用户IP
		amount: 1, // 赠送用户代币数量
		outTradeNo, // 商户订单号
		deviceType: 1, // 平台类型1-安卓 仅支持传1
	}
});
console.log('res: ', res);
```