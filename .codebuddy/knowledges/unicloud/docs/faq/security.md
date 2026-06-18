## 安全相关问题

### 关于DDoS

对于针对ip地址进行的流量攻击是无法到达云函数的，云厂商的网关会拦截此类攻击流量。如果攻击者模拟真实请求，此时可以通过云函数[IP防刷](../ip-filter.md)功能，进行一定程度的防护。云厂商也正在提供网关层面的防刷机制。

如何处理针对云存储的流量攻击，参考：[阿里云云存储安全策略](../storage/cdn-security-policy.md)

### 等级保护认证

- DCloud官方可以承接全国各地的等保测评服务。详见[文档](https://uniapp.dcloud.net.cn/tutorial/djbh.html)。
- 如需云厂商提供等级保护证书，请发送邮件到service@dcloud.io申请，邮件模板参考：[申请解除限制邮件模板](../price.md#apply-email-template)
