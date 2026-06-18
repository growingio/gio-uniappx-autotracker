## HTTPS 证书托管

> 本功能仅支付宝云服务空间支持。
## 简介

为云函数自定义域名和静态站点自定义域名的HTTPS 证书提供自动监测与更新功能。当证书接近有效期时，将自动执行域名验证并生成新证书，无需您手动替换，节省您的证书维护时间。

## 使用指南
 1. 在[uniCloud控制台](https://unicloud.dcloud.net.cn "uniCloud控制台") --> 支付宝云服务空间详情 --> 扩展服务 --> HTTPS证书托管页面单击**新增证书**。
 
 ![](https://web-ext-storage.dcloud.net.cn/unicloud/https/cert_list.png)
 
 2. 在**新增证书** 弹窗配置如下信息后单击**确定**。
 
![](https://web-ext-storage.dcloud.net.cn/unicloud/https/create_cert_1.png)
 
 **配置说明**
 
 |配置项    |说明	|
 |:-:		|:-:        |
 |证书名称	|  根据实际情况自定义证书名称。建议使用英文字母、英文句号、数字、下划线（_）和短划线（-）|
 | 域名类型    | 函数自定义域名、静态站点自定义域名       |
 |域名   | 根据域名类型选择对应域名        |
 |描述    | （非必填）建议输入证书使用场景       |
 | 域名服务商  |  输入对应 key 后台将自动验证域名更新证书 |
 
 **补充**
 
 - 域名服务商：
	- 阿里云：
	 1. 使用阿里云主账号登录[阿里云控制台](https://homenew.console.aliyun.com/?spm=a2c4g.11186623.0.0.56d94c5cN9M6yn)或RAM管理员（拥有AliyunRAMFullAccess权限的RAM用户）登录[RAM控制台](https://ram.console.aliyun.com/?spm=a2c4g.11186623.0.0.56d94c5cN9M6yn)。
	 2. 在左侧导航栏，选择身份管理 > 用户。
	 3. 在用户页面，单击**创建用户** 输入登录名称，访问方式勾选**OpenAPI调用访问**。
	 
		![](https://web-ext-storage.dcloud.net.cn/unicloud/https/create_aliyun_user_1.png)
		 
	 4. 用户创建成功后，在用户列表页面，单击目标用户登录名称 进入用户管理页面。
	 
	    **新增授权**
		
		![](https://web-ext-storage.dcloud.net.cn/unicloud/https/aliyun_permission_3.png)
	 
	    **创建AccessKey**
	    
	    ![](https://web-ext-storage.dcloud.net.cn/unicloud/https/create_accesskey_1.png)
	    	 
 
 
 
 3. 更新记录：在 HTTPS 证书列表任一证书**操作**列单击**更新记录**，即可查看对应更新时间的更新操作记录。
 
 4. 删除：在 HTTPS 证书列表任一证书**操作**列单击**删除**，**注意**：删除后无法恢复，请谨慎操作。
 
 5. 开通/关闭托管：在 HTTPS 证书列表任一证书**托管**列**开通/关闭**。
