import { UniCSSPropertyID } from './UniCSSPropertyId'

/**
 * transition-timing-function 类型
 */
export enum UniCSSTransitionTimingFunctionType {
  Ease,
  EaseIn,
  EaseOut,
  EaseInOut,
  Linear,
  CubicBezier,
}

/**
 * cubic-bezier 值数据
 */
export interface UniCSSCubicBezier {
  /**
   * 控制点1的x坐标
   *  范围为0-1
   */
  x1: number,
  /**
   * 控制点1的y坐标
   */
  y1: number,
  /**
   * 控制点2的x坐标
   *  范围为0-1
   */
  x2: number,
  /**
   * 控制点2的y坐标
   */
  y2: number,
}

/**
 * transition-timing-function 数据
 */
export interface UniCSSTransitionTimingFunction {
  /**
   * 动画过渡的速度曲线类型
   */
  type: UniCSSTransitionTimingFunctionType
  /**
   * 动画过渡的贝塞尔值
   *  当 timingFunction 为 CubicBezier 时使用
   */
  timingCubicBezier?: UniCSSCubicBezier | null,
}

/**
 * transition-timing-function 数据（多项）
 */
export type UniCSSTransitionTimingFunctions = UniCSSTransitionTimingFunction[]

/**
 * transition 变换项数据
 */
export interface UniCSSTransition {
  /**
   * 动画持续时间
   *  单位为ms
   */
  duration: number,
  /**
   * 动画延迟时间
   *  单位为ms
   */
  delay: number
  /**
   * 动画要过渡的 css 属性
   */
  property: UniCSSPropertyID,
  /**
   * 动画过渡的速度曲线
   */
  timingFunction: UniCSSTransitionTimingFunction,
}

/**
 * CSS transition 变换数据（多项）
 */
export type UniCSSTransitions = UniCSSTransition[]

/**
 * CSS transition-property 数据
 */
export type UniCSSTransitionProperty = UniCSSPropertyID
export type UniCSSTransitionProperties = UniCSSPropertyID[]

/**
 * CSS transition-duration 数据
 */
export type UniCSSTransitionDuration = number
export type UniCSSTransitionDurations = number[]

/**
 * CSS transition-delay 数据
 */
export type UniCSSTransitionDelay = number
export type UniCSSTransitionDelays = number[]



