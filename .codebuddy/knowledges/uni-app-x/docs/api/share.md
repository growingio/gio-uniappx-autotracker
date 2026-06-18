<!-- ## uni.share(options) @share -->

::: sourceCode
## uni.share(options) @share

> GitCode: https://gitcode.com/dcloud/uni-api/tree/alpha/uni_modules/uni-share


> GitHub: https://github.com/dcloudio/uni-api/tree/alpha/uni_modules/uni-share

:::

分享


### share 兼容性 
| Web | 微信小程序 | Android | iOS | HarmonyOS | HarmonyOS(Vapor) |
| :- | :- | :- | :- | :- | :- |
| <a style="color:unset;" href="https://vote.dcloud.net.cn/#/?name=uni-app%20x">x</a> | - | 5.08 | 5.08 | 4.81 | 5.0 |


### 参数 

| 名称 | 类型 | 必填 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- | :- |  :-: | :- |
| options | **ShareOptions** | 是 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - |  |

#### options 的属性描述

| 名称 | 类型 | 必备 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- | :- |  :-: | :- |
| provider | string | 否 | weixin | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享服务提供商，通过uni.getProvider获取，如果不设置则默认 weixin |
| type | number | 否 | 0 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享类型。默认图文0 |
| title | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 标题 |
| scene | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 场景 |
| summary | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 摘要 |
| href | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 跳转链接 |
| imageUrl | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 图片地址 |
| mediaUrl | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 音视频地址 |
| miniProgram | **ShareMiniProgramShareOptions** | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享小程序 |
| openCustomerServiceChat | boolean | 否 | false | Web: x; 微信小程序: -; Android: x; iOS: x; HarmonyOS: 5.0 | 是否启用拉起客服功能，为 true 时除 `corpid`、`customerUrl` 外其他参数无效 |
| corpid | string | 否 | - | Web: x; 微信小程序: -; Android: x; iOS: x; HarmonyOS: 5.0 | 客服ID，`openCustomerServiceChat` 为 true 时必填<br/> |
| customerUrl | string | 否 | - | Web: x; 微信小程序: -; Android: x; iOS: x; HarmonyOS: 5.0 | 客服的页面路径，`openCustomerServiceChat` 为 true 时必填<br/> |
| success | (result: ShareSuccess) => void | 否 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - | 接口调用成功的回调函数 |
| fail | (result: [ShareFail](#sharefail-values)) => void | 否 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - | 接口调用失败的回调函数 |
| complete | (result: any) => void | 否 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - | 接口调用结束的回调函数（调用成功、失败都会执行） | 

##### type 的属性描述

| 合法值 | 兼容性 | 描述 |
| :- |  :-: | :- |
| 0 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 图文 |
| 1 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 纯文字 |
| 2 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 纯图片 |
| 3 | Web: x; 微信小程序: -; Android: x; iOS: x; HarmonyOS: x; HarmonyOS(Vapor): x | 音乐 |
| 4 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 视频 |
| 5 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 小程序 |

##### scene 的属性描述

| 合法值 | 兼容性 | 描述 |
| :- |  :-: | :- |
| WXSceneSession | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享到聊天界面 |
| WXSceneTimeline | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享到朋友圈 |
| WXSceneFavorite | Web: x; 微信小程序: -; Android: x; iOS: x; HarmonyOS: x; HarmonyOS(Vapor): x | 分享微信收藏 |

##### miniProgram 的属性描述

| 名称 | 类型 | 必备 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- | :- |  :-: | :- |
| id | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 微信小程序原始id |
| path | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 点击链接进入的页面 |
| type | number | 否 | 0 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 微信小程序版本类型，默认为0。 |
| webUrl | string | 否 | - | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 兼容低版本的网页链接 |

###### type 的属性描述

| 合法值 | 兼容性 | 描述 |
| :- |  :-: | :- |
| 0 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 正式版 |
| 1 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 测试版 |
| 2 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 体验版 |

#### ShareFail 的属性值 @sharefail-values 

| 名称 | 类型 | 必备 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- | :- |  :-: | :- |
| errCode | number | 是 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - | 错误码 |
| errSubject | string | 是 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - | 统一错误主题（模块）名称 |
| data | any | 否 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - | 错误信息中包含的数据 |
| cause | [Error](https://uniapp.dcloud.net.cn/tutorial/err-spec.html#unierror) | 否 | - | - | 源错误信息，可以包含多个错误，详见SourceError |
| errMsg | string | 是 | - | Web: x; 微信小程序: -; Android: -; iOS: -; HarmonyOS: - |  |

#### errCode 的属性描述

| 合法值 | 兼容性 | 描述 |
| :- |  :-: | :- |
| 4000500 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 未找到微信APPID,请确认 manifest.json 中配置信息是否正确 |
| 4000501 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 该场景字段当前不支持 |
| 4000502 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 该场景字段未匹配到 |
| 4000503 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享类型不匹配，请确认类型是否正确 |
| 4000504 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 参数填写错误 |
| 4000505 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 请求微信接口失败 |
| 4000506 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 暂不支持该类型的分享 |
| 4000507 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 图片下载失败 |
| 4000508 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 加载本地文件失败 |
| 4000509 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 获取缩略图失败 |
| 4000510 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 微信可能未安装 |
| 4000511 | Web: x; 微信小程序: -; Android: 5.08; iOS: 5.08; HarmonyOS: 4.81; HarmonyOS(Vapor): 5.0 | 分享失败 |




<!-- UTSAPIJSON.share.example -->


### 参见
- [相关 Bug](https://issues.dcloud.net.cn/?mid=api.share.share)
- [参见uni-app相关文档](https://uniapp.dcloud.net.cn/api/plugins/share.html)
- [微信小程序文档](https://developers.weixin.qq.com/doc/search.html?source=enter&query=share&doc_type=miniprogram)
- [支付宝小程序文档](https://open.alipay.com/portal/zhichi/search?keyword=share&pageIndex=1&pageSize=10&source=doc_top&type=all)
- [百度小程序文档](https://smartprogram.baidu.com/forum/search?query=share&scope=devdocs&source=docs)
- [抖音小程序文档](https://developer.open-douyin.com/search-page?keyword=share&secondType=all&type=1)
- [飞书小程序文档](https://open.feishu.cn/search?from=header&page=1&pageSize=10&q=share&topicFilter=)
- [钉钉小程序文档](https://open.dingtalk.com/search?keyword=share)
- [QQ小程序文档](https://q.qq.com/wiki/develop/miniprogram/frame/)
- [快手小程序文档](https://developers.kuaishou.com/page?keyword=share&from=docs)
- [京东小程序文档](https://mp-docs.jd.com/doc/dev/framework/-1)
- [华为快应用文档](https://developer.huawei.com/consumer/cn/doc/quickApp-References/webview-frame-overview-0000001124793625)
- [360小程序文档](https://mp.360.cn/doc/miniprogram/dev/#/b770a184ff1f06c6b3393a0fd1132380)

### 分享provider对象描述 @providerdes

UniShareWeixinProvider(微信分享)继承自 [UniProvider](./provider.md#uniprovider)


| 名称           | 类型      | 必备 | 默认值  | 描述                                  |
| -------------- | --------- | ---- | ------ | ------------------------------------- |
| isWeChatInstalled     | boolean   | 是    | -      | 判断微信是否安装 |


## 通用类型


### GeneralCallbackResult 

| 名称 | 类型 | 必备 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- | :- |  :-: | :- |
| errMsg | string | 是 | - | Web: -; 微信小程序: 4.41; Android: -; iOS: -; HarmonyOS: - | 错误信息 |

## 自定义分享provider接入到uni API @customprovider

背景：目前uni-app x引擎已经内置了微信分享。但分享SDK还有很多，比如微博、抖音分享。

以往这些SDK可以通过独立插件的方式集成到uni-app x中，但需要提供单独的API给开发者使用。

uni-app x从4.25起，开放了provider自接入机制，让三方SDK可以以[provider](./provider.md)方式被开发者集成。

开发一个UTS插件，对接uni规范化的API、错误信息描述等实现自己的分享插件，这样插件使用者就可以通过uni的标准API使用三方SDK。

举个例子，开发者想使用uni.share()的方式调用XX分享，但是内置分享api不支持，

那只需要按照下面四个步骤实现即可:

第一步，新建一个UTS插件，在interface.uts 中定义接口，UniShareProvider，代码如下

```ts
export interface UniShareWeixinProvider extends UniShareProvider{}
```

第二步，在app-android或者app-ios的index.uts中实现接口，代码如下

```ts
import { UniShareWeixinProvider } from '../interface.uts'
export class UniShareWeixinProviderImpl implements UniShareWeixinProvider {
	override id : String = "XX" // id必须有插件作者前缀，避免冲突，避免不同插件作者的插件id重名
	override description : String = "XX的描述"
	override isAppExist : boolean | null = null

	constructor(){}

	override share(options : ShareOptions) {
		//todo 具体逻辑，接收uni规范的入参，进行业务处理，返回uni规范的返回值。如遇到错误，按uni的规范返回错误码
	}
}
```

第三步，在manifest.json中配置

```ts
  "app": {
    "distribute": {
      /* android打包配置 */
      "modules": {
        "uni-share":{
          "XX":{}
        }
      }
    }
  }
```

第四步，打包自定义基座然后运行

### Bug&Tips @bug_tips

- HarmonyOS 平台分享图片时仅支持 jpeg/png 类型的图片
  - 分享视频，大小不能超过 64KB
  - 分享图片，大小不支持超过 100KB
- HarmonyOS 平台分享携带文本时
  - title 不支持超过 512 个字节
  - summary 不支持超过 1024 个字节
- 鸿蒙平台，HBuilderX 4.87 及以下版本，分享时有图片大于 20 KB 会出现分享失败的问题。临时方案是下载 [har包](https://web-ext-storage.dcloud.net.cn/temp/uni_modules__uni_share_weixin_x.har)并改名为 `uni_modules__uni_share_weixin.har`，放到 `项目根目录/harmony-configs/libs/` 目录下重新编译运行到手机。高版本不存在此问题
