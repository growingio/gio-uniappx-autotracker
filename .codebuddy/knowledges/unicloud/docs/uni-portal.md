## uni-portal 统一发布页@uni-portal

App/小程序/网站做好后，如何告知你的用户？

你需要为自己的业务制作一个名片，名片上统一展现：App 的下载地址、小程序二维码、H5访问链接等，也就是“统一发布页”。

而你自己从头开发这么一个发行平台，需要考虑的事情太多了：

- 响应式布局，兼容PC/Mobile各种尺寸
- 微信/微博浏览器判断不同逻辑，右上角提示通过浏览器打开
- PC上制作二维码，方便用户直接扫码下载
- 如果小程序有多个版本，微信、支付宝、百度、QQ、快应用，那搞起来。。。

别急，有了`uni-portal`统一发布页，一切迎刃而解，10分钟内搞定所有。

眼见为实，`uni-app`官方示例的发布页就是基于`uni-portal`制作的，快速体验[hello uni-app发布页](https://hellouniapp.dcloud.net.cn/portal)。

`uni-portal`目前已内置在`uni-admin`项目中。

管理员在`uni-admin`的“应用管理”模块，创建应用并完善相关应用信息（如apk下载地址、小程序二维码）后，点击“发布页管理”，即可生成该应用的发布页。

`uni-portal` 统一发布页面是响应式的，兼容PC宽屏和手机窄屏。

- **PC宽屏**

  ![alt text](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-portal-pc.png)#{width=800}

- **手机窄屏**

手机浏览器上，默认展示效果如下：

  ![alt text](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-portal-mobile.png)#{width=200}

`uni-portal`统一发布页同时会识别当前浏览器环境，在微信等特殊浏览器上，自动提示“点击右上角菜单，在浏览器中打开”，效果如下：

  ![alt text](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-portal-mp.jpg)#{width=200}

### 获取 iOS ABM 包 @ios-abm <Badge text="uni-admin 2.4.4+" />

> 以下图片都以 hello-uniapp x 发布页为例

1. 在 uni-admin 后台的 `应用管理 -> App 信息 -> iOS` 中填写 `获取 ABM 应用登录链接` 后，重新生成发布页
	- `获取 ABM 应用登录链接` 格式：

  ![alt text](https://web-ext-storage.dcloud.net.cn/uni-app-x/ios_abm/admin_ios_abm.png)#{.zooming width=600}

2. 重新生成的发布页在使用 iPhone 访问的时候，会出现 `获取 ABM 应用` 按钮：

	![](https://web-ext-storage.dcloud.net.cn/uni-app-x/ios_abm/get_ios_abm_page.PNG)#{.zooming width=200}

3. 点击该按钮后会有一个提示：

	![](https://web-ext-storage.dcloud.net.cn/uni-app-x/ios_abm/get_ios_abm_toast.jpg)#{.zooming width=200}

4. 如果点击确定，则会跳转至在 `应用管理` 中配置的 `获取 ABM 应用登录链接` 进行登录，如在 hello-uniapp x 中：

	![](https://web-ext-storage.dcloud.net.cn/uni-app-x/ios_abm/dcloud_uni_id_login.jpg)#{.zooming width=200}

5. 登录完成后需要携带参数重定向到处理页面（[示例](https://gitee.com/dcloud/ios-abm-page-example)）

   如 hello-uniapp x 发布页：登录后会携带 oauthToken 重定向到处理页面，校验 oauthToken 后使用云对象去 `opendb-ios-redeem-code` 表（在示例中有 schema）中换取 ABM 兑换码，跳转至 AppStore 消费兑换码，自动下载安装 App
