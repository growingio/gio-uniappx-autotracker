## 开发相关问题

### uniCloud只支持uni-app，怎么开发web界面？

uni-app可以开发web界面，详见：[uni-app宽屏适配指南](https://uniapp.dcloud.io/adapt)

如果是需要pc版admin的话，uniCloud提供了[uniCloud admin](https://uniapp.dcloud.io/uniCloud/admin)

### uniCloud内如何使用formdata

nodejs本身不支持formdata，但是可以通过手动拼装formdata的方式来进行支持，[参考](https://www.npmjs.com/package/form-data)

结合`uniCloud.httpclient.request`使用的示例

```js
const FormData = require('form-data');
let form = new FormData();
form.append('my_field', 'my value');
form.append('my_buffer', new Buffer(10));

form.append('img', new Buffer(10), {
  filename: `${Date.now()}.png`,
  contentType: 'image/png'
})

uniCloud.httpclient.request('https://example.com',{
  content: form.getBuffer(),
  headers: form.getHeaders()
})
```


### 高并发下简单的防止超卖

> uniCloud阿里云现已支持redis，开通并使用redis请参考:[redis开通和使用](../redis.md)，如何使用redis防止超卖请参考：[redis高并发抢购](../redis.md?id=snap-over-sell)（推荐使用）。如下方式针对无redis场景比较不灵活（不推荐使用）

高并发时很多用户同时对一条数据读写，很容易造成数据混乱，表现在秒杀抢购等场景就是超卖。以秒杀为例，开发者可以从扣除库存这步入手对超卖进行很大程度的限制，下面是一个简单的示例（**注意以下代码未使用事务**）

```js
// 云函数
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async function(event){
  const transaction = await db.startTransaction()
  // 其他业务逻辑...
  // 库存减一
  const reduceRes = await db.collection('goods').where({
    _id: 'goods_id', // 商品ID
    stock: dbCmd.gt(1) // 限制库存大于1的才允许扣除库存
  }).update({
    stock: dbCmd.inc(-1)
  })
  if(reduceRes.updated === 0) { // 如果没成功更新库存就认为下单失败
    await transaction.rollback()
    return {
      code: 1001,
      message: '下单失败'
    }
  }
}
```

### 使用腾讯云报未登录Cloudbase

腾讯云会在本地storage存储一些信息，请不要在应用使用过程中使用clearStorage等接口直接删除storage。

### 如何使用promise/async/await@promise

uniCloud客户端callFunction及数据库相关接口会返回Promise类型结果，请参考以下写法使用：

```html
// index.vue
<template>
  <view class="content">
    <button type="default" @click="testThen">promise+then</button>
    <button type="default" @click="testAwait">async+await</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      testThen() {
        uniCloud.callFunction({
          name: 'test'
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.error(err)
        })
      },
      async testAwait() {
        const res = await uniCloud.callFunction({
          name: 'test'
        })
        console.log(res)

        // 如需捕获错误需使用如下写法
        // try {
        //   const res = await uniCloud.callFunction({
        //     name: 'test'
        //   })
        //   console.log(res)
        // } catch (err) {
        //   console.error(err)
        // }

      }
    }
  }
</script>

<style>
</style>
```

### 使用uniCloud.init初始化阿里云正式版服务空间报“InvalidSpaceId.NotFound”

商用版如果使用uniCloud.init需要自行传递endpoint参数，参考：[uniCloud.init](../concepts/space.md#multi-space)
