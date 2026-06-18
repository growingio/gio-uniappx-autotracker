import { UniNativeColor } from "./UniNativeDefines"


/**
 * CSS属性名称
 * 字符串类型
 * 注意：各平台应定为常量
 */
export type UniCSSPropertyName = string

/**
 * CSS属性值
 */
export type UniCSSPropertyValue = any | null

/**
 * box-sizing值类型
 */
export enum UniCSSBoxSizingType {
  BorderBox,
  ContentBox,
}

/**
 * display值类型
 */
export enum UniCSSDisplayType {
  /**
   * 元素按弹性布局
   */
  Flex,
  /**
   * 元素不显示
   */
  None,
}

/**
 * position值类型
 */
export enum UniCSSPositionType {
  Relative,
  Absolute,
  Fixed,
  Sticky,
  Static,
}

/**
 * visibility值类型
 */
export enum UniCSSVisibilityType {
  Visible,
  Hidden
}

/**
 * border-style值类型
 */
export enum UniCSSBorderStyleType {
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

/**
 * boder-width 关键字值类型
 */
export enum UniCSSBorderWidthType {
  /**
   * 细边框线
   *  app平台对应1px值
   */
  Thin,
  /**
   * 中等边框线
   *  app平台对应3px值
   */
  Medium,
  /**
   * 粗边框线
   *  app平台对应5px值
   */
  Thick,
}

/**
 * flex-direction值类型
 */
export enum UniCSSFlexDirectionType {
  Row,
  RowReverse,
  Column,
  ColumnReverse,
}

/**
 * flex-wrap值类型
 */
export enum UniCSSFlexWrapType {
  NoWrap,
  Wrap,
  WrapReverse,
}

/**
 * flex对齐值类型
 * align-item、align-self、justify-content、align-content
 */
export enum UniCSSFlexAlignType {
  Auto,
  FlexStart,
  Center,
  FlexEnd,
  Stretch,
  Baseline,
  SpaceBetween,
  SpaceAround,
  SpaceEvenly,
}
export type UniCSSJustifyContentType = UniCSSFlexAlignType
export type UniCSSAlignItemsType = UniCSSFlexAlignType
export type UniCSSAlignSelfType = UniCSSFlexAlignType
export type UniCSSAlignContentType = UniCSSFlexAlignType

/**
 * flex-basis 值类型
 */
export enum UniCSSFlexBasisType {
  Auto,
  Content,
}


/**
 * line-height值类型
 *  多行文本的行高类型，这里仅定义固定类型值
 */
export enum UniCSSLineHeightType {
  /**
   * 默认行高
   * 约为1.2em
   */
  Normal,
}

/**
 * font-style值类型
 */
export enum UniCSSFontStyleType {
  /**
   * 常规字体
   */
  Normal,
  /**
   * 斜体字体
   */
  Italic,
}

/**
 * font-weight值类型
 */
export enum UniCSSFontWeightType {
  /**
   * 正常粗细
   * 与400等值
   */
  Normal,
  /**
   * 加粗
   * 与700等值
   */
  Bold,
  /**
   * 比正常值更细
   */
  Lighter,
  /**
   * 比正常值更粗
   */
  Bolder,
}

/**
 * text-align值类型
 *  文本对齐方式
 */
export enum UniCSSTextAlign {
  /**
   * 行内内容向左侧边对齐
   */
  Left,
  /**
   * 行内内容向右侧边对齐
   */
  Right,
  /**
   * 行内内容居中
   */
  Center,
}

/**
 * text-decoration-style值类型
 */
export enum UniCSSTextDecorationStyleType {
  /**
   * 实线
   */
  Solid,
  /**
   * 双实线
   */
  Double,
  /**
   * 点划线
   */
  Dotted,
  /**
   * 虚线
   */
  Dashed,
  /**
   * 波浪线
   */
  Wavy,
}

/**
 * text-decoration-line值类型
 */
export enum UniCSSTextDecorationLineType {
  /**
   * 没有文本装饰线
   */
  None,
  /**
   * 文本的下方有装饰线
   */
  Underline,
  /**
   * 文本的上方有装饰线
   */
  Overline,
  /**
   * 贯穿文本中间的装饰线
   */
  LineThrough,
}

/**
 * text-decoration-thickness值类型
 */
export enum UniCSSTextDecorationThicknessType {
  /**
   * 自动选择合适的厚度
   */
  Auto,
  /**
   * 优先使用字体文件中包含了首选的厚度值，否则与Auto值一样
   */
  FromFont,
}

/**
 * text-decoration-style值类型定义
 */
export interface UniCSSTextDecorationStyle {
  /**
   * 装饰线线条类型
   */
  line: UniCSSTextDecorationLineType,
  /**
   * 装饰线颜色
   * 默认值与文本颜色值一致
   */
  color: UniNativeColor,
  /**
   * 装饰线样式
   * 默认值为实线
   */
  style: UniCSSTextDecorationStyleType,
  /**
   * 装饰性线厚度
   * 默认值为Auto
   */
  thickness: UniCSSTextDecorationThicknessType,

}

/**
 * text-overflow值类型
 * 文字溢出处理样式
 */
export enum UniCSSTextOverflow {
  /**
   * 截断溢出内容
   */
  Clip,
  /**
   * 溢出内容显示为省略号
   */
  Ellipsis,
}

/**
 * white-space值类型
 *  字符中的空白字符处理方式
 */
export enum UniCSSWhiteSpace {
  /**
   * 换行符会被合并，连续的空白符（空格/制表符）会被合并，文本自动换行
   */
  Normal,
  /**
   * 换行符会被合并，连续的空白符（空格/制表符）会被合并，文本不自动换行
   */
  Nowrap,
  /**
   * 换行符会保留，连续的空白符（空格/制表符）会保留，文本不自动换行
   */
  Pre,
  /**
   * 换行符会保留，连续的空白符（空格/制表符）会保留，文本自动换行
   */
  PreWrap,
  /**
   * 换行符会保留，连续的空白符（空格/制表符）会被合并，文本自动换行
   */
  PreLine,
  /**
   * 换行符会保留，连续的空白符（空格/制表符）会保留，文本自动换行
   */
  BreakSpaces,
}

/**
 * text-shadow值类型定义
 * 文字阴影样式
 */
export type UniCSSTextShadow = {
  /**
   * 阴影颜色
   * 默认为文字颜色
   */
  color?: UniNativeColor | null
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
}
