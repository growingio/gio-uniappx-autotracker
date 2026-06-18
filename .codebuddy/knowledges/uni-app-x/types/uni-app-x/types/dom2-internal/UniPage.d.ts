import { UniElement } from './index'
import { UniElementType, UniElementStyles } from './UniElementType'
import { UniViewElement } from './index'
import { UniTextElement } from './index'
import { UniImageElement } from './index'
import { UniRichTextNativeElement } from './index'
import { UniNativeView } from './UniNativeView'
import { UniNativeTextView } from './UniNativeTextView'
import { UniNativeImageView } from './UniNativeImageView'
import { UniNativeScrollView, UniNativeScrollViewOptions } from './UniNativeScrollView'
import { UniNativeCustomView } from './UniNativeCustomView'
import { UniNativeRichTextNativeView } from './UniNativeRichTextNativelView'
import { UniTextLayout } from './index'
import { UniText } from './index'


declare global {
  /**
   * 页面对象
   */
  interface UniPage {

    /**
     * 创建UniElement
     * 仅内部使用，c层实现，在线程1中创建
     * @param type - UniElementType类型
     * @param flatten - Element是否被拍平（扁平化）
     *  true表示可拍平，false表示不可拍平，默认值false
     * @param style - 同时设置多个CSS样式
     * 注意：在Android平台仅支持排版CSS，为了各平台统一，编译生成的代码应该只设置排版相关CSS
     */
    // 废弃通过类型创建UniElement的API，改用下面创建指定类型的UniElement
    // createElement(type: UniElementType, flatten: boolean): UniElement
    // createElement(type: UniElementType, flatten: boolean, style?: UniElementStyles | null): UniElement
    /**
     * 创建view组件的Element
     * @internal
     */
    createViewElement(flatten: boolean, style?: UniElementStyles | null): UniViewElement
    /**
     * 创建text组件的Element
     * @internal
     */
    createTextElement(flatten: boolean, style?: UniElementStyles | null): UniTextElement
    /**
     * 创建image组件的Element
     * @internal
     */
    createImageElement(flatten: boolean, style?: UniElementStyles | null): UniImageElement
    /**
     * 创建scroll-view组件的Element
     * @internal
     */
    createScrollViewElement(): UniScrollViewElement
    /**
     * 创建nested-scroll-header组件的Element
     * @internal
     */
    createNestedScrollHeaderElement(): UniNestedScrollHeaderElement
    /**
     * 创建nested-scroll-body组件的Element
     * @internal
     */
    createNestedScrollBodyElement(): UniNestedScrollBodyElement
    /**
     * 创建native-viewe组件的Element
     * @internal
     */
    createNativeViewElement(): UniNativeViewElement
    /**
     * 创建rich-text-native组件的Element
     * @internal
     */
    createRichTextNativeElement(): UniRichTextNativeElement
    /**
     * 创建注释节点的Element
     * @internal
     */
    createComment(data: string): UniElement
    /**
     * 目前该API仅限特定场景使用，比如
     * <text><slot>123</slot></text>
     * <custom>123</custom>
     * @internal
     */
    createTextNode(data?: string | null): UniText
    /**
     * Android平台Kotlin层实现
     *  用于Android平台线程2中创建
     * @internal
     */
    createElement(type: UniElementType): UniElement
    /**
     * Android平台Kotlin层实现
     *  用于Android平台线程1中创建UniTextLayout
     * @internal
     */
    createTextLayout(): UniTextLayout
    /**
     * 增加TextLayout内部计数器，解决非text节点不需要创建TextLayout时能同时增加计数，确保内部id与UniTextElement的内部id一致
     * @internal
     */
    increaseTextLayoutCounter(count: number): void

    /**
     * 创建原生View（view）
     * @param flatten 原生View是否被拍平（扁平化），true表示可拍平，false表示不可拍平，默认值false
     * @internal
     */
    createNativeView(flatten: boolean): UniNativeView
    /**
     * 创建原生文本View（text）
     * @internal
     */
    createNativeTextView(flatten: boolean): UniNativeTextView
    /**
     * 创建原生图片View（image）
     * @internal
     */
    createNativeImageView(flatten: boolean): UniNativeImageView
    /**
     * 创建原生滚动View（scroll-view）
     * @internal
     */
    createNativeScrollView(options: UniNativeScrollViewOptions): UniNativeScrollView
    /**
     * 创建原生自定义View（native-view）
     * @internal
     */
    createNativeCustomView(): UniNativeCustomView
    /**
     * 创建原生富文本View（rich-text-native）
     */
    createNativeRichTextNativeView(): UniNativeRichTextNativeView
    // 废弃通过类型创建NativeView的API，改用上面创建指定类型的原生View
    // createNativeView(type: UniNativeViewType, flatten: boolean): UniNativeBaseView
    // createNativeView<T extends UniNativeBaseView>(type: UniNativeViewType, flatten: boolean): T
    /**
     * 增加原生view内部计数器，解决一些虚拟节点只需要创建UniElement，不需要创建UniNativeView的场景
     * @param count - 增加计数器值，默认值为1
     * @internal
     */
    increaseNativeViewCounter(count: number): void

    /**
     * 通过内部NodeID查找节点
     * @param id
     *  内部Node id
     * @internal
     */
    getNodeById(id: number): UniElement | null

    /**
     * 通过id属性查找元素
     * @param id
     *  元素的id值
     * @internal
     */
    getElementById(id: string): UniElement | null

    /**
     * 定义CSS变量
     * @param key - css变量名称
     * @param value - css变量值，空字符串则表示移除变量定义
     * @internal
     */
    defineStyleVariable(key: string, value: string): void
  }
}
