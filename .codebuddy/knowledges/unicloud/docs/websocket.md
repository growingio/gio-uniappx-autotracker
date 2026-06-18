# WebSocket

> 仅支付宝云(云端)支持
>
> Nodejs版本 >= 18

很多情况下需要实时进行网络互动，例如游戏、通信、金融交易和其他高吞吐量活动。

WebSocket 是一种协议，可通过单个 TCP 连接在网络客户端与网络服务器之间提供全双工通信通道。WebSocket 协议使用 HTTP 协议在客户端与服务器之间建立连。

云函数WebSocket运行原理为客户端请求WebSocket网关，由WebSocket网关处理连接后转发给指定的云函数，调用云函数内不同的WebSocket事件完成事件触发与执行。

## WebSocket 事件
>
> WebSocket 支持在云函数与云对象中使用。

### connection
>
> 当有客户端进行连接时触发

**云函数实现**

```javascript
exports.onWebsocketConnection = function (event, context) {
    console.log("onWebsocketConnection", event, context)
}
```

**云对象实现**

```javascript
module.exports = {
    _onWebsocketConnection: function (event) {
        console.log("onWebsocketConnection", event)
    }
}
```

**入参参数**

**event**

|参数|类型|说明|
|---|---|---|
|connectionId|`String`|连接ID|
|query|`Object`|请求时的query参数|

**context**

云函数 context [参考](https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html#context)

### message
>
> 接收到客户端消息时触发

**云函数实现**

```javascript
exports.onWebsocketMessage = function (event, context) {
    console.log("onWebsocketMessage", event, context)
}
```

**云对象实现**

```javascript
module.exports = {
    _onWebsocketMessage: function (event) {
        console.log("onWebsocketMessage", event)
    }
}
```

**入参参数**

**event**

|参数|类型|说明|
|---|---|---|
|connectionId|`String`|连接ID|
|payload|`String` `Buffer`|消息内容|

**context**

云函数 context [参考](https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html#context)

### disConnection
>
> 连接断开时触发

**云函数实现**

```javascript
exports.onWebsocketDisConnection = function (event, context) {
    console.log("onWebsocketDisConnection", event, context)
}
```

**云对象实现**

```javascript
module.exports = {
    _onWebsocketDisConnection: function (event) {
        console.log("onWebsocketDisConnection", event)
    }
}
```

**入参参数**

**event**

|参数|类型|说明|
|---|---|---|
|connectionId|`String`|连接ID|

**context**

云函数 context [参考](https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html#context)

### error
>
> 触发其他事件时失败后触发

**云函数实现**

```javascript
exports.onWebsocketError = function (event, context) {
    console.log("onWebsocketError", event, context)
}
```

**云对象实现**

```javascript
module.exports = {
    _onWebsocketError: function (event) {
        console.log("onWebsocketError", event)
    }
}
```

**入参参数**

**event**

|参数|类型|说明|
|---|---|---|
|connectionId|`String`|连接ID|
|errorMessage|`String`|错误信息|

**context**

云函数 context [参考](https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html#context)

## 云函数 uniCloud API

用法：`const ws = uniCloud.webSocketServer()`

返回值: `WebSocketServer`

### WebSocketServer.send@uniCloud.ws.send
>
> 从云函数/云对象中向客户端发送消息

```javascript
const ws = uniCloud.webSocketServer()

await ws.send(connectionId, sendData)
```

**参数说明**

|参数|类型|说明|
|---|---|---|
|connectionId|`String` `Array`|客户端连接ID, 支持批量向客户端发送消息|
|sendData|`String` `Buffer`|发送给客户端的消息内容|

**示例**

```javascript
// 以云函数为例

exports.onWebsocketMessage = async function (event) {
    const { connectionId, payload } = event
    const ws = uniCloud.webSocketServer()

    // 发送给单个客户端
    await ws.send(connectionId, `receive:${payload}`)

    // 发送给多个客户端
    await ws.send([connectionId1, connectionId2, ...], `receive:${payload}`)

    // 发送给客户端对象数据，发送时会自动JSON.stringify为字符串
    await ws.send(connectionId, {
        receive: payload
    })

    // 发送给客户端二进制数据
    await ws.send(connectionId, Buffer.from(`receive:${payload}`))
}

```

### WebSocketServer.close@uniCloud.ws.close
>
> 在云函数/云对象中关闭连接

```javascript
const ws = uniCloud.webSocketServer()

await ws.close(connectionId)
```

**参数说明**

|参数|类型|说明|
|---|---|---|
|connectionId|`String` `Array`|客户端连接ID, 支持批量关闭客户端连接|

**示例**

```javascript
// 以云函数为例

exports.onWebsocketMessage = async function (event) {
    const { connectionId, payload } = event
    const ws = uniCloud.webSocketServer()

    // 关闭单个客户端连接
    await ws.close(connectionId)

    // 批量关闭客户端连接
    await ws.close([connectionId1, connectionId2, ...])
}

```

### WebSocketServer.signedURL@uniCloud.ws.signedURL
>
> 在云函数/云对象中生成WebSocket连接地址

在客户端没有使用 uniCloud SDK 时，可以通过 URL 化在云端生成 WebSocket 连接地址。

```javascript
const ws = uniCloud.webSocketServer()

await ws.signedURL(name, query)
```

**参数说明**

|参数|类型|说明|
|---|---|---|
|name|`String`|WebSocket云函数/云对象名称|
|query|`Object`|建立连接时需要传递的参数, 仅在 `connection` 事件中接收到|

**返回值**

WebSocket 连接地址

**示例**

```javascript
const ws = uniCloud.webSocketServer()

await ws.signedURL("exampleWebSocket", {
  key: "val"
})
```


### WebSocketServer.isAlive@uniCloud.ws.isAlive
>
> 在云函数/云对象中检测WebSocket连接是否存活

检测连接是否存活

```javascript
const ws = uniCloud.webSocketServer()

// 检测单个连接是否存活
await ws.isAlive(connectionId)

// 批量检测连接是否存活
await ws.isAlive([connectionId1, connectionId2, ...])
```

**参数说明**

|参数|类型| 说明   |
|---|---|------|
|connectionId|`String`| 连接ID |

**返回值**

**单个连接检测结果**

| 参数        | 类型        | 说明    |
|-----------|-----------|-------|
| isAlive   | `Boolean` | 是否存活; |
| requestID | `String`  | 请求ID  |

**批量连接检测结果**

| 参数           | 类型       | 说明        |
|--------------|----------|-----------|
| aliveCount   | `Number` | 存活连接数     |
| allCount     | `Number` | 检测连接总数    |
| aliveConnIds | `Array`  | 存活连接ID列表  |
| deadConnIds  | `Array`  | 不存活连接ID列表 |
| requestID    | `String` | 请求ID      |

## 客户端 uniCloud API

:::warning uni-app-x 连接 WebSocket 说明

uni-app-x Android 需要 HBuilderX 版本 >= 4.28

:::

### uniCloud.connectWebSocket

快速连接 WebSocket 服务

```javascript
uniCloud.connectWebSocket({
    name: "exampleWebSocket",
    query: {}
})
```

**参数说明**

|参数|类型|说明|
|---|---|---|
|name|`String`|WebSocket云函数/云对象名称|
|query|`Object`|建立连接时需要传递的参数, 仅在 `connection` 事件中接收到|

**返回值**

[SocketTask](https://uniapp.dcloud.net.cn/api/request/socket-task.html)

**示例**

```javascript
const exampleWebSocket = await uniCloud.connectWebSocket({
    name: "exampleWebSocket",
    query: {
        key: "val"
    }
})

// 连接成功时触发
exampleWebSocket.onOpen(event => {
    console.log("WebSocket:open", event)
})

// 收到数据时触发
exampleWebSocket.onMessage(event => {
    console.log("WebSocket:message", event.data)
})

// 连接被关闭时触发
exampleWebSocket.onClose(event => {
    console.log("WebSocket:close", event)
})

// 连接因错误而关闭时触发
exampleWebSocket.onError(event => {
    console.log("WebSocket:error", event)
})

```

## WebSocket 场景示例@demo

### WebSocket 聊天室

[线上预览](https://env-00jxgnnacplt-static.normal.cloudstatic.cn/wschat/index.html)

[源代码](https://gitcode.com/dcloud/websocket-chat-demo)

### WebSocket 协作白板

> 基于开源白板工具[excalidraw](https://github.com/excalidraw/excalidraw)实现
>
> 使用支付宝云WebSocket实现多人协作功能

[线上预览](https://env-00jxgnnacplt-static.normal.cloudstatic.cn/index.html)
