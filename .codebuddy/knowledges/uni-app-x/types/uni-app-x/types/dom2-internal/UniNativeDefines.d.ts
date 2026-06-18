/**
 * NativeView通用基础类型定义
 *
 * 特别说明
 * 类型中涉及长度单位的，如果没有特殊说明，单位为逻辑像素值，渲染时需转换各自平台需要的值
 */
import { UniSize, UniPosition, UniLTWH, UniLTRB, UniCSSUnitValue } from './index'
import { UniCSSTransform, UniCSSTransformOrigin } from './UniCSSTransform'
import { UniCSSTransition, UniCSSTransitions, UniCSSTransitionProperty, UniCSSTransitionProperties, UniCSSTransitionTimingFunction, UniCSSTransitionTimingFunctions, UniCSSTransitionDuration, UniCSSTransitionDurations, UniCSSTransitionDelay, UniCSSTransitionDelays } from './UniCSSTransition'


/**
 * 颜色对象
 * 不同平台根据自身使用自己的类型，比如Int
 */
export type UniNativeColor = {
  /**
   * 颜色值
   * 如何定义各平台根据实际情况处理，可以使用CSSOM中的颜色定义（新取别名）
   */
}

/**
 * 背景区域
 */
export enum UniNativeBackgroundClip {
  /**
   * 背景延伸至边框外沿（但是在边框下层）
   */
  BorderBox,
  /**
   * 背景延伸至内边距（padding）外沿，不会绘制到边框处
   */
  PaddingBox,
  /**
   * 背景被裁剪至内容区（content box）外沿
   */
  ContentBox
}

/**
 * 背景图
 *  暂时仅支持线性渐变背景
 */
export type UniNativeBackgroundImage = UniNativeLinearGradient

/**
 * 线性渐变
 */
export type UniNativeLinearGradient = {
  /**
   * 渐变方向
   */
  direction: UniNativeLinearGradientDirectionType,
  /**
   * 色标数据
   *  优先支持2个值的情况，超过2个值的情况低优先级
   */
  colorStops: UniNativeLinearGradientColorStop[],
}
/**
 * 渐变色标
 */
export type UniNativeLinearGradientColorStop = {
  /**
   * 色标颜色
   */
  color: UniNativeColor,
  /**
   * 色标位置
   *  低优先级
   */
  length?: number
}
/**
 * 渐变方向枚举值
 */
export enum UniNativeLinearGradientDirectionType {
  /**
   * 从左向右渐变
   */
  ToBottom,
  /**
   * 从右向左渐变
   */
  ToLeft,
  /**
   * 从上到下渐变
   */
  ToRight,
  /**
   * 从下到上渐变
   */
  ToTop,
  /**
   * 从右上角到左下角
   */
  ToBottomLeft,
  /**
   * 从左上角到右下角
   */
  ToBottomRight,
  /**
   * 从右下角到左上角
   */
  ToTopLeft,
  /**
   * 从左下角到右上角
   */
  ToTopRight,
}


/**
 * 位置对象
 */
export type UniNativeLayout = UniLTWH
/**
 * 尺寸信息
 */
export type UniNativeLayoutSize = UniSize

/**
 * 位置信息
 */
export type UniNativeLayoutPosition = UniPosition


/**
 * 内边距信息
 */
export type UniNativePadding = UniLTRB

/**
 * 外边距
 */
export type UniNativeMargin = number
/**
 * 外边距详细信息
 */
export type UniNativeMargins = UniLTRB

/**
 * 边框信息
 */
/**
 * 边框宽度类型
 */
export type UniNativeBorderWidth = number
/**
 * 边框宽度详细信息
 */
export type UniNativeBorderWidths = UniLTRB
/**
 * 边框颜色
 */
export type UniNativeBorderColor = UniNativeColor
/**
 * 边框颜色详细信息
 */
export type UniNativeBorderColors = {
  /**
   * 上边框颜色
   */
  top: UniNativeBorderColor
  /**
   * 右边框颜色
   */
  right: UniNativeBorderColor
  /**
   * 下边框颜色
   */
  bottom: UniNativeBorderColor
  /**
   * 左边框颜色
   */
  left: UniNativeBorderColor
}

/**
 * 边框样式
 *  注：鸿蒙/iOS平台都是在C层可以与CSS中的 UniCSSBorderStyleType 复用
 */
export enum UniNativeBorderStyle {
  /**
   * 无边框
   */
  None,
  /**
   * 实线样式边框
   */
  Solid,
  /**
   * 方形虚线样式边框
   */
  Dashed,
  /**
   * 圆点样式边框，圆点半径为borderWidth的一半
   */
  Dotted
}
//export type UniNativeBorderStyle = UniCSSBorderStyleType

/**
 * 边框样式详细信息
 */
export type UniNativeBorderStyles = {
  /**
   * 上边框样式
   */
  top: UniNativeBorderStyle
  /**
   * 右边框样式
   */
  right: UniNativeBorderStyle
  /**
   * 下边框样式
   */
  bottom: UniNativeBorderStyle
  /**
   * 左边框样式
   */
  left: UniNativeBorderStyle
}

/**
 * 边框圆角半径
 */
export type UniNativeBorderRadius = UniCSSUnitValue
/**
 * 边框圆角半径详细信息
 */
export type UniNativeBorderRadiuses = {
  /**
   * 左上角圆角半径
   */
  topLeft: UniNativeBorderRadius
  /**
   * 右上角圆角半径
   */
  topRight: UniNativeBorderRadius
  /**
   * 右下角圆角半径
   */
  bottomRight: UniNativeBorderRadius
  /**
   * 左下角圆角半径
   */
  bottomLeft: UniNativeBorderRadius
}


/**
 * 阴影样式详细信息
 */
export type UniNativeBoxShadow = {
  /**
   * 阴影是否在元素内部
   * 默认值为false，即阴影在外部
   */
  isInset: boolean
  /**
   * 阴影的 x 偏移量
   */
  offsetX: number
  /**
   * 阴影的 y 偏移量
   */
  offsetY: number
  /**
   * 阴影的模糊半径
   * 默认值为0
   */
  blurRadius: number
  /**
   * 阴影的扩展范围
   * 默认值为0
   */
  spreadRadius: number
  /**
   * 阴影颜色
   * 默认为透明
   */
  color: UniNativeColor
}


/**
 * 元素溢出行为类型
 */
export enum UniNativeOverflowType {
  /**
   * 内容被裁减，即不可渲染到元素外部
   */
  Hidden,
  /**
   * 内容不被裁减，即可能渲染到元素外部
   */
  Visible,
}


/**
 * pointer-event类型
 * 元素是否可以成为事件的target
 */
export enum UniNativePointerEventType {
  /**
   * 元素可成为事件的target
   */
  Auto,
  /**
   * 元素不可成为事件的target
   */
  None,
}


/**
 * display类型
 * 元素显示类型
 *  注：鸿蒙/iOS平台都是在C层可以与CSS中的 UniCSSDisplayType 复用
 */
export enum UniNativeDisplayType {
  /**
   * 元素按弹性布局
   */
  Flex,
  /**
   * 元素不显示
   */
  None,
}
//export type UniNativeDisplayType = UniCSSDisplayType


/**
 * position类型
 * 元素位置信息，渲染时需特殊处理fixed的场景
 *  注：鸿蒙/iOS平台都是在C层可以与CSS中的 UniCSSPositionType 复用
 */
export enum UniNativePositionType {
  /**
   * 当前元素将参与父节点布局，根据 top、right、bottom、left 等属性相对于自身偏移。
   */
  Relative,
  /**
   * 当前元素将不参与父节点布局，布局时不会为该元素创建任何空间，在父元素的内容区域中进行绝对布局，根据 top、right、bottom、left 等属性决定其位置。
   */
  Absolute,
  /**
   * 当前元素将不参与父节点布局，将被视为页面根节点的子元素进行绝对布局，根据 top、right、bottom、left 等属性决定其位置。
   */
  Fixed,
  /**
   *
   */
  Sticky,
  /**
   *
   */
  Static,
}
//export type UniNativePositionType = UniCSSPositionType


/**
 * visibility类型
 * 元素是否可见
 *  注：鸿蒙/iOS平台都是在C层可以与CSS中的 UniCSSVisibilityType 复用
 */
export enum UniNativeVisibilityType {
  /**
   * 元素可见
   */
  Visible,
  /**
   * 元素不可见
   */
  Hidden,
}
//export type UniNativeVisibilityType = UniCSSVisibilityType


/**
 * transform数据类型
 */
export type UniNativeTransform = UniCSSTransform

/**
 * transform-origin数据类型
 */
export type UniNativeTransformOrigin = UniCSSTransformOrigin

/**
 * transition数据类型
 */
export type UniNativeTransition = UniCSSTransition
export type UniNativeTransitions = UniCSSTransitions
export type UniNativeTransitionProperty = UniCSSTransitionProperty
export type UniNativeTransitionProperties = UniCSSTransitionProperties
export type UniNativeTransitionDuration = UniCSSTransitionDuration
export type UniNativeTransitionDurations = UniCSSTransitionDurations
export type UniNativeTransitionDelay = UniCSSTransitionDelay
export type UniNativeTransitionDelays = UniCSSTransitionDelays
export type UniNativeTransitionTimingFunction = UniCSSTransitionTimingFunction
export type UniNativeTransitionTimingFunctions = UniCSSTransitionTimingFunctions



/**
 * 插槽名称
 * 注：鸿蒙/iOS平台都是在C层可以与CSS中的 UniSlotType 复用
 * UniNativeSlotType 与 UniSlotType 相同，重新定义是为了编译器能正确的将其识别为enum
 */
export enum UniNativeSlotType {
  /**
   * 无插槽
   */
  None,
  /**
   * 下拉刷新插槽
   *  scroll-view组件的子组件使用
   */
  Refresher
}
//export type UniNativeSlotType = UniSlotType

