import { UniElement } from './index'
import { UniTextLayout } from './index'
import { UniNativeColor } from "./UniNativeDefines"
import { UniCSSUnitValue, UniCSSUnitType } from "./UniCSSType"
import { UniCSSFontStyleType, UniCSSFontWeightType, UniCSSLineHeightType } from "./UniCSSProperty"
import { UniCSSTextDecorationLineType, UniCSSTextDecorationStyle } from "./UniCSSProperty"
import { UniCSSTextAlign, UniCSSTextOverflow, UniCSSWhiteSpace, UniCSSTextShadow } from "./UniCSSProperty"


declare global {
  interface UniText {
    /**
     *
     * 设置文本(直接透传设置给它的父UniTextElement)
     */
    setText(text: string): void
  }
  /**
   * UniTextElement
   */
  interface UniTextElement extends UniElement {

    /**
     * 以下API所有平台都需要支持
     *  Android平台：在kotlin层实现
     *  鸿蒙平台：在c层实现
     *  iOS平台：在c层实现
     */
    /**
     * 设置文本内容
     *  Android平台仅在kotlin层实现，用于开放给开发者使用
     *  鸿蒙/iOS平台的在c层实现，设置后需同步更新给NativeView
     *  鸿蒙/iOS平台在ArkTS/Swift包装调用c层的实现
     */
    setLayoutText(text: UniTextLayout): void;

    /**
     * 设置渲染标识，用于复用内部TextLayout
     */
    setRenderKey(key: string): void

    /**
     * 设置文本最大行数
     * 支持 max-lines 属性，废弃dom1中css lines属性
     *  Android平台在kotlin层实现
     *  鸿蒙/iOS平台的在c层实现
     */
    setMaxLines(lines: number): void

    /**
     * 以下API用于支持框架不使用UniTextLayout API的场景
     *  仅鸿蒙/iOS平台在c层实现
     */
    /**
     * 设置文本
     */
    setText(text: string): void

    /**
     * 设置文本颜色
     * @param color
     *  UniNativeColor - 平台颜色类型
     */
    setColor(color: UniNativeColor): void

    /**
     * 设置背景颜色
     * @param color
     *  UniNativeColor - 平台颜色类型
     */
    setBackgroundColor(color: UniNativeColor): void

    /**
     * 设置字体名称
     */
    setFontFamily(family: string): void

    /**
     * 设置字体大小
     * @param size
     *  UniCSSUnitValue - 带单位的长度
     */
    setFontSize(size: UniCSSUnitValue): void
    setFontSize(value: number, unit: UniCSSUnitType): void
    /**
     * 设置字体样式
     * @param style
     *  UniCSSFontStyleType - 枚举类型字体样式
     */
    setFontStyle(style: UniCSSFontStyleType): void

    /**
     * 设置字体粗细
     * 默认值为Normal
     * @param weight
     *  UniCSSFontWeightType - 字体粗细枚举值
     *  number - 体粗细具体值
     */
    setFontWeight(weight: UniCSSFontWeightType | number): void

    /**
     * 设置字符间距
     *  UniCSSUnitValue - 字符间距值
     */
    setLetterSpacing(spacing: UniCSSUnitValue): void
    setLetterSpacing(value: number, unit: UniCSSUnitType): void

    /**
     * 设置文本行高
     * 默认值为Normal
     * @param height
     *  UniCSSLineHeightType - 文本行高枚举值
     *  UniCSSUnitValue - 带单位的文本行高值
     */
    setLineHeight(height: UniCSSLineHeightType | UniCSSUnitValue): void
    setLineHeight(value: number, unit: UniCSSUnitType): void

    /**
     * 设置文字水平对齐方式
     * 默认值为Left
     * @param align
     *  UniCSSTextAlign - 文字水平对齐枚举值
     */
    setTextAlign(align: UniCSSTextAlign): void

    /**
     * 设置文本装饰线样式
     */
    setTextDecoration(style: UniCSSTextDecorationStyle): void
    /**
     * 设置文本装饰线线条类型
     * 其它效果不支持时使用此API设置
     */
    setTextDecorationLine(type: UniCSSTextDecorationLineType): void

    /**
     * 设置文字溢出处理样式
     * @param overflow
     *  UniCSSTextOverflow - 文字溢出处理样式枚举值
     */
    setTextOverflow(overflow: UniCSSTextOverflow): void

    /**
     * 设置文字阴影
     * @param shadow
     *  UniCSSTextShadow - 文字阴影类型值
     */
    setTextShadow(shadow: UniCSSTextShadow): void

    /**
     * 设置处理空白字符
     */
    setWhiteSpace(whiteSpace: UniCSSWhiteSpace): void

    /**
     * 设置hover状态样式
     */
    setHoverStyles(style: UniElementStyles): void

    /**
     * 用于解决view组件 over 状态的样式更新与恢复，内部使用。
     * 区分更新样式是排版相关还是渲染相关
     * 排版相关通过FlexNode获取并备份数据，渲染相关需通过NativeView获取并备份数据：
     *  按下时调用backupAndUpdateStyle备份样式
     *  松开时调用restoreStyle恢复样式
     *
     *  Android平台：在kotlin/c层分别实现
     *  iOS平台/鸿蒙平台：在c层实现
     */
    /**
     * 备份并更新样式
     */
    backupAndUpdateStyle(): void
    /**
     * 恢复样式
     */
    restoreStyle(): void
  }

}

export { }
