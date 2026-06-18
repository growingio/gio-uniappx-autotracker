## uniCloud基础问题

### uniCloud和微信小程序云开发、支付宝云开发有何区别？

微信、支付宝、百度的小程序，均提供了云开发。但它们都仅支持自家小程序，无法在其他端使用。

`uniCloud`和微信小程序云开发、支付宝云开发使用相同的基础建设平台，微信小程序云开发背后是腾讯云的TCB团队，支付宝云开发背后是阿里小程序云团队。`uniCloud`是DCloud和阿里小程序云团队、腾讯云的TCB团队直接展开深层次合作，在他们底层资源的基础上进行二次封装，提供的跨端云开发方案。

简单来说，uniCloud和微信小程序云开发、支付宝云开发一样稳定健壮，但有更多优势：
- 跨平台。不管你在uniCloud里选择了阿里还是腾讯的serverless，均可以跨uni-app的全端使用。从pc到h5，从Android到iOS，以及各家小程序快应用，十几个平台全端支持
- uniCloud提供了`clientDB`神器，减少90%的服务器开发工作量，且保障数据安全。[详见](clientDB.md)
- uniCloud提供了[uni-id](uni-id/summary.md)、[uniPay](./unipay)等重要框架，大幅减少开发者的相应功能开发量。
- uniCloud提供了[uni-starter](https://ext.dcloud.net.cn/plugin?id=5057)，客户端开发工作量大幅减少。
- uniCloud提供了[uniCloud admin](./admin)，管理端开发工作量大幅减少。
- uniCloud提供了[schema2code](schema2code.md)，只需编制数据库schema文件，用户端和管理端的数据列表、分页、搜索、详情查看、修改、删除，全套代码均能自动生成。
- 更易学。uniCloud提供了`JQL`查询语言，比SQL和MongoDB的查询语法更简单易掌握，尤其是联表查询非常简单。[详见](https://uniapp.dcloud.io/uniCloud/database?id=jsquery)
- 更完善的工具链。前端uni-app、云端uniCloud、还有ide端的HBuilderX，互相紧密搭配，打造闭环的优秀开发体验
- 更丰富的生态。插件市场有大量现成的轮子和资源 [详见](https://ext.dcloud.net.cn/?cat1=7&orderBy=TotalDownload)

如果你已经使用过微信小程序云开发，想进一步了解对比差异或如何从微信小程序云迁移到uniCloud，[详见](wx2unicloud.md)

### uniCloud稳定吗？DCloud服务器异常会影响我的线上业务吗？

`uniCloud`是 DCloud 和阿里云、腾讯云等成熟云厂商合作推出的云服务产品，阿里云、腾讯云等提供云端基础资源，DCloud提供API设计、前端框架、IDE工具支持、管理控制台、插件生态等服务，开发者的云函数直接托管在阿里云等服务商的serverless平台。

用户终端上的应用在运行时，直连云服务商serverless平台，不会经过DCloud服务器，开发者无需担心因DCloud服务器负载而影响自己业务的问题。

阿里云和腾讯云都有商业级SLA。如果真出问题，他们会负责赔偿。

### 云开发是nodejs+改良版MongoDB组合，对比php+mysql的传统组合怎么样？

nodejs的性能优于php，MongoDB的性能也优于mysql。

对于前端而言，MongoDB这种类json的文档数据库更加易用，且有更高的灵活性。
操作MongoDB仍然使用js的方法。

MongoDB非常灵活，可以对大数据量的表随便增加字段。而mysql的表数据量一旦变大，每增加一个字段，数据库的体积和性能都会造成负面影响。

MongoDB的字段可以嵌套，表达tree型的数据非常方便，扩展起来随心所欲。

对于希望增加数据冗余以提高性能的开发者而言，nosql数据库则是利器。

当然，对于喜欢传统数据库的开发者而言，仍然可以按传统方式设计数据库表结构。

MongoDB的功能要比mysql强大很多。sql太简单的了，一段sql语句其实就是一个字符串，写不了复杂的逻辑。

而MongoDB有非常多的js api，各种聚合运算符，它是可编程的，而不是仅靠一段字符串sql语句来表达。

举个例子，商品数据表中有4个字段：浏览量、收藏量、购买量、评价。需要生成一个近期热门商品列表，4个字段各占25%的权重，加权后排序。这种需求sql是无法直接实现的。而MongoDB里可以一个查询直接返回排序好的结果。

SQL的模糊查询也很弱，like只有前后%，导致很多开发者不得不再使用ElastciSearch这些三方数据库。虽然后期版本的mysql也支持有限正则。但MongoDB的正则查询还是超过开发者预期的强大。

MongoDB虽然强大，但易用性不佳，尤其是聚合运算写起来非常复杂。

uniCloud在MongoDB的基础上改良，进一步提供了`DB Schema`和`JQL`。

`DB Schema`是一个json文件，可以对数据进行描述、约定字段值域、控制操作权限、描述字段之间的关系，让数据库管理更高效，并且大幅降低了服务端的代码开发工作量。[详见](https://uniapp.dcloud.io/uniCloud/schema)

`JQL`是一套操作uniCloud数据库的方法，它更符合js开发者的习惯，并且极大的降低了学习成本和代码量。
比如联表查询、tree查询，都变的非常简单。像tree查询是以往只有oracle才有的功能。`JQL`文档[详见](https://doc.dcloud.net.cn/uniCloud/database?id=jsquery)

曾经DCloud官方也推进过阿里云和腾讯云提供serverless的mysql。但经过对MongoDB的深入研究和改良，DCloud已经放弃了难用的mysql。推荐开发者了解uniCloud的云数据库，用起来更强大和方便。

### 支持websocket吗？

:::warning 注意
在云函数请求三方服务器时支持任意方式请求，包括http、websocket（需要使用nodejs原始的写法或三方包，后续uniCloud会支持websocket相关接口）等。下面说明的是针对云函数和客户端之间的通讯的说明
:::

1. uni-push2.0，全端支持（APP、H5、各端小程序）当应用在线时就是一个免费的websocket服务，详情文档：[https://uniapp.dcloud.io/unipush-v2.html](https://uniapp.dcloud.io/unipush-v2.html)
2. 如果是im方面的需求，有DCloud基于uni-push2.0开发的云端一体的、全平台的、免费的、开源即时通讯系统，详情查看：[https://doc.dcloud.net.cn/uniCloud/uni-im.html](https://doc.dcloud.net.cn/uniCloud/uni-im.html)

### uniCloud访问速度感觉不如传统服务器？@slow
有开发者在一台单机上安装php或java，连接同电脑的mysql。然后与uniCloud比较速度，认为uniCloud偏慢。这里需要澄清如下差异：

- 原因1. 冷启动。具体分析见上一问题

- 原因2. 代码和数据库不在一台服务器
在一台单机上安装php或java，同时安装数据库，访问速度确实快。但在使用云数据库时，即数据库是单独的服务器，和运行代码不在一台服务器上时，就会略微造成些延迟。但商业应用的数据库肯定都是独立服务器。

- 原因3. 拦截器
后端开发的请求一般都有路由管理框架或拦截器，每个请求都要拦截，校验权限。使用这类框架肯定会增加耗时。

clientDB就是这种情况，因为clientDB内部有权限校验系统，某些权限的验证还需要数据库查询。

所以虽然clientDB的速度慢一些，但实际上开发者在自己写了路由拦截和权限管理的框架后，速度也一样会下降。

从uni-id 3.0起，用户的角色权限缓存在token里，不再查库。clientDB的速度比之前提升了100毫秒左右。如果还未升级，请尽快[升级](https://ext.dcloud.net.cn/plugin?id=2116)。同时注意如果用了uniCloud admin，也要配套升级。如果自己在云函数里编写过相关业务逻辑，请务必阅读升级注意事项。

- 原因4. 数据库索引

查询表的索引要正确配置，需要在where里查询的字段都建议配上索引，否则查询会很慢。

但注意索引不能太多，否则增删改数据时又会变慢，精准很重要。推荐详细阅读[索引文档](https://uniapp.dcloud.io/uniCloud/db-index)

### 发布H5时还得自己找个服务器部署前端网页，可以不用自己再找服务器吗？

uniCloud支持[前端网页托管](https://uniapp.dcloud.io/uniCloud/hosting)，选择阿里云作为云厂商时完全免费！

- 如果你已经有备案过的域名，直接解析过来即可；
- 如果你要新注册域名，备案流程和传统云主机略有不同，涉及一个uniCloud没有固定ip的问题。此时可以去买花生壳的备案服务；也可以临时买一个短期固定ip，走固定ip备案。这里有开发者分享的[经验贴](https://ask.dcloud.net.cn/article/38116)

如果是因为微信js sdk等服务要求配置固定ip白名单，那么腾讯云收费空间已经支持固定ip，[详见](https://uniapp.dcloud.io/uniCloud/cf-functions?id=eip)

### 腾讯、阿里的serverless有什么大案例？

- 微信小程序云开发，已经有50万开发者，包括腾讯自有的很多大日活应用都构建在腾讯云serverless上，如微信生活缴费、乘车码、微信读书、腾讯新闻、腾讯相册等。
- 2019年双11，阿里部分业务已经迁移在serverless上。支付宝小程序也提供了云开发功能。


### 港澳台及境外用户访问比较慢怎么办@global-accelerate

港澳台及海外/国外用户需要使用全球加速（海外加速）。uniCloud服务商为阿里云时支持配置全球加速，步骤如下：

1. 参考[阿里云全球加速](https://help.aliyun.com/document_detail/153198.html)文档，开通服务并对`自有域名`进行加速
2. 将上述域名CNAME到`api.next.bspapp.com`
3. [自行初始化uniCloud](init.md)传入endpoint参数，其值为开通全球加速的自有域名

### 发生故障时如何判断故障点@fault

当你的系统出问题时，如何判断是DCloud还是阿里云或腾讯云的问题？

首先再次声明，DCloud的服务仅限于开发阶段。发行部署后，应用的访问不经过DCloud的服务器。

1. 通过域名判断故障点
- unicloud.dcloud.net.cn，属于DCloud，这个网站是开发期间使用的，你的应用上线运行时，不经过DCloud服务器。
	如果该域名可以访问，但是在该域名下操作连接阿里云或腾讯云的数据出现问题，那么也是阿里云或腾讯云出了问题。
- bspapp.com，属于阿里云。如果该域名访问报错，说明阿里云serverless出故障了。
- tencentcloudapi.com，属于腾讯云。如果该域名访问报错，说明腾讯云serverless出故障了。
- cloudbasefunction.cn，属于支付宝云。如果该域名访问报错，说明支付宝云serverless出故障了。

当然还有一种情况报错，其实是客户端的问题，包括浏览器的跨域问题，或者小程序的域名白名单问题，导致客户端无法连接uniCloud。这需要通过配置来解决，参考文档：[小程序和浏览器的域名访问配置](https://uniapp.dcloud.io/uniCloud/quickstart?id=useinmp)

2. 通过测试系统判断故障点
- [hello uniCloud 阿里云版](https://hellounicloud.dcloud.net.cn/#/)
- [hello uniCloud 腾讯云版](https://hellounicloud.dcloud.net.cn/tcb/#/)
- [hello uniCloud 支付宝云版](https://hellounicloud.dcloud.net.cn/alipay/#/)

如果测试系统不正常，那就说明这家云厂商的服务出故障了。

这几个系统是完全独立的，如果这几个系统都故障了，那就是云厂商都故障了，而不是DCloud服务故障了。再次声明，发布后的服务，不连接DCloud的服务器。

当遇到uniCloud故障时，在uniCloud的IM群或论坛里反馈即可。因为云厂商其实都有拨测系统，他们也会及时知道故障并解决的。

### 常见错误@freq-error

**`operation exceeded time limit`、`云数据库执行时间超限`错误**

此错误一般由数据库操作超时引发，具体如何优化请参考：[性能优化](https://uniapp.dcloud.io/uniCloud/db-performance)

**使用事务时出现`WriteConflict`错误**

事务的执行会锁行，同时执行的不同事务在操作同一行数据是会存在冲突导致写入失败。尽量优化流程，避免事务互相冲突

**长时间未使用的服务空间再次访问时报错**

可能出现的错误信息有：`请求云函数超时`、`Response timeout for 10000ms, POST https://api.next.bspapp.com/server -1`

此问题一般是数据库长时间未访问，mongoDB WiredTiger存储引擎在内存中淘汰了表和索引，导致数据库请求超时引发云函数报错。

**腾讯云报`SIGN_PARAM_INVALID signature is expired`**错误

此问题一般出现在腾讯云云函数本地调试时，一般由当前开发用机器系统时间错误引起

**腾讯云报`access token disabled for ANONYMOUS login`错误**

服务空间从来没有上传过云函数，上传一个云函数即可。

2024年12月之后新建的腾讯云空间，如果上传函数后仍报该错误，请使用HBuilderX 4.41及以上版本重新编译并发布前端页面来解决。
