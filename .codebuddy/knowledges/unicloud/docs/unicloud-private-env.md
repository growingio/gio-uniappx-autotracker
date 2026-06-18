# uni云开发软件版

## 产品介绍

[uniCloud官网](https://doc.dcloud.net.cn/uniCloud/)介绍的uniCloud，默认都是`uniCloud serverless版`。

`uniCloud serverless版`基于云计算的`serverless`技术实现，后端逻辑代码运行在云厂商的服务器（容器）中，服务器（容器）不跟具体开发者关联绑定，会随着终端用户量的变化自动弹性扩缩容，开发者对服务器的具体型号、配置等无感。

现实中，部分开发者因合规要求（如数据必须在公司内网），或需要对后端服务器有更强的可控性，希望uniCloud能部署在自己机房内或自己的云厂商账号下，因此，`uni云开发软件版`应运而生。

### 产品特征

从开发工具、API、生态各维度，uni云开发软件版和serverless版没有差别。开发者基于serverless版编写的uniCloud项目源码，可以平滑部署到软件版，前端uni-app代码、后端云函数、云对象等代码，均无需修改。

相比serverless版，软件版最主要的差别如下：

- 开发者需要单独购买服务器，自己安装操作系统（目前仅支持`linux`操作系统）；
- 开发者自己购买云存储、开通CDN加速产品；
- 开发者自己安装数据库，或者购买mongodb实例；
- 开发者自己处理负载均衡，自己负责日常运维。

而如上工作，serverless版均无需进行，serverless版通过`服务空间`的概念，将云函数、云存储、云数据库统一封装，开发者可一键开通所有业务，不需要额外去开通云存储、CDN，也无需去安装或购买云数据库实例。

进一步解释，uni云开发软件版实际上是一个`支持uniCloud语法的Node开发框架`。

你可以更具象化理解：uni云开发软件版就是`支持uniCloud语法的类Egg.js框架`。

> 和Egg.js框架差异：uni云开发软件版内置有定制版本的Node.js运行时，并且仅可在内置的定制Node.js上运行，不支持使用开发者安装的Node.js环境。

uni云开发软件版，作为一个开发框架，仅负责云函数、云对象的执行，支持在云函数中连接开发者自己的对象存储和数据库。
而这些对象存储和数据库，需要开发者自己去购买开通，uni云开发软件版本身没有内置。

存储方面，uni云开发软件版目前支持如下3种存储方案：

- 本地存储：文件存储和uni云开发软件版在同一台服务器上；
- 阿里云OSS
- 腾讯云COS

数据库方面，uni云开发软件版仅支持`mongodb`，支持本地服务器上安装的mongodb，也支持在云厂商购买单独的mongodb实例。

::: warning 注意

1. 为了与serverless版保持一致，uni云开发软件版目前仅支持`mongo 4.0` 版本
2. uni云开发软件版内置的定制`node.js`版本为`16.20.2`

:::

### 名词解释

**集群**

集群是从业务范畴进行的划分单元，比如：OA系统集群、ERP系统集群、论坛系统集群等，是一个虚拟的业务组织概念。

同一个集群下可以有1台或多台服务器，多个服务器可做负载均衡，共同处理该集群下的同类业务系统。

**服务器**

服务器即实体服务器或虚拟机，uni云开发软件版安装在每台具体的服务器上。
每台服务器均需购买商业授权。

**应用**

应用即DCloud产品体系下App概念，每个应用都有AppID，格式如：`__UNI__XXX`。
比如论坛App：

- 面向用户端的是一个应用，有自己的AppID；
- 面向管理者/运营人员的是另一个应用，有自己另外的AppID。
- 这两个应用会绑定同一服务空间，访问相同的数据库。

**商业授权**

uni云开发软件版的商业授权，分为服务器授权和应用授权，安装uni云开发软件版的每台服务器均需购买商业授权，每个上线的应用也需要购买应用授权。

场景举例：

- 如果你的用户量很大，单台服务器无法承载，你希望增加额外服务器做负载，此时增加的每台服务器，均需单独购买服务器授权。双机热备的服务器，也需要分别购买服务器授权。
- 如果你的业务用户量不大（比如内部系统），你希望将多个业务系统部署在同一台服务器上运行，此时你需要单独购买应用授权。

### 产品版本及价格

uni云开发软件版分为标准版、企业版两个规格，具体如下：

|    |标准版           |企业版            |
|--    |--            |--             |
|**联网激活**  |需要           |不需要<br/>可实现完全内网托管       |
|**技术支持**  |1. 官方社区/社群问答 <br/> 2. uniCloud控制台报障 |1. 专有uni-im技术支持群 <br/> 2. 工作时间30分钟内响应 |
|**服务器授权** |同一集群下，首台服务器2万元，赠送2个应用授权；<br/> 同一集群下，追加服务器，每台1万元，无应用授权赠送；  |同一集群下，首台服务器9.8万元，赠送2个应用授权；<br/> 同一集群下，追加服务器，每台4.9万元，无应用授权赠送；           |
|**应用授权**  |1000元/个          |1000元/个 |
|**购买方式**  |[uniCloud控制台](https://unicloud.dcloud.net.cn)在线付款，自助下单|联系<bd@dcloud.io>沟通合同 |

## 服务器安装部署

### 系统要求

**服务器最低配置**

- CPU >= 1核
- 内存 >= 2G
- 硬盘 >= 40G

**操作系统要求**

关键依赖软件：

- 内核版本 >= 4.18
- glibc >= 2.28
- gcc >= 8.5

具体操作系统版本：

- RHEL >= 8.1
- Ubuntu >= 20.04
- CentOS >= 8.5 (官方已停止维护，不推荐作为生成环境使用)
- 银河麒麟高级服务器操作系统V10

**环境检测**

可以使用如下命令来检查服务器环境是否满足要求。

```
// 查看内核发行版本号
uname -r     
// 查看系统版本号   
cat /etc/os-release | grep -E "^NAME=|^VERSION="  
// 查看 glibc 版本号
ldd --version           
// 查看 GCC 版本号
gcc --version           
// 查看CPU信息
cat /proc/cpuinfo| grep "processor"     
// 查看内存信息
free -h
// 查看磁盘信息   
df -h             
```

### 获取并安装uni云开发软件版

::: warning 注意

1. uni云开发软件版仅面向企业认证用户开放下载，个人认证用户若想升级为企业类型，可参考[实名认证信息变更](https://ask.dcloud.net.cn/article/39729)
2. 每次下载的安装包都是为当前账号单独生成的，内含账号的指纹信息，请勿进行破解、扩散等侵犯DCloud知识产权的行为，否则DCloud将会通过法律途径维护自己的合法权益。
:::

登录uniCloud控制台，按图所示进入uni云开发软件版页面

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240801211818.png)

初次使用，需先确认uni云开发软件版的服务协议。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs202408021637360.png)

同意并开通后，进入uni云开发软件版集群列表

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240801212100.png)

创建一个[集群]()，创建成功后，稍等片刻，云端会在10分钟内为你构建专属uni云开发软件版安装包。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240802144148.png)

安装包构建成功后，你可以通过浏览器手动下载安装包，也可以直接在你的服务器上，使用`wget`命令下载安装包。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240802144834.png)

将安装包上传到服务器并进行解压，推荐目录为`~/uniCloud`，后文为方便表述，我们以`${uniCloud_HOME}`代指uni云开发软件版的安装根目录。

```
# 创建uniCloud安装目录，${uniCloud_HOME} 代指uni云开发软件版的安装根目录，如：mkdir ~/uniCloud
mkdir ${uniCloud_HOME}
# 解压安装包
tar -zxvf [version].tar.gz -C ${uniCloud_HOME}
```

### 创建并配置服务空间

为了和serverless版保持开发体验一致，软件版也有服务空间的概念设计；需要先创建集群，然后再创建服务空间。

登录[uniCloud控制台](https://unicloud.dcloud.net.cn/) ，新建服务空间，版本选择`uni云开发软件版`，绑定已创建的集群，完成服务空间的创建。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240802152207.png)

复制服务空间ID，回到你的服务器上，在uni云开发软件版根目录下使用以下命令创建对应的服务空间目录：

```
cd ${uniCloud_HOME}
./unicloud init-space [服务空间ID]
```

> `./unicloud` 更多命令参数，[参考](#commands)

接下来，你需要在服务器上，根据自己的具体情况，通过`config.json`配置mongodb数据库、文件存储、redis等，config.json的完整配置及解释，[参考](#config)。

### 启动服务

```
cd ${uniCloud_HOME}
./uniloud start
```

然后使用 `curl localhost:7001`命令，若成功返回`hello uniCloud`，则表示安装成功。

接下来，就是开发自己的业务代码，部署上传到服务器即可。

### 部署程序包

在HBuilderX中开发业务代码，测试完毕后，构建服务端发行包，并通过`ssh/sftp`等方式上传到服务器中，构建包的解压目录是`${uniCloud_HOME}/spaces/${spaceId}/`，关于构建操作，[参考](#build-server-package)。

### 标准版软件联网激活授权

#### 服务器授权

uni云开发软件版启动时，会自动向DCloud进行注册，默认为试用版，试用有效期为15天。

每个账号每年(自然年)有5次试用机会，即允许在5台服务器上运行未激活的uni云开发软件版。

试用到期后，你需要尽快购买并激活授权，升级为正式版。

**服务器授权购买方式：** 登录[uniCloud控制台](https://unicloud.dcloud.net.cn)，从顶部导航栏下拉列表中选择“uni云开发软件版”，进入集群列表，选择对应集群，可看到该集群下的所有已注册服务器，选择需要激活的服务器，完成授权购买。

uniCloud控制台激活操作完成后，会在24小时内自动完成你服务器上的uni云开发软件版激活，或者你也可以通过重启的方式，让uni云开发软件版立即激活。

#### 应用授权

uniCloud试用版不校验appid，一旦你完成uni云开发软件版的正式激活，则需尽快配置该服务器允许使用的appid清单，每个appid需要一个应用授权。

未授权的应用访问uniCloud正式版将会返回`403`错误码。

添加应用授权有两种方式：

- 在购买应用授权时，同时绑定应用；
- 先购买应用授权个数，后期选择对应应用进行绑定；

绑定应用后，需重新启动uni云开发软件版，方可生效。

### 企业版软件离线激活授权

#### 服务器授权

在uni云开发软件版安装目录下运行 `./uniCloud scan` 命令，会检测服务器环境信息及注册状态，如未注册状态，会在最后生成一个硬件ID

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs202408021552565.png)

你需要登录uniCloud控制台-集群详情页面，在服务器授权处点击添加授权，输入服务器名称（用于备注服务器）和硬件ID，添加完成后点击"下载授权"，将会生成`uniCloud.LICENSE`文件。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240802152500.png)

下载授权文件并上传至uni云开发软件版服务器上，上传目录为`${uniCloud_HOME}/license/`，重启uni云开发软件版即可完成服务器正式激活。

#### 应用授权

你需要先完成应用授权的购买，然后手动下载应用的授权文件。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs20240802152533.png)

将下载的应用授权文件上传uni云开发软件版服务器上，目录为`${uniCloud_HOME}/license/`，重启uni云开发软件版即可完成应用授权激活。

### 运维管理

#### uni云开发软件版操作命令@commands

> 所有命令，需在uniCloud软件安装根目录下执行

启动

`./unicloud start`

|参数|类型|默认值|说明|
|---|---|---|---|
|`-s, --spaceId`|String|-|服务空间ID，为空默认服务空间|
|`-w, --worker`|Number|服务器 CPU 核数|启动worker数量|
|`--schedule`|Boolean|false|开启执行定时任务服务|

停止

`./unicloud stop`

|参数|类型|默认值|说明|
|---|---|---|---|
|`-s, --spaceId`|String|-|服务空间ID，为空默认服务空间|

安装云函数第三方依赖

`./unicloud install-deps`

|参数|类型|默认值|说明|
|---|---|---|---|
|`-s, --spaceId`|String|-|服务空间ID，为空默认服务空间|

初始化服务空间

`./unicloud init-space`

|参数|类型|默认值|说明|
|---|---|---|---|
|`-s, --spaceId`|String|-|服务空间ID，为空默认服务空间|
|`--storage`|String|local|存储服务类型，目前支持 local、qiniu、aliyun、tencent|
|`--mongodb`|Boolean|false|创建 MongoDB 配置|
|`--redis`|Boolean|false|创建 Redis 配置|

初始化数据库

`./unicloud init-database`

|参数|类型|默认值|说明|
|---|---|---|---|
|`-s, --spaceId`|String|-|服务空间ID，为空默认服务空间|

扫描服务器、服务空间、注册状态等信息

`./unicloud scan`

查看 uniCloud 各服务空间运行状态

`./unicloud status`

#### 出网域名白名单

uni云开发软件版的部分业务需要从你的服务器向外网发送请求，需联网的业务包括：

|功能 |联网域名 |
|-- |-- |
|1. uni云开发软件版联网激活<br/>2. 短信 <br/> 3. 一键登录 <br/> 4. uni-ai <br/> 5. 实人认证 <br/>  |1. pucoa1.dcloud.net.cn <br/> 2. pucoa2.dcloud.net.cn <br/> 3. pucoabk.dcloud.net.cn |
|6. uni-push |restapi.getui.com |

若你的服务器开启了防火墙，或限制公网访问，同时又使用了如上业务，则你需要将如上对应域名加入防火墙白名单。

#### 日志

uni云开发软件版内置简单的日志服务，日志分为启动日志与运行日志。

启动日志是记录 uniCloud 启动期间的所有输出日志。

运行日志是在 uniCloud 运行期间记录框架的输出日志和云函数输出日志。

**日志路径**

启动日志放在`${uniCloud_HOME}/logs/${spaceId}/master`路径下，每次启动的日志独立保存。

运行时日志默认放在`${uniCloud_HOME}/logs/${spaceId}`路径下，可以修改服务空间配置文件中的`logger.customLogDir`字段来自定义日志目录。

如果想自定义日志路径，可参考如下配置：

```json
 {
 "logger": {
  "customLogDir": "/your/custom/dir/path"
 }
 }
```

**日志分类**

启动日志

- `master-stdout.log` 标准输出日志，包含启动时所有日志。
- `master-stderr.log` 标准错误日志，启动时如遇到启动失败/异常，错误日志将写入此文件中，方便根据此日志排查问题。

运行日志

- `unicloud.log` 框架及云函数运行日志。
- `unicloud-error.log` uniCloud 中任何错误信息都会写入此文件内。

**日志切割**

启动日志按照每次启动进行自动切割。

运行日志是按天切割，在每日`00:00`按照`.log.YYYY-MM-DD`文件名进行切割。

## HBuilderX开发调试

### 安装软件版开发插件

前往插件市场，下载并安装[uni云开发软件版插件](https://ext.dcloud.net.cn/plugin?id=18520)。

uni云开发软件版插件支持以下功能：

- 创建本地调试配置文件
- 创建本地存储调试配置文件
- 打包uniCloud资源

### 关联并配置服务空间

> HBuilderX > 4.19

uni云开发软件版服务空间使用 `dcloud` 标识

### 本地调试配置

在项目中的`uniCloud`目录右键-uni云开发软件版-创建本地调试配置文件，即可生成`config.json`配置文件。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs202408021527159.png)

默认配置内容如下所示

```json
{
 "mongodb": { //mongo库连接配置
   "url": "mongodb://username:password@127.0.0.1:7001",//mongo库连接地址
   "database": "unicloud" //数据库名称
 },
 "redis": {//redis库连接配置，项目中不使用redis服务可不配置此项
   "host": "127.0.0.1",//host
   "port": 6379, //端口号
   "password": "password"//密码
 },
 "storage": {//存储服务配置，如项目未使用存储服务可不配置此项
    "provider": "local",//服务商 支持local:本地存储 aliyun: 阿里云存储服务 tencent:腾讯云存储服务 qiniu:七牛云
    "dir": "file/upload", //文件上传目录
    "bucket": "",//存储桶名称，本地存储无需配置此项
    "cdnProtocol": "http://",//cdn协议 支持 http https
    "cdnDomain": "127.0.0.1:7001",//cdn域名
    "cdnRootPath": "/storage/file/",//cdn根目录
    "storageSecret": "xxxxxxxxxx",//本地存储服务访问密钥
  }
}
```

你需要根据自己的具体情况，配置mongodb数据库、文件存储、redis等，config.json的完整配置及解释，[详见](#config)

### 远程调试

在本地运行时如果需要连接云端云函数，需要在uniCloud空间中配置云端apiEndpoint后切换云端云函数访问。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs202407091657999.png)

**注意**

修改 apiEndpoint 后需要重新关联服务空间生效。

### 构建服务端发行包@build-server-package

由于有uni_modules插件内包含uniCloud云函数等，需要进行uniCloud打包操作，将uni_modules插件内的云函数及数据库schema抽离出来。

在 `uniCloud`目录右键“uni云开发软件版”-“打包uniCloud资源”，将会在`uniCloud`服务空间目录下生成`dist`目录。

可以使用git/svn等版本管理工具进行管理，将代码上传至git/svn，在服务器拉取代码后将`uniCloud-dcloud/dist`目录同步到对应服务空间下即可。

也可以单独对`dist`目录打包zip并上传到服务器对应的服务空间目录下并解压。

上传代码之后需要重新启动服务空间，在uni云开发软件版根目录执行以下命令进行重启操作

```javascript
./unicloud stop & ./unicloud start
```

建议部署时采用分布式部署方案，即使用2台以上服务器部署可以保证服务的稳定性，在服务重启时也不会中断服务。

## 配置文件@config

uni云开发软件版需要单独配置mongodb数据库、文件存储、redis等，所有配置全部在`config.json`中完成。

HBuilderX端开发配置、服务器端线上配置，都通过 config.json实现，且规则保持一致。

`config.json`完整模版内容如下：

```json
{
  "default": true,
  "spaceId": "pvt-xxx",
  "startAsDaemon": true,
  "port": 7001,
  "clientSecret": "xxx",
  "mongodb": {
    "url": "mongodb://username:password@127.0.0.1:7001",
    "database": "test",
    "maxPoolSize": 30,
    "minPoolSize": 10
  },
  "storage": {
    "provider": "local",
    "dir": "file/upload",
    "bucket": "",
    "cdnProtocol": "http://",
    "cdnDomain": "127.0.0.1:7001",
    "cdnRootPath": "/storage/file/",
    "storageSecret": "xxxxxxxxxx",
  },
  "logger": {
    "customLogDir": "~/logs"
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379,
    "password": ""
  },
  "spaceSecret": {
    "secretKeyId": "xxxx",
    "secretKey": "xxx"
  }
}
```

|参数|类型|默认值|说明|
|---|---|---|---|
|default|Boolean|false|仅服务器支持；是否为默认服务空间，一套uni云开发软件版环境下，只能有一个默认服务空间|
|spaceId|String|-|服务空间ID，可在uniCloud控制台查看|
|startAsDaemon|Boolean|true|仅服务器支持；是否在后台运行|
|port|Number|7001|端口号，同一台服务器下，各服务空间的端口号不可重复|
|clientSecret|String|-|仅服务器支持；客户端通讯密钥|
|mongodb|Object|-|mongo数据库连接配置|
|mongodb.url|String|-|mongo数据库连接|
|mongodb.database|String|-|数据库名称|
|mongodb.maxPoolSize|Number|100|最大连接数|
|mongodb.minPoolSize|Number|0|最小连接数|
|storage|Object|-|存储服务配置|
|storage.provider|String|local|服务商 支持local:本地存储 aliyun: 阿里云存储服务 tencent:腾讯云存储服务 qiniu:七牛云|
|storage.dir|String|file/upload|文件上传目录|
|storage.bucket|String|-|存储桶名称，本地存储无需配置此项|
|storage.cdnProtocol|String|http|cdn协议 支持 http https|
|storage.cdnDomain|String|
|storage.cdnRootPath|String|/storage/file/|cdn根目录|
|storage.storageSecret|String|-|本地存储服务访问密钥|
|storage.bucketName|String|-|仅qiniu支持；存储桶名称|
|storage.domain|String|-|仅qiniu支持；qiniu储存域名（域名地址）|
|storage.ak|String|-|仅qiniu支持；bucket ak|
|storage.sk|String|-|仅qiniu支持；bucket sk|
|logger|Object|-|日志服务配置|
|logger.customLogDir|String|/private-cloud-env/logs|uni云开发软件版环境日志存储路径|
|redis|Object|-|redis配置; 如不需要可不配置此字段|
|redis.host|String|-|redis连接host|
|redis.port|Number|6379|端口号|
|redis.password|String|-|密码|
|spaceSecret|Object|-|服务空间通讯配置|
|spaceSecret.secretKeyId|String|-|SpaceKeyID，可在uniCloud控制台查看|
|spaceSecret.secretKey|String|-|SpaceSecret ，可在uniCloud控制台查看|

如项目中使用了存储服务，则还需额外增加存储服务的配置项。即在服务空间目录下创建`file`目录，并在`file`目录下增加`permission.json`配置文件。配置文件内容如下：

```json
{
  "*": {
    "read": true,
    "update": false,
    "create": true,
    "delete": "auth.uid == resource.uid"
  }
}
```

|参数|类型|默认值|说明|
|---|---|---|---|
|read|Boolean|-|读权限|
|update|Boolean|-|修改权限|
|create|Boolean|-|创建权限|
|delete|String|-|删除权限|
