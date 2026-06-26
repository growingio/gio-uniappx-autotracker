# QA 约束与已知坑

## 生命周期与页面对象

1. 在 `app-android` 平台，`App.uvue` 不支持 mixins，全局 mixins 也不会对 `App.uvue` 生效，也不支持运行时按条件动态构造 mixins，所以不能依赖 App mixin 监听完整退后台链路。
2. 生命周期桥接不能直接把页面实例 `this` 或原始 `options` 传进 `utssdk/`。iOS 原生侧不认识这些实例，它们既不是稳定的 `UTSJSONObject`，也不是可依赖的 `UniPage`。
3. 当前正确做法是在 `plugin.uts` 的 JS 编译层先做浅拷贝，只把 SDK 真正需要的字段装进普通对象后再传给 `utssdk/`：
   - 页面快照：`route`、`$scope.route`、`options`、`$scope.options`、`title`
   - 启动参数快照：`path`、`scene`、`query`、`referrerInfo` / `refererInfo`
4. 页面 path / query / title 的获取需要区分平台处理，不同平台实例结构不同；基准参考应以 uni-stat 当前实现为准，`atomgit` 上的 uni-app x 版本比 GitHub 镜像更新。

## 编译层边界

1. `utssdk` 目录外是 JS 编译层，`utssdk` 目录内是 native 编译层，所以要避免直接内外混合 export，防止编译出多个实例或把 JS 层代码卷进原生编译。
2. iOS 不认 `index.uts` 里的复杂二次 re-export；公共导出要尽量扁平，必要时直接从实际 uts 文件路径导出。
3. 五端入口文件要保持齐全：`web/index.uts`、`app-android/index.uts`、`app-ios/index.uts`、`app-harmony/index.uts`、`mp-weixin/index.uts`。Android / iOS / Harmony 当前只做薄入口时，也要显式保留 `index.uts`。

## 请求与数据结构

1. 在 uni-app x UTS 中，`uni.request` 的 `data` 只接受 `UTSJSONObject | string | ArrayBuffer`，不支持直接传 `Array<UTSJSONObject>`。
2. 页面实例不能直接转 `UTSJSONObject`；如果后续还要补字段，继续在 JS 层快照对象里显式增加，不要回退到直接 cast。

## 公开 API 约束

1. `setOptions` 当前只允许修改 `dataCollect`。参数必须显式包含布尔字段 `dataCollect`，不能静默接受其他运行时配置。
2. `setLocation(latitude, longitude)` 仅非 web 端支持，参数必须是合法经纬度数字。设置后只影响后续构建的事件字段，当前不持久化。
3. 微信小程序分享采集必须先注册 `gioShareTracking`，再走显式包装器；不能用全局 mixin 注入分享钩子，否则会改变业务页面的转发菜单表现。

## Kotlin / Swift 差异

1. `[]` 在 Kotlin 和 Swift 都会翻译成 `Array`，但 Swift 是 COW，Kotlin 更接近引用语义；跨模块共享可变数组时优先用包装类承载状态。
2. iOS 上 `parseFloat` 等方法可能产生 `NaN`，而 `JSON.stringify` 无法稳定处理；数值兼容优先使用 `as number`，不要在系统信息读取路径里滥用 `parseFloat`。
