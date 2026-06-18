# 开发指南

## 启用 uni-cloud-ext-storage 扩展库@use-in-function

扩展存储是单独的扩展库，开发者需手动将 uni-cloud-ext-storage 扩展库添加到云函数或云对象的依赖中。

操作步骤：

1. 右键需要添加的云函数或云对象
2. 点击-管理公共模块或扩展库依赖
3. 勾选 uni-cloud-ext-storage 扩展库

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/3707/ext-storage/445.png)

## API@api

### 获取扩展存储管理对象@getextstoragemanager

云端在操作扩展存储前，需要先获取 extStorageManager 对象实例，然后再通过 extStorageManager.xxx 调用对应的 API

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu', // 扩展存储供应商
  domain: 'example.com', // 域名地址
});
```

**请求参数**

|    参数名    |  类型  | 必填 | 默认值 | 说明                                                                                     |
| :----------: | :----: | :--: | :----: | :--------------------------------------------------------------------------------------- |
|   provider   | String |  是  |   -    | 必填，扩展存储供应商，可选<br/>qiniu: 七牛云                                             |
|    domain    | String |  是  |   -    | 必填，扩展储存域名（域名地址）如：example.com                                            |
|  bucketName  | String |  否  |   -    | 选填，扩展储存的 bucket 名称，不填会自动从绑定的空间中获取（此参数当前仅云端运行时生效） |
| bucketSecret | String |  否  |   -    | 选填，扩展储存的 bucket 密钥，不填会自动从绑定的空间中获取（此参数当前仅云端运行时生效） |

### 获取前端上传参数@getuploadfileoptions

接口名：getUploadFileOptions

调用此接口可在云端获取前端上传所需参数，将上传参数返回给前端，前端使用 uni.uploadFile 即可上传文件

你可以在调用 extStorageManager.getUploadFileOptions 前执行一些自己的业务逻辑，判断用户是否有上传权限。

**云端云对象代码**

注意：如果是云函数，写法会略有不同，包括前端调用的代码，故建议使用云对象，跟文档更契合。

```js
module.exports = {
  getUploadFileOptions(data = {}) {
    let {
      cloudPath, // 前端传过来的文件路径
    } = data;
    // 可以在此先判断下此路径是否允许上传等逻辑
    // ...

    // 然后获取 extStorageManager 对象实例
    const extStorageManager = uniCloud.getExtStorageManager({
      provider: 'qiniu',
      domain: 'example.com', // 域名地址
    });
    // 最后调用 extStorageManager.getUploadFileOptions
    let uploadFileOptionsRes = extStorageManager.getUploadFileOptions({
      cloudPath: cloudPath, // 建议把用户上传的文件统一放在 public 目录下，方便可以根据目录删除文件
      allowUpdate: false, // 是否允许覆盖更新，如果返回前端，建议设置false，代表仅新增，不可覆盖
    });
    return uploadFileOptionsRes;
  },
};
```

**请求参数**

|       参数名        |  类型   | 必填 | 默认值 | 说明                                                                                                                                                                                                                            |
| :-----------------: | :-----: | :--: | :----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|      cloudPath      | String  |  否  |   -    | 云端文件路径（不填会自动生成），建议把用户上传的文件统一放在 public 目录下，方便可以根据目录删除文件                                                                                                                            |
|     allowUpdate     | Boolean |  否  | false  | 是否允许覆盖更新 true：可覆盖 false：仅新增，不可覆盖                                                                                                                                                                           |
|     fsizeLimit      | Number  |  否  |   -    | 限定上传文件大小最大值，单位 Byte。超过限制上传文件大小的最大值会被判为上传失败，返回 413 状态码。值最大为 1GB                                                                                                                  |
|      expiresIn      | Number  |  否  |  3600  | token 的有效期，单位是秒，默认为 1 小时                                                                                                                                                                                         |
|      mimeLimit      | String  |  否  |   -    | 限定用户上传的文件类型<br/>示例：<br/> `image/*` 表示只允许上传图片类型<br/>`image/jpeg;image/png` 表示只允许上传 jpg 和 png 类型的图片<br/>`!application/json;text/plain` 表示禁止上传 json 文本和纯文本。注意最前面的感叹号！ |
|    persistentOps    | String  |  否  |   -    | 转码参数 [详情](https://developer.qiniu.com/dora/1248/audio-and-video-transcoding-avthumb) 如果传了此参数，则资源上传成功后会自动转码                                                                                           |
| persistentNotifyUrl | String  |  否  |   -    | 转码成功后的异步回调通知地址                                                                                                                                                                                                    |

**响应参数**

|       字段        |  类型  | 说明                                                        |
| :---------------: | :----: | :---------------------------------------------------------- |
| uploadFileOptions | Object | uni.uploadFile 所需的参数                                   |
|     cloudPath     | String | 文件云端路径                                                |
|      fileID       | String | 文件 ID                                                     |
|      fileURL      | String | 文件 URL（如果是私有权限的文件，则此 URL 是无法直接访问的） |

响应参数 uploadFileOptions 详情

```json
{
  "expTime": 1704459639, // 过期时间，以秒为单位的时间戳
  "cloudPath": "public/test/1704456039122.jpg", // 文件云端路径
  "fileID": "qiniu://public/test/1704456039122.jpg", // 文件ID
  "fileURL": "https://cdn.example.com/public/test/1704456039122.jpg", // 文件URL（如果是私有权限的文件，则此URL是无法直接访问的）
  "uploadFileOptions": {
    "url": "https://upload.qiniup.com", // 上传网关地址，对应uni.uploadFile的url参数
    "name": "file", // 文件对应的 key，对应uni.uploadFile的name参数
    // HTTP 请求中其他额外的 form data，对应uni.uploadFile的formData参数
    "formData": {
      "token": "xxxxxxxx",
      "key": "public/test/1704456039122.jpg"
    }
  }
}
```

**前端上传代码**

**uni-app**

```js
uni.chooseImage({
  count: 1,
  success: async (res) => {
    const filePath = res.tempFilePaths[0];
    uni.showLoading({ title: '上传中...', mask: true });
    // ext-storage-co 是你自己写的云对象（参考上面的云端代码）
    const uniCloudStorageExtCo = uniCloud.importObject('ext-storage-co');
    const uploadFileOptionsRes = await uniCloudStorageExtCo.getUploadFileOptions({
      cloudPath: `test/${Date.now()}.jpg`, // 支持自定义目录
    });
    const uploadTask = uni.uploadFile({
      ...uploadFileOptionsRes.uploadFileOptions, // 上传文件所需参数
      filePath: filePath, // 本地文件路径
      success: (uploadFileRes) => {
        if (uploadFileRes.statusCode !== 200) {
          console.log('上传失败', uploadFileRes);
          return;
        }
        const res = {
          cloudPath: uploadFileOptionsRes.cloudPath, // 文件云端路径
          fileID: uploadFileOptionsRes.fileID, // 文件ID
          fileURL: uploadFileOptionsRes.fileURL, // 文件URL（如果是私有权限，则此URL是无法直接访问的）
        };
        // 数据库里可直接保存 fileURL 或 fileID
        console.log('上传成功', res);
      },
      fail: (err) => {
        console.log('上传失败', err);
      },
    });
    // 监听上传进度
    uploadTask.onProgressUpdate((res) => {
      console.log('监听上传进度', res);
    });
    uni.hideLoading();
  },
});
```

**uni-app x**

```js
uni.chooseImage({
	count: 1,
	success: (res) => {
		const filePath = res.tempFilePaths[0];
		uni.showLoading({ title: "上传中...", mask: true });
		// ext-storage-co 是你自己写的云对象（参考上面的云端代码）
		const uniCloudStorageExtCo = uniCloud.importObject("ext-storage-co");
		uniCloudStorageExtCo.getUploadFileOptions({
			cloudPath: `test/${Date.now()}.jpg`, // 支持自定义目录
		}).then((uploadFileOptionsRes : UTSJSONObject) => {
			const uploadFileOptions = uploadFileOptionsRes['uploadFileOptions'] as UTSJSONObject;
			const url = uploadFileOptions['url'] as string;
			const name = uploadFileOptions['name'] as string;
			const formData = uploadFileOptions['formData'] as UTSJSONObject;
			const cloudPath = uploadFileOptionsRes['cloudPath'] as string; // 文件云端路径
			const fileID = uploadFileOptionsRes['fileID'] as string; // 文件ID
			const fileURL = uploadFileOptionsRes['fileURL'] as string; // 文件URL（如果是私有权限，则此URL是无法直接访问的）
			const uploadTask = uni.uploadFile({
				url,
				name,
				formData,
				filePath,
				success: (uploadFileRes) => {
					if (uploadFileRes.statusCode !== 200) {
						console.log("上传失败", uploadFileRes);
						return;
					}
					const uploadRes = {
						cloudPath, // 文件云端路径
						fileID, // 文件ID
						fileURL, // 文件URL（如果是私有权限，则此URL是无法直接访问的）
					};
					// 数据库里可直接保存 fileURL 或 fileID
					console.log("上传成功", uploadRes);
				},
				fail: (err) => {
					console.log("上传失败", err);
				}
			});
			// 监听上传进度
			uploadTask.onProgressUpdate((res) => {
				console.log("监听上传进度", res);
			});
			uni.hideLoading();
		});
	}
});
```

### 云端上传文件@uploadfile

接口名：uploadFile

调用此接口可在云端上传文件到云存储

**云端代码**

将网络图片转为 Buffer 上传到扩展存储

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let imageBuffer = await uniCloud.request({
  url: 'https://www.xxx.com/a.jpg',
  method: 'GET',
  responseType: 'buffer',
  header: {
    'cache-control': 'no-cache',
  },
});

let res = await extStorageManager.uploadFile({
  cloudPath: `${Date.now()}.png`, // 云端文件名，不填则自动生成
  fileContent: imageBuffer.data, // 要上传的文件内容
  allowUpdate: false, // 是否允许覆盖
});
console.log('uploadFile: ', res);
```

将 base64 转为 Buffer 上传到扩展存储

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
// 文件的base64值
let base64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAX1JREFUeF7tnLFxwkAQRf86dEwHDqEATAeO3YNdgmugBFGDiemAoQBSd+DUhD6Pxk6Y4XTB13o08AiFDt09vf3cCGZDkhbd6qHoey3Fk6T7/tgNv05S2YXu3o6v+4/4haODVGY3DOXC0uMzpGXMu+W7FM/AuUSgbGPePX5RVlU9Tj2ggj11AgBq2AEgAHkBgkEYhEEeAQzy+JFBGIRBHgEM8viRQRg0AYOOL/vqLBablTfDxujsa49SYtmTHGKUfW0A/UcGZd9FDDJSKvvmUGKUmKGnJAzCIAxK3aRSYpQYJUaJsZM2qoCdNI87DH0kYRAGYZBHAIM8fmQQBmGQRwCDPH5kEAZhkEcAgzx+ZBAGYZBH4NoNSqXT+PAx/puU/rMPgBpP9QAEoLYDQ3uR9ui8M8ggQtqzazIGecuY9uhRvuanvURvdgBq8AMQgCgxjwAGefzIIAzCII8ABnn8aLA0zK9vsESLrjqjsqXJW5XOX5O3/n3aBJ5ROmsT+AM4B3/QCW75sQAAAABJRU5ErkJggg==`;
let base64Str = 'base64,';
let base64Index = base64.indexOf(base64Str);
if (base64Index > -1) base64 = base64.substring(base64Index + base64Str.length);

let fileContent = new Buffer(base64, 'base64');
let res = await extStorageManager.uploadFile({
  cloudPath: `${Date.now()}.png`, // 云端文件名，不填则自动生成
  fileContent, // 要上传的文件内容
  allowUpdate: false, // 是否允许覆盖
});
console.log('uploadFile: ', res);
```

**请求参数**

|   参数名    |  类型   | 必填 | 默认值 | 说明                                                  |
| :---------: | :-----: | :--: | :----: | :---------------------------------------------------- |
| fileContent | Buffer  |  是  |   -    | 文件内容                                              |
|  cloudPath  | String  |  否  |   -    | 云端文件路径（不填会自动生成）                        |
| allowUpdate | Boolean |  否  | false  | 是否允许覆盖更新 true：可覆盖 false：仅新增，不可覆盖 |

**响应参数**

|   字段    |  类型  | 说明                                                        |
| :-------: | :----: | :---------------------------------------------------------- |
| cloudPath | String | 文件云端路径                                                |
|  fileID   | String | 文件 ID                                                     |
|  fileURL  | String | 文件 URL（如果是私有权限的文件，则此 URL 是无法直接访问的） |

### 获取临时下载链接@gettempfileurl

接口名：getTempFileURL

调用此接口可批量获取私有文件的临时下载链接

你可以在调用 extStorageManager.getTempFileURL 前执行一些自己的业务逻辑，判断用户是否有获取临时下载链接权限。

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let res = extStorageManager.getTempFileURL({
  fileList: ['qiniu://test.jpg'], // 文件地址列表
});
console.log('getTempFileURL: ', res);
return res;
```

**请求参数**

|  参数名   |  类型  | 必填 | 默认值 | 说明                                                                                                                                                   |
| :-------: | :----: | :--: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileList  | Array  |  是  |   -    | 文件地址列表，数组内元素值类型支持（fileID、cloudPath、fileURL）<br/>如："qiniu://test.jpg" "test.jpg" "https://example.com/test.jpg" 均表示同一个文件 |
| expiresIn | Number |  否  |  3600  | 有效期，单位秒，默认 1 小时                                                                                                                            |

**响应参数**

|   字段   | 类型  | 说明               |
| :------: | :---: | :----------------- |
| fileList | Array | 存储下载链接的数组 |

响应参数中的 fileList

|    字段     |  类型  | 说明              |
| :---------: | :----: | :---------------- |
| tempFileURL | String | 临时文件 URL 地址 |
|   fileID    | String | 文件 ID           |
|  cloudPath  | String | 文件云端路径      |

### 下载文件@downloadfile

接口名：downloadFile

调用此接口获得文件 Buffer

你可以在调用 extStorageManager.downloadFile 前执行一些自己的业务逻辑，判断用户是否有下载该文件权限

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let res = extStorageManager.downloadFile({
  fileID: 'qiniu://test.jpg', // 待下载的文件
});
console.log('downloadFile: ', res);
return res;
```

**请求参数**

| 参数名 |  类型  | 必填 | 默认值 | 说明                                                                                                                                                |
| :----: | :----: | :--: | :----: | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileID | String |  是  |   -    | 待下载的文件，该字段支持的值类型：fileID、cloudPath、fileURL <br/>如："qiniu://test.jpg" "test.jpg" "https://example.com/test.jpg" 均表示同一个文件 |

**响应参数**

|    字段     |  类型  | 说明             |
| :---------: | :----: | :--------------- |
| fileContent | Buffer | 下载的文件的内容 |

### 删除文件@deletefile

接口名：deleteFile

调用此接口可批量删除云端文件

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let res = await extStorageManager.deleteFile({
  fileList: ['qiniu://test.jpg'], // 待删除的文件地址列表
});
console.log('deleteFile: ', res);
return res;
```

**请求参数**

|  参数名  | 类型  | 必填 | 默认值 | 说明                                                                                                                                                   |
| :------: | :---: | :--: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileList | Array |  是  |   -    | 文件地址列表，数组内元素值类型支持（fileID、cloudPath、fileURL）<br/>如："qiniu://test.jpg" "test.jpg" "https://example.com/test.jpg" 均表示同一个文件 |

**响应参数**

|   字段   | 类型  | 说明                 |
| :------: | :---: | :------------------- |
| fileList | Array | 删除结果组成的数组。 |

### 修改文件状态@updatefilestatus

接口名：updateFileStatus

可以将指定文件设置为私有权限或公共权限

默认上传的文件都是公共权限，如果需要将文件设置为私有权限，则可调用此接口

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let res = await extStorageManager.updateFileStatus({
  fileID: 'qiniu://test.jpg', // 待修改的文件
  isPrivate: true, // true 私有 false 公共
});
console.log('updateFileStatus: ', res);
return res;
```

**请求参数**

|  参数名   |  类型   | 必填 | 默认值 | 说明                                                                                                                                                |
| :-------: | :-----: | :--: | :----: | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
|  fileID   | String  |  是  |   -    | 待修改的文件，该字段支持的值类型：fileID、cloudPath、fileURL <br/>如："qiniu://test.jpg" "test.jpg" "https://example.com/test.jpg" 均表示同一个文件 |
| isPrivate | Boolean |  是  |   -    | true 设为私有权限 false 设为公共读权限                                                                                                              |

**响应参数**

|  字段   |  类型  | 说明                |
| :-----: | :----: | :------------------ |
| errCode | Number | 0 成功 其他均为失败 |
| errMsg  | String | 失败描述            |

### 刷新 CDN 缓存@refreshcdncache

接口名：refreshCdnCache

调用此接口可批量缓存云端文件 CDN 缓存

**注意：**

1. 每日只能刷新 100 个文件
2. 刷新 CDN 缓存生效有延迟，预计在 1-10 分钟内生效
3. 如果想要实时刷新缓存，可考虑文件地址后面加?v=文件版本号的方式，如 `https://cdn.example.com/test.jpg?v=1`（此方式即使不执行 refreshCdnCache 接口也能获取最新的文件）

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let res = await extStorageManager.refreshCdnCache({
  fileList: ['qiniu://test.jpg'], // 待刷新的文件地址列表
});
console.log('refreshCdnCache: ', res);
return res;
```

**请求参数**

|  参数名  | 类型  | 必填 | 默认值 | 说明                                                                                                                                                   |
| :------: | :---: | :--: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileList | Array |  是  |   -    | 文件地址列表，数组内元素值类型支持（fileID、cloudPath、fileURL）<br/>如："qiniu://test.jpg" "test.jpg" "https://example.com/test.jpg" 均表示同一个文件 |

**响应参数**

|  字段   |  类型  | 说明                     |
| :-----: | :----: | :----------------------- |
| errCode | Number | 0 代表成功，其他均为失败 |
| errMsg  | String | 失败原因                 |

### 获取域名列表@getdomains

接口名：getDomains

注意：获取的域名列表是账号绑定的所有域名

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用getDomains接口时，这里的域名可以随便填，不会生效，但不能为空
});
let { domains = [] } = await extStorageManager.getDomains();
console.log('域名列表: ', domains);
```

**响应参数**

|  字段   | 类型  | 说明     |
| :-----: | :---: | :------- |
| domains | Array | 域名列表 |

### 获取 TOP100 统计数据@getcdntop

接口名：getCdnTop

注意：获取的域名列表是账号绑定的所有域名

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用getCdnTop接口时，这里的域名可以随便填，不会生效，但不能为空
});
// 获取域名
let { domains = [] } = await extStorageManager.getDomains();
// 查询 2024-05-12 日的TOP100统计数据
let startDate = '2024-05-12';
let endDate = '2024-05-12';
let getCdnTopRes = await extStorageManager.getCdnTop({
  type: 2, // 1 topURL 2 topIP
  domains,
  startDate,
  endDate,
});
console.log('TOP100统计数据: ', getCdnTopRes.data);
```

**请求参数**

|  参数名   |  类型  | 必填 | 默认值 | 说明                                                         |
| :-------: | :----: | :--: | :----: | :----------------------------------------------------------- |
|   type    | Number |  是  |   -    | 必填，查询类型，值为 1 代表查询 topURL 值为 2 代表查询 topIP |
|  domains  | Array  |  是  |   -    | 必填，域名列表，总数不超过 100 条                            |
| startDate | String |  是  |   -    | 必填，开始时间，格式为：2006-01-02。起止最大间隔为 31 天     |
|  endDate  | String |  是  |   -    | 必填，结束时间，格式为：2006-01-02。起止最大间隔为 31 天     |

**响应参数**

| 字段 | 类型  | 说明            |
| :--: | :---: | :-------------- |
| data | Array | TOP100 统计数据 |

### 获取 cdn 流量数据@getcdnflow

接口名：getCdnFlow

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用getCdnFlow接口时，这里的域名可以随便填，不会生效，但不能为空
});
let getCdnFlowRes = await extStorageManager.getCdnFlow({
  domains: ['cdn.example.com'], // 这里填写你绑定的域名，支持传多个域名
  granularity: 'day',
  startDate: '2024-04-01',
  endDate: '2024-04-30',
});
console.log('getCdnFlowRes: ', getCdnFlowRes);
```

**请求参数**

|   参数名    |  类型  | 必填 | 默认值 | 说明                                                     |
| :---------: | :----: | :--: | :----: | :------------------------------------------------------- |
|   domains   | Array  |  是  |   -    | 必填，域名列表，总数不超过 100 条                        |
| granularity | String |  是  |   -    | 必填，粒度，取值：5min 、 hour 、day                     |
|  startDate  | String |  是  |   -    | 必填，开始时间，格式为：2006-01-02。起止最大间隔为 31 天 |
|   endDate   | String |  是  |   -    | 必填，结束时间，格式为：2006-01-02。起止最大间隔为 31 天 |

**响应参数**

| 字段 |  类型  | 说明         |
| :--: | :----: | :----------- |
| data | Object | 流量统计数据 |

**完整响应参数示例**

注意

1. 流量的单位是 b，转成 GB 需要 `/1024/1024/1024`
2. china 代表国内流量，oversea 代表海外流量

```json
{
  "errCode": 0,
  "errMsg": "ok",
  "data": {
    "time": [
      "2024-04-01 00:00:00",
      "2024-04-02 00:00:00",
      "2024-04-03 00:00:00",
      "2024-04-04 00:00:00",
      "2024-04-05 00:00:00",
      "2024-04-06 00:00:00",
      "2024-04-07 00:00:00",
      "2024-04-08 00:00:00",
      "2024-04-09 00:00:00",
      "2024-04-10 00:00:00",
      "2024-04-11 00:00:00",
      "2024-04-12 00:00:00",
      "2024-04-13 00:00:00",
      "2024-04-14 00:00:00",
      "2024-04-15 00:00:00",
      "2024-04-16 00:00:00",
      "2024-04-17 00:00:00",
      "2024-04-18 00:00:00",
      "2024-04-19 00:00:00",
      "2024-04-20 00:00:00",
      "2024-04-21 00:00:00",
      "2024-04-22 00:00:00",
      "2024-04-23 00:00:00",
      "2024-04-24 00:00:00",
      "2024-04-25 00:00:00",
      "2024-04-26 00:00:00",
      "2024-04-27 00:00:00",
      "2024-04-28 00:00:00",
      "2024-04-29 00:00:00",
      "2024-04-30 00:00:00"
    ],
    "data": {
      "qiniu.dcloud.net.cn": {
        "china": [
          1350, 1312, 1350, 1350, 1350, 0, 3937, 1987, 1350, 1350, 1350, 1350, 1350, 1350, 1350, 1987, 1350, 1350, 675, 1350, 1350, 675, 1350, 1350, 1987, 1350, 1350, 1350, 1987,
          1312
        ],
        "oversea": [0, 0, 0, 0, 0, 0, 0, 4050, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    "total": { "china": 42859, "oversea": 4050, "all": 46909 }
  }
}
```

### 修改 SSL 证书@updatecdncert

接口名：updateCdnCert

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用updateCdnCert接口时，这里的域名可以随便填，不会生效，但不能为空
});
let updateCdnCertRes = await extStorageManager.updateCdnCert({
  domain: 'cdn.example.com', // 这里填写你绑定的域名
  pri: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpQxxxxxxikbALs=\n-----END RSA PRIVATE KEY-----\n', // 证书私钥
  ca: '-----BEGIN CERTIFICATE-----\nMIIGaxxxxxxxVKQPNriiTsBhYscw==\n-----END CERTIFICATE-----', // 证书内容
});
console.log('updateCdnCertRes: ', updateCdnCertRes);
```

**请求参数**

| 参数名 |  类型  | 必填 | 默认值 | 说明           |
| :----: | :----: | :--: | :----: | :------------- |
| domain | String |  是  |   -    | 域名           |
|  pri   | String |  是  |   -    | 必填，证书私钥 |
|   ca   | String |  是  |   -    | 必填，证书内容 |

**响应参数**

|  字段   |  类型  | 说明                     |
| :-----: | :----: | :----------------------- |
| errCode | Number | 0 代表正确，其他均为错误 |
| errMsg  | String | 错误提示                 |

### 获取文件列表@listfiles

接口名：listFiles

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用listFiles接口时，这里的域名可以随便填，不会生效，但不能为空
});
let listFilesRes = await extStorageManager.listFiles({
  limit: 100,
  marker: '',
  prefix: '',
  delimiter: '/',
});
console.log('listFilesRes: ', listFilesRes);
```

**请求参数**

| 参数名 |  类型  | 必填 | 默认值 | 说明                                                                 |
| :----: | :----: | :--: | :----: | :------------------------------------------------------------------- |
| limit  | Number |  否  |   -    | 本次列举的条目数，范围为 1-1000。默认值为 1000。                     |
| marker | String |  否  |   -    | 上一次列举返回的位置标记，作为本次列举的起点信息。默认值为空字符串。 |
| prefix | String |  否  |   -    | 文件地址前缀（不包含域名）                                           |

**响应参数**

|    字段    |  类型  | 说明                                                         |
| :--------: | :----: | :----------------------------------------------------------- |
|   files    | Array  | 文件列表                                                     |
| directorys | Array  | 目录列表                                                     |
|   marker   | String | 当前位置标记（此值当前仅连接云端时返回，本地调试暂无此参数） |

### 获取域名信息@getdomaininfo

接口名：getDomainInfo

注意：可以获取账号绑定的所有域名的信息

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用getDomainInfo接口时，这里的域名可以随便填，不会生效，但不能为空
});
let getDomainInfoRes = await extStorageManager.getDomainInfo({
  domain: 'example.com', // 这里的域名需要填你自己账号下的扩展存储cdn域名
});
console.log('域名信息：' + getDomainInfoRes.data);
```

**响应参数**

|  字段   |  类型  | 说明                     |
| :-----: | :----: | :----------------------- |
| errCode | Number | 0 代表正确，其他均为错误 |
| errMsg  | String | 错误提示                 |
|  data   | Object | 域名信息                 |

### 修改 referer 防盗链@updatedomainreferer

接口名：updateDomainReferer

**注意**：此为覆盖替换，因此建议先通过 [getDomainInfo](#getdomaininfo) 接口获取域名信息，获取当前已设置的防盗链规则，然后在此基础上修改。

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用updateDomainReferer接口时，这里的域名可以随便填，不会生效，但不能为空
});

// 先获取当前域名信息
let { data: domainInfo } = await extStorageManager.getDomainInfo({
  domain: 'example.com', // 这里的域名需要填你自己账号下的扩展存储cdn域名
});

console.log('当前已设置的防盗链规则: ', domainInfo.referer);
// 表示新增域名 www.bbb.com
domainInfo.referer.refererValues.push('www.bbb.com');

let updateDomainRefererRes = await extStorageManager.updateDomainReferer({
  domain: 'example.com', // 这里的域名需要填你自己账号下的扩展存储cdn域名
  refererType: domainInfo.referer.refererType,
  refererValues: domainInfo.referer.refererValues,
  nullReferer: domainInfo.referer.nullReferer,
});
console.log('updateDomainRefererRes: ', updateDomainRefererRes);
```

**请求参数**

|    参数名     |  类型   | 必填 | 默认值 | 说明                              |
| :-----------: | :-----: | :--: | :----: | :-------------------------------- |
|    domain     | String  |  是  |   -    | 需要操作的扩展存储 cdn 域名       |
|  refererType  | String  |  是  |   -    | 类型，white：白名单 black：黑名单 |
| refererValues |  Array  |  是  |   -    | referer 数组                      |
|  nullReferer  | Boolean |  是  |   -    | 是否允许空的 referer              |

**响应参数**

|  字段   |  类型  | 说明                     |
| :-----: | :----: | :----------------------- |
| errCode | Number | 0 代表正确，其他均为错误 |
| errMsg  | String | 错误提示                 |

### 修改 ip 黑白名单@updatedomainipacl

接口名：updateDomainIpacl

**注意**：此为覆盖替换，因此建议先通过 [getDomainInfo](#getdomaininfo) 接口获取域名信息，获取当前已设置的 ip 黑白名单规则，然后在此基础上修改。

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用updateDomainIpacl接口时，这里的域名可以随便填，不会生效，但不能为空
});

// 先获取当前域名信息
let { data: domainInfo } = await extStorageManager.getDomainInfo({
  domain: 'example.com', // 这里的域名需要填你自己账号下的扩展存储cdn域名
});

console.log('当前已设置的ip黑白名单规则: ', domainInfo.ipACL);
// 表示新增域名 www.bbb.com
domainInfo.ipACL.ipACLValues.push('www.bbb.com');

let updateDomainIpaclRes = await extStorageManager.updateDomainIpacl({
  domain: 'example.com', // 这里的域名需要填你自己账号下的扩展存储cdn域名
  ipACLType: domainInfo.ipACL.ipACLType,
  ipACLValues: domainInfo.ipACL.ipACLValues,
});
console.log('updateDomainIpaclRes: ', updateDomainIpaclRes);
```

**请求参数**

|   参数名    |  类型  | 必填 | 默认值 | 说明                              |
| :---------: | :----: | :--: | :----: | :-------------------------------- |
|   domain    | String |  是  |   -    | 需要操作的扩展存储 cdn 域名       |
|  ipACLType  | String |  是  |   -    | 类型，white：白名单 black：黑名单 |
| ipACLValues | Array  |  是  |   -    | ip 数组                           |

**响应参数**

|  字段   |  类型  | 说明                     |
| :-----: | :----: | :----------------------- |
| errCode | Number | 0 代表正确，其他均为错误 |
| errMsg  | String | 错误提示                 |

### 视频转码@pfop

接口名：pfop

**云端代码**

下方为 `mp4` 转 `m3u8` 格式的示例

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 调用pfop接口时，这里的域名可以随便填，不会生效，但不能为空
});

const urlsafeBase64Encode = (text) => {
  let encoded = Buffer.from(text).toString('base64');
  return encoded.replace(/\//g, '_').replace(/\+/g, '-');
};

let savePattern = urlsafeBase64Encode('transcode/${key}.m3u8.${count}.ts');
let saveas = urlsafeBase64Encode('dc-qiniu-aliyun-mp-a071697e-6402-4c6a-9d2a-79196812197e-eaf');
let saveKey = urlsafeBase64Encode('transcode/${key}.m3u8');
let fops = `avthumb/m3u8/noDomain/1/segtime/15/savePattern/${savePattern}|saveas/${saveas}/savePattern/${saveKey}`;
await extStorageManager.pfop({
  cloudPath: 'test.mp4',
  fops,
  notifyURL: 'https://domain.com/ext-storage-transcode-notice',
});
```

**请求参数**

|  参数名   |  类型  | 必填 | 默认值 | 说明                                                                                                                                   |
| :-------: | :----: | :--: | :----: | :------------------------------------------------------------------------------------------------------------------------------------- |
| cloudPath | String |  是  |   -    | 云端文件地址，支持（fileID、cloudPath、fileURL）<br/>如："qiniu://test.jpg" "test.jpg" "https://example.com/test.jpg" 均表示同一个文件 |
|   fops    | String |  是  |   -    | 转码参数 [详情](https://developer.qiniu.com/dora/1248/audio-and-video-transcoding-avthumb)                                             |
| notifyURL | String |  否  |   -    | 转码成功后的异步回调通知地址                                                                                                           |

**响应参数**

|     字段     |  类型  | 说明                     |
| :----------: | :----: | :----------------------- |
|   errCode    | Number | 0 代表正确，其他均为错误 |
|    errMsg    | String | 错误提示                 |
| persistentId | String | 转码任务 id              |

### 主动查询转码状态@get-pfop-status

```js
let persistentId = 'z0.01z021df5a2xxxxxxxxxxdm0i000ai2';
let res = await uniCloud.httpclient.request(`https://api.qiniu.com/status/get/prefop?id=${persistentId}`, {
  method: 'GET',
  dataType: 'json',
});
let result = res.data;
console.log('result: ', result);
```

**请求参数**

| 参数名 |  类型  | 必填 | 默认值 | 说明                                         |
| :----: | :----: | :--: | :----: | :------------------------------------------- |
|   id   | String |  是  |   -    | 转码任务 id，即 pfop 接口返回的 persistentId |

**调用成功返回示例**

只重点查看有注释的字段即可

```js
{
	"id": "z0.01z021df5a2xxxxxxxxxxdm0i000ai2", // 转码任务id，即pfop接口返回的 persistentId
	"pipeline": "1382959026.default.sys",
	"code": 0,
	"desc": "The fop was completed successfully",
	"reqid": "M-8AAAA6fsipuoMY",
	"inputBucket": "dc-qiniu-aliyun-mp-a071697e-6402-4c6a-9d2a-79196812197e-eaf", // 扩展存储 bucketName
	"inputKey": "test2.mp4", // 转码前的视频云端存储路径
	"items": [{
		"cmd": "avthumb/m3u8/noDomain/1/segtime/15/savePattern/dHJhbnNjb2RlLyR7a2V5fS5tM3U4LiR7Y291bnR9LnRz|saveas/ZGMtcWluaXUtYWxpeXVuLW1wLWEwNzE2OTdlLTY0MDItNGM2YS05ZDJhLTc5MTk2ODEyMTk3ZS1lYWY=/savePattern/dHJhbnNjb2RlLyR7a2V5fS5tM3U4", // 执行的命令
		"code": 0,
		"desc": "The fop was completed successfully",
		"hash": "FqhDcUAXyf4bFa8lAI4evxdjY72d",
		"key": "transcode/test2.mp4.m3u8", // 转码成功后的视频云端存储路径
		"returnOld": 0
	}],
	"creationDate": "2025-12-23T11:31:57.303334639+08:00" // 创建时间
}
```

**调用失败返回示例**

```js
{
	"desc":"mongo: no documents in result",
	"error":"not_found", // 错误原因
	"reqId":"9JIAAABRR7SPu4MY"
}
```

### 转码异步回调通知地址模板@persistent-notify-url

新建云函数，命名：`ext-storage-transcode-notice`

`package.json` 文件内容如下

```js
{
	"name": "ext-storage-transcode-notice",
	"extensions": {
		"uni-cloud-ext-storage": {}
	},
	"cloudfunction-config": {
		"concurrency": 10,
		"memorySize": 512,
		"path": "/ext-storage-transcode-notice",
		"timeout": 60,
		"triggers": [],
		"runtime": "Nodejs18",
		"keepRunningAfterReturn": false
	}
}
```

`index.js` 文件内容如下

```js
'use strict';
const uniCloudExtStorage = require('uni-cloud-ext-storage');

exports.main = async (event = {}, context) => {
  const path = event.path;
  let body = event.body;
  if (event.isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString();
  }
  console.log('body: ', body);
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = false;
    }
  }
  if (!body) {
    console.log('body参数格式错误');
    return { code: -1, msg: '参数格式错误' };
  }
  // 转码异步回调通知处理
  await transcodeNotice(body);
  return {
    code: 0,
  };
};

// 转码异步回调通知处理
async function transcodeNotice(body) {
  /* 
	// 数据示例
	body = {
		"id": "z0.01z001ddphfxlfydup00mvdm0i002v7f", // 此值 = persistentId
		"pipeline": "1382959026.default.sys",
		"code": 0,
		"desc": "The fop was completed successfully",
		"reqid": "fD4AAACH7EpyCnEY",
		"inputBucket": "dc-qiniu-aliyun-xxxxxxxxx-eaf",
		"inputKey": "11/test2.mp4",
		"items": [{
			"cmd": "avthumb/hls/vcodec/libx264/autoscale/1/savePattern/JHtrZXliYXNlfS5tM3U4LiR7Y291bnR9LnRz/maxrate/1000k|saveas/ZGMtcWluaXUtYWxpeXVuLW1wLWEwNzE2OTdlLTY0MDItNGM2YS05ZDJhLTc5MTk2ODEyMTk3ZS1lYWY=/savePattern/JHtrZXliYXNlfS5tM3U4",
			"code": 0,
			"desc": "The fop was completed successfully",
			"hash": "FkuA5g0vXq5-vpuDxGyJIGWgUjIS",
			"key": "11/test2.m3u8",
			"returnOld": 0
		}],
		"creationDate": "2025-10-23T14:20:16.048291267+08:00"
	} 
	*/
  let {
    id, // 持久化处理的进程ID，即转码任务id
    pipeline, // 转码使用的处理队列名称
    code, // 状态码0成功，1等待处理，2正在处理，3处理失败。
    desc, // 	与状态码相对应的详细描述。
    reqid, // 请求id
    inputBucket, // 写入的bucket名
    inputKey, // 转码前的文件云端地址
    items,
    creationDate, // 云处理请求的提交时间。格式 "2025-10-23T14:20:16.048291267+08:00"
  } = body;

  const {
    key, // 转码后的文件云端地址
  } = items[0];

  if (code !== 0) {
    console.log('转码失败', code, desc);
    return;
  }

  console.log('转码前的文件云端地址: ', inputKey);
  console.log('转码后的文件云端地址: ', key);

  const extStorageManager = uniCloud.getExtStorageManager({
    provider: 'qiniu', // 扩展存储供应商
    domain: 'example.com', // 域名地址，此处的域名无需更改
  });

  let deleteFileRes = await extStorageManager.deleteFile({
    fileList: [`qiniu://${inputKey}`], // 删除转码前的源文件
  });
  console.log('deleteFileRes: ', deleteFileRes);

  // 这里可以增加你的其他逻辑，比如替换数据库里的url等
}
```

补全 `ext-storage-transcode-notice` 函数内自定义逻辑后，最后上传云函数即可

## 以下 API 仅云端运行支持

以下 API 暂不支持本地运行，只能云端运行才能调用

## 小程序域名白名单@mp-whitelist

小程序需要添加域名白名单，否则无法正常使用

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/b6debafc-06ed-4505-82b4-303cf96e5e65.png)

### 上传域名@mp-whitelist-uploadfile

将下方域名添加到小程序的 uploadFile 合法域名列表中

```
https://upload.qiniup.com
```

### 下载域名@mp-whitelist-download

下载域名就是你开通扩展存储时绑定的自定义域名，将你的自定义域名添加到 download 合法域名列表中

## 托管 Web 静态站点@web-site

扩展存储已支持托管 Web 静态站点，且根目录下的站点支持 history 模式，可以解决支付宝云内置前端托管不支持 history 的问题

### 通过 HBuilderX 上传@web-site-hbx

::: warning 注意
需要 HBuilderX 5.0+ 的版本才能进行此操作，如低于此版本，请在[uniCloud 控制台上传](#web-site-console)
:::

按下图所示操作即可

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/17da3752-9cf3-4099-b2e8-7e101ce9d250.png)

**注意**：非首次上传时，需要刷新缓存才能生效，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/59e26c97-a1b5-415d-b80e-44cdb0c07758.png)

### 通过 uniCloud 控制台上传@web-site-console

**部署流程**

**如果您使用的 HBuilderX 版本低于 5.0，需要按下面的操作进行**

1. 点击 HBuilderX 上方【发行】菜单 - 【网站-PC Web 或手机 H5】，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/74ea64b0-ffa7-47c9-aee6-80b169933a6a.png)

2. 出现确认弹窗后，直接点【发行】按钮

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/064c479e-3134-47e0-a901-6b83ad0963bb.png)

3. 等待编译完成后，复制编译产物目录路径地址，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/18bdfb98-31fd-438f-a06d-db63d203b11b.png)

4. 打开 uniCloud 控制台 - 选择空间 - 扩展存储-七牛云 - 上传到当前目录 - 上传 Web 静态网站到当前目录

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/c1c6aeb1-36c5-4957-bb6a-14e745607def.png)

5. 粘贴第 3 步复制的路径，然后点上传按钮

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/6322d63e-b13d-40a0-b553-539381027c03.png)

**注意**：非首次上传时，需要刷新缓存才能生效，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/59e26c97-a1b5-415d-b80e-44cdb0c07758.png)

### history 模式注意事项@history-tips

扩展存储仅根目录的站点可以实现 history 模式，且需要在根目录多上传一个名为 `errno-404` 的文件，文件内容和 `index.html` 内容完全一致。

提示：当你在 uniCloud 控制台上传时会自动生成 `errno-404` 的文件，无需特殊处理。

## 图片处理@imageshandle

### 图片瘦身@imageslim

**简介**

图片瘦身服务（imageslim）在尽可能不影响画质的情况下，将 JPEG、PNG 格式的图片实时压缩，瘦身后画质基本没有变化，分辨率不变，格式不变，大幅缩小文件体积：

- 降低 CDN 分发成本
- 加快客户端图片的加载速度，提升用户体验

**使用限制**

- 原图限制
  - 格式支持： JPEG、PNG 格式
  - 对图片大小/分辨率没有限制，处理异常（处理超时、处理后图片大小大于原图、处理出错等）则返回原图
- jpeg 图片瘦身
  - 同步请求超时限制为 1s
  - 异步请求的超时限制为 10s
- png 图片瘦身
  - 同步请求超时限制为 3s
  - 异步请求的超时限制为 30s
- 建议「图片瘦身」操作放在所有其他图片处理操作之后
- 如果原图本身大小并不大，使用图片瘦身后可能没有瘦身效果，反而会增大

**接口规格**

```
imageslim/zlevel/<zlevel>
```

| 参数名称           | 必填 | 说明                                                                           |
| :----------------- | :--- | :----------------------------------------------------------------------------- |
| `/zlevel/<zlevel>` | 否   | 图片质量损失控制，值越小，质量越好，压缩率越低。默认值为 3，取值范围：[0-10]。 |

**使用示例**

原图

```
http://7xkv1q.com1.z0.glb.clouddn.com/grape.jpg
```

瘦身后

```
http://7xkv1q.com1.z0.glb.clouddn.com/grape.jpg?imageslim
```

瘦身后并控制质量损失

```
http://7xkv1q.com1.z0.glb.clouddn.com/grape.jpg?imageslim/zlevel/2
```

**瘦身前后图片对比**

- 画质基本不变
- 格式不变
- 分辨率不变
- 图片文件体积大幅减少，有助于节省 CDN 流量、提升用户体验

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/500.png)

### 图片基本处理@imageview2

| 功能     | 说明                                 |
| :------- | :----------------------------------- |
| 缩略     | 等比缩放、设定目标宽高缩放等多种方式 |
| 格式转换 | 格式转换、GIF 颜色控制               |
| 渐进显示 | 图片渐进显示                         |
| 质量变换 | 对图片质量进行调节                   |

**限制说明**

使用服务时有如下限制：

- 原图格式支持： psd、jpeg、png、gif、webp、tiff、bmp、avif、heic
  - webp 动图，仅支持持久化处理
- 输出限制
  - 输出为 `gif`，一般处理时间比较长，建议优先使用持久化处理
  - 输出为 `webp` 时，宽或高不能超过 16383
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理
  - 图片文件大小没有限制
  - 处理前的 `gif`、`webp动图`，最大帧数为 500
  - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素

**接口规格**

注意：接口规格不含任何空格与换行符

```
imageView2/<mode>/w/<LongEdge>
								 /h/<ShortEdge>
								 /format/<Format>
								 /interlace/<Interlace>
								 /q/<Quality>
								 /colors/<colors>
								 /ignore-error/<ignoreError>
```

**参数说明**

| 参数名称                                                                                                                                                                                                                                                                                                                                                                           | 必填           | 说明                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /mode #{rowspan=7}                                                                                                                                                                                                                                                                                                                                                                 | 是#{rowspan=7} | 定义等比缩放、设定目标宽高缩放的多种不同方式，取值范围：[0,5]的整数，必填项。分为如下几种情况：                                                                                                                                                                                                                                                                                                                       |
| mode=0，使用姿势：`/0/w/<LongEdge>/h/<ShortEdge>`<br/> 1、限定缩略图的长边最多为`<LongEdge>`，短边最多为 `<ShortEdge>`，进行等比缩放，不裁剪。<br/> 2、如果只指定 w 参数则表示限定长边（短边自适应），只指定 h 参数则表示限定短边（长边自适应）。                                                                                                                                  |
| mode=1，使用姿势：`/1/w/<LongEdge>/h/<ShortEdge>	`<br/>1、限定缩略图的宽最少为`<LongEdge>`，高最少为`<ShortEdge>`，进行等比缩放，居中裁剪。<br/>2、转后的缩略图通常恰好是 `<LongEdge>x<ShortEdge>` 的大小（有一个边缩放的时候会因为超出矩形框而被裁剪掉多余部分）。<br/>3、如果只指定 w 参数或只指定 h 参数，代表限定为长宽相等的正方图。                                           |                |
| mode=2，使用姿势：`/2/w/<LongEdge>/h/<ShortEdge>`<br/> 1、限定缩略图的长边最少为`<LongEdge>`，短边最少为`<ShortEdge>`，进行等比缩放，不裁剪。<br/>2、如果只指定 w 参数则表示限定宽（高自适应），只指定 h 参数则表示限定高（宽自适应）。<br/>3、它和模式 0 类似，区别只是限定宽和高，不是限定长边和短边。从应用场景来说，模式 0 适合移动设备上做缩略图，模式 2 适合 PC 上做缩略图。 |                |
| mode=3，使用姿势：`/3/w/<LongEdge>/h/<ShortEdge>	`<br/>1、限定缩略图的长边最少为`<LongEdge>`，短边最少为`<ShortEdge>`，进行等比缩放，不裁剪。<br/>2、如果只指定 w 参数或只指定 h 参数，代表长宽限定为同样的值。你可以理解为模式 1 是模式 3 的结果再做居中裁剪得到的。                                                                                                               |                |
| mode=4，使用姿势：`/4/w/<LongEdge>/h/<ShortEdge>`<br/>1、限定缩略图的长边最少为`<LongEdge>`，短边最少为`<ShortEdge>`，进行等比缩放，不裁剪。<br/>2、如果只指定 w 参数或只指定 h 参数，表示长边短边限定为同样的值。这个模式很适合在手持设备做图片的全屏查看（把这里的长边短边分别设为手机屏幕的分辨率即可），生成的图片尺寸刚好充满整个屏幕（某一个边可能会超出屏幕）。             |                |
| mode=5，使用姿势：`/5/w/<LongEdge>/h/<ShortEdge>	`<br/>1、限定缩略图的长边最少为`<LongEdge>`，短边最少为`<ShortEdge>`，进行等比缩放，居中裁剪。<br/>2、如果只指定 w 参数或只指定 h 参数，表示长边短边限定为同样的值。同上模式 4，但超出限定的矩形部分会被裁剪。                                                                                                                     |                |
| `/format/<Format>`                                                                                                                                                                                                                                                                                                                                                                 | 否             | 图片输出格式 <br/>1、取值：copy，保持原图格式输出。<br/>2、取值：jpg，gif，png，webp 等，参考支持转换的图片格式。<br/>3、取值：heic 或 avif ，属于 图片高级压缩 格式，按照图片高级压缩收费，当前仅支持 持久化处理 来使用。 <br/>注意：<br/>● 必须指定 mode 参数，否则不生效。<br/>● 当原图为 heic 或 avif 时，设置 format/copy 会保持原图格式不变，且不按照图片高级压缩收费；如果不指定 format 参数，将会输出 jpeg 。 |
| `/colors/<colors>`                                                                                                                                                                                                                                                                                                                                                                 | 否             | 控制图片颜色数量 <br/>● 源图片为 GIF 时，控制输出 GIF 中不同颜色的数量，取值可为 2、4、8、16、32、64、128、256，不使用该参数时的默认值为 128。<br/>● 输出图片为 PNG 时，控制输出 PNG 中不同颜色的数量，取值可为 2、4、8、16、32、64、128、256，不使用该参数时默认关闭。<br/>注意：<br/>● 必须指定 mode 参数，否则不生效。<br/>● 如果只设置图片颜色数量，不做其他缩放处理，建议使用 图片高级处理-格式转换              |
| `/interlace/<Interlace>`                                                                                                                                                                                                                                                                                                                                                           | 否             | 是否支持渐进显示 <br/>取值范围：1 支持渐进显示，0 不支持渐进显示(默认为 0)。<br/>适用目标格式：jpg <br/>效果：网速慢时，图片显示由模糊到清晰。新图的输出格式，必须指定 mode 参数，否则不生效。<br/>注意： <br/>● 必须指定 mode 参数，否则不生效。<br/>● 如果只设置渐渐显示，不做其他缩放处理，建议使用 图片高级处理-渐进显示                                                                                          |
| `/q/<Quality>`                                                                                                                                                                                                                                                                                                                                                                     | 否             | 新图的图片质量 <br/>● 取值范围是[1, 100]<br/>● 输入是 jpeg，且不强制指定质量条件下，七牛会根据原图质量算出一个修正值，取修正值和指定值中的小值。<br/>注意：<br/>● 必须指定 mode 参数，否则不生效。<br/>● 指定值后面可以增加 !，表示强制使用指定值，如 100!。<br/>● heic：默认值 35 <br/>● avif：默认值 50 <br/>● 其他格式：默认值 75 <br/>● 如果只设置图片质量，不做其他缩放处理，建议使用 图片高级处理-质量变换      |
| `/ignore-error/<ignoreError>`                                                                                                                                                                                                                                                                                                                                                      | 否             | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息。<br/>注意：<br/>● 必须指定 mode 参数，否则不生效。                                                                                                                                                                                                                                            |

**注意：**

- 所有模式都可以只指定 w 参数或只指定 h 参数，并获得合理结果。在 w、h 为限定最大值时，未指定某参数等价于将该参数设置为无穷大（自适应）；在 w、h 为限定最小值时，未指定参数等于给定的参数，也就限定的矩形是正方形。
- 新图的宽/高/长边/短边，不会比原图大，即本接口总是 缩小图片。
- 如果原图带有 EXIF 信息且包含 Orientation 字段且不能被识别出来，imageView2 默认根据此字段的值进行自动旋转修正。
- 当一张含有透明区域的图片，转换成不支持透明的格式 jpg,bmp 等时，透明区域填充白色。
- `<Quality>`修正值算法：
  - 原图 quality <= 90：min[90, 原图 quality*sqrt（原图长宽乘积/结果图片长宽乘积）]
  - 原图 quality > 90： 原图 quality\*sqrt（原图长宽乘积/结果图片长宽乘积)

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

裁剪正中部分，等比缩小生成 200x200 缩略图：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageView2/1/w/200/h/200
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/17109358584645tjjceskb3.png)

宽度固定为 200px，高度等比缩小，生成 200x133 缩略图：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageView2/2/w/200
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/17110086294401t8kfttnl9.png)

高度固定为 200px，宽度等比缩小，生成 300x200 缩略图：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageView2/2/h/200
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1710935922984avaq0pgbshg.png)

设置图片质量为 55：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageView2/1/w/200/h/200/q/55
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1710935960936r3a3aa4ge88.png)

### 图片高级处理@imagemogr2

#### 缩放@imagemogr2-thumbnail

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/thumbnail/!<Scale>p
          /thumbnail/!<Scale>px
          /thumbnail/!x<Scale>p
          /thumbnail/<Width>x
          /thumbnail/x<Height>
          /thumbnail/<Width>x<Height>
          /thumbnail/!<Width>x<Height>r
          /thumbnail/<Width>x<Height>!
          /thumbnail/<Width>x<Height>>
          /thumbnail/<Width>x<Height><
          /thumbnail/<Area>@
          /ignore-error/<ignoreError>
```

| 参数名称                        | 必填 | 说明                                                                                                                                                                                |
| :------------------------------ | :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/thumbnail/!<Scale>p`          |      | 基于原图的长宽，按指定百分比缩放。Scale 取值范围 1-999。                                                                                                                            |
| `/thumbnail/!<Scale>px`         |      | 以百分比形式指定目标图片宽度，高度不变。Scale 取值范围 1-999。                                                                                                                      |
| `/thumbnail/!x<Scale>p`         |      | 以百分比形式指定目标图片高度，宽度不变。Scale 取值范围 1-999。                                                                                                                      |
| `/thumbnail/<Width>x`           |      | 指定目标图片宽度，高度等比缩放，Width 取值范围 1-9999。                                                                                                                             |
| `/thumbnail/x<Height>`          |      | 指定目标图片高度，宽度等比缩放，Height 取值范围 1-9999。                                                                                                                            |
| `/thumbnail/<Width>x<Height>`   |      | 等比缩放，比例值为宽缩放比和高缩放比的较小值，Width 和 Height 取值范围 1-9999。<br/>注意： 宽缩放比：目标宽/原图宽 高缩放比：目标高/原图高                                          |
| `/thumbnail/!<Width>x<Height>r` |      | 等比缩放，比例值为宽缩放比和高缩放比的较大值，Width 和 Height 取值范围 1-9999。<br/>注意： 宽缩放比：目标宽/原图宽 高缩放比：目标高/原图高                                          |
| `/thumbnail/<Width>x<Height>!`  |      | 按指定宽高值强行缩略，可能导致目标图片变形，width 和 height 取值范围 1-9999。                                                                                                       |
| `/thumbnail/<Width>x<Height>>`  |      | 等比缩小，比例值为宽缩放比和高缩放比的较小值。如果目标宽和高都大于原图宽和高，则不变，Width 和 Height 取值范围 1-9999。<br/>注意： 宽缩放比：目标宽/原图宽 高缩放比：目标高/原图高; |
| `/thumbnail/<Width>x<Height><`  |      | 等比放大，比例值为宽缩放比和高缩放比的较小值。如果目标宽(高)小于原图宽(高)，则不变，Width 和 Height 取值范围 1-9999。<br/>注意： 宽缩放比：目标宽/原图宽 高缩放比：目标高/原图高;   |
| `/thumbnail/<Area>@`            |      | 按原图高宽比例等比缩放，缩放后的像素数量不超过指定值，Area 取值范围 1-24999999。                                                                                                    |
| `/ignore-error/<ignoreError>`   |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息                                                              |

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

等比缩小至 20%

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/!20p
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/!20p)

等比缩小到宽为 200px

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/200x
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/200x)

等比缩小到高为 200px

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/x200
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/x200)

限定长边，生成不超过 200x200 的缩略图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/200x200
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/200x200)

限定短边，生成不小于 200x200 的缩略图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/!200x200r
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/!200x200r)

强制生成 200x200 的缩略图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/200x200!
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/200x200!)

原图大于指定长宽矩形，按长边自动缩小为 200x200 缩略图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/200x200>
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/200x200)

原图小于指定长宽矩形，按长边自动拉伸为 700x600 放大图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/700x600<
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/700x600<)

生成图的像素总数小于指定值

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/350000@
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/350000@)

#### 裁剪@imagemogr2-crop

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/crop
```

裁剪操作参数表 (cropsize)

| 参数名称                      | 必填 | 说明                                                                                                                     |
| :---------------------------- | :--- | :----------------------------------------------------------------------------------------------------------------------- |
| `/crop/<Width>x`              |      | 指定目标图片宽度，高度不变。取值范围为 0-10000。                                                                         |
| `/crop/x<Height>`             |      | 指定目标图片高度，宽度不变。取值范围为 0-10000。                                                                         |
| `/crop/<Width>x<Height>`      |      | 同时指定目标图片宽高。取值范围为 0-10000。                                                                               |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息。 |

裁剪偏移参数表 (cropoffset)

| 参数名称                      | 必填 | 说明                                                                                                         |
| :---------------------------- | :--- | :----------------------------------------------------------------------------------------------------------- |
| `/crop/!{cropsize}a<dx>a<dy>` |      | 相对于偏移锚点，向右偏移 dx 个像素，同时向下偏移 dy 个像素。取值范围不限，小于原图宽高即可。                 |
| `/crop/!{cropsize}-<dx>a<dy>` |      | 相对于偏移锚点，从指定宽度中减去 dx 个像素，同时向下偏移 dy 个像素。取值范围不限，小于原图宽高即可。         |
| `/crop/!{cropsize}a<dx>-<dy>` |      | 相对于偏移锚点，向右偏移 dx 个像素，同时从指定高度中减去 dy 个像素。取值范围不限，小于原图宽高即可。         |
| `/crop/!{cropsize}-<dx>-<dy>` |      | 相对于偏移锚点，从指定宽度中减去 dx 个像素，同时从指定高度中减去 dy 个像素。取值范围不限，小于原图宽高即可。 |

示例

- /crop/!300x400a10a10 表示从源图坐标为 x:10,y:10 处截取 300x400 的子图片。
- /crop/!300x400-10a10 表示从源图坐标为 x:0,y:10 处截取 290x400 的子图片。

注意

- 必须同时指定横轴偏移和纵轴偏移。
- thumbnail 和 crop 之间的操作可以管道处理，即可以先对图进行缩略再裁剪，或者先裁剪再缩略。
- gravity 会使其后的裁剪偏移 cropoffset 受到影响，建议放在 /crop 参数之前。
- 计算偏移值会受到位置偏移指示符 /gravity/ 的影响。默认为相对于左上角 NorthWest 计算偏移值，参考 重心参数表。

重心参数表

在图片高级处理现有的功能中只影响其后的裁剪操作参数表，即裁剪操作以 gravity 为原点开始偏移后，进行裁剪操作。

```
NorthWest     |     North      |     NorthEast
              |                |
              |                |
--------------+----------------+--------------
              |                |
West          |     Center     |          East
              |                |
--------------+----------------+--------------
              |                |
              |                |
SouthWest     |     South      |     SouthEast
```

转义说明

部分参数以 ! 开头，表示参数将被转义。为便于阅读，我们采用特殊转义方法，如下所示：

```
p => % (percent)
r => ^ (reverse)
a => + (add)
```

即!50x50r 实际代表 50x50^ 这样一个字符串。而!50x50 实际代表 50x50 这样一个字符串（该字符串并不需要转义）。 中的 OffsetGeometry 部分可以省略，默认为 +0+0。即 /crop/50x50 等价于 /crop/!50x50a0a0，执行 -crop 50x50+0+0 语义。

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

限定宽最大 300，生成裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/crop/300x
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/crop/300x)

限定高最大 300，生成裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/200x
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/200x)

等比缩小到高为 200px

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/x200
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/x200)

生成固定 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/crop/300x300)

生成 300x300 裁剪图，偏移距离 30x100

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/crop/!300x300a30a100
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/crop/!300x300a30a100)

生成 300x200 裁剪图，偏移距离 30x0

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/crop/!300x300a30-100
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/crop/!300x300a30-100)

生成 270x300 裁剪图，偏移距离 0x100

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/crop/!300x300-30a100
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/crop/!300x300-30a100)

生成 270x200 裁剪图，偏移距离 0x0

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/crop/!300x300-30-100
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/crop/!300x300-30-100)

锚点在左上角 (NorthWest)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/NorthWest/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/NorthWest/crop/300x300)

锚点在正上方 (North)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/North/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/North/crop/300x300)

锚点在右上角 (NorthEast)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/NorthEast/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/NorthEast/crop/300x300)

锚点在正左方 (West)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/West/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/West/crop/300x300)

锚点在正中 (Center)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/Center/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/Center/crop/300x300)

锚点在正右方 (East)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/East/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/East/crop/300x300)

锚点在左下角 (SouthWest)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/SouthWest/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/SouthWest/crop/300x300)

锚点在正下方 (South)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/South/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/South/crop/300x300)

锚点在右下角 (SouthEast)，生成 300x300 裁剪图

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/gravity/SouthEast/crop/300x300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/gravity/SouthEast/crop/300x300)

#### 格式转换@imagemogr2-format

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/format/<Format>
          /colors/<colors>
          /ignore-error/<ignoreError>
```

参数说明

| 参数名称                      | 必填 | 说明                                                                                                                                                                                                                                                                                                                                                  |
| :---------------------------- | :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/format/<Format>`            |      | 新图的输出格式<br/>1、取值：jpg，gif，png，webp 等，参考 支持转换的图片格式。<br/>2、取值：heic 或 avif ，属于 图片高级压缩 格式，按照图片高级压缩收费，当前仅支持 持久化处理 来使用。<br/>3、取值：缺省，默认保持原图格式输出。<br/>注意：<br/>● 必须指定 mode 参数，否则不生效。<br/>● 当原图为 heic 或 avif 时，如果 format 值缺省，会输出 jpeg 。 |
| `/colors/<colors>`            |      | 1、源图片为 GIF 时，控制输出 GIF 中不同颜色的数量，取值可为 2、4、8、16、32、64、128 或 256，不使用该参数时的默认值为 128。<br/>2、输出图片为 PNG 时，控制输出 PNG 中不同颜色的数量，取值可为 2、4、8、16、32、64、128 或 256，不使用该参数时默认关闭。                                                                                               |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息。                                                                                                                                                                                                                              |

注意

- 当一张含有透明区域的图片，转换成不支持透明区域的图片格式 jpg、bmp 等时，透明区域填充白色。

**使用示例**

转为 png 格式

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/format/png
```

#### 渐进显示@imagemogr2-interlace

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/interlace/<Interlace>
          /ignore-error/<ignoreError>
```

参数说明

| 参数名称                      | 必填 | 说明                                                                                                                                          |
| :---------------------------- | :--- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `/interlace/<Interlace>`      |      | 是否支持渐进显示<br/>取值范围：1 支持渐进显示，0 不支持渐进显示(默认为 0)。<br/>适用目标格式：jpg <br/>效果：网速慢时，图片显示由模糊到清晰。 |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息。                      |

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

原图转为 png 后，并渐进显示图片：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/format/png/interlace/1
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/format/png/interlace/1)

原图缩放后，并渐进显示图片：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/thumbnail/300x300/interlace/1
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/thumbnail/300x300/interlace/1)

#### 背景色填充@imagemogr2-background

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/background/<background>
          /ignore-error/<ignoreError>
```

**参数说明**

| 参数名称                              | 必填 | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :------------------------------------ | :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------- |
| `/background/<background>`            |      | 填充背景颜色，可以是颜色名称（比如 red）或十六进制颜色（比如#FF0000）的 URL 安全的 Base64 编码。我们支持的颜色名称有 transparent（#00000000）、none（#00000000）、white（#FFFFFF）、black（#000000）、red（#FF0000）、orange（#FFA500）、yellow（#FFFF00）、green（#008000）、blue（#0000FF）、purple（#800080）、gray（#7E7E7E）、pink（#FFC0CB），其中 none 与 transparent 均为透明背景色，另外十六进制颜色不区分大小写，具体颜色请参考颜色编码表。缺省背景色为 white（#FFFFFF）。 |
| `/extent/<extent>`                    |      | 背景颜色填充的大小和偏移，即 {size}{offset}。 <br/>注意：dx、dy 取值范围不限，小于原图宽高即可。示例如下：                                                                                                                                                                                                                                                                                                                                                                           | <br/>1、/extent/!642x492a10a10 ，表示相对原图左上角，向右偏移 10，向下偏移 10，填充 642x492 大小的背景颜色。 | <br/>2、/extent/!642x492-10-10 ，表示相对原图左上角，向左偏移 10，向上偏移 10，填充 642x492 大小的背景颜色。 | <br/>注意：dx、dy 取值范围不限，小于原图宽高即可。示例如下： | <br/>1、/extent/!642x492a10a10 ，表示相对原图左上角，向右偏移 10，向下偏移 10，填充 642x492 大小的背景颜色。 | <br/>2、/extent/!642x492-10-10 ，表示相对原图左上角，向左偏移 10，向上偏移 10，填充 642x492 大小的背景颜色。 | <br/>具体参数如下： |
| `/extent/<Width>x<height>`            |      | 相对于原图中心位置，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `/extent/<Width>x<height>a<dx>a<dy>`  |      | 相对于原图左上角，向右偏移 dx 个像素，同时向下偏移 dy 个像素，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                               |
| `/extent/!<Width>x<height>-<dx>-<dy>` |      | 相对于原图左上角，向左偏移 dx 个像素，同时向上偏移 dy 个像素，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                               |
| `/extent/!<Width>x<height>-<dx>a<dy>` |      | 相对于原图左上角，向左偏移 dx 个像素，同时向下偏移 dy 个像素，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                               |
| `/extent/!<Width>x<height>a<dx>-<dy>` |      | 相对于原图左上角，向右偏移 dx 个像素，同时向上偏移 dy 个像素，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                               |
| `/extent/!-<dx>a<dy>`                 |      | 相对于原图左上角，向左偏移 dx 个像素，同时向下偏移 dy 个像素，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                               |
| `/extent/!a<dx>-<dy>`                 |      | 相对于原图左上角，向右偏移 dx 个像素，同时向上偏移 dy 个像素，填充指定大小的背景颜色。                                                                                                                                                                                                                                                                                                                                                                                               |
| `/bordercolor/<bordercolor>`          |      | 填充背景颜色，可以是颜色名称（比如 red）或十六进制颜色（比如#FF0000）的 URL 安全的 Base64 编码。我们支持的颜色名称有 transparent（#00000000）、none（#00000000）、white（#FFFFFF）、black（#000000）、red（#FF0000）、orange（#FFA500）、yellow（#FFFF00）、green（#008000）、blue（#0000FF）、purple（#800080）、gray（#7E7E7E）、pink（#FFC0CB），其中 none 与 transparent 均为透明背景色，另外十六进制颜色不区分大小写，具体颜色请参考颜色编码表。缺省背景色为 white（#FFFFFF）。 |
| `/border/<width>x<height>`            |      | 相对于原图中心位置，填充指定大小的背景颜色。输出图像宽高为(OriWidth+2width) x（OriHeight + 2 height）<br/>使用示例：http://rnjirg2hf.sabkt.gdipper.com/gogopher111.jpeg?imageMogr2/border/10x10/bordercolor/cmVk                                                                                                                                                                                                                                                                     |
| `/ignore-error/<ignoreError>`         |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息。                                                                                                                                                                                                                                                                                                                                                             |

**转义说明**

部分参数以 ! 开头，表示参数将被转义。为便于阅读，我们采用特殊转义方法，如下所示：

```
p => % (percent)
r => ^ (reverse)
a => + (add)
```

即 `!50x50r` 实际代表 50x50 这样一个字符串。而 `!50x50`实际代表 50x50 这样一个字符串（该字符串并不需要转义）。 `<ImageSizeAndOffsetGeometry>` 中的 OffsetGeometry 部分可以省略，默认为 +0+0。即 /extent/50x50 等价于 /extent/!50x50a0a0。

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

旋转并添加背景色：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/auto-orient/thumbnail/!256x256r/gravity/center/crop/!256x256/blur/3x9/quality/80/rotate/45/background/b3Jhbmdl
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/auto-orient/thumbnail/!256x256r/gravity/center/crop/!256x256/blur/3x9/quality/80/rotate/45/background/b3Jhbmdl)

添加 1 像素的红色边框：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/extent/!642x429/background/cmVk
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/extent/!642x429/background/cmVk)

左边填充 3 像素的红色边框：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/extent/!-3a0/background/cmVk
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/extent/!-3a0/background/cmVk)

自适应填充背景色：

```
http://rnjirg2hf.sabkt.gdipper.com/gogopher111.jpeg?imageMogr2/border/10x10/bordercolor/cmVk
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/border/10x10/bordercolor/cmVk)

图片右边填充 3 像素的红色边框：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/extent/!a3-0/background/cmVk
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/extent/!a3-0/background/cmVk)

图片上方填充 3 像素的红色边框：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/extent/!a0-3/background/cmVk
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/extent/!a0-3/background/cmVk)

图片下方填充 3 像素的红色边框：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/extent/!-0a3/background/cmVk
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/extent/!-0a3/background/cmVk)

#### 旋转@imagemogr2-rotate

**限制说明**

- 原图格式支持：psd、jpeg、png、gif、webp、tiff、bmp、avif、heic
  - webp 动图，仅支持持久化处理
- 输出限制
  - 输出为 gif，一般处理时间比较长，建议优先使用持久化处理
  - 输出为 webp 时，宽或高不能超过 16383
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理
  - 图片文件大小没有限制
  - 处理前的 `gif`、`webp动图`，最大帧数为 500
  - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/auto-orient
          /rotate/<rotate>
          /ignore-error/<ignoreError>
```

**参数说明**

| 参数名称                      | 必填 | 说明                                                                                                                   |
| :---------------------------- | :--- | :--------------------------------------------------------------------------------------------------------------------- |
| `/auto-orient`                |      | 自适应旋转：与图像处理顺序相关，建议放在首位，根据原图 EXIF 信息自动旋正，便于后续处理。                               |
| `/rotate/<rotate>`            |      | 普通旋转：图片顺时针旋转角度，取值范围为 1-360，默认为不旋转。                                                         |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息 |

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

顺时针旋转 45 度：

```
 https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/rotate/45
```

![](https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/rotate/45)

#### 高斯模糊@imagemogr2-blur

**限制说明**

- 原图格式支持：psd、jpeg、png、gif、webp、tiff、bmp、avif、heic
  - webp 动图，仅支持持久化处理
- 输出限制
  - 输出为 gif，一般处理时间比较长，建议优先使用持久化处理
  - 输出为 webp 时，宽或高不能超过 16383
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理
  - 图片文件大小没有限制
  - 处理前的 `gif`、`webp动图`，最大帧数为 500
  - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/blur/<blur>
          /ignore-error/<ignoreError>
```

**参数说明**

| 参数名称                      | 必填 | 说明                                                                                                                      |
| :---------------------------- | :--- | :------------------------------------------------------------------------------------------------------------------------ |
| `/blur/<blur>`                |      | 高斯模糊参数。radius 是模糊半径，取值范围为 1-50。sigma 是正态分布的标准差，必须大于 0。图片格式为 gif 时，不支持该参数。 |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/> 不设置此参数，默认处理失败时返回错误信息   |

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

半径为 3，Sigma 值为 5：

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/blur/3x5
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/blur/3x5)

#### 锐化@imagemogr2-sharpen

**限制说明**

- 原图格式支持：psd、jpeg、png、gif、webp、tiff、bmp、avif、heic
  - webp 动图，仅支持持久化处理
- 输出限制
  - 输出为 gif，一般处理时间比较长，建议优先使用持久化处理
  - 输出为 webp 时，宽或高不能超过 16383
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理
  - 图片文件大小没有限制
  - 处理前的 `gif`、`webp动图`，最大帧数为 500
  - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/sharpen/<sharpen>
          /ignore-error/<ignoreError>
```

**参数说明**

| 参数名称                      | 必填 | 说明                                                                                                                   |
| :---------------------------- | :--- | :--------------------------------------------------------------------------------------------------------------------- |
| `/sharpen/<sharpen>`          |      | 图片是否锐化，当设置值为 1 时打开锐化效果。                                                                            |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息 |

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

设置锐化参数为 1，进行锐化处理

```
https://dn-odum9helk.qbox.me/resource/gogopher.jpg?imageMogr2/sharpen/1
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/sharpen/1)

#### 图像 DPI@imagemogr2-density

**限制说明**

- 原图格式支持：psd、jpeg、png、gif、webp、tiff、bmp
  - webp 动图，仅支持持久化处理
- 输出限制
  - 输出为 gif，一般处理时间比较长，建议优先使用持久化处理
  - 输出为 webp 时，宽或高不能超过 16383
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理
  - 图片文件大小没有限制
  - 处理前的 `gif`、`webp动图`，最大帧数为 500
  - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素

**接口规格**

注意：接口规格不含任何空格与换行符。

```
imageMogr2/density/<density>
          /ignore-error/<ignoreError>
```

**参数说明**

| 参数名称                      | 必填 | 说明                                                                                                                   |
| :---------------------------- | :--- | :--------------------------------------------------------------------------------------------------------------------- |
| `density/<density>`           |      | 图像 DPI 值的修改值范围：1-1200，默认为原图 DPI 值。                                                                   |
| `/ignore-error/<ignoreError>` |      | 主要针对图片兼容性的问题导致无法处理，取值为 1 时，则处理失败时返回原图；<br/>不设置此参数，默认处理失败时返回错误信息 |

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

设置输出分辨率为 300DPI，进行处理。

```
https://dora-doc.qiniu.com/gogopher.jpg?imageMogr2/density/300
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?imageMogr2/density/300)

### 图片基本信息@imageinfo

**简介**

图片基本信息包括图片格式、图片大小、色彩模型。

**限制说明**

- 原图支持 20MB 以内的图片

**接口规格**

```
imageInfo
```

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

获取图片基本信息

```
https://dora-doc.qiniu.com/gogopher.jpg?imageInfo
```

返回结果（内容经过格式化以便阅读）：

```js
{
	size: 214513,
	format: "jpeg",
	width: 640,
	height: 427,
	colorModel: "ycbcr",
	orientation: "Top-left"
}
```

| 字段名称    | 必填 | 说明                                  |
| :---------- | :--- | :------------------------------------ |
| size        | 是   | 文件大小，单位：Bytes                 |
| format      | 是   | 图片类型，如 png、jpeg、gif、bmp 等。 |
| width       | 是   | 图片宽度，单位：像素(px)。            |
| height      | 是   | 图片高度，单位：像素(px)。            |
| colorModel  | 是   | 色彩模型，如 palette16、ycbcr 等。    |
| frameNumber |      | 帧数，gif 图片会返回此项              |

### 图片 EXIF 信息@image-exifinfo

**简介**

EXIF(EXchangeable Image File Format) 是专门为数码相机的照片设定的可交换图像文件格式。

**限制说明**

- 缩略图等经过云处理的新图片不支持 EXIF
- 原图格式为 avif、heif 不支持 EXIF
- 原图只支持 20MB 以内的图片

**接口规格**

```
exif
```

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

获取图片 EXIF 信息

```
https://dora-doc.qiniu.com/gogopher.jpg?exif
```

返回结果（内容经过格式化以便阅读）：

```js
{
	 "DateTime" : {
			"type" : 2,
			"val" : "2011:11:19 17:09:23"
	 },
	 "ExposureBiasValue" : {
			"type" : 10,
			"val" : "0.33 EV"
	 },
	 "ExposureTime" : {
			"type" : 5,
			"val" : "1/50 sec."
	 },
	 "Model" : {
			"type" : 2,
			"val" : "Canon EOS 600D"
	 },
	 "ISOSpeedRatings" : {
			"type" : 3,
			"val" : "3200"
	 },
	 "ResolutionUnit" : {
			"type" : 3,
			"val" : " 英寸"
	 },
	 ...后续内容已省略...
}
```

### 图片圆角@image-roundpic

**简介**

将图片生成圆角图片，并且可以指定图片的圆角大小。

**限制说明**

- 原图格式支持：png、jpg，处理后的图片格式为 png
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理 - 图片文件大小没有限制 - 处理前的 `gif`、`webp动图`，最大帧数为 500 - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素 - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素
  ​
  **接口规格**

处理后图片文件大小没有限制
​

```
roundPic/radius/<radius>
        /radiusx/<radiusx>
        /radiusy/<radiusy>
```

| 参数名称             | 必填 | 说明                                                                                                                 |
| :------------------- | :--- | :------------------------------------------------------------------------------------------------------------------- |
| `/radius/<radius>`   | 否   | 圆角大小的参数，水平和垂直的值相同，可以使用像素数（如 200）或百分比（如!25p）。不能与 radiusx 和 radiusy 同时使用。 |
| `/radiusx/<radiusx>` | 否   | 圆角水平大小的参数，可以使用像素数（如 200）或百分比（如!25p）。需要与 radiusy 同时使用。                            |
| `/radiusy/<radiusy>` | 否   | 圆角垂直大小的参数，可以使用像素数（如 200）或百分比（如!25p）。需要与 radiusx 同时使用                              |

注意：

1. 其中当像素数大于宽（高）的 1/2 时取其 1/2，百分比大于!50p 时，取!50p；
2. 像素数与百分比均需为非负值，命令 roundPic/radius/!50p 可使方形图片变圆

**使用示例**

原图

```
https://dora-doc.qiniu.com/gogopher.jpg
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

把一张图片变成 50 度圆角：

```
https://dora-doc.qiniu.com/gogopher.jpg?roundPic/radius/50
```

![](https://dora-doc.qiniu.com/gogopher.jpg?roundPic/radius/50)

把一张图片变成圆形：

```
https://dora-doc.qiniu.com/gogopher.jpg?roundPic/radius/99999999999
```

![](https://dora-doc.qiniu.com/gogopher.jpg?roundPic/radius/99999999999)

### 图片水印处理@image-watermark-1

**简介**

给图片添加水印

**限制说明**

- 原图格式支持： psd、jpeg、png、gif、webp、tiff、bmp、avif、heic
  - webp 动图，适用于 watermark/1、watermark/2、watermark/3 接口，仅支持持久化处理
- 输出限制
  - 输出为 gif，一般处理时间比较长，建议优先使用 持久化处理
- 同步处理
  - 原图只支持 20MB 以内的图片，超过 20MB 的图片请使用持久化处理
  - 处理前的 `gif` 最大帧数为 200
  - 处理前的图片 `w` 和 `h` 参数不能超过 3 万像素，总像素不能超过 1.5 亿像素
  - 处理后的图片 `w` 和 `h` 参数不能超过 9999 像素，总像素不得超过 24999999（2500w-1）像素
- 持久化处理 - 图片文件大小没有限制 - 处理前的 `gif`、`webp动图`，最大帧数为 500 - 处理前的图片 `w` 和 `h` 不能超过 3 万像素，总像素不能超过 1.5 亿像素 - 处理后的图片 `w` 和 `h` 不能超过 14999 像素，总像素不得超过 59999999（6000w-1）像素
  ​
  **接口规格**

处理后图片文件大小没有限制
​

```
watermark/1
         /format/<Format>
         /image/<encodedimageurl>
         /dissolve/<dissolve>
         /gravity/<gravity>
         /dx/<distanceX>
         /dy/<distanceY>
         /ws/<watermarkScale>
         /wst/<watermarkScaleType>
```

| 参数名称                    | 必填 | 说明                                                                                                                                                                                                                                                                                                            |
| :-------------------------- | :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/format/<Format>`          |      | 图片输出格式 <br/>1、取值：heic 或 avif ，属于 图片高级压缩 格式，按照图片高级压缩收费，当前仅支持 持久化处理 来使用。<br/>2、取值：copy，保持原图格式输出。<br/>注意：<br/>● 当原图为 heic 或 avif 时，设置 format/copy 会保持原图格式不变，且不按照图片高级压缩收费；如果不指定 format 参数，将会输出 jpeg 。 |
| `/image/<encodedimageurl>`  | 是   | 水印图片地址，均需要经过[URL 安全的 Base64 编码](#urlsafebase64encode)。<br/>注意：更换图片水印时，建议更换图片的文件名。                                                                                                                                                                                       |
| `/dissolve/<dissolve>`      |      | 透明度，取值范围 1-100，默认值为 100（完全不透明）。                                                                                                                                                                                                                                                            |
| `/gravity/<gravity>`        |      | 水印位置，参考水印锚点参数表，默认值为 SouthEast（右下角）。                                                                                                                                                                                                                                                    |
| `/dx/<distanceX>`           |      | 横轴边距，单位:像素(px)，默认值为 10。                                                                                                                                                                                                                                                                          |
| `/dy/<distanceY>`           |      | 纵轴边距，单位:像素(px)，默认值为 10。                                                                                                                                                                                                                                                                          |
| `/ws/<watermarkScale>`      |      | 水印图片自适应原图的比例，ws 的取值范围为 0-1。具体是指水印图片保持原比例，按照自适应原图的类型 wst，比如默认是按照短边，则水印图片短边=原图短边＊ws。                                                                                                                                                          |
| `/wst/<watermarkScaleType>` |      | 水印图片自适应原图的类型，取值 0、1、2、3 分别表示为自适应原图的短边、长边、宽、高，默认值为 0。                                                                                                                                                                                                                |

例如：

1. 原图大小为 250x250，水印图片大小为 91x61，如果 wst=0、ws=0.1，那么最终水印图片的大小为：37.2x25
2. 原图大小为 250x250，水印图片大小为 91x61，如果 wst=1、ws=0.1，那么最终水印图片的大小为：25x16.8

水印锚点参数表

```
NorthWest     |     North      |     NorthEast
              |                |
              |                |
--------------+----------------+--------------
              |                |
West          |     Center     |          East
              |                |
--------------+----------------+--------------
              |                |
              |                |
SouthWest     |     South      |     SouthEast
```

**使用示例**

原图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png)

- 水印图片
  - imageurl = `https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/uniCloud.jpg`
  - encodedimageurl = `aHR0cHM6Ly93ZWItZXh0LXN0b3JhZ2UuZGNsb3VkLm5ldC5jbi91bmljbG91ZC9leHQtc3RvcmFnZS91bmlDbG91ZC5qcGc=`
- 水印透明度: 50% (dissolve=50)
- 水印位置: 右下角 (gravity=SouthEast)
- 横向边距: 20px
- 纵向边距: 20px
- 水印图片自适应短边比例：0.2

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?watermark/1/image/aHR0cHM6Ly93ZWItZXh0LXN0b3JhZ2UuZGNsb3VkLm5ldC5jbi91bmljbG91ZC9leHQtc3RvcmFnZS91bmlDbG91ZC5qcGc=/dissolve/50/gravity/SouthEast/dx/20/dy/20/ws/0.2
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?watermark/1/image/aHR0cHM6Ly93ZWItZXh0LXN0b3JhZ2UuZGNsb3VkLm5ldC5jbi91bmljbG91ZC9leHQtc3RvcmFnZS91bmlDbG91ZC5qcGc=/dissolve/50/gravity/SouthEast/dx/20/dy/20/ws/0.2)

### 图片盲水印处理@image-watermark-5

**简介**

肉眼可见的水印方式，一般用于标志图片的出处或者用于声明版权，会破坏原图，且影响美观。扩展存储提供盲水印功能，隐蔽性强，在不破坏原始作品的情况下，实现版权的防护与追踪。当图片被盗用后，您可对图片进行盲水印解码，验证版权归属。

**限制说明**

- 原图限制：
  - 原图格式支持： jpg、png
  - 宽高限制为：4096x4096
  - version 为 3 时，原图的尺寸宽高都需大于 512
- 编码、解码的 version 要相同
- 盲水印主要为 CPU 密集型任务，处理时间会随着图片文件的增大而增大
- 建议使用 version/3，相较于之前的版本有以下优化： - 解水印不需要对比原图，去除对原图的依赖 - 抗大面积涂抹&裁剪攻击
  ​
  **应用场景**

- 隐形美观：盲水印是一种肉眼不可见的水印方式，可以保持图片美观的同时，保护您的资源版权。
- 版权保护：对图片资源使用图片盲水印或者文字水印，借此避免数字媒体未经授权的复制和拷贝，可通过对原图进行解码操作，得到水印图来证明版权归属。
- 防泄漏：对于内部分享的图片资源，您可使用盲水印功能，加上不同标识，如果资料被复制、传播可根据解码出的唯一标识得出泄露方信息。

#### 图片盲水印

**接口规格**

```
watermark/5
         /version/<version>
         /method/<method>
         /imageKey/<encodedImageKey>
         /orignal/<encodedImage>
```

**添加水印**

version 为 1 或 2 时，请求参数说明如下：

| 名称                          | 必填 | 说明                                                                                                                                                                                                                         |
| :---------------------------- | :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/version/<version>`          | N    | 接口版本值为 1 或 2 , 默认为 1。                                                                                                                                                                                             |
| `/method/<method>`            | Y    | 盲水印标志位，编码（添加水印）为 encode。                                                                                                                                                                                    |
| `/imageKey/<encodedImageKey>` | N    | 水印图片（经过[URL 安全的 Base64 编码](#urlsafebase64encode)）<br/>例如：imageKey=upload.png，encodedImageKey=urlsafe_base64_encode(imageKey)。<br/>注意：水印图片宽高分别不超过原图宽高的二分之一，图片为黑底白字效果更佳。 |

version 为 3 时，请求参数说明如下：

| 名称                          | 必填 | 说明                                                                                                                                                              |
| :---------------------------- | :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/version/<version>`          | N    | 接口版本值为 3，注意：<br/>1）原图的宽高都需大于 512。<br/>2）水印图片的限制，必须是二值图像，且水印的大小为 64x64，如果不符合条件， 会缩放和处理图片到服务要求。 |
| `/method/<method>`            | Y    | 盲水印标志位，编码（即添加水印）为 encode。                                                                                                                       |
| `/imageKey/<encodedImageKey>` | N    | 水印图片（经过[URL 安全的 Base64 编码](#urlsafebase64encode)）<br/>例如：imageKey=upload.png，encodedImageKey=urlsafe_base64_encode(imageKey)                     |

**提取水印**

version 为 1 或 2 时，请求参数说明如下：

| 名称                      | 必填 | 说明                                                               |
| :------------------------ | :--- | :----------------------------------------------------------------- |
| `/version/<version>`      | N    | 接口版本值为 1 或 2 , 默认为 1。                                   |
| `/method/<method>`        | Y    | 盲水印标志位，解码（即提取水印）为 decode。                        |
| `/orignal/<encodedImage>` | N    | 解码对比原图（经过[URL 安全的 Base64 编码](#urlsafebase64encode)） |

version 为 3 时，请求参数说明如下：

| 名称                 | 必填 | 说明                                           |
| :------------------- | :--- | :--------------------------------------------- |
| `/version/<version>` | N    | 接口版本值为 3，注意：原图的宽高都需大于 512。 |
| `/method/<method>`   | Y    | 盲水印标志位，解码（即提取水印）为 decode      |

**使用示例**

原图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png)

编码/ 添加盲水印（version/3)

- 水印图片 cloudPath：`unicloud/ext-storage/uniCloud.png`
- 水印图片 encodedImageKey：`dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/3/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/3/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n)

解码/ 提取盲水印（version/3)

- 水印图片 cloudPath：`unicloud/ext-storage/uniCloud.png`
- 水印图片 encodedImageKey：`dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/3/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n|watermark/5/version/3/method/decode
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/3/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n|watermark/5/version/3/method/decode)

编码/ 添加盲水印（version/2)

- 水印图片 cloudPath：`unicloud/ext-storage/u.png`
- 水印图片 encodedImageKey：`dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/2/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdS5wbmc=
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/2/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdS5wbmc=)

解码/ 提取盲水印（version/2)

- 水印图片 cloudPath：`unicloud/ext-storage/u.png`
- 水印图片 encodedImageKey：`dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdW5pQ2xvdWQucG5n`
- 原图 cloudPath：`unicloud/ext-storage/gogopher1.png`
- 原图 encodedImage：`dW5pY2xvdWQvZXh0LXN0b3JhZ2UvZ29nb3BoZXIxLnBuZw==`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/2/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdS5wbmc=|watermark/5/version/2/method/decode/orignal/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvZ29nb3BoZXIxLnBuZw==
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/5/version/2/method/encode/imageKey/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvdS5wbmc=|watermark/5/version/2/method/decode/orignal/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvZ29nb3BoZXIxLnBuZw==)

#### 文字盲水印

**接口规格**

```
watermark/6
         /version/<version>
         /method/<method>
         /text/<encodedText>
         /orignal/<encodedImage>
```

**添加水印**

version 为 1 或 2 时，请求参数说明如下：

| 名称                  | 必填 | 说明                                                                                                                    |
| :-------------------- | :--- | :---------------------------------------------------------------------------------------------------------------------- |
| `/version/<version>`  | N    | 接口版本值为 1 或 2 , 默认为 1。                                                                                        |
| `/method/<method>`    | Y    | 盲水印标志位，编码（添加水印）为 encode。                                                                               |
| `/text/<encodedText>` | N    | 水印文字（经过[URL 安全的 Base64 编码](#urlsafebase64encode)）。只支持英文数字字符，不支持中文字符，数量上限分别为 10。 |

version 为 3 时，请求参数说明如下：

| 名称                  | 必填 | 说明                                                                                                                                                              |
| :-------------------- | :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/version/<version>`  | N    | 接口版本值为 3，注意：<br/>1）原图的宽高都需大于 512。<br/>2）水印图片的限制，必须是二值图像，且水印的大小为 64x64，如果不符合条件， 会缩放和处理图片到服务要求。 |
| `/method/<method>`    | Y    | 盲水印标志位，编码（即添加水印）为 encode。                                                                                                                       |
| `/text/<encodedText>` | N    | 水印文字（经过 URL 安全的 Base64 编码）。只支持英文数字字符，不支持中文字符，数量上限分别为 15。                                                                  |

**提取水印**

version 为 1 或 2 时，请求参数说明如下：

| 名称                      | 必填 | 说明                                        |
| :------------------------ | :--- | :------------------------------------------ |
| `/version/<version>`      | N    | 接口版本值为 1 或 2 , 默认为 1。            |
| `/method/<method>`        | Y    | 盲水印标志位，解码（即提取水印）为 decode。 |
| `/orignal/<encodedImage>` | N    | 解码对比原图（经过 URL 安全的 Base64 编码） |

version 为 3 时，请求参数说明如下：

| 名称                 | 必填 | 说明                                           |
| :------------------- | :--- | :--------------------------------------------- |
| `/version/<version>` | N    | 接口版本值为 3，注意：原图的宽高都需大于 512。 |
| `/method/<method>`   | Y    | 盲水印标志位，解码（即提取水印）为 decode      |

**使用示例**

原图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png)

编码/ 添加盲水印（version/3)

- 文本原文：`123456`
- 文本 encodedText：`MTIzNDU2`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/3/method/encode/text/MTIzNDU2
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/3/method/encode/text/MTIzNDU2)

解码/ 提取盲水印（version/3)

- 文本原文：`123456`
- 文本 encodedText：`MTIzNDU2`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/3/method/encode/text/MTIzNDU2|watermark/6/version/3/method/decode
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/3/method/encode/text/MTIzNDU2|watermark/6/version/3/method/decode)

编码/ 添加盲水印（version/2)

- 文本原文：`123456`
- 文本 encodedText：`MTIzNDU2`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/2/method/encode/text/MTIzNDU2
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/2/method/encode/text/MTIzNDU2)

解码/ 提取盲水印（version/2)

- 文本原文：`123456`
- 文本 encodedText：`MTIzNDU2`
- 原图 cloudPath：`unicloud/ext-storage/gogopher1.png`
- 原图 encodedImage：`dW5pY2xvdWQvZXh0LXN0b3JhZ2UvZ29nb3BoZXIxLnBuZw==`

最终拼接得到图片 URL 如下

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/2/method/encode/text/MTIzNDU2|watermark/6/version/2/method/decode/orignal/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvZ29nb3BoZXIxLnBuZw==
```

效果展示

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher1.png?watermark/6/version/2/method/encode/text/MTIzNDU2|watermark/6/version/2/method/decode/orignal/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvZ29nb3BoZXIxLnBuZw==)

### 动图合成@image-animate

**简介**

动图合成接口（animate）用于将多张图片合成 GIF 动图。

**限制说明**

- 原图限制：
  - 支持的格式有 jpeg 和 png
  - 支持的最大帧数为 20
  - 支持的最大图片尺寸为 1080\*1080
  - 每张图的尺寸必须相同

**接口规格**

```
animate/duration/<duration>
       /merge/key/<encodedImageKey>
             /key/<encodedImageKey>
             ...
       /effect/<effectType>
```

**参数说明**

| 名称                | 必填 | 说明                                                                                                                        |
| :------------------ | :--- | :-------------------------------------------------------------------------------------------------------------------------- |
| `<duration>`        | Y    | GIF 动图的每帧间隔时间(单位: 0.01s)，取值要求为大于 0 的整数。                                                              |
| `<encodedImageKey>` | N    | 合成 GIF 动图的源图片 key 需要经过 [URL 安全的 Base64 编码](#urlsafebase64encode) ，且保证所有的源图都来源于同一个 bucket。 |
| `<effectType>`      | N    | 定义播放顺序，取值：0，1。（0:正序循环播放；1:倒序循环播放；）默认为 0                                                      |

第一张图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1.png
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1.png)

第二张图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/2.png
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/2.png)

第三张图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/3.png
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/3.png)

三张图合成一张动图

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1.png?animate/duration/10/merge/key/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvMi5wbmc=/key/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvMy5wbmc=
```

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1.png?animate/duration/10/merge/key/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvMi5wbmc=/key/dW5pY2xvdWQvZXh0LXN0b3JhZ2UvMy5wbmc=)

### URL 安全的 Base64 编码@urlsafebase64encode

图片处理部分 API 会涉及到 `经过URL安全的Base64编码`，具体算法如下

**云端代码示例**

```js
function urlsafeBase64Encode(text) {
  let encoded = Buffer.from(text).toString('base64');
  return encoded.replace(/\//g, '_').replace(/\+/g, '-');
}
let base64 = urlsafeBase64Encode('test/a.jpg');
console.log('base64: ', base64);
```

**前端代码示例（仅 H5 端可用）**

```js
function urlsafeBase64Encode(text) {
  // 使用window.btoa进行Base64编码，得到的是URL安全的Base64字符串
  let encoded = window.btoa(text);
  // 由于window.btoa已经使用_和-代替了+和/，所以不需要额外替换
  return encoded;
}
let base64 = urlsafeBase64Encode('test/a.jpg');
console.log('base64: ', base64);
```

### 私有文件如何使用图片处理?@privatehandle

在调用 getTempFileURL 的时候，fileList 内带上图片处理参数即可

**云端代码**

```js
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu',
  domain: 'example.com', // 域名地址
});
let res = extStorageManager.getTempFileURL({
  fileList: ['qiniu://test.jpg?imageMogr2/thumbnail/!20p'], // 文件地址列表
});
console.log('getTempFileURL: ', res);
return res;
```

## 视频处理@videoshandle

### 音视频转码@video-transcode

- 上传后自动转码 [详情](#getuploadfileoptions)
- 主动调用转码 API [详情](#pfop)
- 主动查询转码状态 API [详情](#get-pfop-status)
- 转码异步回调通知地址模板[详情](#persistent-notify-url)

### 视频单帧缩略图@video-vframe

**简介**

视频单帧缩略图接口(vframe)用于从视频流中截取指定时刻的单帧画面并按指定大小缩放成图片。

**接口规格**

```
vframe/<Format>
      /offset/<Second>
      /w/<Width>
      /h/<Height>
      /rotate/<Degree>
```

注意：

1. 当指定 `w` 而不指定 `h` 时，缩略图的高度将等比缩放；当指定 `h` 而不指定 `w` 时，缩略图的宽度将等比缩放。
2. `w` 与 `h` 中，长边取值范围 [20,3840]，短边取值范围 [20,2160]。

**参数说明**

| 参数名称           | 必填 | 说明                                                            |
| :----------------- | :--- | :-------------------------------------------------------------- |
| `<Format>`         | 是   | 输出的目标截图格式，支持 jpg、png 等。                          |
| `/offset/<Second>` | 是   | 指定截取视频的时刻，单位：秒，精确到毫秒。                      |
| `/w/<Width>`       | 否   | 缩略图宽度，单位：像素（px）                                    |
| `/h/<Height>`      | 否   | 缩略图高度，单位：像素（px）                                    |
| `/rotate/<Degree>` | 否   | 指定顺时针旋转的度数，可取值为 90、180、270、auto，默认为不旋转 |

注意：建议视频文件不能太大，举例用户设置该接口的超时时间为 10s，那么同步处理的视频文件最好不超过 450MB ，否则可能会超时导致处理失败。

原视频

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4
```

取视频第 2 秒的图

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4?vframe/jpg/offset/2/
```

取视频第 2 秒的图，宽度为 480px，高度为 360px：

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4?vframe/jpg/offset/2/w/480/h/360
```

取视频第 60 秒的图

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4?vframe/jpg/offset/60
```

### 音视频元信息@video-avinfo

**简介**

音视频元信息接口(avinfo)用于获取指定音频、视频资源的元信息

**接口规格**

```
avinfo
```

原视频

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4
```

获取音视频元信息

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4?avinfo
```

返回结果

```js
{
    "streams": [
        {
            "index": 0,
            "codec_name": "h264",
            "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
            "profile": "Baseline",
            "codec_type": "video",
            "codec_time_base": "1/60",
            "codec_tag_string": "avc1",
            "codec_tag": "0x31637661",
            "width": 1280,
            "height": 720,
            "coded_width": 1280,
            "coded_height": 720,
            "has_b_frames": 0,
            "sample_aspect_ratio": "1:1",
            "display_aspect_ratio": "16:9",
            "pix_fmt": "yuv420p",
            "level": 41,
            "color_range": "tv",
            "chroma_location": "left",
            "refs": 1,
            "is_avc": "true",
            "nal_length_size": "4",
            "r_frame_rate": "30/1",
            "avg_frame_rate": "30/1",
            "time_base": "1/30000",
            "start_pts": 0,
            "start_time": "0.000000",
            "duration_ts": 22526000,
            "duration": "750.866667",
            "bit_rate": "89992",
            "bits_per_raw_sample": "8",
            "nb_frames": "22526",
            "disposition": {
                "default": 1,
                "dub": 0,
                "original": 0,
                "comment": 0,
                "lyrics": 0,
                "karaoke": 0,
                "forced": 0,
                "hearing_impaired": 0,
                "visual_impaired": 0,
                "clean_effects": 0,
                "attached_pic": 0,
                "timed_thumbnails": 0
            },
            "tags": {
                "creation_time": "2020-03-15T13:54:39.000000Z",
                "language": "eng",
                "handler_name": "Mainconcept MP4 Video Media Handler",
                "encoder": "AVC Coding"
            }
        },
        {
            "index": 1,
            "codec_name": "aac",
            "codec_long_name": "AAC (Advanced Audio Coding)",
            "profile": "LC",
            "codec_type": "audio",
            "codec_time_base": "1/44100",
            "codec_tag_string": "mp4a",
            "codec_tag": "0x6134706d",
            "sample_fmt": "s16p",
            "sample_rate": "44100",
            "channels": 2,
            "channel_layout": "stereo",
            "bits_per_sample": 0,
            "r_frame_rate": "0/0",
            "avg_frame_rate": "0/0",
            "time_base": "1/44100",
            "start_pts": 0,
            "start_time": "0.000000",
            "duration_ts": 33115136,
            "duration": "750.910113",
            "bit_rate": "125663",
            "max_bit_rate": "236003",
            "nb_frames": "32339",
            "disposition": {
                "default": 1,
                "dub": 0,
                "original": 0,
                "comment": 0,
                "lyrics": 0,
                "karaoke": 0,
                "forced": 0,
                "hearing_impaired": 0,
                "visual_impaired": 0,
                "clean_effects": 0,
                "attached_pic": 0,
                "timed_thumbnails": 0
            },
            "tags": {
                "creation_time": "2020-03-15T13:54:39.000000Z",
                "language": "eng",
                "handler_name": "Mainconcept MP4 Sound Media Handler"
            }
        }
    ],
    "format": {
        "nb_streams": 2,
        "nb_programs": 0,
        "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
        "format_long_name": "QuickTime / MOV",
        "start_time": "0.000000",
        "duration": "750.910111",
        "size": "20503129",
        "bit_rate": "218434",
        "probe_score": 100,
        "tags": {
            "major_brand": "mp42",
            "minor_version": "0",
            "compatible_brands": "isommp42",
            "creation_time": "2020-03-15T13:54:38.000000Z"
        }
    }
}
```

## 文件处理@fileshandle

### 资源下载二维码@file-qrcode

**简介**

资源下载二维码生成功能(qrcode)，用于为存放在七牛云存储上的资源的下载 URL 或资源内容生成二维码图片，方便用户在各种客户端之间传播资源。

所生成的二维码图片格式为 png。

**接口规格**

```
qrcode/level/<Level>
```

| 参数名称         | 说明                                                             | 必填 |
| :--------------- | :--------------------------------------------------------------- | :--- |
| `/level/<Level>` | 冗余度，可选值 L（7%）、M（15%）、Q（25%），H（30%），默认为 L。 |

其中 `<DownloadURL>` 代表资源的原始下载 URL

注意：L 是最低级别的冗余度，H 最高。提高冗余度，较大可能会使生成图片总像素变多。

原视频文件

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4
```

生成文件对应的二维码，扫码二维码即可直接观看视频

```
https://cdn.domain.com/unicloud/ext-storage/test.mp4?qrcode
```

原图片文件

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png
```

扫码二维码查看图片内容

```
https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/gogopher.png?qrcode
```

## 机器智能审核@examine-pulp

扩展存储支持机器智能审核，会在用户上传图片和视频的时候异步进行审核，审核结果通过异步回调通知到您。

开通方式：开通此功能需要进 [扩展存储技术交流群](https://im.dcloud.net.cn/#/?joinGroup=65436862cc41b0763842cfc9) 申请发送文字：我想申请开通扩展存储“机器智能审核”功能。

### 机器智能审核费用

[点击查看费用说明](./price.md#examine-pulp)

### 审核异步回调函数

新建云函数 `ext-storage-examine-notice`，操作如下图所示。

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/941d8f2c-46b2-447b-b88a-7f636df288e4.png)

编写 `ext-storage-examine-notice/package.json` 文件，内容如下：

```json
{
  "name": "ext-storage-examine-notice",
  "extensions": {
    "uni-cloud-ext-storage": {}
  },
  "cloudfunction-config": {
    "concurrency": 1,
    "memorySize": 512,
    "path": "/ext-storage-examine-notice",
    "timeout": 60,
    "triggers": [],
    "runtime": "Nodejs18",
    "keepRunningAfterReturn": false
  }
}
```

再编写 `ext-storage-examine-notice/index.js` 文件，内容如下：

```js
'use strict';
const uniCloudExtStorage = require('uni-cloud-ext-storage');

exports.main = async (event = {}, context) => {
  const path = event.path;
  let body = event.body;
  if (event.isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString();
  }
  console.log('body: ', body);
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = false;
    }
  }

  if (!body) {
    console.log('body参数格式错误');
    return { code: -1, msg: '参数格式错误' };
  }

  if (path === '/video') {
    // 视频审核异步回调通知
    await videoExamineNotice(body);
  } else {
    // 图片审核异步回调通知
    await imageExamineNotice(body);
  }

  return {
    code: 0,
  };
};

// 图片审核异步回调通知
async function imageExamineNotice(body) {
  let {
    code, // 状态码0成功，1等待处理，2正在处理，3处理失败，4通知提交失败。
    desc, // 	与状态码相对应的详细描述。
    id, // 处理任务的persistentID
    inputBucket, // 处理源文件所在的Bucket名
    inputKey, // 	处理源文件的文件名。
    reqid, // 	云处理请求的请求id
    items, // 	审核结果详情
  } = body;
  const extStorageManager = uniCloud.getExtStorageManager({
    provider: 'qiniu', // 扩展存储供应商
    domain: 'example.com', // 域名地址，此处的域名无需更改
  });
  if (code !== 0) {
    console.log('自动审核未成功', code, desc);
    return;
  }
  let finalSuggestion = 'pass';
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let result = item.result.result;
    let {
      disable, // 文件是否被禁用的标识，true表示文件已被禁用，false表示文件没有被禁用。如果用户在增量设置中开启了“自动禁用违规文件”，那么增量违规文件就会被自动禁用，此时该字段就显示为true。
      suggestion, // 审核结果建议，取值范围：pass：正常，review：疑似违规，block：违规
      scenes = {}, // 审核场景具体信息
    } = result;

    if (suggestion === 'block') {
      finalSuggestion = 'block';
    } else if (suggestion === 'review') {
      if (finalSuggestion === 'pass') finalSuggestion = 'review';
    }
  }
  if (finalSuggestion === 'block') {
    console.log('该文件违规，需要立即删除');
    let deleteFileRes = await extStorageManager.deleteFile({
      fileList: [`qiniu://${inputKey}`], // 待删除的文件地址列表
    });
    console.log('deleteFileRes: ', deleteFileRes);
    // 注意，删除后如果不刷新缓存，可能cdn因为缓存问题，用户还能查看图片，但刷新缓存有次数限制，故此时没有执行刷新缓存
  } else if (finalSuggestion === 'review') {
    console.log('该文件疑似违规，需要人工审核');
    // 这里可以写自己的业务逻辑
  } else {
    console.log('该文件正常，无需处理');
  }
}

// 视频审核异步回调通知
async function videoExamineNotice(body) {
  let {
    code, // 状态码0成功，1等待处理，2正在处理，3处理失败，4通知提交失败。
    desc, // 	与状态码相对应的详细描述。
    id, // 处理任务的persistentID
    inputBucket, // 处理源文件所在的Bucket名
    inputKey, // 	处理源文件的文件名。
    reqid, // 	云处理请求的请求id
    items, // 	审核结果详情
  } = body;
  const extStorageManager = uniCloud.getExtStorageManager({
    provider: 'qiniu', // 扩展存储供应商
    domain: 'example.com', // 域名地址，此处的域名无需更改
  });
  if (code !== 0) {
    console.log('自动审核未成功', code, desc);
    return;
  }
  let finalSuggestion = 'pass';
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let result = item.result.result;
    let {
      disable, // 文件是否被禁用的标识，true表示文件已被禁用，false表示文件没有被禁用。如果用户在增量设置中开启了“自动禁用违规文件”，那么增量违规文件就会被自动禁用，此时该字段就显示为true。
      suggestion, // 审核结果建议，取值范围：pass：正常，review：疑似违规，block：违规
      scenes = {}, // 审核场景具体信息
    } = result;

    if (suggestion === 'block') {
      finalSuggestion = 'block';
    } else if (suggestion === 'review') {
      if (finalSuggestion === 'pass') finalSuggestion = 'review';
    }
  }
  if (finalSuggestion === 'block') {
    console.log('该文件违规，需要立即删除');
    let deleteFileRes = await extStorageManager.deleteFile({
      fileList: [`qiniu://${inputKey}`], // 待删除的文件地址列表
    });
    console.log('deleteFileRes: ', deleteFileRes);
    // 注意，删除后如果不刷新缓存，可能cdn因为缓存问题，用户还能查看图片，但刷新缓存有次数限制，故此时没有执行刷新缓存
  } else if (finalSuggestion === 'review') {
    console.log('该文件疑似违规，需要人工审核');
    // 这里可以写自己的业务逻辑
  } else {
    console.log('该文件正常，无需处理');
  }
}
```

保存文件后，还需要上传 `ext-storage-examine-notice` 云函数才能生效。

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/a7214561-1dea-4499-9958-3bd86896936f.png)

此时进入 [uniCloud 控制台](https://unicloud.dcloud.net.cn/) 找到对应空间下的云函数列表中的 `ext-storage-examine-notice` 云函数，点击查看详情，得到 url 接口地址，将这个地址发给扩展存储管理员即可开通【机器智能审核】

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/cd200da5-0a82-45cf-ab7b-b1723a2eb367.png)

## CDN 安全防护能力@cdnsecure

### 基础防御（无需申请）@cdnsecurebase

1. referer 防盗链设置：防止别人直接白嫖你的图片、视频等资源（可在 uniCloud 控制台设置）

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/171559505352924navhej8jg.png)

2. ip 黑名单设置：发现异常 IP 后可以拉黑（uniCloud 控制台有提供 IP top100 查看，但不会自动拉黑，可以在 uniCloud 控制台操作拉黑）

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/17155951341825lkaliq963g.png)

### 额外防御（需申请）@cdnsecureplus

1. 同一个 IP 在 1 分钟内，同一个域名下，CDN 单节点下载文件次数超过 200 次，封禁该 IP 1 小时，1 小时后自动解封（最大封禁 3 小时）

申请方式：在 [扩展存储技术交流群](https://im.dcloud.net.cn/#/?joinGroup=65436862cc41b0763842cfc9) 里发送内容，我想申请七牛云 CDN 额外防御：同一个 IP 在 1 分钟内，同一个域名下，CDN 单节点下载文件次数超过 200 次，封禁该 IP 1 小时，1 小时后自动解封

### CDN 流量监控告警并自动拉黑 IP（需自己部署，已提供云函数定时任务模板）@cdnsecurewarn

1. 单个 IP 每日流量阈值告警（单位：GB）
2. 单个 IP 每日访问次数阈值告警（单位：次）
3. 支持自动将超过阈值的 IP 拉进黑名单

提示：通过 `getDomains` 和 `getCdnTop` 这两个 API，结合云函数定时任务可以自己实现 CDN 流量监控告警功能，该告警功能的定时任务代码模板如下所示

#### 监控告警云函数模板@cdnsecurewarntemplate

**安装教程**

1. 新建一个云函数（注意选云函数，非云对象），名为：`ext-storage-cron`

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1715603185670vbsdmt4h2j.png)

2. 将下方代码复制到新建的云函数中

**注意**

- 如果你有多个空间开通了扩展存储，只需要其中任意一个空间部署这个定时任务即可，无需每个空间都部署一次

```js
'use strict';

const config = {
  frequency: 0, // 执行频率，单位：分钟，可选值：0、15、30、60（只能是这4个值的其中一个，设置为0也代表每15分钟执行一次）
  traffic: 10, // 单个IP 每日流量阈值（单位：GB）如果设置为0代表不限制
  count: 1000000, // 单个IP 每日访问次数阈值（单位：次）如果设置为0代表不限制
  autoAddIpacl: true, // 是否需要将超过阈值的 IP 自动拉进黑名单
  sms: {
    appid: '__UNI__XXXXXXX', // 修改成你的manifest.json里的appid
    phone: '15200000001', // 修改成你自己的手机号
    templateId: 'uni_cdn_warn', // 无需修改，当然也可以改成你自己的短信模板id（uni_cdn_warn为公共短信模板id，无需申请即可使用，发送频率限制为10分钟内最大1次）
  },
  db: {
    sendLog: 'opendb-open-data', // 无需修改，当然也可以改成你自己的数据表名称
  },
};

/**
 * 发送告警信息函数，目前用的是发送短信，你也可以自己更改为发送邮件、微信公众号模板消息等其他方式
 * @param {Object} list 告警列表
 * @param {Object} requestId 本次定时任务的请求id（方便在云函数那查询日志）
 */
async function sendWarn(list, requestId) {
  console.log('准备发送告警信息');
  for (let i = 0; i < list.length; i++) {
    console.log(`正在发送告警信息，当前进度${i + 1}/${list.length}`);
    let {
      type, // 告警类型 traffic 流量 count 访问次数
      domain, // 域名
      ip, // IP
      traffic, // 流量（单位：GB）
      count, // 访问次数（单位：次）
    } = list[i];
    let logInfo = await getSendLog({ ip });
    // 同一个IP在24小时内只发送一次告警信息
    if (logInfo && logInfo.value && logInfo.value.send_time && Date.now() < logInfo.value.send_time + 24 * 3600 * 1000) {
      console.log('该IP 24小时内已经发送过告警信息，不再发送');
      continue;
    }
    try {
      let sendSmsRes = await uniCloud.sendSms({
        ...config.sms,
        data: {},
      });
      console.log('sendSmsRes: ', sendSmsRes);
      if (sendSmsRes.errCode === 0) {
        // 发送成功，记录该IP的发送时间
        await setSendLog({
          type,
          domain,
          ip,
          traffic,
          count,
        });
      }
    } catch (err) {
      // 调用失败
      console.log('发送短信失败：', err);
    }
  }
}
// 以上代码可以修改-----------------------------------------------------------

// 以下代码无需修改-----------------------------------------------------------

// 查询发送告警信息的时间
async function getSendLog(data) {
  try {
    let {
      ip, // IP
    } = data;
    const db = uniCloud.database();
    let nowTime = Date.now();
    let dbRes = await db.collection(config.db.sendLog).doc(`ext-storage-warn:${ip}`).get();
    return dbRes.data[0];
  } catch (err) {
    console.error('err: ', err);
    return;
  }
}

// 记录发送告警信息的时间
async function setSendLog(data) {
  try {
    let {
      type, // 告警类型 traffic 流量 count 访问次数
      domain, // 域名
      ip, // IP
      traffic, // 流量（单位：GB）
      count, // 访问次数（单位：次）
    } = data;
    const db = uniCloud.database();
    let nowTime = Date.now();
    let logInfo = await getSendLog({ ip });
    if (!logInfo) {
      logInfo = {
        value: {
          type,
          domain,
          ip,
          traffic,
          count,
          send_count: 0,
        },
        expired: 0,
      };
    }
    logInfo.value.send_time = nowTime;
    if (!logInfo.value.send_count) logInfo.value.send_count = 0;
    logInfo.value.send_count++; // 记录该IP历史累加发送次数
    delete logInfo._id;

    // 1个IP只会存在一条记录
    return await db.collection(config.db.sendLog).doc(`ext-storage-warn:${ip}`).set(logInfo);
  } catch (err) {
    console.error('err: ', err);
    return;
  }
}

// 查询今日CDN流量top100
const extStorageManager = uniCloud.getExtStorageManager({
  provider: 'qiniu', // 扩展存储供应商
  domain: 'https://www.domain.com', // 此处的域名无需更改
});

// 添加ip黑名单
async function addIpacl(list = []) {
  let ipData = {};
  for (let i = 0; i < list.length; i++) {
    let { domain, ip } = list[i];
    if (!domain || !ip) {
      continue;
    }
    if (!ipData[domain]) ipData[domain] = [];
    ipData[domain].push(ip);
  }
  let domains = Object.keys(ipData);
  for (let i = 0; i < domains.length; i++) {
    let domain = domains[i];
    let ips = ipData[domain];
    let { data: domainInfo } = await extStorageManager.getDomainInfo({
      domain,
    });
    let ipACLValues = ips;
    if (domainInfo.ipACL.ipACLType === 'black') {
      // 如果是黑名单模式，则需要带上之前加过的黑名单 ip
      ipACLValues = ipACLValues.concat(domainInfo.ipACL.ipACLValues);
    }
    // 数组去重
    ipACLValues = [...new Set(ipACLValues)];
    // 执行添加ip黑名单操作
    await extStorageManager.updateDomainIpacl({
      domain,
      ipACLType: 'black',
      ipACLValues,
    });
  }
}

exports.main = async (event, context) => {
  let res = {};
  let nowTime = Date.now();
  // 获取当前分钟数
  let minute = new Date(nowTime).getMinutes();
  if (!config) {
    throw new Error(`未找到相关配置信息`);
  }
  if (config.frequency > 0 && minute % config.frequency !== 0) {
    console.log('未到执行时间');
    return '未到执行时间';
  }

  // 时区8小时
  let offset = 8 * 3600 * 1000;
  let startDate = new Date(nowTime + offset).toISOString().split('T')[0];
  let endDate = new Date(nowTime + offset).toISOString().split('T')[0];
  // 获取我绑定的域名列表
  let { domains = [] } = await extStorageManager.getDomains();
  // 循环domains数组，查询每个域名的CDN流量top100
  console.log(`当前查询日期：${startDate}`);
  let warnList = [];
  for (let i = 0; i < domains.length; i++) {
    let domain = domains[i];
    console.log(`正在查询域名：${domain}，当前进度${i + 1}/${domains.length}`);
    let getCdnTopRes = await getCdnTop({
      domain,
      startDate,
      endDate,
      requestId: context.request_id,
    });
    warnList = warnList.concat(getCdnTopRes);
  }
  let warnListStr = warnList.map((item) => `${item.domain}(${item.ip} : ${item.traffic}GB : ${item.count}次)`).join('、');
  let msg = `共查询了${domains.length}个域名，触发告警的IP有${warnList.length}个`;
  if (warnList.length > 0) {
    msg += `，分别是：${warnListStr}`;
  }
  console.log('执行完毕: ', msg);
  res.msg = msg;
  return res;
};

async function getCdnTop(data = {}) {
  let { domain, startDate, endDate, requestId } = data;
  let getCdnTopRes = await extStorageManager.getCdnTop({
    type: 2, // 1 topURL 2 topIP
    domains: [domain],
    startDate,
    endDate,
  });
  let list = getCdnTopRes.data;
  //console.log('list: ', list)
  let warnList = [];
  let totalTraffic = 0;
  let totalCount = 0;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let traffic = parseFloat((item.traffic / 1024 / 1024 / 1024).toFixed(2)); // 流量（单位：GB）
    let count = item.count; // 访问次数（单位：次）
    totalTraffic += item.traffic;
    totalCount += count;
    if (config.traffic > 0 && traffic >= config.traffic) {
      // 流量告警
      console.log(`域名${domain}触发流量告警，告警IP为：${item.ip}`);
      warnList.push({
        type: 'traffic',
        domain,
        ip: item.ip,
        traffic,
        count,
      });
    } else if (config.count > 0 && count >= config.count) {
      // 访问次数告警
      console.log(`域名${domain}触发访问次数告警，告警IP为：${item.ip}`);
      warnList.push({
        type: 'count',
        domain,
        ip: item.ip,
        traffic,
        count,
      });
    }
  }
  if (totalTraffic > 0 || totalCount > 0) {
    console.log(`域名${domain} TOP100 总流量：${parseFloat((totalTraffic / 1024 / 1024 / 1024).toFixed(6))}GB，共请求${totalCount}次`);
  }
  if (warnList.length > 0) {
    await sendWarn(warnList, requestId);
    if (config.autoAddIpacl) await addIpacl(warnList);
  }
  return warnList;
}
```

3. 修改上面的配置信息

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/17156042667632ukn4s04p2.png)

4. 修改云函数的 package.json 文件，替换代码如下

```js
{
  "name": "ext-storage-cron",
  "extensions": {
    "uni-cloud-sms": {},
    "uni-cloud-ext-storage": {}
  },
  "cloudfunction-config": {
    "concurrency": 1,
    "memorySize": 512,
    "path": "",
    "timeout": 600,
    "triggers": [
      {
        "name": "ext-storage-cron",
        "type": "timer",
        "config": "0 */15 * * * * *"
      }
    ],
    "runtime": "Nodejs16"
  }
}
```

5. 上传云函数 `ext-storage-cron`，完成

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/17156030587837l8qksr5hf.png)

上传成功后，每 15 分钟定时任务会启动一次，可前往云函数 `ext-storage-cron` 查看运行日志

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/171636353762842tk5a0ardo.png)

## 常见问题@question

### 运行报错，当前空间不支持 provider:"qiniu"@q1

通常是因为空间没有开通扩展存储导致的，[前往开通教程](./service.md)，如果确定已经开通，则可尝试重启项目并重新上传相关云函数。

### 运行报错，uniCloud.getExtStorageManager is not a function@q2

出现这个错误时，请依次执行以下操作

1. 检查 HBuilderX 的版本是否 >= 3.99
2. 右键云函数或云对象，管理公共模块或扩展库依赖，勾选 uni-cloud-ext-storage 扩展库
3. 重新上传这个云函数或云对象

### 外部系统如何上传文件到扩展存储@q3

可以通过云函数或云对象开启 URL 化的方式来获取前端上传参数，拿到上传参数后即可通过 uni.uploadFile（或其他三方请求库）上传文件

具体步骤

1. 新建一个云对象 `ext-storage-co`，其中 `index.obj.js` 代码如下（如果已经有了，则忽略此步骤）

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/464.png)

```js
const provider = 'qiniu';
module.exports = {
  _before: function () {},
  getUploadFileOptions(data = {}) {
    let { cloudPath, domain } = data;
    // 可以在此先判断下此路径是否允许上传等逻辑
    // ...

    let prefix = 'public/'; // 上传文件的目录前缀，比如上传到 public 目录下，这里填写 public/

    // 然后获取 extStorageManager 对象实例
    const extStorageManager = uniCloud.getExtStorageManager({
      provider, // 扩展存储供应商
      domain, // 自定义域名
    });
    // 最后调用 extStorageManager.getUploadFileOptions
    let uploadFileOptionsRes = extStorageManager.getUploadFileOptions({
      cloudPath: prefix + cloudPath, // 上传文件的云端路径
      allowUpdate: false, // 是否允许覆盖更新，如果会返回给前端，建议设置false，代表仅新增，不可覆盖（防止文件被意外替换），如果仅服务端直接交互，可以根据业务需要设置为true
    });
    return uploadFileOptionsRes;
  },
};
```

2. 替换新建的云对象的 `package.json` 文件，内容如下

```js
{
	"name": "ext-storage-co",
	"dependencies": {},
	"extensions": {
		"uni-cloud-ext-storage": {}
	},
	"cloudfunction-config": {
		"concurrency": 1,
		"memorySize": 512,
		"keepRunningAfterReturn": false,
		"path": "/http/ext-storage-co",
		"timeout": 60,
		"triggers": [],
		"runtime": "Nodejs16"
	}
}
```

3. 上传云对象 `ext-storage-co`

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1711446854423jpkc04uahvo.png)

4. 前往[uniCloud 控制台](https://unicloud.dcloud.net.cn/)进入对应空间详情-云函数/云对象-ext-storage-co 详情-复制 URL 化地址

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/d9660618-2ba6-4483-9c15-2090392d316f.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/09f633e3-be18-4b74-8ae3-5be76169c96b.png)

5. 通过 HTTP 的 GET 请求方式请求拿到的云对象内的 getUploadFileOptions 函数拿到上传参数

请求地址为：刚复制 URL 化地址 + `/getUploadFileOptions`

如 `https://fc-mp-xxxx.next.bspapp.com/http/ext-storage-co/getUploadFileOptions`

6. 通过上传参数内的上传地址和上传 token，再通过 HTTP 的 POST 请求上传文件

下方的代码用了 axios 作为请求库，这里需要替换成你自己用的请求库

```js
// TODO 这里的 tokenUrl 需要改成你的自己的云对象 ext-storage-co 的 getUploadFileOptions 的URL化地址
let tokenUrl = 'https://fc-mp-xxxx.next.bspapp.com/http/ext-storage-co/getUploadFileOptions';
axios({
  method: 'GET',
  url: tokenUrl,
  params: {
    domain: 'cdn.xxx.com', // TODO 改成你七牛绑定的域名
    cloudPath: `test/${Date.now()}.jpg`, // 文件路径（可自己定义文件名规则）
  },
})
  .then((res) => {
    let uploadFileOptionsRes = res.data;
    console.log('then-uploadFileOptionsRes: ', uploadFileOptionsRes);
    let url = uploadFileOptionsRes.uploadFileOptions.url; // 上传地址
    let name = uploadFileOptionsRes.uploadFileOptions.name; // 上传文件名
    let token = uploadFileOptionsRes.uploadFileOptions.formData.token; // 上传token
    let key = uploadFileOptionsRes.uploadFileOptions.formData.key; // 上传key

    // 创建一个 FormData 对象
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('key', key);
    // 发送请求
    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`上传进度：${percentCompleted}%`);
        },
      })
      .then((uploadRes) => {
        // 处理成功情况
        const res = {
          cloudPath: uploadFileOptionsRes.cloudPath, // 文件云端路径
          fileID: uploadFileOptionsRes.fileID, // 文件ID
          fileURL: uploadFileOptionsRes.fileURL, // 文件URL（如果是私有权限，则此URL是无法直接访问的）
          fileInfo: typeof uploadRes.data === 'string' ? JSON.parse(uploadRes.data) : uploadRes.data,
        };
        // 数据库里可直接保存 fileURL 或 fileID
        console.log('上传成功', res);
        console.log('fileURL', res.fileURL);
        console.log('fileID', res.fileID);
      })
      .catch((err) => {
        // 处理错误情况
        console.log('上传失败', err);
      });
  })
  .catch((err) => {
    console.log('catch', err);
  });
```

### 我的项目如何不改变原有代码使用扩展存储@q4

由于扩展存储不支持前端直传，而是需要先通过云函数或云对象来获取上传凭证，具有较高的安全性，但也因此导致上传代码与内置存储不同，老项目想使用扩展存储就要改动原有上传代码，那么有没有方案可以做到在不改原有上传代码的基础上，老项目也能很方便的使用扩展存储呢?

答案是可以的，按如下步骤操作。

1. 开通扩展存储 [开通教程](./service.md)

2. 在你的项目根目录的 `/js_sdk/ext-storage/` 目录新建文件 `uploadFileForExtStorage.js`（没有 `/js_sdk/ext-storage/` 目录就新建目录）

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/465.png)

uploadFileForExtStorage.js 文件复制下方的代码

```js
/**
 * 设置 uniCloud.uploadFile 默认上传到扩展存储
 * @param {String} provider 云储存供应商
 * 	@value unicloud				内置存储
 * 	@value extStorage 		扩展存储
 * @param {String} domain 自定义域名，仅扩展存储有效
 * @param {Boolean} fileID2fileURL 是否将fileID转为fileURL
 * @param {Function} uploadFileOptions 获取上传参数的函数，仅扩展存储有效
 */
function init(options = {}) {
  let { provider: defaultProvider } = options;
  let originalDefaultProvider = defaultProvider;
  let extStorage = new ExtStorage(options);

  const uploadFile = uniCloud.uploadFile;
  uniCloud.uploadFile = (...e) => {
    let options = e[0] || {};
    let { provider = defaultProvider } = options;
    if (provider === 'extStorage') {
      return extStorage.uploadFile(...e);
    } else {
      return uploadFile(...e);
    }
  };

  const getTempFileURL = uniCloud.getTempFileURL;
  uniCloud.getTempFileURL = (...e) => {
    let options = e[0] || {};
    let { provider = defaultProvider } = options;
    if (provider === 'extStorage') {
      return extStorage.getTempFileURL(...e);
    } else {
      return getTempFileURL(...e);
    }
  };

  const deleteFile = uniCloud.deleteFile;
  uniCloud.deleteFile = (...e) => {
    let options = e[0] || {};
    let { provider = defaultProvider } = options;
    if (provider === 'extStorage') {
      return extStorage.deleteFile(...e);
    } else {
      return deleteFile(...e);
    }
  };

  uniCloud.setCloudStorage = (data = {}) => {
    let { provider, domain, fileID2fileURL } = data;
    if (provider === null) {
      defaultProvider = originalDefaultProvider;
    } else if (provider) {
      defaultProvider = provider;
    }
    if (domain) extStorage.domain = domain;
    if (fileID2fileURL) extStorage.fileID2fileURL = fileID2fileURL;
  };
}

export default {
  init,
};

class ExtStorage {
  constructor(data = {}) {
    let { uploadFileOptions, domain, fileID2fileURL } = data;
    this.uploadFileOptions = uploadFileOptions;
    this.domain = domain;
    this.fileID2fileURL = fileID2fileURL;
  }

  // 上传文件
  uploadFile(options) {
    let { filePath, cloudPath } = options;
    const promiseRes = new Promise(async (resolve, reject) => {
      try {
        const uploadFileOptionsRes = await this.uploadFileOptions({
          cloudPath,
          domain: this.domain,
        });
        const uploadTask = uni.uploadFile({
          ...uploadFileOptionsRes.uploadFileOptions, // 上传文件所需参数
          filePath, // 本地文件路径
          success: (uploadFileRes) => {
            if (uploadFileRes.statusCode !== 200) {
              const err = uploadFileRes;
              if (typeof options.fail === 'function') options.fail(err);
              reject(err);
            } else {
              const res = {
                cloudPath: uploadFileOptionsRes.cloudPath, // 文件云端路径
                fileID: uploadFileOptionsRes.fileID, // 文件ID
                fileURL: uploadFileOptionsRes.fileURL, // 文件URL（如果是私有权限，则此URL是无法直接访问的）
              };
              if (this.fileID2fileURL) {
                res.fileID = `https://${this.domain}/${res.cloudPath}`;
              }
              if (typeof options.success === 'function') options.success(res);
              resolve(res);
            }
          },
          fail: (err) => {
            if (typeof options.fail === 'function') options.fail(err);
            reject(err);
          },
          complete: () => {
            if (typeof options.complete === 'function') options.complete();
          },
        });
        // 监听上传进度
        uploadTask.onProgressUpdate((progressEvent) => {
          if (typeof options.onUploadProgress === 'function') {
            const total = progressEvent.totalBytesExpectedToSend;
            const loaded = progressEvent.totalBytesSent;
            const progress = Math.round((loaded * 100) / total);
            options.onUploadProgress({
              total,
              loaded,
              progress,
            });
          }
        });
      } catch (err) {
        if (typeof options.fail === 'function') options.fail(err);
        reject(err);
        if (typeof options.complete === 'function') options.complete();
      }
    });
    promiseRes.catch(() => {});
    return promiseRes;
  }

  // 获取临时文件下载地址
  getTempFileURL(options = {}) {
    let { fileList } = options;

    return new Promise((resolve, reject) => {
      let res = {
        fileList: fileList.map((item, index) => {
          let cloudPath = getCloudPath(item);
          return {
            fileID: item,
            tempFileURL: `https://${this.domain}/${cloudPath}`,
          };
        }),
      };
      if (typeof options.success === 'function') options.success(res);
      resolve(res);
      if (typeof options.complete === 'function') options.complete();
    });
  }

  // 删除文件
  deleteFile(options = {}) {
    // 扩展存储不允许前端删除文件（故此处直接返回）
    return new Promise((resolve, reject) => {
      let res = {
        fileList: [],
      };
      if (typeof options.success === 'function') options.success(res);
      resolve(res);
      if (typeof options.complete === 'function') options.complete();
    });
  }
}

function getCloudPath(cloudPath) {
  const qiniuPrefix = 'qiniu://';
  if (cloudPath.indexOf(qiniuPrefix) === 0) {
    cloudPath = cloudPath.substring(qiniuPrefix.length);
  } else if (cloudPath.indexOf('http://') === 0 || cloudPath.indexOf('https://') === 0) {
    let startIndex = cloudPath.indexOf('://') + 3;
    startIndex = cloudPath.indexOf('/', startIndex);
    let endIndex = cloudPath.indexOf('?') === -1 ? cloudPath.length : cloudPath.indexOf('?');
    endIndex = cloudPath.indexOf('#') !== -1 && cloudPath.indexOf('#') < endIndex ? cloudPath.indexOf('#') : endIndex;
    cloudPath = cloudPath.substring(startIndex + 1, endIndex);
  }
  return cloudPath;
}
```

3. 在 `App.vue` 的 `<script>` 下面且是 `export default {` 的上面，新增以下代码

```js
import uploadFileForExtStorage from '@/js_sdk/ext-storage/uploadFileForExtStorage.js';
```

4. 在 `App.vue` 的 `onLaunch` 函数中新增以下代码

```js
// 设置 uniCloud.uploadFile 默认上传的云存储供应商
uploadFileForExtStorage.init({
  provider: 'extStorage', // provider代表默认上传到哪，可选项 "unicloud" 内置存储; "extStorage" 扩展存储;
  domain: 'cdn.example.com', //【重要】这里需要改成你开通扩展存储时绑定的自定义域名）
  fileID2fileURL: true, // 将fileID转成fileURL，方便兼容老项目
  // 获取上传参数的函数
  uploadFileOptions: async (event) => {
    // ext-storage-co 是你自己写的云对象，参考代码：https://doc.dcloud.net.cn/uniCloud/ext-storage/dev.html#getuploadfileoptions
    const uniCloudStorageExtCo = uniCloud.importObject('ext-storage-co');
    return await uniCloudStorageExtCo.getUploadFileOptions(event);
  },
});
```

`App.vue` 完整示例

```vue
<script>
  import uploadFileForExtStorage from '@/js_sdk/ext-storage/uploadFileForExtStorage.js';
  export default {
    onLaunch: function () {
      console.log('App Launch');
      // 设置 uniCloud.uploadFile 默认上传到扩展存储
      uploadFileForExtStorage.init({
        provider: 'extStorage', // provider代表默认上传到哪，可选项 "unicloud" 内置存储; "extStorage" 扩展存储;
        domain: 'cdn.example.com', //【重要】这里需要改成你开通扩展存储时绑定的自定义域名）
        fileID2fileURL: true, // 将fileID转成fileURL，方便兼容老项目
        // 获取上传参数的函数
        uploadFileOptions: async (event) => {
          // ext-storage-co 是你自己写的云对象，参考代码：https://doc.dcloud.net.cn/uniCloud/ext-storage/dev.html#getuploadfileoptions
          const uniCloudStorageExtCo = uniCloud.importObject('ext-storage-co');
          return await uniCloudStorageExtCo.getUploadFileOptions(event);
        },
      });
    },
    onShow: function () {
      console.log('App Show');
    },
    onHide: function () {
      console.log('App Hide');
    },
  };
</script>

<style></style>
```

5. 新建一个云对象 `ext-storage-co`，其中 `index.obj.js` 代码如下

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/464.png)

```js
const provider = 'qiniu';
module.exports = {
  _before: function () {},
  getUploadFileOptions(data = {}) {
    let { cloudPath, domain } = data;
    // 可以在此先判断下此路径是否允许上传等逻辑
    // ...

    // 然后获取 extStorageManager 对象实例
    const extStorageManager = uniCloud.getExtStorageManager({
      provider, // 扩展存储供应商
      domain, // 自定义域名
    });
    // 最后调用 extStorageManager.getUploadFileOptions
    let uploadFileOptionsRes = extStorageManager.getUploadFileOptions({
      cloudPath: `public/${cloudPath}`, // 强制在public目录下
      allowUpdate: false, // 是否允许覆盖更新，如果返回前端，建议设置false，代表仅新增，不可覆盖
    });
    return uploadFileOptionsRes;
  },
};
```

6. 右键新建的云对象 `ext-storage-co`，点击 `管理公共模块或扩展库依赖` 选择扩展库 `uni-cloud-ext-storage` 点确定

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1711446719364aso0b63gklg.png)

7. 上传云对象 `ext-storage-co`

![](https://web-ext-storage.dcloud.net.cn/unicloud/ext-storage/1711446854423jpkc04uahvo.png)

8. 重新启动项目，测试原本上传到内置存储的代码现在是否变成上传到扩展存储了

如依然有问题，可进群反馈 [扩展存储技术支持群](https://im.dcloud.net.cn/#/?joinGroup=65436862cc41b0763842cfc9)

### 阿里云 OSS、腾讯云 COS 等其他存储如何迁移到扩展存储?@q5

根据不同的存储服务商，下面列出了不同的迁移方案

#### 七牛云官方存储迁移到扩展存储@q5-1

**实际场景**

我的存储空间是在七牛云的官方账号上，我现在想迁移到 uniCloud 扩展存储，应该如何迁移?

**迁移方案**

因为扩展存储的服务商就是七牛云，因此可以直接使用七牛云自带的迁移工具 qshell 进行迁移

相关文档：

- [qshell 仓库地址](https://github.com/qiniu/qshell/tree/master?tab=readme-ov-file)

#### 阿里云 OSS、腾讯云 COS、空间内置存储以及其他存储如何迁移到扩展存储?@q5-2

**实际场景**

我用的是阿里云 OSS（腾讯云 COS 或其他存储都可以），我想将 Ta 迁移到扩展存储，应该如何迁移?

**迁移方案一**

将需要迁移的存储内的文件全部下载到你的电脑上，然后通过 [本地电脑文件快速批量上传到扩展存储](#q5-3) 的方式上传到扩展存储

**迁移方案二**

可以将扩展存储的回源地址修改为你原先存储的源站地址，这样当用户访问文件时，扩展存储如果未找到文件会尝试从你原先的源站进行下载并保存到扩展存储，以此实现动态迁移，此方案需要一段时间内保留原先存储内的文件，直到扩展存储几乎全部回源后（即原先的存储几乎已无回源流量产生时）就可以释放原先存储（注意：如果某些文件一直没访问，那么扩展存储里不会有这些文件）

操作方式：直接按如下图所示操作即可。

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-storage/c09e0dc2-4eb7-4cdc-ab12-bf8fe84a75e8.png)

**迁移方案三**

只将 uni-cdn 的回源地址修改为你原先存储的源站地址，这样只使用了 uni-cdn，扩展存储内是不会存储文件的，文件还是全在你原先的存储中

申请方式：在 [扩展存储技术交流群](https://im.dcloud.net.cn/#/?joinGroup=65436862cc41b0763842cfc9) 里发送内容，我想申请 uni-cdn 回源到阿里云 OSS，我选择迁移方案三-uni-cdn 回源自有存储，我每月消耗的 CDN 是 xxx TB

**特别注意：方案三只有 CDN 消耗大户才能申请**

#### 空间内置存储迁移到扩展存储注意事项@q5-2-2

由于内置存储使用的是云厂商的默认域名，故即使迁移成功后，数据库里的图片存储的 url 地址还是你之前内置存储的默认域名，因此还需要进行如下操作。

**方案一**

用本地调试的运行方式（设置本地运行超时时间一个很大的数字），循环数据库所有表的记录，进行 url 修改

**方案二**

如果你使用的是第三方组件库的 image 组件，那么可以考虑直接修改 image 组件内的源码，将图片的 src 进行本地动态替换

**方案三**

如果你认为内置存储里存储的文件不重要，也可以考虑放弃内置存储里的文件，不迁移，直接使用扩展存储

#### 本地电脑文件快速批量上传到扩展存储?@q5-3

七牛云提供了 `qshell` 工具用来快速将本地电脑文件快速批量上传到扩展存储

[qshell-下载地址](https://github.com/qiniu/qshell/tree/master)

[qshell-本地文件同步教程](https://github.com/qiniu/qshell/blob/master/docs/qupload.md)
