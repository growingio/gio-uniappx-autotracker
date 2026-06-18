---
source: https://gitcode.com/dcloud/uni-ui-x/tree/alpha/uni_modules/uni-link
---

::: sourceCode
## uni-link
:::

链接组件




### 兼容性
| Web | 微信小程序 | Android | Android(Vapor) | iOS | iOS(Vapor) | HarmonyOS | HarmonyOS(Vapor) |
| :- | :- | :- | :- | :- | :- | :- | :- |
| 5.07 | 5.07 | 5.07 | <a style="color:unset;" href="https://vote.dcloud.net.cn/#/?name=uni-app%20x">x</a> | 5.07 | <a style="color:unset;" href="https://vote.dcloud.net.cn/#/?name=uni-app%20x">x</a> | 5.07 | 5.07 |


### 属性 
| 名称 | 类型 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- |  :-: | :- |
| href | string | "" | - | 链接地址，点击组件时要打开的 URL |
| target | "_blank" \| "_self" | "_self" | - | 打开方式。"_self" 在当前应用内置 webview 中打开；"_blank" 在外部浏览器中打开（小程序端会复制链接提示用户外部打开） |
| blankFallback | "turn-self" \| "copy-link-modal" \| "none" | "turn-self" | - | `target="_blank"`失败时，可以通过本属性控制失败回退策略。"turn-self"使用_self方式打开；"copy-link-modal"复制链接并弹框提醒；"none"不回退，触发失败回调 |
| @error | Event | - | - | - |

<!-- UTSCOMJSON.uni-link.fileFormates -->



<!-- UTSCOMJSON.uni-link.component_type -->



### 示例
示例为[hello uni-app x alpha分支](https://gitcode.com/dcloud/hello-uni-app-x/blob/prod_alpha/pages/uni-ui/link/link.uvue)，与最新HBuilderX Alpha版同步。与最新正式版同步的master分支示例[另见](https://gitcode.com/dcloud/hello-uni-app-x/blob/master//pages/uni-ui/link/link.uvue) 
::: preview https://hellouniappx.dcloud.net.cn/web/#/pages/uni-ui/link/link

> appRedirect https://hellouniappx.dcloud.net.cn/appredirect.html?path=pages/uni-ui/link/link

>示例
```vue
<template>
  <scroll-view class="page">
    <view class="section">
      <text class="section-title">基础用法</text>
      <view class="link-block">
        <uni-link href="https://uniapp.dcloud.net.cn" @error="onError">https://uniapp.dcloud.net.cn</uni-link>
      </view>
    </view>

    <view class="section">
      <text class="section-title">自定义样式</text>
      <view class="link-block">
        <uni-link href="https://doc.dcloud.net.cn/uni-app-x/" class="custom-link" @error="onError" >
          查看 uni-app x 文档
        </uni-link>
      </view>
    </view>

    <view class="section">
      <text class="section-title">target="_self" (默认)</text>
      <view class="link-block">
        <uni-link href="https://uniapp.dcloud.net.cn" target="_self" @error="onError" >
          在内置 webview 中打开
        </uni-link>
      </view>
    </view>

    <view class="section">
      <text class="section-title">target="_blank"</text>
      <view class="link-block">
        <uni-link href="https://uniapp.dcloud.net.cn" target="_blank" @error="onError" >
          使用外部浏览器打开
        </uni-link>
      </view>
      <text class="tip-text">APP 使用 openSchema 插件，小程序回退到内置 webview 打开，Web 打开新页签</text>
    </view>

    <view class="section">
      <text class="section-title">target="_blank" 且 失败回退策略为复制URL</text>
      <view class="link-block">
        <uni-link href="https://uniapp.dcloud.net.cn" target="_blank" blankFallback="copy-link-modal" @error="onError" >
          使用外部浏览器打开
        </uni-link>
      </view>
      <text class="tip-text">使用外部浏览器打开失败时，回退为复制URL到剪贴板且弹框提示用户手动粘贴URL到浏览器</text>
    </view>

    <view class="section">
      <text class="section-title">失败示例</text>
      <view class="link-block">
        <uni-link href="" @error="onError" >
          空链接（触发 error）
        </uni-link>
      </view>
    </view>

    <view class="section">
      <text class="section-title">最近事件</text>
      <text class="log-text">{{ data.lastEvent }}</text>
    </view>
  </scroll-view>
</template>

<script setup lang="uts">
  type Data = {
    lastEvent: string
  }

  const data = reactive<Data>({
    lastEvent: '暂无事件'
  })

  function onError(message : string) {
    data.lastEvent = `error: ${message}`
    console.error(`[link] error: ${message}`)
  }

  defineExpose({
    data,
    onError
  })
</script>

<style>
  .page {
    flex: 1;
    padding: 12px;
  }

  .section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 16px;
    color: var(--text-color, #333333);
  }

  .link-block {
    margin-top: 8px;
  }

  .tip-text {
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-color, #333333);
    opacity: 0.6;
  }

  .custom-link {
    color: #007aff;
    font-size: 20px;
  }

  .log-text {
    margin-top: 8px;
    font-size: 13px;
    color: #007aff;
  }
</style>

```

:::


### 参见
- [相关 Bug](https://issues.dcloud.net.cn/?mid=uni-ui-x.uni-link)
