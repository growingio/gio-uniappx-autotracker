import { UniNativeBaseView } from "./UniNativeBaseView"



/**
 * 基本视图容器 view
 */
export interface UniNativeView extends UniNativeBaseView {
  /**
   * 管理子View
   */
  /**
   * 添加子View
   */
  append(view: UniNativeBaseView): UniNativeView
  /**
   * 删除子View
   */
  removeChild(view: UniNativeBaseView): UniNativeView
  /**
   * 在指定子View前插入
   *  如未指定ref则添加到末尾，与append效果一致
   */
  insertBefore(view: UniNativeBaseView, ref?: UniNativeBaseView | null): UniNativeView


  /**
   * View的属性相关API
   */
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


export type UniNativeViewStyles = Map<string, any>

