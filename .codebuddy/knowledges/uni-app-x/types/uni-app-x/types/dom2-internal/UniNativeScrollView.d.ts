import { UniNativeBaseView,  } from "./UniNativeBaseView"



/**
 * 滚动容器组件 scroll-view
 */
export interface UniNativeScrollView extends UniNativeBaseView {

  /**
   * 关联容器类型
   */
  associativeContainer(type: UniNativeScrollViewAssociativeContainerType): void

  /**
   * 滚动方向
   */
  direction(type: UniNativeScrollViewDirectionType): void

  /**
   * 是否开启点击顶部状态栏滚动条返回顶部
   */
  enableBackToTop(value: boolean): void

  /**
   * 是否开启滚动回弹效果
   *  对应 bounces 属性
   */
  bounces(value: boolean): void

  /**
   * 是否关闭滚动回弹效果
   *  对应 disable-bounces 属性，替换 bounces 属性
   */
  disableBounces(value: boolean): void

  /**
   * 是否显示滚动条
   *  对应 show-scrollbar 属性
   */
  showScrollbar(value: boolean): void

  /**
   * 是否隐藏滚动条
   *  对应 hide-scrollbar 属性，替换 show-scrollbar 属性
   */
  hideScrollbar(value: boolean): void

  /**
   * 距顶部/左边多远时（单位px），触发 scrolltoupper 事件
   */
  upperThreshold(value: number): void

  /**
   * 距底部/右边多远时（单位px），触发 scrolltolower 事件
   */
  lowerThreshold(value: number): void

  /**
   * 设置竖向滚动条位置
   */
  scrollTop(value: number): void

  /**
   * 设置横向滚动条位置
   */
  scrollLeft(value: number): void

  /**
   * 是否在设置滚动条位置时使用滚动动画，设置false没有滚动动画
   */
  scrollWithAnimation(value: boolean): void

  /**
   *下拉刷新样式
   */
  refresherDefaultStyle(type: UniNativeScrollViewRefresherStyleType): void

  /**
   * 是否开启下拉刷新
   */
  refresherEnabled(value: boolean): void

  /**
   * 下拉刷新阈值
   */
  refresherThreshold(value: number): void

  /**
   * 设置下拉最大拖拽距离（单位px），默认是下拉刷新控件高度的2.5倍
   */
  refresherMaxDragDistance(value: number): void

  /**
   * 下拉刷新区域背景颜色
   */
  refresherBackground(color: UniNativeColor): void

  /**
   * 默认是否进入下拉刷新状态
   */
  refresherTriggered(value: boolean): void

  /**
   * 渲染模式
   */
  type(type: UniNativeScrollViewType): void

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
 * scroll-view组件渲染模式
 */
export enum UniNativeScrollViewType {
  /**
   * 普通模式
   */
  Normal,
  /**
   * 嵌套模式
   */
  Nested,
  /**
   * 列表模式
   */
  List,
  /**
   * 自定义模式
   */
  Custom,
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

export enum UniNativeScrollViewAssociativeContainerType {
  /**
   * 无关联容器
   */
  None,
  /**
   * 关联嵌套的滚动容器
   */
  NestedScrollView,
}


/**
 * scroll-view组件下拉刷新样式枚举值
 */
export enum UniNativeScrollViewRefresherStyleType {
/**
 * 深色样式
 */
Black,
/**
 * 浅色样式
 */
White,
/**
 * 无样式，自定义下拉刷新时使用
 */
None,
}
