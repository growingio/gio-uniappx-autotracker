import { UniNativeColor } from "./UniNativeDefines"
import { UniCSSUnitValue } from "./UniCSSType"
import { UniCSSFontStyleType, UniCSSFontWeightType, UniCSSLineHeightType } from "./UniCSSProperty"
import { UniCSSTextDecorationLineType, UniCSSTextDecorationStyle } from "./UniCSSProperty"
import { UniCSSTextAlign, UniCSSTextOverflow, UniCSSWhiteSpace, UniCSSTextShadow } from "./UniCSSProperty"
import { UniLayoutSize, UniLayoutConstraintSize } from "./UniCommon"

declare global {
  /**
   * 文本输出对象
   * 需支持跨线程共享
   */
  interface UniTextLayout {
    /**
     * 设置文本
     */
    setText(text: string): void

    /**
     * 设置背景颜色
     * @param color
     *  UniNativeColor - 平台颜色类型
     */
    setBackgroundColor(color: UniNativeColor): void

    /**
     * 设置文本颜色
     * @param color
     *  UniNativeColor - 平台颜色类型
     *  string - 兼容字符串参数设置文本颜色
     */
    setColor(color: UniNativeColor | string): void

    /**
     * 设置字体名称
     */
    setFontFamily(family: string): void

    /**
     * 设置字体大小
     * @param size
     *  UniCSSUnitValue - 带单位的长度
     *  string - 兼容字符串参数设置字体大小
     */
    setFontSize(size: UniCSSUnitValue | string): void

    /**
     * 设置字体样式
     * @param style
     *  UniCSSFontStyleType - 枚举类型字体样式
     *  string - 兼容字符串参数设置字体样式
     */
    setFontStyle(style: UniCSSFontStyleType | string): void

    /**
     * 设置字体粗细
     * 默认值为Normal
     * @param weight
     *  UniCSSFontWeightType - 字体粗细枚举值
     *  number - 体粗细具体值
     *  string - 兼容字符串参数设置字体粗细
     */
    setFontWeight(weight: UniCSSFontWeightType | number | string): void

    /**
     * 设置字符间距
     *  UniCSSUnitValue - 字符间距值
     *  string - 兼容字符串参数设置字符间距
     */
    setLetterSpacing(spacing: UniCSSUnitValue | string): void

    /**
     * 设置文本行高
     * 默认值为Normal
     * @param height
     *  UniCSSLineHeightType - 文本行高枚举值
     *  UniCSSUnitValue - 带单位的文本行高值
     *  string - 兼容字符串参数设置行高
     */
    setLineHeight(height: UniCSSLineHeightType | UniCSSUnitValue | string): void

    /**
     * 设置文字水平对齐方式
     * 默认值为Left
     * @param align
     *  UniCSSTextAlign - 文字水平对齐枚举值
     *  string - 兼容字符串参数设置文字水平对齐方式
     */
    setTextAlign(align: UniCSSTextAlign | string): void

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
     *  string - 兼容字符串参数设置文字溢出处理样式
     */
    setTextOverflow(overflow: UniCSSTextOverflow | string): void

    /**
     * 设置文字阴影
     * @param shadow
     *  UniCSSTextShadow - 文字阴影类型值
     *  string - 兼容字符串参数设置文字阴影
     */
    setTextShadow(shadow: UniCSSTextShadow | string): void

    /**
     * 设置处理空白字符
     */
    setWhiteSpace(whiteSpace: UniCSSWhiteSpace | string): void

    /**
     * 添加子文本对象
     * 支持text的嵌套
     */
    append(text: UniTextLayout): void

    /**
     * 测量文本大小
     * 调用此方法会创建原生测量对象
     */
    measure(constraint: UniLayoutConstraintSize): UniLayoutSize;
  }
}

export { }
