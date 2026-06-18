
/**
 * CSS属性名称ID
 * 枚举值
 */
export enum UniCSSPropertyID {
  /**
   * 无效属性
   */
  Invalid,
  /**
   * CSS变量
   */
  Variable,
  /*排版样式*/
  /**
   * 元素的上外边距边界与其包含块上边界之间的偏移 top
   * 非定位元素设置此属性无效
   */
  Top,
  /**
   * 元素的右外边距边界与其包含块右边界之间的偏移 right
   * 非定位元素设置此属性无效
   */
  Right,
  /**
   * 元素下外边距边界与其包含块下边界之间的偏移 bottom
   * 非定位元素设置此属性无效
   */
  Bottom,
  /**
   * 元素的左外边距边界与其包含块左边界之间的偏移 left
   * 非定位元素设置此属性无效
   */
  Left,
  /**
   * 元素的宽度
   */
  Width,
  /**
   * 元素的高度
   */
  Height,
  /**
   * 元素的最小宽度
   */
  MinWidth,
  /**
   * 元素的最小高度
   */
  MinHeight,
  /**
   * 元素的最大宽度
   */
  MaxWidth,
  /**
   * 元素的最大高度
   */
  MaxHeight,
  /**
   * 元素的盒模型
   */
  BoxSizing,

  /**
   * Margin相关
   */
  /**
   * 元素的外边距 margin
   */
  Margin,
  /**
   * 元素的顶部外边距 margin-top
   */
  MarginTop,
  /**
   * 元素的右侧外边距 margin-right
   */
  MarginRight,
  /**
   * 元素的底部外边距 margin-bottom
   */
  MarginBottom,
  /**
   * 元素的左侧外边距 margin-left
   */
  MarginLeft,

  /**
   * Padding相关
   */
  /**
   * 元素的内边距 padding
   */
  Padding,
  /**
   * 元素的顶部内边距 padding-top
   */
  PaddingTop,
  /**
   * 元素的右侧内边距 padding-right
   */
  PaddingRight,
  /**
   * 元素的底部内边距 padding-bottom
   */
  PaddingBottom,
  /**
   * 元素的左侧内边距 padding-left
   */
  PaddingLeft,

  /**
   * Border相关
   */
  /**
   * 元素边框的简写属性 border
   */
  Border,
  /**
   * 元素所有边框的宽度 border-width
   */
  BorderWidth,
  /**
   * 元素所有边框的样式 border-style
   */
  BorderStyle,
  /**
   * 元素顶部边框的简写属性 border-top
   */
  BorderTop,
  /**
   * 元素顶部边框的宽度 border-top-width
   */
  BorderTopWidth,
  /**
   * 元素顶部边框的样式 border-top-style
   */
  BorderTopStyle,
  /**
   * 元素右边框的简写属性 border-right
   */
  BorderRight,
  /**
   * 元素右边框的宽度 border-right-width
   */
  BorderRightWidth,
  /**
   * 元素右边框的样式 border-right-style
   */
  BorderRightStyle,
  /**
   * 元素底部边框的简写属性 border-bottom
   */
  BorderBottom,
  /**
   * 元素底部边框的宽度 border-bottom-width
   */
  BorderBottomWidth,
  /**
   * 元素底部边框的样式 border-bottom-style
   */
  BorderBottomStyle,
  /**
   * 元素左边框的简写属性 border-left
   */
  BorderLeft,
  /**
   * 元素左边框的宽度 border-left-width
   */
  BorderLeftWidth,
  /**
   * 元素左边框的样式 border-left-style
   */
  BorderLeftStyle,

  /**
   * Flex相关
   */
  /**
   * Flex布局 简写属性 flex
   * flex-grow|flex-shrink|flex-basis 的简写
   * 单值：flex-grow|flex-basis|关键字
   * 双值：flex-grow|flex-basis
   * 三值：flex-grow|flex-shrink|flex-basis
   */
  Flex,
  /**
   * Flex布局 主轴方向 flex-direction
   */
  FlexDirection,
  /**
   * Flex布局 元素是单行还是多行显示，允许多行时的堆叠方向 flex-wrap
   */
  FlexWrap,
  /**
   * Flex布局 flex-direction|flex-wrap 的简写 flex-flow
   */
  FlexFlow,
  /**
   * Flex布局 元素主尺寸的增长系数 flex-grow
   */
  FlexGrow,
  /**
   * Flex布局 元素宽度的收缩规则 flex-shrink
   */
  FlexShrink,
  /**
   * Flex布局 元素在主轴方向上的初始大小 flex-basis
   */
  FlexBasis,
  /**
   * Flex布局 子元素在主轴方向的对齐方式 justify-content
   */
  JustifyContent,
  /**
   * Flex布局 子元素在交叉轴方向的对齐方式 align-items
   */
  AlignItems,
  /**
   * Flex布局 元素在父元素中的交叉轴方向的对齐方式（覆盖父元素设置的align-items值） align-self
   */
  AlignSelf,
  /**
   * Flex布局 子元素在交叉轴方向的整体分布方式 align-content
   */
  AlignContent,

  /*渲染排版样式*/
  /**
   * 元素的 Z 轴顺序 z-index
   */
  ZIndex,
  /**
   * 元素布局方式 display
   * https://doc.dcloud.net.cn/uni-app-x/css/display.html
   */
  Display,
  /**
   * 元素定位方式 position
   * https://doc.dcloud.net.cn/uni-app-x/css/position.html
   */
  Position,

  /*渲染样式*/
  /**
   * 元素显示或隐藏，不更改布局
   */
  Visibility,
  /**
   * 元素溢出时所需的行为 overflow
   */
  Overflow,
  /**
   * 元素左下角的圆角半径 border-bottom-left-radius
   */
  BorderBottomLeftRadius,
  /**
   * 元素右下角的圆角半径 border-bottom-right-radius
   */
  BorderBottomRightRadius,
  /**
   * 元素顶部边框的颜色 border-top-color
   */
  BorderTopColor,
  /**
   * 元素边框所有圆角半径 border-radius
   */
  BorderRadius,
  /**
   * 元素所有边框的颜色 border-color
   */
  BorderColor,
  /**
   * 元素左上角的圆角半径 border-top-left-radius
   */
  BorderTopLeftRadius,
  /**
   * 元素右上角的圆角半径 border-top-right-radius
   */
  BorderTopRightRadius,
  /**
   * 元素左边框的颜色 border-left-color
   */
  BorderLeftColor,
  /**
   * 元素底部边框的颜色 border-bottom-color
   */
  BorderBottomColor,
  /**
   * 元素右边框的颜色 border-right-color
   */
  BorderRightColor,
  /**
   * 背景相关
   */
  Background,
  BackgroundColor,
  BackgroundImage,
  BackgroundClip,

  /**
   * 字体相关
   */
  FontFamily,
  FontSize,
  FontStyle,
  FontWeight,
  LineHeight,
  LetterSpacing,
  Lines,  //将废弃，通过组件属性max-lines替换

  Color,
  TextAlign,
  TextDecoration,
  TextDecorationColor,
  TextDecorationLine,
  TextDecorationStyle,
  TextDecorationThickness,
  TextOverflow,
  TextShadow,
  WhiteSpace,

  /**
   * 元素变换相关
   */
  Transform,
  TransformOrigin,
  TransformInternal,

  /**
   * 元素动画相关
   */
  Transition,
  TransitionProperty,
  TransitionDuration,
  TransitionDelay,
  TransitionTimingFunction,

  /**
   * 其它
   */
  Opacity,
  BoxShadow,
  PointerEvents,

  /**
   * 代指所有属性值
   */
  All,
}
