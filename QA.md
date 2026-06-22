1. 在 app-android 平台, App.uvue 不支持 mixins，全局 mixins 也不会对 App.uvue 生效，另外也不支持运行时根据条件动态构造mixins, 所以没法通过mixins监听退到后台
2. utssdk目录外是在js层的编译，utssdk目录内是native层的编译，所以要避免直接内外混合export导致编译出多个实例
3. page的name和path获取需要区分平台获取，不同平台实例结构不同，需要参考uni-stat（uniappx的uni-stat在atomgit上，github的不是最新的）
4. page类型需要使用Page类型，而不是any，Page不能转为UTSJsonObject导致无法得到对应的变量，Page类型在iOS不存在，并且并非是UniPage类型（需要在js层完成Page类型->UTSJsonObject的处理）
5. 在 uni-app x UTS 中，uni.request 的 data 只接受 UTSJSONObject | string | ArrayBuffer，不支持直接传 Array<UTSJSONObject>。
6. iOS不认index中二次export的内容（但是可以直接从uts文件路径导出，这也是官方为什么一直推荐一个文件）
7. []在kt和swift都翻译成Array，不知道swift的Array是cow，kt是纯ref(需要用class二次包装[]避免平台差异)
8. iOS parseFloat等方法可能返回Nan，在JSONstringify时无法处理，尽量使用as number不使用其他方法，systemInfo返回的UTSJSONObject，在读取screenHeight时使用parseFloat导致丢失