import { UniElementStyles } from './UniElementType'
import { UniSlotType } from './UniCommon'
import { UniCSSPropertyID } from './UniCSSPropertyId'
import { UniCSSPropertyName, UniCSSPropertyValue } from './UniCSSProperty'
import { UniCSSUnitType, UniCSSUnitValue } from './UniCSSType'
import { UniCSSBoxSizingType, UniCSSDisplayType, UniCSSPositionType, UniCSSBorderStyleType, UniCSSBorderWidthType } from './UniCSSProperty'
import { UniCSSFlexDirectionType, UniCSSFlexWrapType, UniCSSJustifyContentType, UniCSSAlignItemsType, UniCSSAlignSelfType, UniCSSAlignContentType, UniCSSFlexBasisType } from './UniCSSProperty'
import { UniCSSTransitions } from './UniCSSTransition'

declare global {
  /**
   * UniElement
   */
  interface UniElement {

    /**
     * 以下属性在FlexNode和DOM层封装
     * - Android平台：c层和kt层都需要封装
     * - iOS平台：oc层实现
     * - 鸿蒙平台：c层实现
     */
    /**
     * 插槽名称
     */
    slot: UniSlotType
    /**
     * 以下方法在FlexNode层封装，仅用于内部使用
     * - Android平台：c层实现
     * - iOS平台：oc层实现
     * - 鸿蒙平台：c层实现
     */
    /**
     * 定义CSS变量
     * @param key - css变量名称
     * @param value - css变量值，空字符串则表示移除变量定义
     */
    defineStyleVariable(key: string, value: string): void
    /**
     * 设置CSS变量
     */
    setStyleVariable(key: UniCSSPropertyID, value: string): void
    /**
     * 设置位置大小相关CSS属性
     */
    setStyleBoxSizing(value: UniCSSBoxSizingType): void
    getStyleBoxSizing(): UniCSSBoxSizingType
    setStyleDisplay(value: UniCSSDisplayType): void
    getStyleDisplay(): UniCSSDisplayType
    setStylePosition(value: UniCSSPositionType): void
    getStylePosition(): UniCSSPositionType
    setStyleWidth(value: UniCSSUnitValue): void
    setStyleWidth(value: number, unit: UniCSSUnitType): void
    getStyleWidth(): UniCSSUnitValue
    setStyleHeight(value: UniCSSUnitValue): void
    setStyleHeight(value: number, unit: UniCSSUnitType): void
    getStyleHeight(): UniCSSUnitValue
    setStyleMinWidth(value: UniCSSUnitValue): void
    setStyleMinWidth(value: number, unit: UniCSSUnitType): void
    getStyleMinWidth(): UniCSSUnitValue
    setStyleMinHeight(value: UniCSSUnitValue): void
    setStyleMinHeight(value: number, unit: UniCSSUnitType): void
    getStyleMinHeight(): UniCSSUnitValue
    setStyleMaxWidth(value: UniCSSUnitValue): void
    setStyleMaxWidth(value: number, unit: UniCSSUnitType): void
    getStyleMaxWidth(): UniCSSUnitValue
    setStyleMaxHeight(value: UniCSSUnitValue): void
    setStyleMaxHeight(value: number, unit: UniCSSUnitType): void
    getStyleMaxHeight(): UniCSSUnitValue
    setStyleTop(value: UniCSSUnitValue): void
    setStyleTop(value: number, unit: UniCSSUnitType): void
    getStyleTop(): UniCSSUnitValue
    setStyleRight(value: UniCSSUnitValue): void
    setStyleRight(value: number, unit: UniCSSUnitType): void
    getStyleRight(): UniCSSUnitValue
    setStyleBottom(value: UniCSSUnitValue): void
    setStyleBottom(value: number, unit: UniCSSUnitType): void
    getStyleBottom(): UniCSSUnitValue
    setStyleLeft(value: UniCSSUnitValue): void
    setStyleLeft(value: number, unit: UniCSSUnitType): void
    getStyleLeft(): UniCSSUnitValue
    //DOM不需要此数据，去掉相关API
    // setStyleVisibility(value: UniCSSVisibilityType): void
    // getStyleVisibility(): UniCSSVisibilityType
    /**
     * 设置边框边距相关CSS属性
     */
    setStyleMargin(value: UniCSSUnitValue): void
    setStyleMargin(value: number, unit: UniCSSUnitType): void
    getStyleMargin(): UniCSSUnitValue[]      // 数组长度为4
    setStyleMarginTop(value: UniCSSUnitValue): void
    setStyleMarginTop(value: number, unit: UniCSSUnitType): void
    getStyleMarginTop(): UniCSSUnitValue
    setStyleMarginRight(value: UniCSSUnitValue): void
    setStyleMarginRight(value: number, unit: UniCSSUnitType): void
    getStyleMarginRight(): UniCSSUnitValue
    setStyleMarginBottom(value: UniCSSUnitValue): void
    setStyleMarginBottom(value: number, unit: UniCSSUnitType): void
    setStyleMarginBottom(): UniCSSUnitValue
    setStyleMarginLeft(value: UniCSSUnitValue): void
    setStyleMarginLeft(value: number, unit: UniCSSUnitType): void
    getStyleMarginLeft(): UniCSSUnitValue
    setStylePadding(value: UniCSSUnitValue): void
    setStylePadding(value: number, unit: UniCSSUnitType): void
    getStylePadding(): UniCSSUnitValue[]     // 数组长度为4
    setStylePaddingTop(value: UniCSSUnitValue): void
    setStylePaddingTop(value: number, unit: UniCSSUnitType): void
    getStylePaddingTop(): UniCSSUnitValue
    setStylePaddingRight(value: UniCSSUnitValue): void
    setStylePaddingRight(value: number, unit: UniCSSUnitType): void
    getStylePaddingRight(): UniCSSUnitValue
    setStylePaddingBottom(value: UniCSSUnitValue): void
    setStylePaddingBottom(value: number, unit: UniCSSUnitType): void
    getStylePaddingBottom(): UniCSSUnitValue
    setStylePaddingLeft(value: UniCSSUnitValue): void
    setStylePaddingLeft(value: number, unit: UniCSSUnitType): void
    getStylePaddingLeft(): UniCSSUnitValue
    setStyleBorderStyle(value: UniCSSBorderStyleType): void
    getStyleBorderStyle(): UniCSSBorderStyleType[]  // 数组长度为4
    setStyleBorderTopStyle(value: UniCSSBorderStyleType): void
    getStyleBorderTopStyle(): UniCSSBorderStyleType
    setStyleBorderRightStyle(value: UniCSSBorderStyleType): void
    getStyleBorderRightStyle(): UniCSSBorderStyleType
    setStyleBorderBottomStyle(value: UniCSSBorderStyleType): void
    getStyleBorderBottomStyle(): UniCSSBorderStyleType
    setStyleBorderLeftStyle(value: UniCSSBorderStyleType): void
    getStyleBorderLeftStyle(): UniCSSBorderStyleType
    //border-width简写时混合使用关键字类型，则编译时按UniCSSBorderWidthType中规定的值转换为UniCSSUnitValue类型
    setStyleBorderWidth(value: UniCSSUnitValue | UniCSSBorderWidthType): void
    setStyleBorderWidth(value: number, unit: UniCSSUnitType): void
    getStyleBorderWidth(): UniCSSUnitValue[]      // 数组长度为4
    setStyleBorderTopWidth(value: UniCSSUnitValue | UniCSSBorderWidthType): void
    setStyleBorderTopWidth(value: number, unit: UniCSSUnitType): void
    getStyleBorderTopWidth(): UniCSSUnitValue
    setStyleBorderRightWidth(value: UniCSSUnitValue | UniCSSBorderWidthType): void
    setStyleBorderRightWidth(value: number, unit: UniCSSUnitType): void
    getStyleBorderRightWidth(): UniCSSUnitValue
    setStyleBorderBottomWidth(value: UniCSSUnitValue | UniCSSBorderWidthType): void
    setStyleBorderBottomWidth(value: number, unit: UniCSSUnitType): void
    getStyleBorderBottomWidth(): UniCSSUnitValue
    setStyleBorderLeftWidth(value: UniCSSUnitValue | UniCSSBorderWidthType): void
    setStyleBorderLeftWidth(value: number, unit: UniCSSUnitType): void
    getStyleBorderLeftWidth(): UniCSSUnitValue
    /**
     * 设置Flex相关CSS属性
     */
    setStyleFlexDirection(value: UniCSSFlexDirectionType): void
    getStyleFlexDirection(): UniCSSFlexDirectionType
    setStyleFlexWrap(value: UniCSSFlexWrapType): void
    getStyleFlexWrap(): UniCSSFlexWrapType
    setStyleFlexGrow(value: number): void
    getStyleFlexGrow(): number
    setStyleFlexShrink(value: number): void
    getStyleFlexShrink(): number
    setStyleFlexBasis(value: UniCSSUnitValue | UniCSSFlexBasisType): void
    setStyleFlexBasis(value: number, unit: UniCSSUnitType): void
    getStyleFlexBasis(): UniCSSUnitValue
    setStyleJustifyContent(value: UniCSSJustifyContentType): void
    getStyleJustifyContent(): UniCSSJustifyContentType
    setStyleAlignItems(value: UniCSSAlignItemsType): void
    getStyleAlignItems(): UniCSSAlignItemsType
    setStyleAlignSelf(value: UniCSSAlignSelfType): void
    getStyleAlignSelf(): UniCSSAlignSelfType
    setStyleAlignContent(value: UniCSSAlignContentType): void
    getStyleAlignContent(): UniCSSAlignContentType
    /**
     * 设置Transition相关CSS属性
     * 注意：transition/transition-property属性值设置为none时，解析设置null值
     */
    setStyleTransition(value?: UniCSSTransition | UniCSSTransitions | null): void
    getStyleTransition(): UniCSSTransitions | null
    setStyleTransitionProperty(value?: UniNativeTransitionProperty | UniNativeTransitionProperties | null): void
    getStyleTransitionProperty(): UniNativeTransitionProperties | null
    setStyleTransitionDuration(value: UniNativeTransitionDuration | UniNativeTransitionDurations): void
    getStyleTransitionDuration(): UniNativeTransitionDurations
    setStyleTransitionDelay(value: UniNativeTransitionDelay | UniNativeTransitionDelays): void
    getStyleTransitionDelay(): UniNativeTransitionDelays
    setStyleTransitionTimingFunction(value: UniNativeTransitionTimingFunction | UniNativeTransitionTimingFunctions): void
    getStyleTransitionTimingFunction(): UniNativeTransitionTimingFunctions
    /**
     * 获取CSS属性
     * 返回字符串格式数据
     */
    getStyleString(key: UniCSSPropertyID | UniCSSPropertyName): string | null
    /**
     * 获取内部ID值，用于框架调用，不对外公开
     *  Android平台在c/kotlin层分别实现
     *  鸿蒙/iOS平台在c层实现
     */
    // 复用DOM1中定义，暂时注释
    // getNodeId(): number

    /**
     * 以下方法在UniElement区分Node和Element概念
     * 仅在C层实现，不对外公开
     */
    /**
     * Element 逻辑的属性获取
     *  用于 js 层封装 DOM API 提供给开发者使用
     */
    getFirstElementChild(): UniElement | null
    getLastElementChild(): UniElement | null
    getPreviousElementSibling(): UniElement | null
    getNextElementSibling(): UniElement | null
    getParentElement(): UniElement | null
    getChildren(): UniElement | null
    /**
     * Node 逻辑的属性获取
     *  用于支持vue框架运行
     */
    getFirstChild(): UniElement | null
    getLastChild(): UniElement | null
    getPreviousSibling(): UniElement | null
    getNextSibling(): UniElement | null
    getParentNode(): UniElement | null
    getChildNodes(): UniElement | null

    /**
     * 查找离当前元素最近可竖向滚动的祖先元素
     */
    closestVerticalScrollElement(): UniScrollViewElement | null

    /**
     * 修改tagname
     *  在c/kotlin层提供，仅对vue框架开放
     */
    setCustomTagName(name: string): void

    /**
     * 获取内部节点唯一标识
     */
    getNodeId(): number

    /**
     * 设置插槽名称
     */
    setSlot(slot: UniSlotType): void
    /**
     * 获取插槽名称
     */
    getSlot(): UniSlotType

    /**
     * 以下方法在FlexNode和DOM层封装
     * - Android平台：c层和kt层都需要封装
     * - iOS平台：oc层实现
     * - 鸿蒙平台：c层实现
     */
    /**
     * 添加子元素
     */
    appendChild(child: UniElement): void
    /**
     * 插入子元素
     */
    insertBefore(child: UniElement, ref?: UniElement | null): UniElement | null
    /**
     * 删除子元素
     */
    removeChild(child: UniElement): UniElement | null
    /**
     * 从元素所属的DOM树中删除
     */
    remove(): void
    /**
     * 更新元素样式
     *  UniCSSPropertyValue类型可为null，为null值时表示删除此样式
     * 仅内部使用
     */
    updateStyle(style: UniElementStyles): void
    updateStyle(key: UniCSSPropertyID | UniCSSPropertyName, value?: UniCSSPropertyValue | null): void
  }
}
