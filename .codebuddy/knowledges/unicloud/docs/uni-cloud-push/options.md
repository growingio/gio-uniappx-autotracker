实现部分厂商特定功能，包括仅部分厂商支持、不常用或厂商临时新增的功能（不依赖 uni-push，厂商文档支持的参数可直接使用）。

例如要实现发送消息时在:
- 安卓系统的小米手机下，实现铃声并对app版本号进行筛选
- 安卓系统的华为手机下，实现铃声并设置富文本内容
- 鸿蒙系统的华为手机下，指定本次推动为测试消息
- iOS系统下设置灵动岛id
用法为：
```js
const pushManager = uniCloud.getPushManager({"appId":"__UNI__DEMO123"})
return await pushManager.sendMessage({
  title:"消息标题",
  content:"消息内容",
  // ...其他参数略，可参考：https://doc.dcloud.net.cn/uniCloud/uni-cloud-push/api.html#%E5%85%A5%E5%8F%82%E8%AF%B4%E6%98%8E
  options: {
    android:{
      "XM": {
        // 实现铃声
        "/extra.sound_uri": "小米后台申请的自定义 sound_url 地址",
        "/extra.channel_id": "小米后台申请的通知类别id",
        // 对app版本号进行筛选
        "/extra.app_version": "v3.3.0"
      },
      "HW":{
        //实现铃声
        "/message/android/notification/default_sound": false,
        "/message/android/notification/channel_id": "RingRing4",
        "/message/android/notification/sound": "/raw/ring001",
        // 设置富文本内容
        "/message/android/notification/image": "公网可以访问的https图标链接",
        "/message/android/notification/style": 1,
        "/message/android/notification/big_title": "big_title",
        "/message/android/notification/big_body": "big_body"
      }
    },
    harmony:{
      "HW":{
        "/pushOptions/testMessage": true
      }
    },
    ios: {
      laId:"灵动岛id",
      // 略，详情 https://docs.getui.com/getui/server/rest_v2/common_args/#ios-
    }
  }
})
```

更多用法参规范：
- Android和harmony查看：[https://docs.getui.com/getui/server/rest_v2/third_party/](https://docs.getui.com/getui/server/rest_v2/third_party/)
- ios节点的参数规范查看[https://docs.getui.com/getui/server/rest_v2/common_args/#ios-](https://docs.getui.com/getui/server/rest_v2/common_args/#ios-)

options参数对照[个推push完整请求体](https://docs.getui.com/getui/server/rest_v2/common_args/#doc-title-2)的关系如下：
|uni-push	|个推															|
|--				|--																|
|	android	|push_channel.android.ups.options	|
|	harmony	|push_channel.harmony.options			|
|	ios			|push_channel.ios									|


注意：关于离线推送，需确认云端推送时填写的`channel_id`与[客户端设置](https://uniapp.dcloud.net.cn/api/plugins/push.html#channelmanager)的一致。

<div class="weixin-support">
    <div class="weixin-support-focus">
        <img src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/weixin.png" alt="" class="weixin-support-icon">
        联系
        <br>
        个推
    </div>
    <div class="weixin-support-content">
		<img src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/support.jpg" alt="" class="weixin-support-icon">
       微信扫一扫
		<br>
        随时联系个推技术支持
    </div>
</div>

<style>
.weixin-support {
  position: fixed;
  z-index: 10;
  bottom: calc(10% + 265px);
  right: 230px;
}
@media screen and (max-width: 1499px) {
	.weixin-support {
	  right: 10px;
	}
}
.weixin-support img{
	background: #0591F0;
}
.weixin-support-focus {
  padding: 10px 8px;
  color: #fff;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  background: #0591F0;
  box-shadow: 0px 4px 8px rgba(0, 105, 202, 0.24);
  border-radius: 2px;
}
.weixin-support-focus .iconfont{
  display: block;
  font-size: 16px;
  text-align: center;
}
.weixin-support-icon{
  width: 30px;
  display: block;
  margin-bottom: 2px;
  margin-top: -4px;
}
.weixin-support-content {
  z-index: 10;
  display: none;
  position: absolute;
  right: 50px;
  top: -100px;
  background-color: #fff;
  padding: 20px;
  margin-right: 10px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  width: 200px;
  font-size: 14px;
  box-shadow: 0 0 10px #ccc;
}
.weixin-support:hover .weixin-support-content{
  display: block;
}
.weixin-support-content img{
  display: block;
  height: 200px;
  width: 200px;
}
</style>