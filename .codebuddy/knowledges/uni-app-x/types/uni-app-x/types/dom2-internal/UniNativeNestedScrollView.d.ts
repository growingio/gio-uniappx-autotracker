import { UniNativeBaseView,  } from "./UniNativeBaseView"



/**
 * 滚动容器组件 scroll-view
 */
export interface UniNativeScrollView extends UniNativeBaseView {


}


/**
 * scroll-view组件构造参数
 */
export type UniNativeScrollViewOptions = {
  /**
   * 滚动方向
   */
  direction: UniNativeScrollViewDirectionType
  /**
   * 是否开启下拉刷新
   */
  refresherEnabled: boolean
}


/**
 * scroll-view组件滚动方向枚举值
 */
export enum UniNativeScrollViewDirectionType {
  /**
   * 禁止滚动
   */
  None,
  /**
   * 竖向滚动
   */
  Vertical,
  /**
   * 横向滚动
   */
  Horizontal,
  /**
   * 横向竖向都可滚动
   */
  All,
}
