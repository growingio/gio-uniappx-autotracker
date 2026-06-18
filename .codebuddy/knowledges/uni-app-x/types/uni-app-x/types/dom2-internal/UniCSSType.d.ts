
/**
 * 单位类型
 */
export enum UniCSSUnitType {
  /**
   * 无单位
   */
  NONE,
  /**
   * 自动计算
   */
  AUTO,
  /**
   * 逻辑像素
   * Pixel
   */
  PX,
  /**
   * 相对像素
   * Relative Pixel
   */
  RPX,
  /**
   * 百分比
   * Percent
   */
  PCT,
  /**
   * 相对当前元素单位
   */
  EM,
  /**
   * 相对根元素单位
   * Root EM
   */
  REM,
  /**
   * 角度度数
   * Degree
   */
  DEG,
  /**
   * 角度弧度
   * Radian
   */
  RAD,
  /**
   * 时间 秒
   */
  S,
  /**
   * 时间 毫秒
   */
  MS,
}


/**
 * CSS带单位的数值类型
 */
export interface UniCSSUnitValue {
  /**
   * 值
   * 注: 不同语言实际类型需调整，如c/c++中为float类型
   */
  value: number,
  /**
   * 单位
   */
  unit: UniCSSUnitType,
}

/**
 * UniCSSUnitValue构造函数接口
 */
interface UniCSSUnitValueConstructor {
  new(value: number, unit: UniCSSUnitType): UniCSSUnitValue
}
export declare const UniCSSUnitValue: UniCSSUnitValueConstructor
