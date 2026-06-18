`uniCloud` 提供了 2 种类型的 nosql 数据库。

- JSON文档型云数据库

	uniCloud阿里云版的云数据库就是 MongoDB 的 serverless版；uniCloud腾讯云版的云数据库是兼容 MongoDB 的自研数据库；uniCloud支付宝云版的云数据库是兼容部分 MongoDB 语法的自研数据库；

	数据库中的每条记录都是一个 JSON 格式的对象。

	一个数据库可以有多个集合（相当于关系型数据中的表），集合可看做一个 JSON 数组，数组中的每个对象就是一条记录，记录的格式是 JSON 对象。

	这对于js工程师而言，非常容易理解掌握。

	MongoDB的传统操作方法还是比较复杂，uniCloud提供了更多简单操作数据库的方案，包括类似 SQL 的 JQL 语法、clientDB等技术。

	在uniCloud中，云数据库、MongoDB数据库，这些概念一般都是指这个数据库，更多云数据库介绍[参考](../hellodb.md)。
	
	同时针对支付宝云和阿里云专门推出了扩展数据库，扩展数据库在 **​​性能上限**、**成本控制**、**功能自由度**​​ 和 **​​容灾能力​​** 上全面领先空间内置数据库，尤其适合需要 ​​**弹性扩展**、**高并发处理**、**自动化运维​​** 或 **​​多云架构​​** 的企业级场景，具体可[参考](../ext-mongodb/intro.md)。

- redis 数据库

	redis 是一种可以运行在内存中的键值对数据库，它的能力没有MongoDB强大，但由于可运行在内存中，它的性能远超常规数据库。

	redis 也使用 json 方式 key/value 键值对存储数据。更多文档[参考](../redis.md)


如果开发者需要其他数据库，比如 MySQL、ElasticSearch、数据湖，这些数据库没有在uniCloud的服务空间内置，云函数中通过 Node.js 的 api 可以访问这些远程数据库。

如果是业务方面的 MySQL，建议通过 uniCloud web 控制台数据导入或通过云函数将 MySQL 数据导入到 uniCloud 的云数据库中，这样速度比连接远程 MySQL 数据库要更快，
并且可以使用 JQL、clientDB 等一系列 uniCloud 提供的数据库操作技术，uniCloud 庞大的生态如 uni-id、uni-admin 也都只支持 uniCloud 云数据库。

如果是 es搜索、大数据分析，则应该通过云函数中 nodejs API 远程连接这些数据库使用。