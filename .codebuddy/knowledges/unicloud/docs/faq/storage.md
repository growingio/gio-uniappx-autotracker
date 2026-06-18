## 云存储相关问题

### 云存储文件无法访问，图片、apk等文件无法下载 || 控制台获取文件报错 Access Denied

前往服务空间详情查看cdn相关资源用量是否超上限，可通过以下方案解决：
- 包年包月套餐空间：可以通过`升配`、`转按量计费`、`开通超限按量`（仅腾讯云、支付宝云支持）解决；
- 按量计费空间：检查账号余额是否充足。

### 空间过期停服或账号欠费停服，续费或充值后服务恢复，但云存储仍无法访问

停服恢复后，云存储cdn访问恢复大约需要10分钟左右

### 如何查询云存储哪些文件访问较多，消耗流量较大？

可开启“cdn安全策略”，开启后支持查看前一日topUrl、topIp、topReferer，文档：[https://doc.dcloud.net.cn/uniCloud/storage/cdn-security-policy.html](https://doc.dcloud.net.cn/uniCloud/storage/cdn-security-policy.html)

**注意：仅阿里云、支付宝云支持**

### 还没有使用，就多了几次读写次数

云存储的读写次数，并不一定是针对文件的，以下操作也会被计算读写次数：
- 上传文件、修改Policy、修改ACL、修改CORS 等操作，都会被认为是COS写。
- 环境初始化时也会执行很多次初始化操作，写入 policy/acl/cors 等配置信息。
- 用户每次操作`修改安全域名`、`修改静态域名`等，也会触发 CORS 的写入。

### 云存储的CDN费用感觉有点贵，有没有更好的方案？

为帮助开发者降低费用，DCloud联合业内其它主流CDN厂商，单独提供了价格更便宜、功能更强大的uniCloud扩展存储，详见[文档](https://doc.dcloud.net.cn/uniCloud/ext-storage/intro.html)。
