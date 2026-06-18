## uni-ad-admin 插件概述

`uni-ad-admin` 是基于[uni-admin](https://doc.dcloud.net.cn/uniCloud/admin.html)的`uni-ad`插件。

`uni-ad-admin`主要包括两个功能：
- 数据同步：使用`uni-ad-admin`插件，你可以将自己账号下的`uni-ad`收益数据同步到自己的服务空间，存储在自己的云数据库中。
- 统计报表：`uni-ad-admin`默认内置3个统计报表页面，展示内容和[uni-ad控制台](https://uniad.dcloud.net.cn/login)中的收益报表一致；

`uni-ad-admin`是开源的，你可以自由定制，比如：
- 基于同步过来的收益数据，你可以再次同步到自己的业务服务器中，比如同步到自己的虚拟机或MySQL数据库中。
- 基于同步过来的收益数据，定制多维度的广告报表、漏斗分析等。

## 安装部署

### 下载插件

前往[插件市场](https://ext.dcloud.net.cn)， 找到 [uni-ad-admin](https://ext.dcloud.net.cn/plugin?name=uni-ad-admin)插件，点击 `下载插件并导入HBuilderX` ，在 HBuilderX 中选择对应的 `uni-admin`项目，HBuilderX会自动完成插件下载及文件合并。

`uni-ad-admin` 插件新增的文件主要包括：
- 云函数：`uni_modules/uni-ad-admin/uniCloud/cloudfunctions/uni-ad-admin-receiver` 接收同步数据云函数
- 数据表：`uni_modules/uni-ad-admin/uniCloud/database`目录下 `uni-ad` 开头的 `schema` 文件
- 统计页面：`uni_modules/uni-ad-admin/pages` 文件夹下面的若干页面

### 注册菜单

在HBuilderX中找到 `opendb-admin-menus.init_data.json` 文件，右键 `初始化云数据库数据`，可完成左侧导航菜单的注册。

> 如果你只有国内广告，没有海外广告，可在`opendb-admin-menus.init_data.json`文件中删除如下海外广告菜单后，再右键`初始化云数据库数据`。

``` json
[	
	{
		"parent_id": "uni-ad",
		"permission": [],
		"enable": true,
		"menu_id": "uni-ad-global",
		"name": "国际广告",
		"icon": "",
		"url": "",
		"sort": 2300,
		"create_date": 1638356902516,
		"_id": "uni-ad-global"
	},
	{
		"parent_id": "uni-ad-global",
		"permission": [],
		"enable": true,
		"menu_id": "uni-ad-global-home",
		"name": "概况",
		"icon": "",
		"url": "/uni_modules/uni-ad-admin/pages/global/index/index",
		"sort": 2211,
		"create_date": 1638356902516,
		"_id": "uni-ad-global-home"
	},
	{
		"parent_id": "uni-ad-global",
		"permission": [],
		"enable": true,
		"menu_id": "uni-ad-global-revenue",
		"name": "数据收益",
		"icon": "",
		"url": "/uni_modules/uni-ad-admin/pages/global/revenue/revenue",
		"sort": 2212,
		"create_date": 1638356902516,
		"_id": "uni-ad-global-revenue"
	}
]
```

### 上传 schema

schema 位于 uniCloud/database 目录下，在 `database` 目录右键点击 `上传所有DB Schema` 菜单，将 schema 上传到云端服务空间。

### 配置签名秘钥

为保证数据安全，数据从uni-ad云端同步到你的服务空间时，会使用秘钥加密传输，该秘钥需你自己配置。

配置文件：`uniCloud/cloudfunctions/uni-ad-admin-receiver/config/config.json`

### 上传云函数

在HBuilderX中，选择`uniCloud/cloudfunctions/uni-ad-admin-receiver`，右键`上传部署`。

## 收益数据同步

登录[uni-ad控制台](https://uniad.dcloud.net.cn)，在右上角点击 `uni-ad-admin` 按钮，在弹出框中选择已部署含`uni-ad-admin`插件的`uni-admin`项目空间：

![](https://web-ext-storage.dcloud.net.cn/doc/uniadmin/shengqing.png)

注意：`secret`是数据同步过程中的加密秘钥，务必和`uniCloud/cloudfunctions/uni-ad-admin-receiver/config/config.json`文件中配置的`scrert`保持一致。

:::warning 注意
-  数据同步：每日下午3点开始同步昨日收益数据。如需历史数据同步请发邮件到 `service@dcloud.io` 申请。
-  由于网络或数据库无读、写次数等原因同步失败后，服务器会有重试同步机制，每日重试5次，5次都失败后不再同步。如你确认服务空间无问题后可以应用收益详情的 `同步日志` 中点击重新同步。
-  `云函数` 接收到同步后首先会按 `收益日期` 删除已存在数据，防止数据重复。不使用循环查询是否存在以减少读、写次数。
:::

如果你的原服务空间过期或其它原因需要变更收益数据的服务空间，则需再次登录[uni-ad控制台](https://uniad.dcloud.net.cn)，点击右上角 `uni-ad-admin` 按钮，在弹出对话框中选择新的服务空间即可。

你也可以在该弹出框中，点击左下角的`关闭收益同步`按钮，关闭该项功能。

在`uni-ad-admin`的应用收益详情中，可查看数据同步日志。如有同步失败的，可点击重新同步。

![](https://web-ext-storage.dcloud.net.cn/doc/uniadmin/user-repush.png)

## 插件源码解读

### 表结构

`uni-ad-admin`插件包含4个数据表：

- uni-ad-positions：广告位记录表
- uni-ad-adp-revenues：adp收益表（广告位维度）
- uni-ad-app-revenues：app收益表（应用维度）
- uni-ad-sync-logs：uni-ad 数据同步日志表，记录每日同步时间、状态；

**uni-ad-positions 广告位**

|字段|类型|默认值|可选值|说明|
|:-:|:-:|:-:|:-:|:-:|
|appid      |   string  |   |   |   应用appid，对应opendb-app-list.appid|
|ad_region  |   int| 1   | 1,2 | 数据源|
|adp_id |   string| -|-|广告位id|
|adp_name| string| -|-|广告位名称|
|ad_type|int|0|-|广告位类型|
|create_time| timestamp| -|-|创建时间|


**uni-ad-adp-revenues收益数据，广告位维度**
|字段|类型|默认值|可选值|说明|
|:-:|:-:|:-:|:-:|:-:|
|ad_region  |   int| 1   | 1,2| 数据源|
|revenue_date|int|-|-|收益日期，格式：yyyymmdd，例：20240415  |
|appid|string|-|-|应用appid，对应opedb-app-list.appid|
|adp_id|string|-|-|广告位id，对应uni-ad-posotions表的adp_id|
|ad_platform|int|-|-|广告平台|
|show_count|int|0|-|广告展示量|
|click_count|int|0|-|广告点击量|
|click_rate|string|-|-|广告点击率|
|revenue|int|0|-|预估收益，单位：厘|
|cpc|string|-|-|每次点击收益（单位：元，如：1.25）|
|cpm|string|-|-|千次展现收益（单位：元，如：5.25）|
|ad_type|int|0|-|广告类型|
|os|string|-|-|系统类型 android 或 ios  只有platform_id=2（渠道SDK广告）时才有该字段|
|create_time| timestamp| -|-|创建时间|


**uni-ad-app-revenues日汇总收益表**
|字段|类型|默认值|可选值|说明|
|:-:|:-:|:-:|:-:|:-:|
|ad_region  |   int| 1   | 1,2| 数据源|
|revenue_date|int|-|-|收益日期，格式：yyyymmdd，例：20240415  |
|appid|string|-|-|应用appid，对应opedb-app-list.appid|
|revenue|int|0|-|预估收益，单位：厘|
|create_time| timestamp| -|-|创建时间|

**uni-ad-sync-logs数据同步日志表**

|字段|类型|默认值|可选值|说明|
|:-:|:-:|:-:|:-:|:-:|
|sync_date  |   int |   -   |   -   |   收益同步日期，格式：yyyymmdd，例：20240415   |
|appid      |   string  |   |   |   应用appid，对应opendb-app-list.appid|
|ad_region  |   int| 1   | 1,2 | 数据源|
|status |   int |   0   |   0,1,2,3   | 同步状态 |
|create_time| timestamp| -|-|创建时间|
|update_time| timestamp| -|-|更新时间|

### 表字段说明

**`status`：同步状态**
|值|说明|
|:-:|:-:|
|0|未同步|
|1|同步完成|
|2|正在同步|
|3|同步失败|


**`ad_region`：数据源**
|值|说明|
|:-:|:-:|
|1|国内广告|
|2|国际广告|

**`ad_platform`：广告平台**
|值|说明|
|:-:|:-:|
|1|APP-DCloud快捷广告|
|2|APP-渠道SDK广告|
|3|Web广告|
|4|小程序广告|

**`ad_type`：广告类型**
|值|说明|
|:-:|:-:|
|1|开屏|
|4|信息流|
|7|全屏视频|
|9|激励视频 |
|10|Draw视频广告|
|13|互动游戏|
|14|内容联盟|
|15|插屏广告|
|17|小程序格子广告|
|18|互动红包|
|91|DCloud快捷广告-开屏|
|92|DCloud快捷广告-红包|
|93|DCloud快捷广告-PUSH|
|94|DCloud快捷广告-uniMP|

**`CPC`：平均每次点击收益**

计算公式：CPC = 总收益 / 点击量

**`CPM`：千次展现收益**

计算公式：CPM = 总收益 / 展示量 * 1000

### 报表展示页

下方仅展示 `uni-ad-admin` 插件相关的文件夹及文件。

```bash
├── uniCloud							# 云函数
├── common								# 样式文件
├── components                          # 自定义组件
├── js_sdk                              # js sdk
├── pages                               # 页面
│   │── china                          	# 国内统计页面
│   |   │── detail                     	# 应用统计详情
│   |   |   │── detail.vue             	# 页面（下同）
│   |   |   └── fieldsMap.js            # 字段配置（下同）
|	|	|──	index
│   |   |   │── index.vue
│   |   |   └── fieldsMap.js
|	|	└──	revenue
│   |       │── index.vue
│   |      	└── fieldsMap.js
|	└──	global
│   	│── detail                     	# 应用统计详情
│      	|   │── detail.vue             	# 页面（下同）
│      	|   └── fieldsMap.js            # 字段配置（下同）
|		|──	index
│      	|   │── index.vue
│      	|   └── fieldsMap.js
|		└──	revenue
│          	│── index.vue
│         	└── fieldsMap.js
└── package.json
```


## 常见问题

**1. 申请数据同步后，何时可以查看报表数据 ？**

答：数据同步服务每日下午3点启动，如您在下午3点后申请，在次日下午3点才会启动同步。

**2. 数据报表可查看当日数据吗？**

答：数据同步和 `uni-ad` 后台一样，今日出昨日的预估收益。

**3. 子账号需要赋予哪些表的权限才能正常查看uni-ad统计？**

分三步骤

**第一步：添加用户角色权限**
1、去权限管理添加一个权限id为： `READ_UNI_AD` 的权限 
2、去角色管理添加一个角色id为： `READ_UNI_AD` 的角色
3、去用户管理赋予子账号角色 `READ_UNI_AD` 角色

**第二步：给相关的表设置read权限**
涉及表如下：
1、uni-ad-sync-logs
2、uni-ad-positions
3、uni-ad-position-revenues
4、uni-ad-day-revenues
5、opendb-app-list

需要赋予上面的表的 `read` 权限全部设置为


```json
"permission": {
	"read": "'READ_UNI_AD' in auth.permission",
	"create": false,
	"update": false,
	"delete": false
}
```


**第三步：前往菜单管理，对每一个uni-ad统计的页面（包含子页面）设置下权限 `READ_UNI_AD`（菜单只有拥有对应权限才会显示）**


## 参考资料

- uni-admin文档：[详见](https://doc.dcloud.net.cn/uniCloud/admin.html)
- opendb文档：[详见](https://doc.dcloud.net.cn/uniCloud/opendb.html)

