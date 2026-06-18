## 简介

一个服务空间对应一整套独立的云开发资源，包括云数据库、云存储、云函数等资源。服务空间之间彼此隔离。

每个服务空间都有一个全局唯一的space ID。

- 通过 HBuilderX 中管理服务空间，包括新建服务空间和关联服务空间

在 `uniCloud` 目录右键菜单中创建服务空间

<div align=center>
  <img style="max-width:750px;" src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/create1.jpg"/>
</div>

创建服务空间后，在同样的 `uniCloud` 目录右键菜单中关联该服务空间。只有项目关联好服务空间后，才能上传云函数、操作服务空间下的云数据库、云存储等资源。

- 通过uniCloud的web控制台[https://unicloud.dcloud.net.cn](https://unicloud.dcloud.net.cn) 管理服务空间。

web控制台可以新建、删除服务空间，管理线上的服务空间资源。


**新建服务空间注意**

- 第一次创建支付宝云空间需验证账号实名认证的主体是否已注册支付宝，只有注册支付宝并完成实名才可以创建支付宝云空间。
- 创建服务空间可能需要几十秒的时间，可以在web控制台查看是否创建完成。


## 多人协作@collaboration

> 2022年7月18日前，服务空间的多人协作是在 dev.dcloud.net.cn 的 app 协作中设置。在2022年7月18日后，改为在 unicloud.dcloud.net.cn 设置。

一个服务空间仅有一个 **创建者**，但可以设置多个 **协作成员**，以实现多人协作开发。

项目涉及多人开发时，在[uniCloud WEB控制台](https://unicloud.dcloud.net.cn)设置协作者（选择服务空间->成员管理），实现多人共同使用一个云服务空间。

### 一、协作者权限体系

新版成员管理将协作者分为两种角色：

#### 管理员

拥有除以下操作外的全部权限：

- 无法进行：
  - 服务空间的续费、变配、删除、转按量、转包年包月
  - Redis 的新购、续费、变配、实例销毁
  - 扩展云存储开通
  - 腾讯云静态托管功能开通与关闭
  - 腾讯云云函数日志服务开通与关闭
- 无法添加成员

#### 普通成员

可针对各模块分别配置权限：

- `查看`：仅可浏览内容
- `管理`：具备创建、修改、删除等权限，同时包含查看权限



### 二、权限明细表

| 模块 | 查看权限 | 管理权限 |
| --- | ----------------- | ------------------- |
| **云函数** | 控制台查看函数列表、详情、日志；HBuilderX 可下载函数但不可上传；不可删除函数 | 全部支持 |
| **云数据库** | 控制台查看集合、数据、索引、表结构、扩展校验函数、schema 扩展；不可进行增删改操作；HBuilderX 无法上传schema、扩展校验函数、schema扩展 | 全部支持 |
| **内置存储** | 控制台查看/下载文件、查看参数配置和文件权限；不可上传/删除文件、不可创建/删除目录、修改配置、修改文件权限；HBuilderX 不可上传文件至内置存储 | 全部支持 |
| **扩展存储** | 控制台查看/下载文件、查看参数配置、用量报表、访问 Top 统计；不可上传/删除文件、不可创建/删除目录、修改配置、配置域名、空间设置 | 全部支持 |
| **前端网页托管** | 控制台查看/下载文件、查看配置；不可上传/删除文件、不可创建/删除目录、绑定域名、修改配置；HBuilderX 不可上传文件至静态托管 | 全部支持 |
| **Redis** | 控制台查看数据；不可添加/删除键 | 全部支持 |



### 三、协作者设置步骤

1. 登录 [uniCloud Web 控制台](https://unicloud.dcloud.net.cn)，选择目标服务空间  
2. 左侧菜单点击 `成员管理`  
3. 输入协作者邮箱并点击 `搜索`，确认后点击 `添加成员`

   ![成员管理](https://web-ext-storage.dcloud.net.cn/doc/unicloud/member20250702143952.jpg)

4. 在下方 `成员列表` 中，可查看协作者，并对其进行权限编辑或移除操作。

   ![成员列表](https://web-ext-storage.dcloud.net.cn/doc/unicloud/list20250703195615.jpg)



### 四、注意事项

- 服务空间协作者与 App 协作者是两套独立体系，需分别设置（App 协作者请前往 [dev.dcloud.net.cn](https://dev.dcloud.net.cn) 配置）  
- 只有服务空间创建者可添加或移除成员  
- 协作者需完成实名认证后才可被添加  
- 协作者可在 HBuilderX 和 Web 控制台中使用授权服务空间，权限以其角色配置为准  
- 协作有效期可设置范围为1~365天，不设置时永久有效


## 应用和服务空间的关系

每个uni-app应用都有一个appid，每个服务空间都有一个spaceid。

服务空间和手机端项目是多对多绑定关系。同DCloud账号下，一个应用可以关联到多个服务空间。一个服务空间也可以被多个项目访问。

### 多应用共用服务空间@multi-app


随着用户使用uniCloud开发的项目越来越多， 部分用户遇到了新的问题。

两个、多个项目想共用一个云服务空间，比如一个系统，有用户端项目、管理admin项目，两个项目需要公共服务空间。还有司机端、乘客端、用户端、骑手端....很多类似的问题。

如果每个项目目录下都存在多个重复的云函数文件。 每个项目都要做 同步云函数列表， 下载云函数等操作。 繁琐，而且很容易冲突。

针对上面出现的问题， 提供了`一云多项目`的解决方案。


#### 一云多端

##### 绑定其它项目的服务空间

选中项目下的`uniCloud-alipay|aliyun|tcb`目录， 右键菜单，点击 【关联云服务空间或项目... 】 ，可以`关联云服务空间`、`绑定其它项目的服务空间`：

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/202310241639174.png)

##### 已关联项目

选择关联项目，此时显示的是所有的uniapp项目。用户选择任一uniapp项目进行关联,  关联效果如下图：

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/202310241640206.png)

1. 查看关联项目的服务空间：点击后，会在项目管理器打开关联的项目
2. 解除绑定：解除绑定，会解除绑定关系，可以重新`关联云服务空间`、`绑定其它项目的服务空间`
3. 移动至关联项目xxx下： 会将当前项目的uniCloud目录内容，移动到关联的项目下。


##### 插件市场导入插件

![](https://ask.dcloud.net.cn/uploads/article/20201207/0d4ab346f103f0a746801a59b9b51c57.png)


#### 特别说明

> 以阿里云举例， `绑定其它项目的服务空间` 指的是关联其他项目的当前使用的阿里云服务空间。

1. 阿里云无法关联到腾讯云， 腾讯云也无法关联到阿里云， 但是项目可以关联，使用时会报错。
2. 如果项目已关联其他项目， 选择云服务空间， 此时关联关系会断开。


### 一个应用访问多个服务空间@multi-space

若应用仅连接一个服务空间，在HBuilderX中做好服务空间关联即可。开发者无需手动做初始化工作（可理解为类调用）。

```javascript
//项目仅连接了一个服务空间，则无需初始化
//可通过uniCloud直接调用云开发的API
uniCloud.callFunction()
uniCloud.uploadFile()
```


若一个应用需要同时连接更多服务空间，HBuilderX中无法绑定更多服务空间。此时需开发者在**客户端代码**中，手动调用初始化方法`uniCloud.init`，连接其他服务空间。

`uniCloud.init`方法会返回一个`uniCloud`实例，之后云函数API的调用都需要通过该`uniCloud`实例发起（类似实例调用）。

`uniCloud.init`方法定义如下：

```javascript
function init(options):uniCloud
```

`uniCloud.init`方法接受一个`options`参数，返回`uniCloud`实例，`uniCloud`实例可调用云函数、云存储相关API。

**注意**

- 云函数会自动识别自己所属的服务空间，调用本服务空间下的资源时无需初始化。
- 云函数环境（仅腾讯云支持）仅能通过init返回同账号下其他的腾讯云服务空间实例。
- 客户端环境（腾讯云、阿里云、支付宝云均支持）可以通过init返回本账号下任意云厂商服务空间实例

**options 参数说明**

|    参数名			     |   类型	   | 必填	 |                                          默认值						                                          |                                说明																					                                |
|:-------------:|:-------:|:---:|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|
|  provider		   | String	 | 是		 |                                          -							                                           |                        aliyun、tencent、alipay																		                        |
|   spaceId		   | String	 | 是		 |                                          -							                                           |                        服务空间ID，**注意是服务空间ID，不是服务空间名称**										                        |
| clientSecret	 | String	 | 是		 |                                          -							                                           |           仅阿里云支持，可以在[uniCloud控制台](https://unicloud.dcloud.net.cn)服务空间列表中查看	           |
|   accessKey   | String  |  是  |                                              -                                              |         仅支付宝云支持, 可以在[uniCloud控制台](https://unicloud.dcloud.net.cn)服务空间详情中查看         |
|   secretKey   | String  |  是  |                                              -                                              |         仅支付宝云支持, 可以在[uniCloud控制台](https://unicloud.dcloud.net.cn)服务空间详情中查看         |
|  spaceAppId   | String  |  是  |                                              -                                              |         仅支付宝云支持, 可以在[uniCloud控制台](https://unicloud.dcloud.net.cn)服务空间详情中查看         |
|  endpoint		   | String	 | 否		 | 阿里云：`https://api.bspapp.com`；<br/> 支付宝云：`https://{spaceId}.api-hz.cloudbasefunction.cn`	 | 服务空间地址，仅阿里云与支付宝云支持。<br /> 阿里云商用版请将此参数设为`https://api.next.bspapp.com`														 |
|  wsEndpoint		   | String	 | 否		 | `wss://{spaceId}.api-hz.cloudbasefunction.cn`	 | websocket网关地址，支付宝云支持。													 |

**示例代码**

```javascript
//开发者创建了多个服务空间，则需手动初始化。注意这是前端代码，不是云函数代码
const myCloud = uniCloud.init({
  provider: 'aliyun',
  spaceId: 'xxxx-yyy',
  clientSecret: 'xxxx'
});
//通过uniCloud实例调用云开发的API
myCloud.callFunction()
myCloud.uploadFile()

```

uniCloud还支持跨服务空间的云数据库访问，另见[文档](https://doc.dcloud.net.cn/uniCloud/hellodb.html#init-db)
