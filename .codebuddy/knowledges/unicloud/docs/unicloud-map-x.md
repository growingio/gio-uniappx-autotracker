## unicloud-map 云端一体组件 uni-app x

::: warning 注意
该组件依赖 [uni-map-common 公共模块](uni-map-common.md)

本文档适用于客户端为 `uni-app x` 的版本，若客户端为 `uni-app` 则请访问：[unicloud-map 文档](./unicloud-map.md)

:::

### 介绍@introduce

基于地图的位置服务，是移动应用的特色场景，但过去开发一个地图类应用非常麻烦。需要对接地图厂商的客户端API、服务器API，再编写自己的业务逻辑。

unicloud的MongoDB数据库，对地理位置查询，提供了比传统数据库更方便的GEO查询方案，比如可以直接查询附近的POI信息。（Point of Interest，地图上的兴趣点）

DCloud之前已推出各种云端一体组件，基于[datacom规范](https://uniapp.dcloud.net.cn/component/datacom.html)，组件在客户端可以直接连数据库。

现在进一步封装了地图的datacom组件，将前端地图组件和云端数据库连起来，只需写一个`<unicloud-map>`组件，就可以直接从数据库里拉出附近的POI信息，并显示在地图上。

在uni-admin中，还提供了POI编辑插件，可以在管理端可视化的标记POI。标记的结果存入opendb表，客户端的`<unicloud-map>`组件可以自动直接拉取。

本文是`<unicloud-map>`组件的文档，admin插件文档[另见](unicloud-map-admin.md)

unicloud-map云端一体组件，主要用于显示数据库里的自定义POI，渲染在地图上。具体可以实现如下功能：

1. 显示静态POI信息。比如门店位置、景点位置、个人位置、车辆位置、活动举办地点等静态POI
2. 显示动态POI信息和路径。比如外卖软件显示外卖员实时配送路线、打车软件显示司机到乘客上车点的实时路线
3. 更多基于自定义POI实现的功能

> 插件市场地址：[https://ext.dcloud.net.cn/plugin?name=unicloud-map](https://ext.dcloud.net.cn/plugin?name=unicloud-map)

> 交流群：[uni-map交流群](https://im.dcloud.net.cn/#/?joinGroup=64d62b106823de10406ad72f)

### 用法示例@example

#### 简易示例

注意：由于组件是读取数据库表[opendb-poi](https://gitee.com/dcloud/opendb/blob/master/collection/opendb-poi/collection.json)进行查询，若表不存在或表内没有POI数据，则不会显示POI，可以通过[unicloud-map-admin插件](unicloud-map-admin.md)管理POI信息

```vue
<template>
	<view style="width: 100%;height: 100%;">
		<unicloud-map
			ref="map"
			:where="where"
			:latitude="latitude"
			:longitude="longitude"
			:default-icon="defaultIcon"
			:custom-icons="customIcons"
		></unicloud-map>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 查询条件
			where:{

			} as UTSJSONObject,
			// 你的经纬度，可通过uni.getLocation获取，注意type需传gcj02，同时在电脑端运行时获取到的经纬度是不准的
			latitude: 39.908823,
			longitude: 116.39747,
			defaultIcon: "/static/icon/default.png", // 默认POI图标
			// 自定义POI图标
			customIcons: [
				{ type: "门店", icon: "/static/icon/shop.png" },
				{ type: "总部", icon: "/static/icon/headquarters.png" }
			] as Array<UTSJSONObject>
		}
	}
}
</script>
```

#### 渲染静态POI@staticpoi

通过从数据库获取POI数据，渲染到地图上

**运行效果图**

<a target="_blank">
    <img src="https://web-ext-storage.dcloud.net.cn/unicloud/uni-map/9219a88d-f8d8-4ffe-9bc5-16e7213d6f29.png" style="width: 400px;"/>
</a>

**示例代码**

```vue
<template>
	<view class="page">

		<view class="map-box">
			<unicloud-map ref="map" loadtime="auto" collection="opendb-poi" :where="where" :latitude="latitude" :longitude="longitude" :scale="13" :poi-maximum="100"
				:default-icon="defaultIcon" :custom-icons="customIcons" :enable-scroll="true" :enable-zoom="true" :show-compass="true" @poitap="poitap"></unicloud-map>
		</view>

		<view class="btn-box first">
			<button @click="initData" size="mini" class="btn">初始化数据</button>
			<button @click="show1" size="mini" class="btn">只显示门店</button>
		</view>
		<view class="btn-box">
			<button @click="show2" size="mini" class="btn">只显示总部</button>
			<button @click="show3" size="mini" class="btn">显示总部+门店</button>
		</view>

	</view>
</template>

<script>
	const uniMapCo = uniCloud.importObject('uni-map-co', {
		customUI: true
	});
	const db = uniCloud.databaseForJQL();
	const dbCommand = db.command;
	const category = "static-001";
	export default {
		data() {
			return {
				latitude: 39.908823,
				longitude: 116.39747,
				where: {
					category: category
				} as UTSJSONObject, // 查询条件，不支持字符串JQL形式，必须是对象形式
				defaultIcon: "/static/icon/default.png", // 默认图标
				// 自定义图标
				customIcons: [
					{ type: "门店", icon: "/static/icon/shop.png" },
					{ type: "总部", icon: "/static/icon/headquarters.png" }
				] as Array<UTSJSONObject>
			}
		},
		onLoad() {

		},
		methods: {
			// 初始化测试数据
			async initData() {
				uni.showLoading({
					title: "生成中...",
					mask: true
				});
				try {
					await uniMapCo.initStatic001();
					await this.refresh();
				} catch (err) { }
				uni.hideLoading();
			},
			// 只显示门店
			show1() {
				this.where = {
					category: category,
					type: "门店"
				} as UTSJSONObject;
			},
			// 只显示总部
			show2() {
				this.where = {
					category: category,
					type: "总部"
				} as UTSJSONObject;
			},
			// 显示门店+总部
			show3() {
				this.where = {
					category: category,
					type: dbCommand.in(["门店", "总部"])
				} as UTSJSONObject;
			},
			// 刷新地图
			async refresh() {
				const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
				await mapInstance.refresh({
					needIncludePoints: true
				});
			},
			// 监听 - 点击POI事件
			poitap(e : UTSJSONObject) {
				if (e['poi'] != null) {
					let poi = e['poi'] as UTSJSONObject;
					this.showActionSheet(poi);
				}
			},
			// 导航弹窗
			showActionSheet(poi : UTSJSONObject) {
				let itemList = ["导航到这里"];
				uni.showActionSheet({
					title: poi['title'] as string,
					itemList: itemList,
					success: (res) => {
						let tapIndex = res.tapIndex as number;
						let item = itemList[tapIndex];
						if (item == "导航到这里") {
							uni.showModal({
								title: "提示",
								content: "可使用uni.openLocation插件来实现跳导航APP的功能",
								showCancel: false
							})
							// if (typeof uni.openLocation != "function") {
							// 	uni.showToast({
							// 		title: "请安装uni.openLocation插件",
							// 		icon: "none"
							// 	});
							// } else {
							// 	uni.openLocation({
							// 		type: 'gcj02',
							// 		latitude: poi.location.coordinates[1],
							// 		longitude: poi.location.coordinates[0],
							// 		name: poi.title,
							// 		address: poi.address
							// 	});
							// }
						}
					}
				});
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100%;
		height: 100%;
		flex-direction: column;

		.map-box {
			flex: 1;
		}

		.btn-box {
			margin: 20px;
			flex-direction: row;

			.btn {
				flex: 1;
				margin: 0 5px;
			}

			&.first {
				margin: 20px 10px 0 10px;
			}
		}
	}
</style>
```

#### 渲染动态POI@dynamicspoi

通过从数据库获取POI数据，并通过公共模块 [uni-map-common](https://doc.dcloud.net.cn/uniCloud/uni-map-common.html) 内的路线规划API，计算路线、距离、时间

**运行效果图**

<a target="_blank" href="https://web-ext-storage.dcloud.net.cn/doc/unicloud/uni-map/uni-map.mp4">
    <img src="https://web-ext-storage.dcloud.net.cn/unicloud/uni-map/d4d666d7-94de-41f4-aa22-c913cc78d9ca.png" style="width: 400px;" />
</a>

**示例代码**

```vue
<template>
	<view class="page">

		<view class="map-box">
			<unicloud-map ref="map" :debug="false" loadtime="auto" collection="opendb-poi" :where="where" :latitude="latitude" :longitude="longitude" :scale="13" :poi-maximum="100"
				:default-icon="defaultIcon" :custom-icons="customIcons" :enable-scroll="true" :enable-zoom="true" :show-compass="true" :show-location="true"></unicloud-map>
		</view>

		<view class="btn-box first">
			<button @click="initData" size="mini" class="btn">初始化配送点</button>
			<button @click="virtuallyTest" size="mini" class="btn">模拟配送</button>
		</view>
		<view class="btn-box">
			<button @click="start" size="mini" class="btn" v-if="!isStart">开启监听</button>
			<button @click="stop" size="mini" class="btn" v-else>暂停监听</button>
		</view>
	</view>
</template>

<script>
	var timer = -1;

	const uniMapCo = uniCloud.importObject('uni-map-co', {
		customUI: true
	});
	const category = "dynamics-001";

	function sleep(ms : number) : Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}


	export default {
		data() {
			return {
				longitude: 116.39747,
				latitude: 39.908823,
				where: {
					category: category
				} as UTSJSONObject,
				defaultIcon: "/static/icon/default.png", // 默认图标
				// 自定义图标
				customIcons: [
					{ type: "配送员", icon: "/static/icon/delivery.png" },
					{ type: "目的地", icon: "/static/icon/to.png" }
				] as Array<UTSJSONObject>,
				isStart: false,
				polyline: [] as Polyline[],
				isReady: false,
				updateNum: 0
			}
		},
		onLoad() {

		},
		onUnload() {
			this.stop();
		},
		methods: {
			async initData() {
				let res = await uniMapCo.initDynamics001();
				await this.getPolyline();
				await this.refresh();
				this.setPolyline(res['polyline'] as Array<UTSJSONObject>);
			},
			// 虚拟配送测试
			async virtuallyTest() {
				// 启动监听
				this.start();
				// 先执行一次刷新，获得配送路线
				await this.getPolyline();
				await this.refresh();
				let polyline = this.polyline
				if (polyline.length > 0) {
					// 去除重复的点
					let points = polyline[0].points;
					for (let i = 0; i < points.length - 1; i++) {
						let item = points[i];
						let nextItem = points[i + 1];
						if (item.latitude == nextItem.latitude && item.longitude == nextItem.longitude) {
							points.splice(i, 1);
							i--;
						}
					}
					let length = points.length;
					for (let i = 0; i < length; i++) {
						// 为了更快的显示变化，这里加速显示
						let rate = 5;
						if ((length - 1) > (i + rate)) {
							i = i + rate;
						} else {
							i = length - 1;
						}
						if (!this.isStart) {
							break;
						}
						let item = points[i];
						await sleep(500); // 模拟停顿
						if (i == length - 1) {
							await this.getPolyline();
						}
						await uniMapCo.updateMyLocation({
							longitude: item.longitude,
							latitude: item.latitude,
						});
					}
				}
			},
			// 刷新POI
			async refresh() {
				this.updateNum++;
				if (this.updateNum % 5 == 0) {
					await this.getPolyline();
				}
				const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
				await mapInstance.refresh({
					needIncludePoints: true
				});
			},
			// 获取路线
			async getPolyline() {
				let res = await uniMapCo.getPolyline();
				if (res['end'] != null && res['end'] as boolean) {
					this.setPolyline([] as Array<UTSJSONObject>);
				} else {
					this.setPolyline(res['polyline'] as Array<UTSJSONObject>);
				}
			},
			// 开启监听
			start() {
				this.isStart = true;
				if (timer != -1) {
					clearInterval(timer);
					timer = -1;
				}
				timer = setInterval(() => {
					this.refresh();
				}, 1000);
			},
			// 停止监听
			stop() {
				this.isStart = false;
				if (timer != -1) {
					clearInterval(timer);
					timer = -1;
				}
			},
			// 设置路线
			setPolyline(polyline : Array<UTSJSONObject>) {
				let polylines = polyline.map((item : UTSJSONObject) : Polyline => {
					let itemPoints = item['points'] as Array<UTSJSONObject>;
					let points = itemPoints.map((point : UTSJSONObject) : LocationObject => {
						let latitude = point['latitude'] as number;
						let longitude = point['longitude'] as number;
						return {
							latitude: latitude,
							longitude: longitude
						} as LocationObject;
					});
					return {
						points,
						color: item['color'] as string,
						width: item['width'] as number,
						dottedLine: item['dottedLine'] as boolean,
						arrowLine: item['arrowLine'] as boolean,
						borderWidth: item['borderWidth'] as number,
						borderColor: item['borderColor'] as string,
					} as Polyline;
				});
				const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
				this.polyline = polylines;
				mapInstance.setPolyline(polylines);
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100%;
		height: 100%;
		flex-direction: column;

		.map-box {
			flex: 1;
		}

		.btn-box {
			margin: 20px;
			flex-direction: row;

			.btn {
				flex: 1;
				margin: 0 5px;
			}

			&.first {
				margin: 20px 10px 0 10px;
			}
		}
	}
</style>
```

### 地图Key配置@config

地图Key需要在两个地方进行配置：前端配置和云端配置（必须都配置）。

前端配置Key：[点击查看](https://doc.dcloud.net.cn/uni-app-x/component/map.html#map-key%E9%85%8D%E7%BD%AE)

云端配置Key：

在 uni-config-center/uni-map/config.js 中进行配置。（没有配置文件和目录就新建目录和文件）

config.js 文件内容

```js
module.exports = {
	"default": "qqmap", // 使用的平台
	"key": {
		"qqmap": "", // 腾讯地图key
		"amap": "", // 高德地图key
	}
}
```

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/3707/419.png)

### 组件属性@props

unicloud-map组件依赖map组件，以下是不同于map组件的属性列表，[点击查看map组件属性](https://doc.dcloud.net.cn/uni-app-x/component/map.html#%E5%B1%9E%E6%80%A7)

| 属性名						| 说明																									| 类型					| 默认值							| 可选值						|平台差异说明																																							|
|-----------------	|-------------------------------												|---------			|--------							|-------						|-------																																									|
| collection				|  表名																									| string				| opendb-poi					| -									|-																																												|
| loadtime					| 数据加载时机																					| string				| auto								| [详情](#loadtime)	|-																																												|
| where							| 查询条件，注意，只支持对象写法，不支持JQL的字符串语法	| UTSJSONObject				| -										| -									|-																																												|
| poi-maximum				| 最大poi显示数量																				| number				| 100									| -									|-																																												|
| poi-max-distance	|查询的最大距离																					| number				| -										| -									|-																																												|
| poi-min-distance	|查询的最小距离																					| number				| -										| -									|-																																												|
| default-icon			|默认的POI图标																					| string				| /static/location.png| -									|-																																												|
| custom-icons			|自定义图标，根据POI的type来区分												| UTSJSONObject []					| -										| -									|-																																												|
| latitude					|中心纬度																								| number| -										| -									|-																																												|
| longitude					|中心经度																								| number| -										| -									|-																																												|
| defaultLatitude		|默认中心纬度，当latitude无值时使用该值									| number| 39.908823						| -									|-																																												|
| defaultLongitude	|默认中心经度，当longitude无值时使用该值								| number| 116.39747						| -									|-																																												|
| @mounted					|组件挂载完毕触发																				| EventHandle		| -										|-									|-																																												|
| @custom-poitap						|点击自定义POI点时触发																	| UTSJSONObject		| -										|-									|-																																												|

**注意**

- 只支持腾讯地图或高德地图，且需使用 `gcj02` 坐标，用错坐标类型会显示偏移。

### loadtime

|值			|类型		|描述																																													|
|:-			|:-			|:-																																														|
|auto		|String	|页面就绪后或属性变化后加载数据，默认为auto																										|
|onready|String	|页面就绪后不自动加载数据，属性变化后加载。适合在onready中接收上个页面的参数作为where条件时。	|
|manual	|String	|手动模式，不自动加载数据。如果涉及到分页，需要先手动修改当前页，在调用加载数据								|

### 组件方法@function

| 方法名					| 说明													|
|-----------------|-------------------------------|
| refresh					| 主动刷新POI数据										|
| getMarkers			| 获取组件内的markers						|
| setMarkers			| 设置组件内的markers						|
| getPolyline			| 获取组件内的polyline					|
| setPolyline			| 设置组件内的polyline					|
| getCircles			| 获取组件内的circles						|
| setCircles			| 设置组件内的circles						|
| getControls			| 获取组件内的controls					|
| setControls			| 设置组件内的controls					|

**注意**

使用这些方法前，需要在组件先声明 `ref="map"`

```vue
<unicloud-map
	ref="map"
	...其他属性
</unicloud-map>
```

**refresh**

主动刷新POI数据

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
await mapInstance.refresh({
	needIncludePoints: true
});
```

**getMarkers**

获取组件内的markers

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
let markers = mapInstance.getMarkers();
console.log('markers: ', markers);
```

**setMarkers**

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
const markers :Marker[]= [{
	id: 0,
	latitude: 39.908692,
	longitude: 116.397477,
	title: '天安门',
	// zIndex: '1',
	iconPath: '../../../static/location.png',
	width: 40,
	height: 40,
	anchor: {
		x: 0.5,
		y: 1
	},
	callout: {
		content: '首都北京\n天安门',
		color: '#00BFFF',
		fontSize: 12,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#333300',
		bgColor: '#CCFF11',
		padding: 5,
		display: 'ALWAYS'
	} as MapMarkerCallout
} as Marker];

mapInstance.setMarkers(markers);
```

**getPolyline**

获取组件内的polyline

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
let polyline = mapInstance.getPolyline();
console.log('polyline: ', polyline);
```

**setPolyline**

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
const polyline: Polyline[] = [{
	points: [{
		latitude: 39.925539,
		longitude: 116.279037
	},
	{
		latitude: 39.925539,
		longitude: 116.520285
	}],
	color: '#FFCCFF',
	width: 7,
	dottedLine: true,
	arrowLine: true,
	borderColor: '#000000',
	borderWidth: 2
} as Polyline];
mapInstance.setPolyline(polyline);
```

**getCircles**

获取组件内的circles

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
let circles = mapInstance.getCircles();
console.log('circles: ', circles);
```

**setCircles**

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
const circles: Circle[] = [{
  latitude: 39.996441,
  longitude: 116.411146,
  radius: 15000,
  strokeWidth: 5,
  color: '#CCFFFF',
  fillColor: '#CC0000'
} as Circle];
mapInstance.setCircles(circles);
```

**getControls**

获取组件内的controls

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
let controls = mapInstance.getControls();
console.log('controls: ', controls);
```

**setControls**

示例

```js
const mapInstance = this.$refs["map"] as UnicloudMapComponentPublicInstance;
const controls: Control[] = [{
  id: 1,
  position: {
    left: 5,
    top: 180,
    width: 30,
    height: 30
  } as ControlPosition,
  iconPath: '../../../static/uni.png',
  clickable: true
} as Control];
mapInstance.setControls(controls);
```

### unicloud-map的opendb数据表@database

unicloud-map需要创建以下表后才能正常运行，可以右键插件database目录下的opendb-poi.schema.json上传Schema

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/3707/411.png)

- 地图POI表 [opendb-poi](https://gitee.com/dcloud/opendb/blob/master/collection/opendb-poi/collection.json)

### 三方定位和地图服务收费说明@fee

unicloud-map是免费的，但高德、腾讯、百度等地图的使用需向地图厂商采购商业授权。DCloud与地图厂商达成合作，可更优惠的给开发者提供地图服务。[详见](https://uniapp.dcloud.net.cn/component/map.html#%E4%B8%89%E6%96%B9%E5%AE%9A%E4%BD%8D%E5%92%8C%E5%9C%B0%E5%9B%BE%E6%9C%8D%E5%8A%A1%E6%94%B6%E8%B4%B9%E8%AF%B4%E6%98%8E)

### 三方地图SDK

[点击查看](https://doc.dcloud.net.cn/uni-app-x/component/map.html#mapsdk)

### 【福利】高德拉新

一键注册高德企业开发者，最高可获取210元奖励金，详见[https://ask.dcloud.net.cn/article/41279](https://ask.dcloud.net.cn/article/41279)
