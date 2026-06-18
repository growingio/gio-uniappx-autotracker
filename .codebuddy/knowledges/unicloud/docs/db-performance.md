慢查询，指云数据库查询较慢，不能及时返回结果。这样的查询会收录在 uniCloud web控制台的慢查询日志栏目中。但收录不是实时的，有一定延时。

开发者应经常查阅自己的慢查询，修复问题，保证业务系统的健康稳定。

在数据库语句执行超过一定时间（**腾讯云、阿里云均为5秒**）仍不能返回结果后，数据库请求会报超时错误。

这里介绍如何进行查询优化以避免此类问题。

## 设置合适的索引

请参阅：[数据库索引](db-index.md)。

## 将JQL查询结果缓存到redis中

请参阅：[jql-cache-redis](jql-cache-redis.md)

## 大数据量时查询语句写法注意

如果您的数据量非常大，在设置合适的索引之后仍然会查询超时，您要考虑以下优化方案。

尽量避免使用skip，至少不应该skip比较大的值，因为skip操作Mongo服务端依然会扫描被skip的数据，带skip操作的耗时和skip的数量线性相关。您可以考虑使用排序和范围查询功能来替代直接使用skip。

对于非常大的数据可以分段来查询，即通过一定的条件将一次查询拆分为多次查询操作。

### 带条件的count@count

如果满足条件的数据特别多，where+count会特别慢，很有可能超时。我们建议不要在大数据量的集合内这样使用count方法。

### 使用skip方法传入较大的值@skip

您应该避免使用where+skip+limit的查询方式来遍历整个集合，因为这种方式随着Skip数量的增长响应时间会越来越慢，还可能会造成请求超时。

下面的代码给出了一个示例。**为避免示例过于复杂，先假设没有两条记录的create_date是相等，如果create_date不能唯一标识数据，可以再额外加入其他字段，比如文章作者等**

按照create_date（创建时间）降序排序，每次查询时都指定查询条件小于上次查询结果中的最后一条记录的create_date，这样不需要使用skip即可实现分页效果，同时还能保证用户在上下翻页的时候不会因为出现新增数据而引起的前后两页数据重复的问题。

```js
const db = uniCloud.database()
const dbCmd = db.command
module.exports = async function(event,context) {
  const {
    lastCreateDate = Date.now(),
    pageSize
  } = event
  if(pageSize > 100){
    throw new Error('单页数据不可超过100条')
  }
  const res = await db.collection('book').where({
    create_date: dbCmd.lt(lastCreateDate)
  })
  .limit(pageSize)
  .get()
}
```

使用上述写法后您应该使用上一页、下一页、上n页（其中n是一个比较小的数字）、下n页的翻页功能来替换随机翻页。您可以参考百度或者谷歌的搜索结果的分页功能，当结果页数非常多时，不展示共有多少页，仅支持在前10页中支持随机翻页；再往下翻页的过程中，不再支持随机翻页，仅支持向下翻一个较小的页数，这样就可以在已经查询出结果的基础上再使用where+skip（少量）+limit+orderBy的方式来快速查询到结果。

### 抽样方法sample

sample操作在大数据量高频触发时会响应缓慢，使用前请务必确定自己的业务场景适合使用sample方法

## clientDB联表查询超时@client-db-lookup

请参考此文档调整优化，[使用getTemp进行联表查询](./jql.md?id=lookup-with-temp)

## 慢查询日志@slow

> 仅阿里云、支付宝云支持

**一般产生慢查询日志都是因为数据表未配置索引，请根据日志内容中的查询条件配置对应索引**。详见[数据库索引相关介绍](./db-index.md)

::: warning 注意事项
阿里云服务空间当每分钟新产生的慢查询日志超过200条或文档扫描数超2000万行时会触发阿里云限流：Throttling.Api: Request was denied due to api flow control. RequestId，导致服务异常。请及时对慢查询进行优化，如合理配置查询索引、优化表结构及业务代码查询条件等。
:::

慢查询的定义：单条查询语句耗时超100毫秒。符合条件的查询会被统计进来。
一个典型的慢查询日志包含以下信息

| 指标名称			     | 说明																																																			                           |
|-------------|---------------------------------------------------------------------------------|
| 数据表			     | 数据库请求操作的数据表的名称				                                                               |
| 查询语句					   | 详细的查询指令模板，例：{"filter":{"invite_code":"?"}}，表示以 invite_code: "xxx" 作为查询条件进行的查询		 |
| 执行开始时间					 | 该慢查询执行开始的时间			                                                                  |
| 执行时长					 | 该慢查询执行的时长（毫秒）						                                                             |
| 文档扫描行数	     | 该慢查询命中数据库内多少条数据，如果索引设置的合适此数值会尽可能的接近索引扫描行数（阿里云返回）				                                    |
| 索引扫描行数	     | 该慢查询命中索引扫描数据库内的数据	（阿里云返回）				                                         |
| 返回行数	     | 该慢查询结果最终匹配数据库内多少条数据，即查询返回的条数				                                                |

其中查询语句是详细的查询日志内容，内容示例如下：
```
{
    "op": "query",
    "command": { // 执行的具体命令
        "find": "uni-id-users", // find命令查询的数据表
        "filter": { // 查询条件
            "invite_code": 'invite_code_value'
        },
        "limit": 1, // 查询一条数据
        "maxTimeMS": { // 最大超时时间，毫秒
            "$numberLong": "5000"
        }
    },
    "keysExamined": 959875, // 查找过程中检查的索引键数量
    "docsExamined": 959875, // 查找过程中检查的文档数量
    "millis": 2214, // 执行耗时，毫秒
}
```
本次查询中，`keysExamined`和`docsExamined`值很大说明可能未配置索引导致全表扫描。此时应前往控制台检查`uni-id-users`表是否配置`invite_code`该查询条件的索引，如未配置可在控制台操作添加，添加后索引生效有一定延迟（需后台执行创建，数据量越大创建越慢）。待索引生效后，该查询命中索引便会减少慢查询，达到优化的目的。

### 阿里云

在慢查询日志到一定量级时，我们会发送邮件通知到服务空间所属账号邮箱，请及时关注并前往[uniCloud web控制台](https://unicloud.dcloud.net.cn/)查看慢查询日志统计和详细信息，参考本文档进行优化。

慢查询日志支持查看统计及详细数据，可查询具体某个数据表的慢查询日志记录。慢查询日志保留时间为7天。

![](https://web-ext-storage.dcloud.net.cn/unicloud/database/aliyun-slow-log-count.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/database/aliyun-slow-log-detail.png)


### 支付宝云
可查询某个特定云函数下的某个数据表或某个数据表的慢查询统计及详细数据。
![](https://web-ext-storage.dcloud.net.cn/unicloud/database/alipay-slow-log-count.png)

![](https://web-ext-storage.dcloud.net.cn/unicloud/database/alipay-slow-log-detail.png)



## 分表和冗余表
如果你的数据表记录条数超过几十万，可以使用分表策略来优化。

比如很多电商系统的订单表，最近3个月的订单是一张表，超期的订单会挪到其他表。银行系统也会把几年前的交易数据归档，防止数据量太大查不动。

冗余表是另一种策略，不是分表，而是把大表中的高频数据单独摘出来成为一张表。其实 [jql-cache-redis](jql-cache-redis.md) 就是一种冗余思路，把数据在redis里多存一份。

## 使用扩展数据库
当数据量庞大，优化索引难以解决内置云数据库的慢查询问题时，可考虑使用[扩展数据库](https://doc.dcloud.net.cn/uniCloud/ext-mongodb/intro.html)来突破性能瓶颈。
