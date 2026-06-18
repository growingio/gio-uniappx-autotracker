---
source: https://gitcode.com/dcloud/uni-ui-x/tree/alpha/uni_modules/uni-nav-bar
---

::: sourceCode
## uni-nav-bar
:::

自定义导航栏组件




### 兼容性
| Web | 微信小程序 | Android | Android(Vapor) | iOS | iOS(Vapor) | HarmonyOS | HarmonyOS(Vapor) |
| :- | :- | :- | :- | :- | :- | :- | :- |
| 5.07 | 5.07 | 5.07 | <a style="color:unset;" href="https://vote.dcloud.net.cn/#/?name=uni-app%20x">x</a> | 5.07 | <a style="color:unset;" href="https://vote.dcloud.net.cn/#/?name=uni-app%20x">x</a> | 5.07 | 5.07 |


### 属性 
| 名称 | 类型 | 默认值 | 兼容性 | 描述 |
| :- | :- | :- |  :-: | :- |
| hideDefaultBack | boolean | false | - | 是否隐藏默认的返回箭头。为 true 时需要通过 left 插槽自定义返回按钮 |
| title | string | "" | - | 导航栏中间显示的标题文字，若使用 mid 插槽则该属性无效 |
| navigationBarTextStyle | string as PropType\<"white" \| "black" \| ""> | "" | - | 导航栏前景色（文字和返回箭头颜色）。非小程序端未传入时会自动读取 pageStyle 的 navigationBarTextStyle |
| leftClass | classString | "" | - | 左侧区域的自定义样式类 |
| midClass | classString | "" | - | 中间区域的自定义样式类 |
| rightClass | classString | "" | - | 右侧区域的自定义样式类 |

<!-- UTSCOMJSON.uni-nav-bar.fileFormates -->



<!-- UTSCOMJSON.uni-nav-bar.component_type -->



### 示例
示例为[hello uni-app x alpha分支](https://gitcode.com/dcloud/hello-uni-app-x/blob/prod_alpha/pages/uni-ui/nav-bar/nav-bar.uvue)，与最新HBuilderX Alpha版同步。与最新正式版同步的master分支示例[另见](https://gitcode.com/dcloud/hello-uni-app-x/blob/master//pages/uni-ui/nav-bar/nav-bar.uvue) 
::: preview https://hellouniappx.dcloud.net.cn/web/#/pages/uni-ui/nav-bar/nav-bar

> appRedirect https://hellouniappx.dcloud.net.cn/appredirect.html?path=pages/uni-ui/nav-bar/nav-bar

>示例
```vue
<template>
	<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle"></uni-nav-bar>
	<scroll-view style="flex: 1;padding-bottom: var(--uni-safe-area-inset-bottom);" :class="state.isDarkMode ? 'theme-dark' : 'theme-light'">
		<!-- 正常使用场景应把uni-nav-bar放在template的根节点，本示例为了演示多种导航栏效果把导航栏组件放到了scroll-view里了 -->
		<uni-nav-bar navigationBarTextStyle="black" title="黑色标题"></uni-nav-bar>
		<uni-nav-bar navigationBarTextStyle="white" title="青色背景白色标题" style="background-color: cyan;"></uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" title="下边带灰线" style="border-bottom: 0.5px #ccc solid;"></uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" hideDefaultBack title="隐藏左侧返回箭头"></uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" title="标题居左" mid-class="left-title"></uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" title="右边有按钮">
			<template #right>
				<text class="txt-button" @click="clickButton">⋯</text>
			</template>
		</uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" title="右边有2个按钮" right-class="two-buttons">
			<template #right>
				<text class="txt-button" @click="clickButton">+</text>
				<text class="txt-button" @click="clickButton">⋯</text>
			</template>
		</uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" title="左边有按钮">
			<template #left>
				<text class="txt-button" @click="clickButton">+</text>
			</template>
		</uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle" title="左右各1个按钮">
			<template #left>
				<text class="txt-button" @click="clickButton">+</text>
			</template>
			<template #right>
				<text class="txt-button" @click="clickButton">⋯</text>
			</template>
		</uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle">
			<template #mid>
				<text :style="{ color: navigationBarTextStyle }">插槽右箭头可以点</text>
				<text style="padding: 3px;font-size: 10px;" class="uni-theme-text" @click="clickButton">▼</text>
			</template>
		</uni-nav-bar>
		<uni-nav-bar :navigationBarTextStyle="navigationBarTextStyle">
			<template #left>
				<text class="txt-button" @click="clickButton">+</text>
			</template>
			<template #mid>
				<input placeholder="左中右都是插槽，中间是input" style="border: #ccc 0.5px solid;"/>
			</template>
			<template #right>
				<text class="txt-button" @click="clickButton">⋯</text>
			</template>
		</uni-nav-bar>
	</scroll-view>
</template>

<script setup>
	import { state } from '@/store/index';

	const navigationBarTextStyle = ref('black')

	function clickButton() {
		uni.showToast({
			title: '点击了按钮'
		});
	}

	onShow(() => {
		// Android平台如果在onShow前调用API，会设置上一个页面的导航栏颜色，所以放在onShow里设置颜色
		// #ifdef APP-ANDROID
		if (state.isDarkMode) {
			navigationBarTextStyle.value = 'white'
			// 本示例中导航栏的背景色和通用背景色不同，前景色无法遵守theme.json的设置，需要单独设颜色
			uni.setNavigationBarColor({
				"frontColor":"#ffffff",
				"backgroundColor":"#000000" //微信规范不可为空
			})
		} else {
			navigationBarTextStyle.value = 'black'
			// 本示例中导航栏的背景色和通用背景色不同，前景色无法遵守theme.json的设置，需要单独设颜色
			uni.setNavigationBarColor({
				"frontColor":"#000000",
				"backgroundColor":"#ffffff"  //微信规范不可为空
			})
		}
		// #endif
	})

	watch((): boolean => state.isDarkMode, (newVal: boolean) => {
		if (newVal) {
			navigationBarTextStyle.value = 'white'
			// 本示例中导航栏的背景色和通用背景色不同，前景色无法遵守theme.json的设置，需要单独设颜色
			uni.setNavigationBarColor({
				"frontColor":"#ffffff",
				"backgroundColor":"#000000" //微信规范不可为空
			})
		} else {
			navigationBarTextStyle.value = 'black'
			// 本示例中导航栏的背景色和通用背景色不同，前景色无法遵守theme.json的设置，需要单独设颜色
			uni.setNavigationBarColor({
				"frontColor":"#000000",
				"backgroundColor":"#ffffff"  //微信规范不可为空
			})
		}
	}
	// #ifndef APP-ANDROID
	// TODO Android在设置页面导航栏颜色后，后退页面，上一层页面的导航栏也被改了！原因是这个代码执行太早，activity还没创建好
	, { immediate: true }
	// #endif
	)
</script>

<style>
.left-title{
	justify-content: flex-start;
}
.two-buttons{
	width: 88px;
}
.txt-button{
	font-weight: bold;
	width: 44px;
	height: 44px;
	line-height: 44px;
	text-align: center;
	color: var(--text-color);
}
</style>

```

:::


### 参见
- [相关 Bug](https://issues.dcloud.net.cn/?mid=uni-ui-x.uni-nav-bar)
