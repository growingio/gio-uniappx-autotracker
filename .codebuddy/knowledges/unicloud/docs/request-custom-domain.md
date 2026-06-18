## 使用场景

客户端在通过callFunction调用云函数时，会通过服务提供商分配的request域名来发起请求，目前各服务提供商默认分配的域名如下：

| 服务提供商	 | request域名	 |
|--------|-----------|
| 支付宝云	  | https://{spaceId}.api-hz.cloudbasefunction.cn	       |
| 腾讯云	   | https://{spaceId}.ap-shanghai.tcb-api.tencentcloudapi.com	       |
| 阿里云	   | https://api.next.bspapp.com	       |

其中腾讯云与支付宝云为携带服务空间ID的子域名，每个空间不同，阿里云为固定域名。

固定域名是所有开发者共用，可能存在部分开发者违规导致域名被某些地区运营商封禁，从而影响该地区其他开发者正常的业务。

非固定域名可以避免这个问题，不过现在腾讯云和支付宝云提供的均是含有服务空间id的子域名，仍然存在上述问题。

为更好的解决这个问题，uniCloud支付宝云服务空间提供了自定义request域名功能，您可以在web控制台进行配置，配置完成后，所有云函数的request域名将变成您配置的域名。

本文档主要指导您如何在uniCloud web控制台管理和使用云函数自定义request域名。

## 操作步骤

> 仅支付宝云支持

### 设置云函数自定义request域名@set-request-domain
1. 登录[uniCloud控制台](https://unicloud.dcloud.net.cn/)，选择支付宝云服务空间。
2. 点击左侧菜单栏“云函数”，进入云函数管理页面。
3. 页面右上角“域名绑定”下拉菜单中选择“云函数request域名绑定”，可以查看默认域名及已绑定的域名。
![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/SCR-20251110-pgah.png)
4. 点击“添加域名”，在弹出的窗口中进行配置，绑定域名需先完成CNAME解析，并上传https证书。
![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/SCR-20251110-pgnz-2.png)
![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/SCR-20251110-phrg.png)
5. 绑定成功后，自定义域名默认关闭，点击“启用”按钮后，即可生效。
![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/SCR-20251110-pjxb.png)

### 使用自定义request域名@use-request-domain

在完成上述步骤后，如需使用自定义request域名，还需要在开发阶段做一些处理，两种使用方案：

#### 代码中使用自定义域名

在日常开发中，HBuilderX关联服务空间后，我们可以在代码中直接调用`uniCloud.callFunction()`来调用云函数，此时使用的是默认request域名。

我们也可以通过`uniCloud.init()`来初始化uniCloud实例，并在`endpoint`传入自定义request域名，此时调用`uniCloud.callFunction()`时，将使用自定义request域名。

```javascript
const myCloud = uniCloud.init({
  provider: 'alipay',
  spaceId: 'env-xxx', 
  accessKey: 'xxxx',
  secretKey: 'xxxx',
  spaceAppId: 'xxxx',
  endpoint: '控制台绑定的自定义域名',
});
//通过uniCloud实例调用云开发的API
myCloud.callFunction()
```

这种方法适用于在客户端代码中直接使用自定义域名，控制台绑定后即使没有启用，也可以通过设置`endpoint`来使用自定义域名。

#### HBuilderX中自动使用自定义域名@hbx-use-domain
> HBuilderX 5.0+版本支持

控制台绑定域名后，需主动点击“启用”，如果绑定了多个域名，在启用某个域名时，已开启的域名会自动关闭，即仅一个域名生效。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/SCR-20251110-pqxt.png)

在HBuilderX中重新关联启用了自定义域名的服务空间

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/SCR-20251110-rafr.png)

关联后重新打包发布即可全局生效。

## 配合全球加速

### 资源准备

1. 一个已经在阿里云备案过的自己的域名
2. 需要开通一个支付宝云服务空间，且绑定了[自定义request域名](#set-request-domain)
3. 需要购买阿里云全球加速产品（选按量付费即可）
4. 域名有SSL证书

### 操作步骤

假设需要加速的域名为 api.example.com

1. 先在支付宝云绑定[自定义request域名](#set-request-domain)，域名就是加速域名，即 api.example.com
2. 控制台绑定域名后，需主动点击“启用”，让域名生效
3. 在HBuilderX中重新关联启用了自定义域名的服务空间
4. 开通[阿里云全球加速](https://ga.console.aliyun.com/)，具体操作按下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/1.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/2.png)

勾选国内地区 + 你想要加速的海外地区，不勾选国内会导致国内用户无法访问

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/3.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/4.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/5.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/6.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/7.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/8.png)

完成上面步骤后，再去域名解析后台，修改域名解析为全球加速的cname地址

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/9.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ga/10.png)

完成上述全部步骤后，自定义域名就支持全球加速，[查看HBuilderX中自动使用自定义域名](#hbx-use-domain)

## 注意事项
- 使用自定义域名并发布后，请务必保证域名绑定正确，域名CNAME解析正确，否则会导致已发布应用请求失败。
- 如需更换其他自定义域名，必须使用HBuilderX重新打包发布新版本。
