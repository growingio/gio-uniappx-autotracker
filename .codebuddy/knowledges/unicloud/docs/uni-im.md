**uni-im 已开放需求征集和投票** [点此前往](https://vote.dcloud.net.cn/#/?name=uni-im)

# 简介
uni-im 是一款集云端一体、全平台支持、免费且开源的即时通讯系统
- 基于uni-app，App、小程序、web全端兼容
- 基于uniCloud，前后端都使用js开发
- 基于[uni-push2](https://uniapp.dcloud.net.cn/unipush-v2.html)，专业稳定的全端消息推送系统（聚合多个手机厂商推送通道，App关闭后也能收到消息）
- 开放性高，支持非uniCloud（即支持服务端是php、java、go、.net、python、c#等开发语言的项目），甚至非uni-app开发的项目都可以接入使用
- 性价比高，前后端代码均免费开源，与同类产品相比，使用uni-im仅需支付因托管在 uniCloud（serverless 服务器）而产生的少量费用，详情可查看[费用说明部分](#cost)

插件下载地址：[https://ext.dcloud.net.cn/plugin?name=uni-im](https://ext.dcloud.net.cn/plugin?name=uni-im)

## 案例
应用名称：DCloud。此 App 的内置聊天模块即是基于 uni-im 开发的。

web端网址（支持PC宽屏和移动端）：[https://im.dcloud.net.cn/index.html#/](https://im.dcloud.net.cn/index.html#/)

扫码体验： ![](https://web-ext-storage.dcloud.net.cn/doc/im/download.png)

下载地址为：[https://im.dcloud.net.cn/uni-portal.html](https://im.dcloud.net.cn/uni-portal.html)

> uni-im相关功能建议或问题，可以加入由uni-im（本插件）搭建的交流群[点此加入](https://im.dcloud.net.cn/#/?joinGroup=63ef49711d358337456f4d67)

# 快速部署体验

演示视频
[
![](https://web-ext-storage.dcloud.net.cn/doc/im/20241125164315.jpg)
](https://www.bilibili.com/video/BV1BmzcYME8H/?vd_source=b123f8c166833c59567e6923b9aa2013)

注意：实际情况可能与视频存在差异，部分服务空间可能不会自动创建数据表。此时，需打开项目根目录下的：`uniCloud/database` 目录，右键`上传所有DB Schema（含扩展库）`

## 前提条件
1. 创建运行uni-im服务端代码的云服务环境

    注意：这里和你自己项目服务端代码是什么语言开发的，以及运行在什么服务器环境无关。uni-im运行在专有的运行环境uniCloud（一种[serverless 服务器](https://doc.dcloud.net.cn/uniCloud/#%E4%BB%80%E4%B9%88%E6%98%AFserverless)）下。
    你的项目服务端和uni-im的服务端之间分别“独立部署”，二者通过发送 http 请求并借助事件进行通讯。
    当然，如果你的项目服务端也是基于uniCloud开发的，就可以部署在同一个服务空间内；通过云函数互调通讯。

- 公有云
开通地址：[https://unicloud.dcloud.net.cn/](https://unicloud.dcloud.net.cn/) 服务商推荐选择“支付宝云”，性能更好。

- 私有云
普通中小企业项目使用公有云即可，但如果的项目存在特殊需求，例如：政务类、对信息保密性要求较高、用户都在海外的项目，这种情况下则需要进行私有化部署，详情可点击[此处](https://doc.dcloud.net.cn/uniCloud/software/#uni%E4%BA%91%E5%BC%80%E5%8F%91%E8%BD%AF%E4%BB%B6%E7%89%88)。

2. 开通可实时发送消息的推送服务
这里我们需要开通`uni-push`，它是基于个推封装的服务；个推是A股上市公司，专业性在推送领域领先。
开通指南：[点此打开](https://uniapp.dcloud.net.cn/unipush-v2.html#%E7%AC%AC%E4%B8%80%E6%AD%A5-%E5%BC%80%E9%80%9A)

## 体验示例项目
1. 下载示例项目
打开`uni-im`插件下载地址：[https://ext.dcloud.net.cn/plugin?name=uni-im](https://ext.dcloud.net.cn/plugin?name=uni-im) 点击`使用HBuilderX导入示例项目`

2. 绑定项目的服务空间
在项目根目录uniCloud右键选择“关联云服务空间或项目”（注意：选择关联的服务空间，需在项目的 uni-push2.0的[web控制台](https://dev.dcloud.net.cn/pages/app/push2/info)被关联）

3. 创建相关数据表
打开项目根目录：`uniCloud/database` 目录，右键`上传所有DB Schema（含扩展库）`

4. 运行项目
在菜单`运行`->`运行到浏览器` 选择要运行的浏览器
这里需要运行到两个不同的浏览器（避免同一浏览器打开多个uni-im页面，引起socket占线)，`注册账号并登录`2个账号，体验对话效果

5. 向指定用户发起会话
通过访问路径：`/uni_modules/uni-im/pages/chat/chat?user_id=` + `指定用户的id`即可。
如果你不知道用户的id，可通过在浏览器控制台执行`uni.imObservableData.currentUser._id`可获取当前登录的账号id

注意：以上为连接本地云函数体验，如果要发行为正式项目，需要把uniCloud内的文件部署到云端。操作方式为：对项目根目录uniCloud点右键选择“云服务空间初始化向导”界面按提示部署项目

## 部署到自己的项目
> 如果你的项目客户端，不是基于Vue3版本的uni-app + uniCloud + uni-id-pages 或对im的交互性能要求不高，或希望便捷快速地给你的项目增加个客服功能。建议直接使用[uni-im-web-load](/uni-im-web-load.md)部署（即：将uni-im打包发行为web页面，通过web-view的方式集成至项目）。

1. 项目的客户端需要启用uni-push2.0 [详情参考](https://uniapp.dcloud.net.cn/unipush-v2.html#enable-app)
2. 打开`uni-im`插件下载地址：[https://ext.dcloud.net.cn/plugin?name=uni-im](https://ext.dcloud.net.cn/plugin?name=uni-im)
3. 点击`使用HBuilderX导入插件`，选择你的项目，点击确定（同时会自动导入依赖的uni_modules`uni-id-pages`）并按需要配置`pages.json`
4. 打开项目根目录的App.vue文件，初始化uni-id-pages和uniIm模块
示例如下：

```html
<script>
	//1. 导入uni身份信息管理模块
	import uniIdPagesInit from '@/uni_modules/uni-id-pages/init.js';
	//2. 导入uniIm
	import uniIm from '@/uni_modules/uni-im/sdk/index.js';
	// 3.引入扩展插件（项目默认引入了，扩展插件uniImMsgReader用于展示消息是否已读）
	import MsgReaderExtension from '@/uni_modules/uni-im-msg-reader/extension.js'
	export default {
		onLaunch: async function() {
			console.log('App Launch');
			//4. 初始化uni身份信息管理模块
			uniIdPagesInit();
			//5. 安装uniIm扩展插件
			MsgReaderExtension.install()
			//6. 初始化uniIm
			uniIm.init();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>
```

**微信小程序端注意:**
uni-im 的“扩展插件功能“基于“动态组件”实现；而微信小程序并不支持“动态组件”，需要引入vite插件[rollup-plugin-uniapp-cementing.js](https://gitcode.com/dcloud/hello-uni-im/blob/v3/rollup-plugin-uniapp-cementing.js)实现“动态组件静态化”。

示例:
在项目根目录创建：`vite.config.js`，内容如下：
```js
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import cementingPlugin from './rollup-plugin-uniapp-cementing.js'

export default defineConfig({
  plugins: [
    cementingPlugin({
      // 需要静态化的页面路径（支持通配符*）
      include: [
        '**/uni-im-conversation.vue',
        './uni_modules/uni-im/components/uni-im-msg/uni-im-msg.vue',
        './uni_modules/uni-im/components/uni-im-msg/msg-content.vue',
        './uni_modules/uni-im/pages/chat/info.vue'
      ],
      components: {
        // 声明组件，格式 {"$组件名":{"$cementing":"$组件路径"}}
        MsgByType: {
          msgUserCard: '@/uni_modules/uni-im/components/uni-im-msg/types/userinfo-card.vue',
          msgVideo: '@/uni_modules/uni-im/components/uni-im-msg/types/video.vue',
          msgFile: '@/uni_modules/uni-im/components/uni-im-msg/types/file.vue',
          msgHistory: '@/uni_modules/uni-im/components/uni-im-msg/types/history.vue',
          msgRichText: '@/uni_modules/uni-im/components/uni-im-msg/types/rich-text.vue',
          msgCode: '@/uni_modules/uni-im/components/uni-im-msg/types/code.vue',
          msgText: '@/uni_modules/uni-im/components/uni-im-msg/types/text.vue',
          msgSound: '@/uni_modules/uni-im/components/uni-im-msg/types/sound.vue',
          msgImage: '@/uni_modules/uni-im/components/uni-im-msg/types/image.vue',
        },
        MsgExtra: {
          UniImMsgReader: '@/uni_modules/uni-im-msg-reader/components/uni-im-msg-reader/uni-im-msg-reader.vue',
        }
      },
      debug: true
    }),
    uni(),
  ],
  build:{target: 'es2015'},
});
```

5. 配置Schema扩展Js的公共模块或扩展库
先复制示例项目的`/uni_modules/uni-id-pages/uniCloud/database/uni-id-users.schema.json`文件覆盖到自己项目，解决表操作权限问题。
由于uni-im的数据库的触发器依赖了`uni-im-utils`，需要在目录`uniCloud/database`右键 -> 选择“配置Schema扩展Js的公共模块或扩展库” -> 在选择项目的公共模块中找到`uni-im-utils`并勾选 -> 点击确定，完成配置；然后在目录`uniCloud/database`右键 -> 上传Schema扩展Js的配置。

6. 部署到uniCloud
在项目根目录uniCloud点右键，选择“云服务空间初始化向导” 按提示部署项目（注意：选择绑定的服务空间，须在uni-push2.0的[web控制台](https://dev.dcloud.net.cn/pages/app/push2/info)关联）

7. 登录uni-im
基于[uni-id-pages](https://doc.dcloud.net.cn/uniCloud/uni-id/app.html)实现用户体系的项目，
集成 uni-im 不需要考虑账号打通问题，用户登录项目后，不需要额外登录 uni-im。
其他项目，需要通过 uni-im 的客户端 sdk 的[login](#client-login)方法，实现登录。

### 常见问题：
1. 为什么不能实时接收到推送的消息，需要刷新或者关闭重新打开才能收到？
答： uni-im通过`uni-push`实现消息实时送达，请检查是否已开通并正确配置，且在配置正常后重新登录

2. 怎么样快速上手
答：先下载示例项目，部署并正确配置push后，体验没问题了再部署到自己的项目。

3. 非unicloud项目提前导入用户数据
答：通过uni-im的[httpapi](#httpapi)调用login方法，实现用户数据导入。


## 限制普通用户向其他用户发起会话
客服场景下，我们希望管理员客服可以向任意用户发起会话。而普通用户的会话对象只能是客服。
- 客户端限制
删除或隐藏“用户列表页”和“会话列表页”，仅保留“聊天对话页”。并绘制按钮，如：“联系客服”，点击后打开“聊天对话页”
逻辑代码如下：
```js
uni.navigateTo({
	url:'/uni_modules/uni-im/pages/chat/chat?user_id=' + 对应的用户id
})
```

- 服务端限制

1. 添加`uni-im`配置文件，打开：`/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center/`；新建`uni-im`文件夹和`config.json`文件，示例如下：
```json
{
  "conversation_grade": 100,
	"customer_service_uids":["user-id-01","user-id-02"]
}
```

2. 配置customer_service_uids[详情查看](#uni-im-cloud-config)

# 开发文档
## 目录结构
<pre v-pre="" data-lang="">
<code class="lang-" style="padding:0">
├── changelog.md // 变更日志文件，记录版本更新内容
├── common
│   ├── baseStyle.scss // 基础样式文件，用于定义通用的样式规则
│   └── config.js // 配置文件，包含项目的各种配置参数
├── components
│   ├── uni-im-chat-input
│   │   ├── emojiCodes.js // emoji表情代码文件，存储表情相关的代码信息
│   │   └── uni-im-chat-input.vue // 对话界面输入框组件，用于用户输入聊天内容
│   ├── uni-im-choose-user // 用户选择组件，用于选择特定用户
│   ├── uni-im-contextmenu // 自定义右键菜单组件（web - pc专用），提供右键操作功能
│   ├── uni-im-conversation // 会话组件，展示单个会话信息
│   ├── uni-im-conversation-list // 会话列表组件，展示所有会话的列表
│   ├── uni-im-editor // 编辑器组件，用于编辑聊天内容相关功能
│   ├── uni-im-filtered-conversation-list // 过滤后的会话列表组件（搜索聊天记录时展示），显示符合搜索条件的会话
│   ├── uni-im-friendly-time // 友好时间显示组件，将时间戳转换为更易读的时间格式显示
│   ├── uni-im-group-notification // 群公告组件，用于展示群公告信息
│   ├── uni-im-icons
│   │   ├── uni-im-icons.ttf // 图标字体文件，提供项目中使用的图标字体
│   │   └── uni-im-icons.vue // 图标组件，使用图标字体来显示各种图标
│   ├── uni-im-img // 图片组件，用于显示聊天中的图片信息
│   ├── uni-im-info-card // 信息卡片组件，用于展示用户、群组等相关信息卡片
│   ├── uni-im-load-state // 加载状态提示组件，提示用户当前的加载状态
│   ├── uni-im-member-list // 成员列表组件，用于展示群成员
│   ├── uni-im-msg
│   │   ├── popup-control.vue // 弹出式消息操控组件（集成：撤回、复制、回复、转发、多选），提供对聊天消息的操作功能
│   │   ├── types
│   │   │   ├── code.vue // 代码类型消息组件，用于显示代码内容消息
│   │   │   ├── file.vue // 文件类型消息组件，用于显示文件相关消息
│   │   │   ├── history.vue // 历史类型消息组件（转发的聊天记录），用于显示转发的聊天记录信息
│   │   │   ├── image.vue // 图片类型消息组件，用于显示图片消息内容
│   │   │   ├── order.vue // 订单类型消息组件，用于显示订单相关消息（如果有此功能）
│   │   │   ├── rich-text.vue // 富文本类型消息组件，用于显示富文本内容消息
│   │   │   ├── sound.vue // 声音类型消息组件，用于显示声音相关消息
│   │   │   ├── system.vue // 系统类型消息组件，用于显示系统相关消息
│   │   │   ├── text.vue // 纯文本类型消息组件，用于显示纯文本内容消息
│   │   │   ├── userinfo-card.vue // 用户信息卡片类型消息组件，用于显示用户信息卡片消息
│   │   │   └── video.vue // 视频类型消息组件，用于显示视频相关消息
│   │   └── uni-im-msg.vue // 聊天消息组件，是聊天消息的基础组件
│   ├── uni-im-msg-list
│   │   ├── components
│   │   │   ├── filter-contorl // 过滤控制组件，用于控制消息列表的过滤功能
│   │   │   └── uni-im-list // 消息列表子组件，用于显示具体的消息列表内容
│   │   └── uni-im-msg-list.vue // 消息列表组件，用于显示聊天消息的列表
│   ├── uni-im-share-msg // 分享消息界面组件，用于展示分享的消息内容（当仅兼容web-pc端）
│   ├── uni-im-sound // 录音组件，用于录制声音消息
│   └── uni-im-view-msg // 用于浏览分享的历史聊天记录组件，方便用户查看分享的聊天历史
├── license.md // 源码使用许可协议文件，规定了代码的使用许可条款
├── package.json // 包管理文件，包含项目依赖的各种包信息以及项目的一些基本信息
├── pages
│   ├── chat
│   │   ├── chat-filtered.vue // 简版对话页面（搜索聊天记录时展示），用于在搜索聊天记录时显示简化的聊天界面
│   │   ├── chat.vue // 聊天对话页，用于正常的聊天交互界面
│   │   ├── components
│   │   │   └── chat-fragment.vue // 渲染会话中一个片段的消息列表，用于显示某条消息搜索结果的上下文列表组件，帮助用户查看搜索消息的上下文
│   │   └── info.vue // 对话详情页面（显示好友信息，可在此页面操作删除好友），展示聊天对象的详细信息并提供相关操作功能
│   ├── common
│   │   ├── video 播放视频专用组件，用于播放聊天中的视频内容
│   │   └── view-code-page // 全屏代码浏览页面，用于全屏查看代码类型的消息内容
│   ├── contacts
│   │   ├── addPeopleGroups // 查找并添加用户或群组件，用于添加新的用户或群组
│   │   ├── contacts.vue // 联系人页面组件，展示联系人列表
│   │   ├── createGroup // 创建群聊组件，用于创建新的群组
│   │   ├── groupList // 我的群列表组件，展示用户所在的群列表信息
│   │   └── notification
│   │       ├── action.js // 操作相关脚本文件，用于处理系统通知的相关操作逻辑
│   │       └── notification.vue // 系统通知组件，用于显示系统通知信息
│   ├── group
│   │   ├── info.vue // 群信息页面（管理群）组件，用于显示和管理群信息
│   │   ├── members.vue // 成员页面组件，用于展示群成员信息
│   │   └── qrCode.vue // 群二维码页面组件，用于显示群的二维码信息
│   ├── index
│   │   ├── index.scss // 首页样式文件，用于定义首页的样式规则
│   │   └── index.vue // 首页组件，展示会话列表等主要信息
│   └── userList 所有用户列表页组件（仅管理员账号可用），用于管理员查看所有用户信息
├── readme.md // 项目说明文件，用于介绍项目的功能、使用方法等信息
├── sdk
│   ├── ext
│   │   ├── CloudData.class.js // 云数据相关类文件，用于处理与云端数据相关的操作
│   │   ├── index.js // 扩展目录索引文件，用于组织和导出该目录下的模块
│   │   └── indexDB.js // indexDB数据库相关文件，用于操作indexDB数据库
│   ├── index.js // SDK索引文件，用于组织和导出SDK中的模块
│   ├── init
│   │   ├── EasyWebNotification.js // 简单网页通知相关脚本，用于在网页端实现简单的通知功能
│   │   ├── checkVersion.js // 版本检查脚本，用于检查项目的版本信息
│   │   ├── clearData.js // 清空数据脚本，用于清除项目中的相关数据
│   │   ├── getCloudMsg.js // 获取云端消息脚本，用于获取在掉线期间缺失的云端消息
│   │   ├── imData.js // 初始化基本数据脚本，用于初始化项目的基本数据
│   │   ├── index.js // 初始化目录索引文件，用于组织和导出该目录下的模块
│   │   ├── msgEvent.js // 消息事件脚本，用于处理消息相关的事件
│   │   ├── onAppActivateStateChange.js // 应用激活状态改变相关脚本，用于处理应用激活状态变化时的操作
│   │   ├── onNotification.js // 系统消息通知相关，用于处理各种通知相关的操作，包括：用户加群申请、加好友申请等
│   │   ├── onSocketStateChange.js // socket连接状态改变相关脚本，用于处理socket连接状态变化时的操作
│   │   ├── onlyOneWebTab.js // 限制web-pc端只能单选项卡打开本应用相关脚本，用于控制web-pc端的应用打开方式
│   │   └── sqlite.js // sqlite数据库相关脚本，用于操作sqlite数据库
│   ├── methods
│   │   ├── extensions.js // 扩展相关脚本，用于实现项目的扩展功能
│   │   ├── friend.js // 好友相关脚本，用于处理好友相关的操作
│   │   ├── index.js // 方法目录索引文件，用于组织和导出该目录下的模块
│   │   ├── msgTypes.js // 消息类型相关脚本，用于定义处理不同类型的消息
│   │   ├── notification.js // 系统消息相关脚本，用于处理系统消息相关的操作
│   │   └── users.js // 用户相关脚本，用于处理用户相关的操作
│   ├── state
│   │   ├── Conversation.class.js // 会话类定义文件，定义了会话相关的类和属性
│   │   ├── ConversationItem.class.js // 会话项类定义文件，用于表示会话列表中的单个会话项相关信息
│   │   ├── Friend.class.js // 好友类定义文件，定义了好友相关的类和属性
│   │   ├── Group.class.js // 群组类定义文件，定义了群组相关的类和属性
│   │   ├── GroupItem.class.js // 群组项类定义文件，用于表示群列表中的单个群组项相关信息
│   │   ├── GroupMember.class.js // 群成员类定义文件，定义了群成员相关的类和属性
│   │   ├── MsgItem.class.js // 消息项类定义文件，定义了消息相关的类和属性
│   │   ├── data.js // 数据相关脚本，用于存储和管理项目中的数据
│   │   ├── index.js // 状态目录索引文件，用于组织和导出该目录下的模块
│   │   └── msg.class.js // 消息类定义文件，定义了消息相关的类和属性
│   └── utils
│       ├── appEvent.js // 应用事件脚本，用于处理应用生命周期相关的事件
│       ├── createObservable.js // 创建响应式对象脚本，用于创建可观察的响应式对象
│       ├── highlight
│       │   ├── github-dark.min.scss // github深色主题样式文件，用于代码高亮显示的样式设置（是在特定主题下）
│       │   └── highlight-uni.min.js // 代码高亮相关脚本（适用于uni平台），用于实现代码高亮功能
│       ├── html-parser.js // html字符串转化为节点专用库脚本，用于将html字符串解析为节点结构
│       ├── index.js // 工具目录索引文件，用于组织和导出该目录下的模块
│       ├── markdown-it.min.js // markdown相关脚本库，用于处理markdown格式的文本
│       ├── md5.min.js // md5哈希加密算法脚本（用于本地直接生成会话id），用于生成md5哈希值
│       ├── shortcut-key.js // web-pc快捷键相关脚本，用于处理快捷键操作
│       └── toFriendlyTime.js // 时间戳转友好的时间表达脚本，用于将时间戳转换为更易读的时间格式
└── uniCloud
    ├── cloudfunctions
    │   ├── common
    │   │   ├── uni-im-ext
    │   │   │   ├── index.js // uni-im扩展相关的云函数索引文件，用于组织和导出该目录下的云函数模块
    │   │   │   └── package.json // uni-im扩展相关的包管理文件，包含该部分的依赖信息等
    │   │   └── uni-im-utils
    │   │       ├── SymmetricEncryption.class.js // 对称加密相关类文件，用于实现对称加密功能
    │   │       ├── index.js // uni-im工具相关的云函数索引文件，用于组织和导出该目录下的云函数模块
    │   │       └── package.json // uni-im工具相关的包管理文件，包含该部分的依赖信息等
    │   └── uni-im-co
    │       ├── conversation.js // 会话相关的云函数文件，用于处理会话相关的云操作
    │       ├── filtered-conversation.js // 过滤后的会话相关的云函数文件（用于搜索聊天记录相关云操作）
    │       ├── friend.js // 好友相关的云函数文件，用于处理好友相关的云操作
    │       ├── group.js // 群组相关的云函数文件，用于处理群组相关的云操作
    │       ├── index.obj.js // 运函数入口文件
    │       ├── msg.js // 消息相关的云函数文件，用于处理消息相关的云操作
    │       ├── package.json // 包管理文件，包含该部分的依赖信息等
    │       ├── push.js // 推送相关的云函数文件，用于处理推送相关的云操作
    │       └── tools.js // 工具相关的云函数文件，提供一些通用的云函数工具功能
    └── database
</code>
</pre>
名词解释
- 聊天会话ID
根据通讯双方用户id，或群聊id，生成的唯一的固定值；用于更加方便对会话数据的操作及聊天记录查找等。
- 聊天会话
一组描述会话状态的数据，记录：未读消息数量、会话更新时间、会话类型、会话所属用户的id、对话的用户id、对话的群id、最后一条消息概述（文本消息的前15个字，消息为多媒体时只描述类型）等，更多详情参考项目根目录下的`/uni_modules/uni-im/uniCloud/database/uni-im-conversation.schema.json`文件

## uni-im-co 云函数（云对象）
API列表

|API								|描述																																	|
|--									|--																																		|
|login							|用户登录，[见下方](#client-login)																				|
|getConversationList|获取会话列表[见下方](#cogetconversationlist)														|
|sendMsg						|发送聊天消息[见下方](#cosendmsg)																				|
|sendPushMsg				|触发器专用消息推送方法																										|
|sendMsgToGroup			|向群用户递归推送消息[见下方](#cosendmsgtogroup)														|
|addFriendInvite		|向用户发起加好友邀请[见下方](#coaddfriendinvite)													|
|chooseUserIntoGroup|选择用户加入群聊（不传群id时为创建群）[见下方](#cosendmsgtogroup)						|
|revokeMsg					|撤回已经发送的消息[见下方](#corevokemsg)																	|

uni-im-co 云函数（云对象）支持：`在uni-app客户端`及`外部服务器`调用。
### 在uni-app客户端调用
示例代码：
```js
// 导入uni-im-co云对象
const uniImCo = uniCloud.importObject('uni-im-co', {customUI: true});
const functionName = "方法名"
const param = "请求参数"
// 请求时会自动带上用户的uni-id-token和客户端信息
await uniImCo[functionName](param);
```
更多[详情参考](https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%B0%83%E7%94%A8)

### 在外部服务器调用@httpCallImCo
在实际应用中，常有外部服务器模拟用户执行向其他用户发消息、撤回消息、拉群等操作。
例如：创建一个名为“系统通知”的用户，通过接口向其他用户发送系统通知。

1. 获取http请求的网络地址
在项目根目录的uniCloud目录右键，选择“打开uniCloud web控制台” -> 云函数/云对象 -> 云函数/云对象列表 -> 找到“云对象uni-im-co” -> 点击右侧的“详情”-> 在页面最下方可以看到“云函数URL化”点击“复制路径“。

2. 实现安全通讯
为防止uni-im-co的url化链接，遭受非法HTTP请求，其默认设置为禁止访问。若要启用访问功能，需配置安全通讯密钥，以此建立可信的访问通道。
- **文件路径**：`/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center/uni-cloud-s2s/config.json`（如果没有需要自己创建）。
	配置内容为：
	```json
	{
		"type": "connectCode",
		"connectCode": "youConnectCodeValue"
	}
	```
	其中 youConnectCodeValue 为你配置的 connectCode 密钥，用一个较长的字符串即可，不可包含中文。配置此密钥是为了后续在请求时进行安全通讯验证。
	> 此安全通讯基于`uni-cloud-s2s`实现，有：`connectCode` 和 `数据签名`2种安全通讯验证方式，这里以`connectCode`为例。如您希望通过数据签名验证[详情参考](https://doc.dcloud.net.cn/uniCloud/uni-cloud-s2s.html)

3. 通讯规范
```js
// 以下是一个POST请求示例，用于模拟用户001向用户002发送文本消息
POST /uni-im-co/sendMsg HTTP/1.1 // "/uni-im-co"是固定值，"/sendMsg"是要请求的方法名
Host: xxx.com // 这里的Host需填写步骤①中获取到的http网络地址的域名
Content-Type: application/json
Cache-Control: no-cache // 此处设置可根据实际需求调整，比如是否允许缓存等情况，当前设置为不缓存
Unicloud-S2s-Authorization: "CONNECTCODE youConnectCodeValue" // 配置安全通讯验证信息，"CONNECTCODE" + " " + 你配置的密钥
[
	{
		"type": "text", // 表示消息类型为文本
		"to_uid": "is002user_id", // 接收消息用户的id
		"body": "你好002，我是001", // 消息具体内容
		"appId": "应用的appid" // 应用对应的appId
	},
	{
		"userInfo":{
			"_id":"is001user_id" // 必填参数，表示操作当前方法的账号id
		}
	}
]
```

完整的body 是一个长度为 2 的数组，且每一项都是对象：
```js
[
	{请求参数},
	{
		"userInfo":"用户信息，详情查看：https://gitee.com/dcloud/opendb/blob/master/collection/uni-id-users/collection.json",
		"clientInfo":"客户端信息（可选），详情查看：https://uniapp.dcloud.net.cn/api/system/info.html"
	}
]
```

补充示例（为了方便进一步理解，以在uniCloud中请求外部接口为例）：
```js
// uni-im-co云对象url化后的网络地址
const uniImCoUrl = "https://xx.com/uni-im-co"
// 要请求的方法名
const functionName = "/sendMsg"
// http请求的网络地址
const url =  uniImCoUrl + functionName
await uniCloud.httpclient.request(url,
  {
    method: "POST",
    dataType: 'json',
    headers: {
      "Unicloud-S2s-Authorization": "CONNECTCODE youConnectCodeValue",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    data: [
		{
			"type": "text",
			"to_uid": "is002user_id",
			"body": "你好002，我是001",
			"appId": "__UNI__XXXXXX"
		},
		{
			"userInfo":{
				"_id": "is001user_id"
			}
		}
    ]
  })
```

### httpApi @httpapi
已废弃。uni-im-co已支持通过http访问云对象内的任意方法，无需额外请求httpApi方法。详情查看[在外部服务器调用uni-im-co](#httpCallImCo)

### 获取会话列表 getConversationList@cogetconversationlist
**参数说明**

|参数名								|类型		|必填	|说明																					|
|--										|--			|--		|--																						|
|limit								|number	|否		|数量，默认值：500																|
|maxLastMsgCreateTime	|number	|否		|最大的会话的最后一条消息的创建时间（实现高性能分页）	|
|page									|number	|是		|页码																					|

**返回值**

|参数名	|类型								|说明						|
|--			|--									|--							|
|errCode|string&#124;number	|错误码，0表示成功	|
|errMsg	|string							|错误信息					|
|data		|array							|会话数据					|

### 发送聊天消息 sendMsg@coSendMsg

|参数名		|类型		|必填	|说明																																																																																																															|
|--				|--			|--		|--																																																																																																																|
|appId		|string	|是		|接收消息的appId；如果是两个不同 appId 的应用相互发送消息，请修改此值为“相对”的 appId																																																																												|
|to_uid		|string	|否		|接收消息的用户id																																																																																																										|
|group_id	|string	|否		|接收消息的群id																																																																																																											|
|body			|string	|是		|消息内容，`type = text`时为文本内容.`type = image`时为图片网络地址																																																																																			|
|type			|string	|是		|消息类型，暂时仅支持：text(表示文本类型)、image(表示图片类型)、voice(表示声音类型)、video(表示视频类型)、file(表示文件类型)、system(表示系统消息)、rich-text(表示富文本类型)、userinfo-card(表示用户信息卡片类型)、code(表示代码类型)、history(表示历史类型)	|
|isRetries|Boolean|否		|是否为重发																																																																																																													|

**返回值**

|参数名													|类型								|说明						|
|--															|--									|--							|
|errCode												|string&#124;number	|错误码，0表示成功	|
|errMsg													|string							|错误信息					|
|data														|object							|								|
|&nbsp;&#124;-&nbsp;create_time	|无									|创建时间					|

**接口形式**

```js
const uniImCo = uniCloud.importObject('uni-im-co', {
  customUI: true
});
await uniImCo.sendMsg({
  to_uid:"630cacf46293d20001f3c368",
  type:"text",
  body:"您好！"
})
```

### 向群用户递归推送消息 sendMsgToGroup@coSendMsgToGroup
注意：这是一个递归云对象，500个设备为一组批量向用户推送消息（该方法仅允许云对象或者触发器调用）

|参数名					|类型		|必填	|说明																																																																																														|
|--							|--			|--		|--																																																																																															|
|appId					|string	|是		|接收消息的应用appId																																																																																								|
|pushParam			|object	|是		|参数同uni-push2.0的sendMessage方法，详情参考[https://doc.dcloud.net.cn/uniCloud/uni-cloud-push/api.html#sendmessage](https://doc.dcloud.net.cn/uniCloud/uni-cloud-push/api.html#sendmessage)	|
|before_id			|string	|否		|从哪个用户id开始（用于实现高性能分页）																																																																																|
|push_clientids	|array	|否		|个推设备id列表																																																																																										|

**返回值**

|参数名	|类型								|说明						|
|--			|--									|--							|
|errCode|string&#124;number	|错误码，0表示成功	|
|errMsg	|string							|错误信息					|

### 撤回已发送的消息 revokeMsg@coRevokeMsg
|参数名	|类型		|必填	|说明		|
|--			|--			|--		|--			|
|msgId	|string	|是		|消息id	|

**返回值**

|参数名	|类型								|说明						|
|--			|--									|--							|
|errCode|string&#124;number	|错误码，0表示成功	|
|errMsg	|string							|错误信息					|


### 向用户发起加好友邀请 addFriendInvite@coAddFriendInvite

|参数名	|类型		|必填	|说明					|
|--			|--			|--		|--						|
|to_uid	|string	|是		|被邀请的用户id	|
|message|string	|否		|请求信息				|

**返回值**

|参数名	|类型								|说明						|
|--			|--									|--							|
|errCode|string&#124;number	|错误码，0表示成功	|
|errMsg	|string							|错误信息					|

### 选择用户加入群聊 chooseUserIntoGroup@coSendMsgToGroup

|参数名		|类型		|必填	|说明								|
|--				|--			|--		|--									|
|group_id	|string	|否		|群id（为空则创建群）	|
|user_ids	|string	|是		|用户id数组						|

**返回值**

|参数名											|类型								|说明						|
|--													|--									|--							|
|errCode										|string&#124;number	|错误码，0表示成功	|
|errMsg											|string							|错误信息					|
|data												|object							|返回信息					|
|&nbsp;&#124;-&nbsp;group_id|string							|群id						|


## 服务端配置@uni-im-cloud-config
路径：`/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center/uni-im/config.json`

|字段名								|数据类型					|说明																															|
|--										|--							|--																																|
|customer_service_uids|string/boolean	|客服用户id，不限制则填`false`即可；仅conversation_grade的值为100时有效	|
|conversation_grade		|int						|控制发起会话的条件，详情[会话控制](#conversation-grade)								|

### 会话控制@conversation_grade

|值	|说明																	|
|--	|--																		|
|0	|不限制																|
|100|仅限当前用户向：客服、好友、群成员发起会话	|
|200|仅限当前用户向：好友或群成员发起会话				|
|300|限制向：系统管理员 或 群管理员 或 好友 发起会话|


## 客户端sdk@clientSkd
入口文件路径:`@/uni_modules/uni-im/sdk/index.js`

|名称												|类型						|说明																																																																																																|
|--													|--							|--																																																																																																	|
|login  										|function				|登录账号，[详情查看](#client-login)																																																																	|
|logout				  						|function				|退出登录																																																																	|
|isDisabled 								|boolean				|是否禁用（当同一个浏览器，多个页签打开引起的占线时使用）|
|conversation								|object					|会话对象																																																																																															|
|currentConversationId			|string					|正在对话的会话id																																																																																											|
|heartbeat									|timestamp			|心跳（精确到秒）详情：[心跳概念说明](#heartbeat-explain)																																																																									|
|friend											|object					|好友对象																																																																																															|
|group											|object					|聊天群对象																																																																																														|
|notification								|object					|系统通知对象																																																																																													|
|users      								|object					|存储所有出现过的用户信息，包括群好友信息																																																																																	|
|isWidescreen								|boolean				|是否为pc宽屏																																																																																													|
|isTouchable								|boolean				|是否为触摸屏																																																																																													|
|systemInfo									|object					|系统信息详情参考：[https://uniapp.dcloud.net.cn/api/system/info.html#系统信息的概念](https://uniapp.dcloud.net.cn/api/system/info.html#%E7%B3%BB%E7%BB%9F%E4%BF%A1%E6%81%AF%E7%9A%84%E6%A6%82%E5%BF%B5)	|
|indexDB										|object/boolean	|indexDB对象（仅web端有效）																																																																																						|
|audioContext								|object/boolean	|audio对象																																																																																														|
|dataBaseIsOpen							|boolean				|判断本地sqlite数据库是否已经打开(仅app端有用)																																																																														|
|socketIsClose  						|boolean				|记录socket是否关闭																																																																	|

其中`conversation,msg,friend,group,notification`继承类`/uni_modules/uni-im/sdk/ext/CloudData.class.js`类，均拥有:
- 属性

|名称			|作用								|
|:--:			|:--:								|
|dataList	|数据列表							|
|hasMore	|表示是否有更多数据		|
|loading	|表示加载状态					|
|loadLimit|分页加载时的单页记录数	|

- 方法

|名称			|作用																											|
|:--:			|:--:																											|
|reset		|重置数据																										|
|remove		|移除数据																										|
|find			|查找本地数据（不联网，确保本地存在时使用；一般用于挂在计算属性上）	|
|get			|获取数据	（根据条件联网查找）																	|
|getMore	|获取数据（下一页数据）																				|
|loadMore	|加载更多数据（获取下一页数据，并添加到dataList）								|
|set			|设置数据																										|
|add			|添加数据																										|
|update		|更新数据																										|

### login@client-login
适用于非unicloud或用户体系前端非uni-id-pages的项目登录im，同时实现同步你项目的用户数据到uni-im的数据库中。

**前提条件** ：需要配置uni-id的 `tokenSecret` `tokenExpiresIn` `tokenExpiresThreshold`[详情查看](https://doc.dcloud.net.cn/uniCloud/uni-id/summary.html#config)

此方法根据uni-im服务端配置中`get_external_userinfo`字段的值，支持两种登录模式：
> 配置路径：`uniCloud/cloudfunctions/common/uni-config-center/uni-im/config.json`

1. 配置为："use-param"，则表示支持直接在客户端传递用户信息，不需要服务端验证，完成登录。
适用于：无账号体系的、支持游客临时登录的，或不关心发消息用户身份可靠性的项目。

**参数说明**

|名称				|类型		|说明																																																																																										|
|--					|--			|--																																																																																											|
|_id				|string	|	用户唯一标识，推荐使用`设备id`，详情：[deviceId](https://uniapp.dcloud.net.cn/api/system/info.html#deviceid-%E8%BF%94%E5%9B%9E%E5%80%BC%E8%AF%B4%E6%98%8E)当然你也可以使用浏览器指纹等其他特征。	|
|nickname		|string	|	自定义用户昵称																																																																																						|
|avatar_file|object	|	自定义用户头像对象，																																																																																			|

示例：
```js
import uniIm from '@/uni_modules/uni-im/sdk/index.js';
uniIm.login({
	_id: uni.getDeviceInfo().deviceId,
	nickname: '自定义用户昵称',
	avatar_file: {
		url: 'https://img.yzcdn.cn/vant/cat.jpeg',
	}
})
```

2. 配置为：“获取你的用户信息接口地址”（接口规范：[详情点此](./uni-im-web-load.md#getuserinfo)#{target=_blank}），则支持使用你项目的token登录
原理为：客户端传递token到uni-im云端，uni-im云端请求你配置的接口实现：验证token的有效性、获取用户信息，添加或者更新用户信息到uni-im的数据库，返回uni-id-token给客户端，完成登录。

**参数说明**

|名称					|类型		|说明																																																																		|
|--						|--			|--																																																																			|
|token				|string	|适用于主项目为非unicloud项目，与uni_id_token字段二选一|
|user_id			|string	|适用于主项目为非unicloud项目，如果token不是jwt未包含user_id需再传user_id</br>具体根据你提供的getUserInfo接口要求																																|
|uni_id_token	|string	|适用于用户体系服务端为uni-id（含4.0以前旧版），但客户端不是uni-id-pages的unicloud项目</br>与token字段二选一。|

示例：
```js
import uniIm from '@/uni_modules/uni-im/sdk/index.js';
uniIm.login({
	//如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
	token: uni.getStorageSync('token'),
	//如果你项目的用户信息不是存在storage内或key值不是current_user_id需要根据实际情况修改
	user_id: uni.getStorageSync('current_user_id')

	// 与token字段，两个参数二选一
	// uni_id_token:  uni.getStorageSync('uni_id_token')
})
```

### 心跳概念说明heartbeat@heartbeat-explain

uni-im的会话列表和消息列表，需要显示实时的发生时间。而一个应用开启太多的定时器，会消耗较大的系统性能。
所以uni-im提供了一个每秒钟更新一次的响应式数据`heartbeat`，由uniImInit方法：启用一个定时器刷新，挂载在全局，所有应用场景引用这一个变量即可


使用示例：
```js
import uniIm from '@/uni_modules/uni-im/sdk/index.js';
```

- 获取会话数据

1. 拿到全部本地会话数据
```js
// 这是一个响应式数据对象，可以直接挂到计算属性上
let conversationList = uniIm.conversation.dataList
```
2. 获取指定会话的id会话数据
```js
//xxx表示会话id
let param = "xxx"
let conversation = await uniIm.conversation.get(param)
```
3. 获取指定好友id的会话数据（如果本地不存在则从云端拉取，仍然不存在则本地自动创建）
```js
//xxx表示好友id
let param = {"friend_uid":"xxx"},
let conversation = await uniIm.conversation.get(param)
```
4. 获取指定群聊id的会话数据（如果本地不存在则从云端拉取，仍然不存在则本地自动创建）
```js
//xxx表示群聊id
let param = {"group_id":"xxx"}
let conversation = await uniIm.conversation.get(param)
```

5. 移除/隐藏会话（软删除，有新消息后自动恢复）
```js
let conversation = await uniIm.conversation.get(param)
await conversation.hide()
```

- 加载会话数据

1. 加载更多会话数据（默认根据会话最后一条消息排序）
```js
await uniIm.conversation.loadMore()
```

2. 加载指定会话id的会话数据
```js
// xxx表示会话id
let param = 'xxx'
let conversationData = await uniIm.conversation.loadMore(param)
```

**返回值**

|属性名						|类型					|说明																	|
|--								|--						|--																		|
|id								|string				|当前会话id															|
|title						|string				|普通会话为对方的用户名或昵称、群会话为群昵称	|
|avatar_file			|uniCloud file|普通会话为对方的用户头像、群会话为群头像		|
|unread_count			|number				|未读消息数															|
|user_id					|string				|对话的用户id（群聊会话时为空）						|
|group_id					|string				|对话的群聊id（普通会话时为空）						|
|update_time			|timestamp		|更新时间（每次会话会更新）								|
|msgList					|array				|当前会话聊天数据列表											|
|chatInputContent	|string				|当前会话的文本框文字内容									|


- 获取所有消息的未读数
```js
let unreadCount = await uniIm.conversation.unreadCount()
```

- 获取系统消息数据

1. 不限类型
```js
let param = null
await uniIm.notification.get(param)
```

2. 指定类型（单个）
```js
// uni-im-group-join-request 表示加群通知
let param = {type:"uni-im-friend-invite"}
await uniIm.notification.get(param)
```

3. 指定类型（多个）
```js
// uni-im-group-join-request uni-im-friend-invite 表示加群通知、好友加请求通知
let param = {type:["uni-im-friend-invite","uni-im-friend-invite"]}
await uniIm.notification.get(param)
```

4. 排除类型（单个）
```js
// uni-im-group-join-request 表示加群通知
let param = {excludeType:"uni-im-friend-invite"}
await uniIm.notification.get(param)
```

5. 排除类型（多个）
```js
// uni-im-group-join-request uni-im-friend-invite 表示加群通知、好友加请求通知
let param = {excludeType:["uni-im-friend-invite","uni-im-friend-invite"]}
await uniIm.notification.get(param)
```

- 加载系统消息数据
参数与`获取系统消息数据`一致

- 获取好友数据
```js
// 这是一个响应式数据对象，可以直接挂到计算属性上
uniIm.friend.dataList
```

- 加载更多好友数据
1. 分页加载
```js
await uniIm.friend.loadMore()
```
2. 加载指定好友数据
```js
let param = {"friend_uid":"xxx"}
await uniIm.friend.loadMore(param)
```
- 获取群列表数据
```js
// 这是一个响应式数据对象，可以直接挂到计算属性上
uniIm.group.dataList
```

- 加载更多群数据
1. 分页加载
```js
await uniIm.group.loadMore()
```
2. 加载指定群聊数据
```js
let param = {"group_id":"xxx"}
await uniIm.group.loadMore(param)
```

- 添加用户信息到本地用户信息库
```js
// xxx表示用户数据
let usersInfo = {xxx}
await uniIm.users.merge(usersInfo)
```

#### 工具类库@utils
utils封装了uni-im常用方法的模块，路径：`/uni_modules/uni-im/sdk/utils/index.js`

|名称							|类型			|说明																														|入参																							|返回值																																							|
|--								|--				|--																															|--																								|--																																									|
|getConversationId|function	|获取会话id																												|对话的用户id或群id 详见[详见](#get-conversation-id)	|无																																									|
|toFriendlyTime		|function	|用于将时间戳转友好时间提示（距离当前2小时内的时间戳，每隔一秒钟会刷新一次）	|时间戳：timestamp																	|格式化后的时间字符串。如：x年x月x日，昨天，下午，1小时前等																	|

##### 获取会话id@get-conversation-id
1. 获取单聊会话id
```js
let friend_uid = "xxx"
uniIm.utils.getConversationId(friend_uid,'single')
```
2. 获取群聊会话id
```js
let group_id = "xxx"
uniIm.getConversationId(group_id,'group')
```

## 重要更新说明：
- [V2.0.14,V2.0.13](https://ext.dcloud.net.cn/plugin?id=9711&update_log) 更新解决了：uni-id-users表的触发器`uni-id-users.schema.ext.js`的兼容性问题。
这个问题可能会和你的项目产生冲突，请升级或者下载最新版的uni-im复制`uni_modules/uni-im/unicloud/database/uni-id-users.schema.ext.js`文件复制到你的项目中以覆盖原文件。

## 项目升级
uni-im遵循uni-app的插件模块化规范，即：[uni_modules](https://uniapp.dcloud.io/uni_modules)。

在项目根目录下的`uni_modules`目录下，以插件ID即`uni-im`为插件文件夹命名，在该目录右键也会看到“从插件市场更新”选项，点击即可更新该插件。也可以用插件市场web界面下载覆盖。


# 许可协议
uni-im源码使用许可协议

2022年10月

本许可协议，是数字天堂（北京）网络技术有限公司（以下简称DCloud）对其所拥有著作权的“DCloud uni-im”（以下简称软件），提供的使用许可协议。

您对“软件”的复制、使用、修改及分发受本许可协议的条款的约束，如您不接受本协议，则不能使用、复制、修改本软件。

授权许可范围

a) 授予您永久性的、全球性的、免费的、非独占的、不可撤销的本软件的源码使用许可，您可以使用这些源码制作自己的应用。

b) 您只能在DCloud产品体系内使用本软件及其源码。您不能将源码修改后运行在DCloud产品体系之外的环境，比如客户端脱离uni-app，或服务端脱离uniCloud。

c) DCloud未向您授权商标使用许可。您在根据本软件源码制作自己的应用时，需以自己的名义发布软件，而不是以DCloud名义发布。

d) 本协议不构成代理关系。

DCloud的责任限制
“软件”在提供时不带任何明示或默示的担保。在任何情况下，DCloud不对任何人因使用“软件”而引发的任何直接或间接损失承担责任，不论因何种原因导致或者基于何种法律理论,即使其曾被建议有此种损失的可能性。

您的责任限制

a) 您需要在授权许可范围内使用软件。

b) 您在分发自己的应用时，不得侵犯DCloud商标和名誉权利。

c) 您不得进行破解、反编译、套壳等侵害DCloud知识产权的行为。您不得利用DCloud系统漏洞谋利或侵害DCloud利益，如您发现DCloud系统漏洞应第一时间通知DCloud。您不得进行攻击DCloud的服务器、网络等妨碍DCloud运营的行为。您不得利用DCloud的产品进行与DCloud争夺开发者的行为。

d) 如您违反本许可协议，需承担因此给DCloud造成的损失。

本协议签订地点为中华人民共和国北京市海淀区。

根据发展，DCloud可能会对本协议进行修改。修改时，DCloud会在产品或者网页中显著的位置发布相关信息以便及时通知到用户。如果您选择继续使用本框架，即表示您同意接受这些修改。

条款结束

# 使用uniCloud产生的费用说明@cost

uni-im本身并不收费，实际使用中需要依赖uniCloud云服务，会产生费用；而uniCloud的价格很实惠：
- 调用10000次云函数仅需0.0133元
- 调用10000次数据库查询仅需0.015元
> 更多计费参考：[支付宝云版uniCloud按量计费文档](https://doc.dcloud.net.cn/uniCloud/price.html#alipay)

举例说明：
- 单聊场景，向用户发送一条消息的过程：
1. 调用uni-im-co云对象的sendMsg方法（产生1次云函数请求）
2. 查询当前对话的会话记录（产生1次云数据库读操作）
3. 根据步骤2的查询结果，如果已经有会话记录，就更新会话，否则就创建一条会话记录（产生1次云数据库写操作）
4. 查询发送消息的用户信息，用于接收消息时在通知栏显示发送者昵称和头像（产生1次云数据库读操作）
5. 记录发送的消息内容到数据库，用于保存消息历史记录（产生1次云数据库写操作）
6. 以`user_id`为标识通过`uni-push2`向用户发送消息会产生0.00000283元uniCloud使用费用[详情查看](https://uniapp.dcloud.net.cn/unipush-v2.html#cost)

合计：1次云函数请求、2次数据库读操作、2次数据库写操作、1次uni-push2推送操作，即 (1 * 0.0133 + 2 * 0.015 + 2 * 0.05 + 1 * 0.0283)/10000 ≈ 0.000017元

- 群聊场景，向用户发送一条消息的过程：
1. 调用uni-im-co云对象的sendMsg方法（产生1次云函数请求）
2. 查询当前用户是否为群成员，防止非群成员发送消息（产生1次云数据库读操作）
3. 查询当前对话的会话记录（产生1次云数据库读操作）
4. 根据步骤3的查询结果，如果已经有会话记录，就更新会话，否则就创建一条会话记录（产生1次云数据库写操作）
5. 查询发送消息的用户信息，用于接收消息时在通知栏显示发送者昵称和头像（产生1次云数据库读操作）
6. 记录发送的消息内容到数据库，用于保存消息历史记录（产生1次云数据库写操作）
7. 以群id为参数，调用uni-im-co云对象的sendMsgToGroup方法，这是一个递归方法每次向500名群成员推送消息（如果群成员数量为0-500只需执行1次，500-1000需执行2次，以此类推），（会产生最少1次数据库读操作，和1次以`user_id`为标识通过`uni-push2`向用户发送消息会产生0.00000283元uniCloud使用费用[详情查看](https://uniapp.dcloud.net.cn/unipush-v2.html#cost)）

合计：向500人群发送消息，会产生：1次云函数请求、4次数据库读操作、2次数据库写操作、1次uni-push2推送操作，即 (1 * 0.0133 + 4 * 0.015 + 2 * 0.05 + 1 * 0.0283)/10000 ≈ 0.000020元

相比市面上同类型产品，使用uni-im仅需花费如此便宜的uniCloud（serverless服务器）费用；在价格这块uni-im性价比极高。

>注：由于uni-im会持续升级，其服务端运行逻辑也会不断优化，或新增其他逻辑，这可能导致上述费用计算方法中的数据库操作次数发生变化。因此，此处的费用算法仅作参考。
