# 开发指南

## 在项目中启用扩展数据库@use-in

扩展数据库作为 uniCloud 的一个扩展库，使用时需要在云函数或者云对象中启用。

::: warning 注意

1. 需要 HBuilderX 4.75+ 的版本才能进行此操作，如低于此版本，请更新 HBuilderX
2. 云函数设置的 Node.js 版本需要 ≥ Nodejs16，推荐使用 Nodejs18，[查看设置云函数 Nodejs 版本教程](#nodejs)
   :::

> 欢迎进入[扩展数据库技术交流群](https://im.dcloud.net.cn/#/?joinGroup=6828579096680d00023f32b5)

### 设置云函数 Nodejs 版本教程@nodejs

云函数设置的 Node.js 版本需要 ≥ Nodejs16，推荐使用 Nodejs18

打开云函数根目录的 `package.json` 文件，添加以下配置

**设置为 Nodejs18（推荐）**

```js
"cloudfunction-config": {
  ...你的其他配置
  "runtime": "Nodejs18",
}
```

**设置为 Nodejs16**

```js
"cloudfunction-config": {
  ...你的其他配置
  "runtime": "Nodejs16",
}
```

**特别注意：** 阿里云部分老空间 clientDB 版本为 node8，且开发者无法自行升级，如发现 clientDB 无法连接扩展数据库，可前往[扩展数据库技术交流群](https://im.dcloud.net.cn/#/?joinGroup=6828579096680d00023f32b5)反馈

### 云函数/云对象操作步骤@use-in-function

**在云函数或云对象中使用扩展数据库，需要进行如下操作：**

1. 在 `云函数/云对象` 上右键，并点击 - 管理公共模块或扩展库依赖

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202505161546857.png)

2. 勾选 `uni-cloud-ext-database` 扩展库

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202505161550180.png)

3. 上传云函数/云对象

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/8088839b-ba43-4282-8fe4-454252831261.png)

**注意：所有需要使用扩展数据库的云函数/云对象都要重复上面的 1-3 步骤**

4. 在 `uniCloud/database` 目录右键，并点击 - 配置 Shema 扩展 JS 的公共模块或扩展库

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202505161549464.png)

5. 勾选 `uni-cloud-ext-database` 扩展库

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202505161550769.png)

6. 再在 `uniCloud/database` 目录右键，并点击 - 上传 Schema 扩展 Js 的配置

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/976b47fa-015f-40ef-ad05-f37fa22c0ab1.png)

7. 完成，验证扩展数据库是否已生效，查看[验证扩展数据库是否已生效](#check-ext-db)

### 验证扩展数据库是否已生效@check-ext-db

右键 database 目录，初始化云数据库，如果有如下弹窗出现，且扩展数据库的 id 和库名正确，代表已生效

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/664ea3d1-d3f2-4413-b0ad-4e7057560ba7.png)

## API@api

扩展数据库已包含[内置数据库](https://doc.dcloud.net.cn/uniCloud/cf-database.html#get-collection)拥有的所有 API，并且还拥有以下特殊 API

### 切换数据库实例@switch-database-instance

**注意：需要先在扩展数据库控制台授权空间后，此空间才能使用**

```js
// 返回的db对象就是连接指定数据库实例的db对象
const db = uniCloud.database({
  id: '数据库实例ID',
});
```

### 切换数据库@switch-database

```js
// 返回的db对象就是连接指定库名的db对象
const db = uniCloud.database({
  database: '数据库实例下的数据库名称',
});
```

### 切换数据库实例和库@switch-database-instance-and-db

```js
// 返回的db对象就是连接指定数据库实例且指定了库名的db对象
const db = uniCloud.database({
  id: '数据库实例ID',
  database: '数据库实例下的数据库名称',
});
```

### 获取原生 MongoDB 操作对象@get-native-db

**API**

`uniCloud.databaseForNative(options: Options): Promise<Db>`

**Options**

|  参数名  |  类型  | 必填 | 默认值 | 说明          |
| :------: | :----: | :--: | :----: | :------------ |
|    id    | string |  否  |   -    | 数据库实例 id |
| database | string |  否  |   -    | 数据库名称    |

**Db**

Db 实例是 MongoDB 的数据库对象，提供了对数据库的操作方法。
详细的 API 参考 [MongoDB Db Class](https://mongodb.github.io/node-mongodb-native/6.10/classes/Db.html)

**示例**

```js
// 获取默认数据库实例
const dbNative = await uniCloud.databaseForNative();

// 切换数据库
const dbNative = await uniCloud.databaseForNative({
  database: '数据库名称',
});
```

#### MongoDB 基本概念

- **数据库**： MongoDB 存储数据的基本单位，类似于关系型数据库中的数据库。
- **集合**：MongoDB 文档的存储单位，类似于关系型数据库中的表。
- **文档**：存储文字数据的基本单位，类似于关系型数据库中的行。更多关于文档的概念可以参考 [MongoDB 文档](https://www.mongodb.com/docs/manual/core/document/)

#### 新建集合（表）@create-collection

在首次向不存在的集合中插入数据时，MongoDB 会隐式创建集合。如果要显式创建集合，可以使用 `createCollection` 方法。

**API**

`db.createCollection(name: string, options?: CreateCollectionOptions): Promise<Collection>`

**name**

集合名称

**CreateCollectionOptions**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/CreateCollectionOptions.html)

**Collection**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/classes/Collection.html)

**示例**

```js
const dbNative = await uniCloud.databaseForNative();

// 创建名为 book 的集合
await dbNative.createCollection('book');
```

#### 获取集合列表@get-collection-names

**API**

`db.listCollections(filter?: Document, options?: ListCollectionsOptions): ListCollectionsCursor`

**Document**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/BSON.Document.html)

**ListCollectionsOptions**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/ListCollectionsOptions.html)

**ListCollectionsCursor**

`ListCollectionsCursor` 是一个游标对象，用于遍历集合列表。它提供了多种方法来处理查询结果，例如 `toArray()`、`forEach()` 等。

- `toArray()`：将游标中的所有文档转换为数组。
- 异步迭代器：可以使用 `for await...of` 循环来遍历游标中的文档。关于异步迭代器参考[AsyncIterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of)

其他方法和属性可以参考 [ListCollectionsCursor](https://mongodb.github.io/node-mongodb-native/6.10/classes/ListCollectionsCursor.html)

**示例**

```js
const dbNative = await uniCloud.databaseForNative();

// 获取集合列表 (toArray)
const collections = await dbNative.listCollections().toArray();
console.log(collections);

// 获取集合列表 (异步迭代)
const collections = dbNative.listCollections();
for await (const collection of collections) {
  console.log(collection);
}

// 仅查询集合名称
const onlyNameCollections = await dbNative.listCollections({}, { nameOnly: true }).toArray();
console.log(onlyNameCollections);
```

#### 新建集合索引@create-index

**API**

`collection.createIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>`

**IndexSpecification**

`IndexSpecification` 是一个对象，定义了索引的字段和排序方式。它的键是要索引的字段名，值是排序方式（1 表示升序，-1 表示降序，2dsphere 表示地理空间索引，2d 表示二维索引等）。

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/IndexSpecification.html)

**CreateIndexesOptions**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/CreateIndexesOptions.html)

**示例**

```js
const dbNative = await uniCloud.databaseForNative();
const collection = dbNative.collection('book');

// 创建索引（单字段索引）
await collection.createIndex({ title: 1 });

// 自定义索引名称
await collection.createIndex({ title: 1 }, { name: 'title_index' });

// 创建唯一索引
await collection.createIndex({ title: 1 }, { unique: true });

// 创建地理空间索引
await collection.createIndex({ location: '2dsphere' });

// 后台创建索引
await collection.createIndex({ title: 1 }, { background: true });

// 创建索引（复合索引）
await collection.createIndex({ title: 1, author: -1 });
```

#### 获取集合索引@get-indexes

**API**

`collection.listIndexes(options?: ListIndexesOptions): ListIndexesCursor`

**ListIndexesOptions**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/types/ListIndexesOptions.html)

**ListIndexesCursor**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/classes/ListIndexesCursor.html)

**示例**

```js
const dbNative = await uniCloud.databaseForNative();
const collection = dbNative.collection('book');

// 获取索引列表 (toArray)
const indexes = await collection.listIndexes().toArray();
console.log(indexes);
```

#### 删除集合索引@drop-index

**API**
`collection.dropIndex(indexName: string, options?: CommandOperationOptions): Promise<Document>`

**CommandOperationOptions**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/CommandOperationOptions.html)

**示例**

```js
const dbNative = await uniCloud.databaseForNative();
const collection = dbNative.collection('book');

// 删除索引
await collection.dropIndex('title_index');
```

**注意**

1. \_id 索引是 MongoDB 默认创建的索引，不可以删除。

#### 删除表所有索引@drop-indexes

**API**

`collection.dropIndexes(options?: CommandOperationOptions): Promise<boolean>`

**CommandOperationOptions**

[参考](https://mongodb.github.io/node-mongodb-native/6.10/interfaces/CommandOperationOptions.html)

**示例**

```js
const dbNative = await uniCloud.databaseForNative();
const collection = dbNative.collection('book');

// 删除所有索引
await collection.dropIndexes();
```

**注意**

1. \_id 索引是 MongoDB 默认创建的索引，删除所有索引时不会删除 \_id 索引。

## 授权绑定空间@space-auth

进入[uniCloud 控制台](https://unicloud.dcloud.net.cn)，进入扩展数据库首页

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/09556a7d-3257-4751-88d7-79d79d44df99.png)

选择对应的数据库，进入详情后，再点击左侧菜单-空间授权管理

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/bb3c5aba-de14-4a11-b9d0-1af9bb70353e.png)

在弹窗中输入对应的信息，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/202e9759-0df5-4cec-b1e0-c508990ab226.png)

## 性能监控@monitor

进入扩展数据库详情页，点击左侧菜单-性能监控

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/14db148b-4a04-4134-8a01-5583e205958e.png)

## 慢日志查询@slow-log

进入扩展数据库详情页，点击左侧菜单-慢日志查询

**注意：扩展数据库没有慢日志限流，此处显示慢日志是为了方便你优化数据库代码，提升系统响应速度**

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/e2c17154-d571-427b-8804-11e024d64e84.png)

## 参数设置@setting

进入扩展数据库详情页，点击左侧菜单-参数设置

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/1ad411c7-d739-4f8b-841e-64fef457b8f8.png)

## IP 白名单@ip-white

进入扩展数据库详情页，点击左侧菜单-IP 白名单设置

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/0d62dc80-e2aa-4c29-b3a8-f51519d75742.png)

## 成员管理@member

进入扩展数据库详情页，点击左侧菜单-成员管理，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/dd2c695c-9621-4c1e-ab51-146384817328.png)

可以添加以下几种角色的成员

|    角色    | 权限说明                                           |
| :--------: | :------------------------------------------------- |
|  普通成员  | 实例详情、性能监控、慢日志查询、参数查看、备份查看 |
|   管理员   | 除成员管理外的功能                                 |
| 超级管理员 | 所有功能                                           |

**注意：变配和续费仅主账号才能操作。**

## 注意事项@note

### 阿里云 affectedDocs 属性处理

目前各家云中，只有阿里云的数据库 API 会多返回一个 affectedDocs 字段，比如执行下面的语句

```js
let result1 = await db.collection('test').where({ _id: '001' }).remove();
let result2 = await db.collection('test').where({ _id: '001' }).update({ a: '1' });
let result3 = await db.collection('test').where({ _id: '001' }).get();
console.log('result1: ', result1);
console.log('result2: ', result2);
console.log('result3: ', result3);
```

该语句执行完后，result 的值在阿里云空间分别为

```js
let result1 = { affectedDocs: 1, deleted: 1 }; // affectedDocs 值永远等于 deleted，建议用 deleted，代替 affectedDocs，使代码更具备通用性
let result2 = { affectedDocs: 1, updated: 1 }; // affectedDocs 值永远等于 updated，建议用 updated，代替 affectedDocs，使代码更具备通用性
let result3 = { affectedDocs: 1, data: [{ _id: '001', ...其他字段 }] }; // affectedDocs 值永远等于 data.length，建议用 data.length，代替 affectedDocs，使代码更具备通用性
```

而在其他云空间 result 值为（包括扩展数据库）

```json
let result1 = { "deleted": 1 }
let result2 = { "updated": 1 }
let result3 = { "data":[{ "_id":"001", ...其他字段 }] }
```

故建议不要在阿里云空间使用 affectedDocs 字段，这样代码才具备通用性，如果你在项目中使用了 affectedDocs 字段，则需要等价替换为 `deleted`、`updated`、`data.length`

## 常见问题@question

### 使用扩展数据库后，我原先的项目代码是否需要修改？@q1

不需要修改，只需要关联扩展数据库的扩展库，并重新上传云函数和 JQL 的 JS 扩展即可，详情见[在项目中启用扩展数据库](#use-in-function)

### 内置数据库如何迁移到扩展数据库？@q2

**特别注意：** 只有**阿里云**、**腾讯云**空间的内置数据库可按下方步骤导出导入数据，如果是**支付宝云**空间，请进入[扩展数据库技术交流群](https://im.dcloud.net.cn/#/?joinGroup=6828579096680d00023f32b5)协助迁移数据

进入内置数据库控制台，选择表，点导出，然后使用扩展数据库的[数据库可视化管理工具](./mongodb-compass.md)，将导出的 json 文件导入即可，具体操作如下：

1. 进入内置数据库控制台，点击-云数据库-选择对应的表-点导出，如下图所示（因为内置数据库不支持批量导出表数据，因此以下步骤每个表都要这样操作一下）

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/53b35866-18f4-4862-82c3-c3f1c308e497.png)

2. 在弹窗中，选择导出格式为 JSON，然后点确定，等待导出，最终浏览器会自动下载。

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/c00b3878-20d1-44be-88b2-3cb3904c662b.png)

3. 打开 `MongoDB Compass` 数据库可视化管理工具，选择对应的库，再选择对应的表，没有表就新建表，关于 `MongoDB Compass` 的操作帮助请[点击查看](./mongodb-compass.md)

4. 选择对应的表后，再按下图所示导入第 1 步导出的 JSON 文件即可。

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/d666b834-8faf-4bf8-9757-751b9d6ec513.png)
