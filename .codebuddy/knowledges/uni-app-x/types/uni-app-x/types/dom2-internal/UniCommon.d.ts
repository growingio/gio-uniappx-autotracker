/**
 * 通用类型定义
 */

/**
 * 插槽名称
 */
export enum UniSlotType {
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


/**
 * 基础类型position：left/top
 */
export type UniPosition = {
  left: number,
  top: number,
}

/**
 * 基础类型size：width/height
 */
export type UniSize = {
  width: number,
  height: number,
}

/**
 * 基础类型：left/top/width/height
 */
export type UniLTWH = {
  left: number,
  top: number,
  width: number,
  height: number,
}

/**
 * 基础类型：left/top/right/bottom
 */
export type UniLTRB = {
  left: number,
  top: number,
  right: number,
  bottom: number,
}

/**
 * 布局大小
 */
export interface UniLayoutSize {
  /**
   * 元素宽度，逻辑像素值。
   */
  width: number,
  /**
   * 元素的高度，逻辑像素值。
   */
  height: number
}

/**
 * 布局约束大小
 */
interface UniLayoutConstraintSize {
  /**
   * 元素最小宽度，逻辑像素值。
   * 可选值，不设置则认为没有最小宽度。
   */
  minWidth: number|null,
  /**
   * 元素最大宽度，逻辑像素值。
   * 可选值，不设置则认为可以无限宽。
   */
  maxWidth: number|null,
  /**
   * 元素最小高度，逻辑像素值。
   * 可选值，不设置则认为没有最小高度。
   */
  minHeight: number|null,
  /**
   * 元素最大高度，逻辑像素值。
   * 可选值，不设置则认为可以无限高。
   */
  maxHeight: number|null,
}
