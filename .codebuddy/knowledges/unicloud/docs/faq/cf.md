## 云函数相关问题

### 云函数 和 传统 Node.js 开发有何区别？

云函数相当于 Node.js + Serverless + DCloud改进。
- 传统Node.js开发需要购买服务器，安装Node.js环境，部署 pm2 等守护进程；云函数无需考虑服务器环境，只需专心实现业务代码，然后将云函数一键上传，云服务商负责云函数运行环境的准备。
- 传统Node.js开发模式，开发者需监控服务器参数，比如硬盘使用率，避免服务器负载过高导致业务中断；云函数模式下，开发者无需关心云函数运行的宿主环境，云厂商会实现服务调配及硬件监控。
- 用户量较大时，传统Node.js开发需考虑购买更多服务器并实现负载均衡；云函数模式下，云服务商自动弹性扩容，开发者无需担心服务器扛不住压力。
- 传统Node.js开发模式，需考虑安全防护，比如DDos攻击；云函数模式，云厂商的API网关会做拦截防护，开发者无需关心，并可节省高防IP等费用

总结一下，前端同学即便可熟练编写Node.js代码，但对于DB优化、弹性扩容、攻击防护、灾备处理等方面还是有经验欠缺的，但`uniCloud`将这些都封装好了，真正做到仅专注业务实现，其它都委托云厂商服务。

另外，在 Node.js 代码实现上，云函数每次执行的宿主环境（可简单理解为虚拟机或服务器硬件）可能相同，也可能不同，因此传统`Node.js`开发中将部分信息存储本地硬盘或内存的方案就不再适合，建议通过云数据库或云存储的方案替代。

当然还有最重要的一点，在uniCloud中，推荐大量业务使用clientDB，一个应用中写不了太多云函数。

### 可否通过http url方式访问云函数或云数据库？

- 场景1：比如App端微信支付，需要配服务器回调地址，此时需要一个HTTP URL。
- 场景2：非uni-app开发的系统，想要连接uniCloud，读取数据，也需要通过HTTP URL方式访问。

uniCloud提供了`云函数URL化`，来满足上述需求。[详见](https://uniapp.dcloud.io/uniCloud/http)

### 云函数访问时快时慢怎么回事？

云函数对应的资源，如果长时间不使用，会被阿里云或腾讯云平台从内存中释放。一旦被释放，启动云函数时会有一个冷启动的过程。

表现为：隔了很久不用，第一次用就会比较慢，然后立即访问第二次，则很快，毫秒级响应。

冷启动的速度一般不会超过1.5秒，如超过1.5秒应该是云函数写的有问题或网络有问题。

资源回收策略方面，阿里云是15分钟内没有第二次访问的云函数，就会被回收。腾讯云是半小时。

两家云厂商仍然在优化这个问题。目前如果开发者在意这个问题，给开发者的建议是：
1. 使用clientDB可以减少遇到冷启动问题的概率
2. 非高频访问的云函数，合并到高频云函数中。有的开发者使用纯单页方式编写云函数，即在一个云函数中通过路由处理实现了整个应用的所有后台逻辑。参考[插件](https://ext.dcloud.net.cn/search?q=%E8%B7%AF%E7%94%B1&cat1=7&orderBy=UpdatedDate)
3. 非高频访问的云函数，可以通过定时任务持续运行它（注意腾讯云可以使用这个方式完全避开冷启动，而阿里云的定时任务最短周期大于资源回收周期）
4. 配置云函数的单实例多并发，请参考：[单实例多并发](../cf-functions.md#concurrency)


### 如何控制云函数数量？云函数是否可以按多级目录整理@merge-functions

不需要控制数量，实际开发中不会突破限制。

因为实际开发中会使用框架而不是真的一个一个开发云函数。

1. 使用[clientDB](https://doc.dcloud.net.cn/uniCloud/clientdb)。这种方式是在前端直接操作数据库，此时一个云函数都不需要写。开发效率远超传统开发模式。包括它配套的action云函数是不占用云函数数量的。
2. 使用[uni-cloud-router单路由云函数框架](https://doc.dcloud.net.cn/uniCloud/uni-cloud-router)，这种方式只有一个云函数，所有接口都是这个云函数的不同参数，它有统一的路由管理。

以免费空间的48个云函数举例，一般情况下：
- [uni-id](../uni-id/summary.md)会有一个云对象（uni-id-co）或老版的云函数（uni-id-cf），这是必备的一个云函数
- 如果使用uni统计、app升级中心、uni发布平台、uniPush2、[uni-search热搜词统计跑批](https://ext.dcloud.net.cn/plugin?id=3851)，这些会自带云函数

上述几个是官方推荐的几个常用框架所带的云函数，然后开发者自己的代码里，大多数业务使用clientDB开发，不写云函数，或者写了配套的action云函数也不占用云函数数量；如果还需要自己写一些云函数，再加上uni-cloud-router，用这个单路由云函数搞定剩余需求；另外如果有跑批数据的需求可以再来一个云函数。所以无论如何48个云函数都占不满。

uniCloud的每个云函数是一个独立进程，不存在云函数级别的多级目录概念。

每个云函数下可以有子目录，但它们都属于这个云函数的一部分，而不是另一个云函数。

单路由云函数框架不止是官方提供的uni-cloud-router，插件市场有很多类似框架：[详见](https://ext.dcloud.net.cn/search?q=%E8%B7%AF%E7%94%B1&cat1=7&orderBy=TotalDownload)

### 云函数通过https访问其他服务器时出现“certificate has expired”@lets-encrypt-cert

> 本章节仅对let's encrypt证书调整进行说明，其他情况请检查对应网站证书是否过期

let's encrypt于2021年9月30日根证书过期并切换到新版根证书。详情参考：[DST Root CA X3 Expiration (September 2021)](https://letsencrypt.org/docs/dst-root-ca-x3-expiration-september-2021/)。此次过期行为引起nodejs8请求使用了let's encrypt证书的网站时出现`certificate has expired`错误。

解决方案有以下两种：

1. 将云函数升级到nodejs12，删除旧云函数，配置node版本之后重新上传。详情参考：[云函数package.json](https://doc.dcloud.net.cn/uniCloud/cf-functions?id=packagejson)

2. （不推荐）使用`uniCloud.httpclient.request`时使用`rejectUnauthorized: false`。示例代码如下：

  ```js
  const https = require('https')
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  })
  await uniCloud.httpclient.request('https://xxx.com/get', {
  	httpsAgent
  })
  ```

### 调用云函数时出现`Unauthenticated access is denied`@access-denied

如使用腾讯云作为服务商，出现此问题时请检查前端是否有执行clearStorage操作。clearStorage会清理掉腾讯云设置的token，导致请求云函数报错。

### 使用阿里云访问云函数时出现`unknow system error`

检查云函数运行时间是否超出配置的超时时间，优化代码逻辑或配置更长的超时时间

### 云函数云端运行默认时区是什么

- 阿里云、腾讯云：`UTC+0`
- 支付宝云：`UTC+8`

### 定时任务执行失败时是否会重试？重试逻辑是什么？

- 阿里云：会重试。执行失败后会重试一次。
- 腾讯云：会重试。执行失败后会重试两次，最多执行三次，且这几次执行的requestId都是一个。
- 支付宝云：不会重试。

### 腾讯云开启固定公网出口IP报“本地域资源售罄”错误

点击uniCloud控制台“紧急报障”，提供spaceId、操作开启固定IP的云函数名称，由DCloud客服提交工单由腾讯云处理。

### 云函数日志无内容

- 腾讯云：腾讯云日志服务为按量计费收费服务，需主动开启日志服务。开启操作路径：云函数日志->开启日志。
- 阿里云、支付宝云：联系DCloud客服排查。

### 阿里云云函数报错 `Throttling.Api: Request was denied due to api flow control`

QPS限流，不区分云函数、云数据库、云存储读写等请求。可能原因及解决方法：
- 流量上涨达到系统阈值 -> 需提工单申请提升qos阈值；
- 慢日志导致的db请求被限流 -> 控制台可查询慢查询日志具体内容，根据慢日志配置索引，参考文档：https://doc.dcloud.net.cn/uniCloud/db-performance.html#slow
**绝大多数情况是由于慢查询导致，应先排查慢查询日志**

### 阿里云云函数报错 `Throttling.Api.Concurrency: Request was denied due to api flow control`

并发限流，包含云函数和云数据库两类请求。可能原因及解决方法：
- 流量上涨达到系统阈值 -> 需提工单申请提升qps阈值

### 阿里云云函数报错 `FunctionResourceExhausted || ResourceExhausted`

函数实例数限流。可能原因及解决方法：
- 函数实例总数超过系统阈值（一个账户默认总数为300个实例），或者流量陡增过快（函数实例创建需要时间） -> 需联系DCloud客服提工单申请提升阈值；

### 阿里云云函数报错 `PrePayResourceExhausted`

套餐内某项资源超额限流。可升级套餐或者转为后付费，5分钟内自动恢复。

### 阿里云云函数绑定域名报错 `DomainNotRegistration: Domain name not registered.`

绑定域名需要在阿里云完成ICP备案，如果域名在其他云厂商，需要在阿里云接入备案才能绑定

### 支付宝云函数报错：函数不允许调用

云函数请求时，会在`header`中增加`x-client-timestamp:1724819065430`参数，时间为客户端本地时间，如果本地时间与北京时间有差异，且较大时，会报这类错误。根本原因：时间戳参与签名，函数签名校验失败。
- 解决方案：修改本地时间与北京时间保持一致。
