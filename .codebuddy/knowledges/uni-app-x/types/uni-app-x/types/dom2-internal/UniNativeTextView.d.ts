import { UniNativeBaseView, } from "./UniNativeBaseView"
import { UniTextLayout } from "./index"



/**
 * 基本视图容器View
 */
/**
 * 文本View
 */
export interface UniNativeTextView extends UniNativeBaseView {
  /**
   * 设置文本内容
   *  注：仅Android平台实现，其它平台UniElement自动更新渲染
   */
  content(value: UniTextLayout): UniNativeTextView


  /**
   * Text的属性相关API
   */
  /**
   * 文本是否可选
   *  注：替换selectable
   */
  userSelect(value: boolean): UniNativeTextView

  /**
   * 设置文本的垂直居中方式
   */
  verticalAlign(type: UniNativeTextViewVerticalAlignType): UniNativeTextView

  /**
   * 是否支持hover样式更新
   */
  hover(value: boolean): UniNativeView
  /**
   * 是否阻止本节点的祖先节点出现点击态
   * 默认值为false
   */
  hoverStopPropagation(value: boolean): UniNativeView
  /**
   * 按住后多久出现点击态，单位为毫秒
   * 默认值为50ms
   */
  hoverStartTime(value: number): UniNativeView
  /**
   * 手指松开后点击态保留时间，单位为毫秒
   * 默认值为400ms
   */
  hoverStayTime(value: number): UniNativeView
}


/**
 * text组件垂直对齐枚举值
 */
export enum UniNativeTextViewVerticalAlignType {
  /**
   * 垂直居顶对齐
   */
  Top,
  /**
   * 垂直居中对齐
   */
  Middle,
  /**
   * 垂直居底部对齐
   */
  Bottom,
}


