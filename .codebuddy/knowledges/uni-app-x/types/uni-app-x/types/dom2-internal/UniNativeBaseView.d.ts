import { UniNativeColor } from './UniNativeDefines'
import { UniCSSPropertyID } from './UniCSSPropertyId'
import { UniCSSUnitType } from './UniCSSType'
import { UniNativeLayout, UniNativePadding } from './UniNativeDefines'
import { UniNativeBackgroundClip, UniNativeBackgroundImage } from './UniNativeDefines'
import { UniNativeBorderWidths, UniNativeBorderWidth, UniNativeBorderStyles, UniNativeBorderStyle, UniNativeBorderColors, UniNativeBorderColor, UniNativeBorderRadiuses, UniNativeBorderRadius } from './UniNativeDefines'
import { UniNativeBoxShadow, UniNativeOverflowType, UniNativeDisplayType, UniNativePointerEventType, UniNativePositionType, UniNativeVisibilityType } from './UniNativeDefines'
import { UniNativeSlotType, UniNativeTransform, UniNativeTransformOrigin } from './UniNativeDefines'
import { UniNativeTransition, UniNativeTransitions, UniNativeTransitionProperty, UniNativeTransitionProperties, UniNativeTransitionDuration, UniNativeTransitionDurations, UniNativeTransitionDelay, UniNativeTransitionDelays, UniNativeTransitionTimingFunction, UniNativeTransitionTimingFunctions } from './UniNativeDefines'



/**
 * 原生基础View
 */
export interface UniNativeBaseView {

  /**
   * 扩展数据
   *  提供给vue框架使用
   */
  ext: Map<string, any | null>

  /**
   * 获取内部ID值，用于框架调用，不对外公开
   *  Android平台在kotlin层实现
   *  鸿蒙/iOS平台在c层实现
   */
  getNodeId(): number

  /**
   * 获取渲染相关样式，用于UniElement封装获取样式
   * 子类需根据支持的样式重写
   */
  /**
   * 获取字符串格式样式
   */
  getStyleString(key: UniCSSPropertyID): string | null
  /**
   * 获取类型化样式
   */
  getStyleAny(key: UniCSSPropertyID): any | null


  /**
   * 插槽名称
   */
  slot(value: UniNativeSlotType): UniNativeBaseView

  /**
   * 位置相关
   * 坐标相对于父View
   */
  /**
   * 设置显示信息
   */
  layout(value: UniNativeLayout): UniNativeBaseView
  layout(left: number, top: number, width: number, height: number): UniNativeBaseView

  /**
   * 设置内边距
   *  只有排版完成后操作，vue框架不需要操作此API
   *    value为UniNativePadding类型表示设置所有内边距值都相同
   */
  padding(value: UniNativePadding): UniNativeBaseView
  padding(left: number, top: number, right: number, bottom: number): UniNativeBaseView
  // 废弃单独设置内边距：排版引擎每次都是全值更新，不需要单独更新
  // paddingTop(value: UniNativePadding): UniNativeBaseView
  // paddingRight(value: UniNativePadding): UniNativeBaseView
  // paddingBottom(value: UniNativePadding): UniNativeBaseView
  // paddingLeft(value: UniNativePadding): UniNativeBaseView

  /**
   * 边框相关
   *  - 去掉简写border数据结构及相关API，DOM API实现时在UniElement中分拆样式设置
   */
  /**
   * 设置边框样式
   */
  borderStyle(value: UniNativeBorderStyles | UniNativeBorderStyle): UniNativeBaseView
  borderStyleTop(value: UniNativeBorderStyle): UniNativeBaseView
  borderStyleRight(value: UniNativeBorderStyle): UniNativeBaseView
  borderStyleBottom(value: UniNativeBorderStyle): UniNativeBaseView
  borderStyleLeft(value: UniNativeBorderStyle): UniNativeBaseView
  /**
   * 设置边框宽度
   *  只有排版完成后操作，vue框架不需要操作此API
   */
  borderWidth(value: UniNativeBorderWidths): UniNativeBaseView
  borderWidth(left: number, top: number, right: number, bottom: number): UniNativeBaseView
  // 废弃单独设置边框：排版引擎每次都是全值更新，不需要单独更新
  // borderWidthTop(value: UniNativeBorderWidth): UniNativeBaseView
  // borderWidthRight(value: UniNativeBorderWidth): UniNativeBaseView
  // borderWidthBottom(value: UniNativeBorderWidth): UniNativeBaseView
  // borderWidthLeft(value: UniNativeBorderWidth): UniNativeBaseView
  /**
   * 设置边框颜色
   */
  borderColor(value: UniNativeBorderColors | UniNativeBorderColor): UniNativeBaseView
  borderColorTop(value: UniNativeBorderColor): UniNativeBaseView
  borderColorRight(value: UniNativeBorderColor): UniNativeBaseView
  borderColorBottom(value: UniNativeBorderColor): UniNativeBaseView
  borderColorLeft(value: UniNativeBorderColor): UniNativeBaseView

  /**
   * 设置边框圆角
   */
  borderRadius(value: UniNativeBorderRadiuses | UniNativeBorderRadius): UniNativeBaseView
  borderRadius(value: number, unit: UniCSSUnitType): UniNativeBaseView
  borderRadiusTopLeft(value: UniNativeBorderRadius): UniNativeBaseView
  borderRadiusTopLeft(value: number, unit: UniCSSUnitType): UniNativeBaseView
  borderRadiusTopRight(value: UniNativeBorderRadius): UniNativeBaseView
  borderRadiusTopRight(value: number, unit: UniCSSUnitType): UniNativeBaseView
  borderRadiusBottomLeft(value: UniNativeBorderRadius): UniNativeBaseView
  borderRadiusBottomLeft(value: number, unit: UniCSSUnitType): UniNativeBaseView
  borderRadiusBottomRight(value: UniNativeBorderRadius): UniNativeBaseView
  borderRadiusBottomRight(value: number, unit: UniCSSUnitType): UniNativeBaseView
  /**
   * 暂不支持垂直和水平方向半径不一致的情况
   */
  // borderRadiusTopLeft(horizontal: UniNativeBorderRadius, vertical: UniNativeBorderRadius): UniNativeBaseView
  // borderRadiusTopRight(horizontal: UniNativeBorderRadius, vertical: UniNativeBorderRadius): UniNativeBaseView
  // borderRadiusBottomLeft(horizontal: UniNativeBorderRadius, vertical: UniNativeBorderRadius): UniNativeBaseView
  // borderRadiusBottomRight(horizontal: UniNativeBorderRadius, vertical: UniNativeBorderRadius): UniNativeBaseView

  /**
   * 背景相关
   */
  /**
   * 设置背景区域
   */
  backgroundClip(value: UniNativeBackgroundClip): UniNativeBaseView
  /**
   * 设置背景颜色
   * 设置为null表示无背景色，默认无背景色
   */
  backgroundColor(value: UniNativeColor | null): UniNativeBaseView
  /**
   * 设置背景图
   * 设置为null表示无背景图，默认无背景图
   */
  backgroundImage(value: UniNativeBackgroundImage | null): UniNativeBaseView

  /**
   * CSS: box-shadow
   * 设置阴影
   * 设置为null表示不需要阴影，默认无阴影
   */
  boxShadow(value: UniNativeBoxShadow | null): UniNativeBaseView

  /**
   * CSS: display
   * 设置显示类型
   */
  display(value: UniNativeDisplayType): UniNativeBaseView

  /**
   * CSS: opacity
   * 设置不透明度
   * 取值范围为0~1.0，默认值为1，即完全不透明
   */
  opacity(value: number): UniNativeBaseView

  /**
   * CSS: overflow
   * 设置元素溢出行为
   * 默认溢出裁剪
   */
  overflow(value: UniNativeOverflowType): UniNativeBaseView

  /**
   * CSS: pointer-events
   * 元素是否可以成为事件的target
   * 默认可成为事件的target
   */
  pointerEvents(value: UniNativePointerEventType): UniNativeBaseView

  /**
   * CSS: position
   */
  position(value: UniNativePositionType): UniNativeBaseView

  /**
   * CSS: visibility
   * 元素是否可见
   * 默认可见
   */
  visibility(value: UniNativeVisibilityType): UniNativeBaseView

  /**
   * CSS: z-index
   * 设置z轴顺序
   */
  zIndex(value: number): UniNativeBaseView

  /**
   * CSS: transform
   * 设置变换
   *  css中设置transform为none时，对应设置value值为null
   */
  transform(value?: UniNativeTransform|null): UniNativeBaseView

  /**
   * CSS: transform-origin
   * 设置变换的原点
   */
  transformOrigin(value: UniNativeTransformOrigin): UniNativeBaseView

  /**
   * CSS: -uni-transform-internal
   * 设置与transform叠加的变换
   *  用于内部实现 list，区分框架设置的transform和开发者设置的transform，仅支持translate效果
   */
  transformInternal(value?: UniNativeTransform|null): UniNativeBaseView


  /**
   * CSS: transition
   * 设置transition动画
   * 注意：transition/transition-property属性值设置为none时，解析设置null值
   */
  transition(value?: UniNativeTransition | UniNativeTransitions | null): UniNativeBaseView
  transitionProperty(value?: UniNativeTransitionProperty | UniNativeTransitionProperties | null): UniNativeBaseView
  transitionDuration(value: UniNativeTransitionDuration | UniNativeTransitionDurations): UniNativeBaseView
  transitionDelay(value: UniNativeTransitionDelay | UniNativeTransitionDelays): UniNativeBaseView
  transitionTimingFunction(value: UniNativeTransitionTimingFunction | UniNativeTransitionTimingFunctions): UniNativeBaseView

}

