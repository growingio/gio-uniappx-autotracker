import { UniCSSPropertyID } from './UniCSSPropertyId'
import { UniCSSPropertyValue } from './UniCSSProperty'

/**
 * UniElement类型
 */
export enum UniElementType {
  /**
   * 基本视图容器 view
   */
  View,
  /**
   * 文本 text
   */
  Text,
  /**
   * 图片 image
   */
  Image,
  /**
   * 可滚动视图容器 scroll-view
   */
  ScrollView,

  //Todo: 补充其它类型

  /**
   * 页面Body
   * 注意：仅内部使用
   */
  Body,
}

/**
 * 样式类型
 * 设置多个样式时值类型
 */
export type UniElementStyles = Map<UniCSSPropertyID, UniCSSPropertyValue>
