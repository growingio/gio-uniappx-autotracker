## 云数据库相关问题

### 微信云开发支持客户端直接操作数据库，uniCloud支持吗？

uniCloud提供了比微信云开发更优秀的前端操作数据库方案，见：[clientDB](../clientdb.md)

### 如何导入老数据库的数据？

- 方式1：可以在HBuilderX里用db_init.json来批量创建云数据库和插入表内容，[详见](https://uniapp.dcloud.io/uniCloud/cf-database?id=%e4%bd%bf%e7%94%a8db_initjson%e5%88%9d%e5%a7%8b%e5%8c%96%e9%a1%b9%e7%9b%ae%e6%95%b0%e6%8d%ae%e5%ba%93)
- 方式2：阿里云支持在uniCloud web控制台界面直接导入导出数据
- 方式3：在云函数里，使用nodejs标准写法，连接老数据库，如使用mysql的[插件](https://ext.dcloud.net.cn/plugin?id=1925)，把数据读出来，再批量写入云数据库
- 方式4：将一个云函数URL化，用其他语言读取老数据库，通过http方式提交到云函数，云函数将接收到的数据存入云数据库

### uniCloud云数据库如何实现全文检索

uniCloud的云数据库本身就是文档型数据库，可以全文检索。

查询数据时可以传入正则表达式。相比sql的like只有前后的%，正则表达式要强大的多。详情请参考[正则表达式查询](https://uniapp.dcloud.io/uniCloud/cf-database?id=regexp)

当然如果你需要额外配置ElastciSearch等三方数据库，也可以自己找服务器安装这些服务，同步数据，把需要搜索的数据同步过去。

### 单次请求超时时间是多久？是否支持调整

- 阿里云：单次请求超时时间为5s，不支持调整
- 腾讯云：单次请求超时时间为5s，不支持调整
- 支付宝云：单次请求超时时间默认为5s，支持设置5~300s，参考文档 [https://doc.dcloud.net.cn/uniCloud/hellodb.html#init-db](https://doc.dcloud.net.cn/uniCloud/hellodb.html#init-db)

### MongoDB的版本是多少？

- 阿里云：4.2
- 腾讯云：底层非MongoDB，兼容MongoDB4.0版本协议
- 支付宝云：底层非MongoDB，兼容MongoDB4.2版本协议

### 阿里云数据表和索引已删除，但是创建表或索引时仍提示已到上限

数据表和索引数量有2小时缓存，删除后会在2小时后更新

### 阿里云数据库慢查询定义是什么

单次查询耗时100ms以上

### 阿里云请求云函数报错 `{“success”:false,”error”:{“code”:”FunctionBizError”,”message”:”InternalBizError:mongo_cell_decision_not_found”}}`

可以先创建一张表，然后再重试。

### 还没有使用就产生了读写次数

开发者通过uniCloud web控制台访问数据库会增加少量读写次数

### uniCloud云数据库限制比较多，有没有性能更好的数据库？

DCloud提供了**uni扩展数据库**来帮开发者解决高性能、高可用相关问题，详见[文档](https://doc.dcloud.net.cn/uniCloud/ext-mongodb/intro.html)。
