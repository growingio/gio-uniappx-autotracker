## 前端网页托管相关问题

### 部署网站到前端网页托管报`The requested file was not found on this server.`

部署history模式的uni-app项目时，如果未修改前端网页托管的配置，直接访问子页面时就会遇到上面的错误。如何配置请参考[部署uni-app项目](https://doc.dcloud.net.cn/uniCloud/hosting.html#host-uni-app)

### 阿里云前端网页托管域名报错指引@ali-hosting-domain

1. 错误信息：`该域名已经被添加过，不能重复添加`
    - 前端网页托管会和阿里云上其他的CDN业务（包括但不限于CDN）冲突，如需绑定到前端网页托管请先将此域名与其他业务解除关联。

2. 错误信息：`The root domain of your domain is reserved by another account`
    - 当前域名有在阿里云开通全站加速相关业务（可能配置了泛域名加速），与前端网页托管冲突。可以考虑使用三级域名或去除泛域名加速改为单独配置需要加速的域名。

3. 错误信息：`DomainNotRegistration: Domain name not registered.` 
    - 绑定域名需要在阿里云完成ICP备案，该域名未备案或尚未在阿里云进行ICP备案。

### 阿里云默认域名访问时报错 `ClientIpNotAllowed Your clientIp xxx does not in the whitelist.`

阿里云默认域名仅供测试使用，每分钟最多60次请求，默认每日仅允许10个公网IP访问。超出部分，需通过手动方式将来源IP加入白名单，IP白名单也会有数量限制。绑定自定义域名后可解除这些限制。文档：[https://doc.dcloud.net.cn/uniCloud/hosting.html#default-domain-ip-whitelist](https://doc.dcloud.net.cn/uniCloud/hosting.html#default-domain-ip-whitelist)

### 阿里云刷新缓存报错 `QuotaExceeded.Refresh: exceed the prescribed limits`

阿里云每个账号下的所有空间每小时刷新次数上限为10次

### 腾讯云默认域名有什么限制

腾讯云限速100K/s，建议绑定自定义域名使用，防止后续默认域名的产品策略更新影响线上使用

### 腾讯云绑定了自定义域名，更新ssl证书后一直部署中，导致https无法访问

可尝试删除域名后重新绑定，如仍有问题，通过uniCloud web控制台“紧急报障”联系客服解决。

### 如何获取备案码

一般情况下，需要在公有云厂商（阿里云、腾讯云等）购买带公网IP的云服务器来获取备案码，为了方便开发者获取备案码，支付宝云服务空间提供了备案码获取能力，[详见](https://doc.dcloud.net.cn/uniCloud/price.html#%E5%A4%87%E6%A1%88%E7%A0%81)
