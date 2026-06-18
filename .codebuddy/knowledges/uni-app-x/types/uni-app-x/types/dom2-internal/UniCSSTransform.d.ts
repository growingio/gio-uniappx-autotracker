import { UniCSSUnitValue, UniCSSUnitType } from './UniCSSType'

/**
 * transform类型
 */
export enum UniCSSTransformType {
  /**
   * 矩阵变换
   */
  Matrix,
  /**
   * 3D矩阵变换
   */
  Matrix3D,
  /**
   * 观察距离变换
   */
  Perspective,
  /**
   * 旋转
   */
  Rotate,
  /**
   * 绕 X 轴旋转
   * rotateX(a) 与 rotate3d(1, 0, 0, a) 一致
   */
  RotateX,
  /**
   * 绕 Y 轴旋转
   * rotateY(a) 与 rotate3d(0, 1, 0, a) 一致
   */
  RotateY,
  /**
   * 绕 Z 轴旋转
   * rotateZ(a) 与 rotate3d(0, 0, 1, a) 一致
   */
  RotateZ,
  /**
   * 3D旋转
   */
  Rotate3D,
  /**
   * 缩放
   */
  Scale,
  /**
   * X 轴方向缩放
   * scaleX(sx) 与 scale(sx, 1)、scale3d(sx, 1, 1) 一致
   */
  ScaleX,
  /**
   * Y 轴方向缩放
   * scaleY(sy) 与 scale(1, sy)、scale3d(1, sy, 1) 一致
   */
  ScaleY,
  /**
   * Z 轴方向缩放
   * scaleZ(sz) 与 scale3d(1, 1, sz) 一致
   */
  ScaleZ,
  /**
   * 3D缩放
   */
  Scale3D,
  /**
   * 倾斜（扭曲）
   */
  Skew,
  /**
   * 沿 X 轴倾斜
   */
  SkewX,
  /**
   * 沿 Y 轴倾斜
   */
  SkewY,
  /**
   * 移动
   */
  Translate,
  /**
   * 沿 X 轴移动
   */
  TranslateX,
  /**
   * 沿 Y 轴移动
   */
  TranslateY,
  /**
   * 沿 Z 轴移动
   */
  TranslateZ,
  /**
   * 3D移动
   */
  Translate3D,
}

/**
 * CSS Transform 函数基类
 */
export interface UniCSSTransformFunction {
  /**
   * 变换类型
   */
  type: UniCSSTransformType;
}

/**
 * 3D 变换基类
 */
export interface UniCSSTransform3DBase extends UniCSSTransformFunction {
  /** X 轴坐标转换 */
  x?: UniCSSUnitValue|null;
  /** Y 轴坐标转换 */
  y?: UniCSSUnitValue|null;
  /** Z 轴坐标转换 */
  z?: UniCSSUnitValue|null;
}

/**
 * CSS Transform: 平移变换
 * 限定类型为 Translate、Translate3D、TranslateX、TranslateY、TranslateZ
 * x/y/z 根据类型决定是否有值
 */
export interface UniCSSTransformTranslate extends UniCSSTransform3DBase {
}
/**
 * UniCSSTransformTranslate构造函数接口
 */
interface UniCSSTransformTranslateConstructor {
  /**
   * Translate数据的构造函数
   */
  Translate(x: UniCSSUnitValue): UniCSSTransformTranslate
  Translate(value: number, unit: UniCSSUnitType): UniCSSTransformTranslate
  Translate(x: UniCSSUnitValue, y: UniCSSUnitValue): UniCSSTransformTranslate
  Translate(valueX: number, unitX: UniCSSUnitType, valueY: number, unitY: UniCSSUnitType): UniCSSTransformTranslate
  /**
   * TranslateX数据的构造函数
   */
  Translatex(x: UniCSSUnitValue): UniCSSTransformTranslate
  Translatex(value: number, unit: UniCSSUnitType): UniCSSTransformTranslate
  /**
   * TranslateY数据的构造函数
   */
  Translatey(y: UniCSSUnitValue): UniCSSTransformTranslate
  Translatey(value: number, unit: UniCSSUnitType): UniCSSTransformTranslate
  /**
   * TranslateZ数据的构造函数
   */
  Translatez(z: UniCSSUnitValue): UniCSSTransformTranslate
  Translatez(value: number, unit: UniCSSUnitType): UniCSSTransformTranslate
  /**
   * Translate3D数据的构造函数
   */
  Translate3d(x: UniCSSUnitValue, y: UniCSSUnitValue, z: UniCSSUnitValue): UniCSSTransformTranslate
}
export const UniCSSTransformTranslate: UniCSSTransformTranslateConstructor


/**
 * CSS Transform: 缩放变换
 * 限定类型为 Scale、Scale3D、ScaleX、ScaleY、ScaleZ
 * x/y/z 根据类型决定是否有值
 */
export interface UniCSSTransformScale extends UniCSSTransform3DBase {
}
/**
 * UniCSSTransformScale构造函数接口
 */
interface UniCSSTransformScaleConstructor {
  /**
   * Scale数据的构造函数
   */
  Scale(x: UniCSSUnitValue): UniCSSTransformScale
  Scale(value: number, unit: UniCSSUnitType): UniCSSTransformScale
  Scale(x: UniCSSUnitValue, y: UniCSSUnitValue): UniCSSTransformScale
  Scale(valueX: number, unitX: UniCSSUnitType, valueY: number, unitY: UniCSSUnitType): UniCSSTransformScale
  /**
   * ScaleX数据的构造函数
   */
  Scalex(x: UniCSSUnitValue): UniCSSTransformScale
  Scalex(value: number, unit: UniCSSUnitType): UniCSSTransformScale
  /**
   * ScaleY数据的构造函数
   */
  Scaley(y: UniCSSUnitValue): UniCSSTransformScale
  Scaley(value: number, unit: UniCSSUnitType): UniCSSTransformScale
  /**
   * ScaleZ数据的构造函数
   */
  Scalez(z: UniCSSUnitValue): UniCSSTransformScale
  Scalez(value: number, unit: UniCSSUnitType): UniCSSTransformScale
  /**
   * Scale3D数据的构造函数
   */
  Scale3d(x: UniCSSUnitValue, y: UniCSSUnitValue, z: UniCSSUnitValue): UniCSSTransformScale
}
export const UniCSSTransformScale: UniCSSTransformScaleConstructor

/**
 * CSS Transform: 旋转变换
 * 限定类型为 Rotate、RotateX、RotateY、RotateZ
 * x/y/z 根据类型决定是否有值，值的单位类型为角度 DEG
 */
export interface UniCSSTransformRotate extends UniCSSTransformFunction {
  /**
   * 旋转角度
   */
  a?: UniCSSUnitValue|null;
}
/**
 * UniCSSTransformRotate构造函数接口
 */
interface UniCSSTransformRotateConstructor {
  /**
   * Rotate数据的构造函数
   */
  Rotate(a: UniCSSUnitValue): UniCSSTransformRotate
  Rotate(value: number, unit: UniCSSUnitType): UniCSSTransformRotate
  /**
   * RotateX数据的构造函数
   */
  Rotatex(a: UniCSSUnitValue): UniCSSTransformRotate
  Rotatex(value: number, unit: UniCSSUnitType): UniCSSTransformRotate
  /**
   * RotateY数据的构造函数
   */
  Rotatey(a: UniCSSUnitValue): UniCSSTransformRotate
  Rotatey(value: number, unit: UniCSSUnitType): UniCSSTransformRotate
  /**
   * ScaleZ数据的构造函数
   */
  Rotatez(a: UniCSSUnitValue): UniCSSTransformRotate
  Rotatez(value: number, unit: UniCSSUnitType): UniCSSTransformRotate
}
export const UniCSSTransformRotate: UniCSSTransformRotateConstructor

/**
 * CSS Transform: 旋转变换
 * 限定类型为 Rotate3D
 * 这时 x/y/z为无单位值，取值范围为0-1
 *  暂不支持
 */
export interface UniCSSTransformRotate3D extends UniCSSTransformRotate {
  /** X 轴坐标方向的矢量 */
  x: number;
  /** Y 轴坐标方向的矢量 */
  y: number;
  /** Z 轴坐标方向的矢量 */
  z: number;
}

/**
 * CSS Transform: 倾斜变换
 * 限定类型为 Skew、SkewX、SkewY
 * x/y 根据类型决定是否有值，值的单位类型为角度 DEG
 */
export interface UniCSSTransformSkew extends UniCSSTransformFunction {
  /**
   * X 轴倾斜角度
   */
  x?: UniCSSUnitValue|null;
  /**
   * Y 轴倾斜角度
   */
  y?: UniCSSUnitValue|null;
}
/**
 * UniCSSTransformSkew构造函数接口
 */
interface UniCSSTransformSkewConstructor {
  /**
   * Skew数据的构造函数
   */
  Skew(x: UniCSSUnitValue): UniCSSTransformSkew
  Skew(value: number, unit: UniCSSUnitType): UniCSSTransformSkew
  Skew(x: UniCSSUnitValue, y: UniCSSUnitValue): UniCSSTransformSkew
  Skew(valueX: number, unitX: UniCSSUnitType, valueY: number, unitY: UniCSSUnitType): UniCSSTransformSkew
  /**
   * SkewX数据的构造函数
   */
  Skewx(x: UniCSSUnitValue): UniCSSTransformSkew
  Skewx(value: number, unit: UniCSSUnitType): UniCSSTransformSkew
  /**
   * SkewY数据的构造函数
   */
  Skewy(y: UniCSSUnitValue): UniCSSTransformSkew
  Skewy(value: number, unit: UniCSSUnitType): UniCSSTransformSkew
}
export const UniCSSTransformSkew: UniCSSTransformSkewConstructor

/**
 * CSS Transform: 矩阵变换
 * 限定类型为 Matrix
 */
export interface UniCSSTransformMatrix extends UniCSSTransformFunction {
  /**
   * 矩阵参数列表
   */
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}
/**
 * UniCSSTransformMatrixConstructor构造函数接口
 */
interface UniCSSTransformMatrixConstructor {
  /**
   * 默认构造函数
   */
  new(a: number, b: number, c: number, d: number, tx: number, ty: number): UniCSSUnitValue
}
export const UniCSSTransformMatrix: UniCSSTransformMatrixConstructor

/**
 * CSS Transform: 3D矩阵变换
 * 限定类型为 Matrix3D
 *  可暂不支持
 */
export interface UniCSSTransformMatrix3D extends UniCSSTransformFunction {
  /**
   * 矩阵参数列表 4x4矩阵
   */
  matrix: number[][];
}

/**
 * CSS Transform: perspective 变换
 * 限定类型为 Perspective
 */
export interface UniCSSTransformPerspective extends UniCSSTransformFunction {
  /**
   * 透视距离
   */
  distance?: UniCSSUnitValue|null;
}

/**
 * CSS Transform 类型合集
 */
export type UniCSSTransform = UniCSSTransformFunction[]



/**
 * CSS Transform 变换的原点
 * 默认值为 50% 50% 0
 *
 * 兼容关键字类型需将属性值定义为联合类型，这会影响运行时的性能，在编译或解析字符串是直接将关键值转换为值类型，规则如下：
 * - 单值
 *  + left: 0% 50% 0
 *  + center: 50% 50% 0
 *  + right: 100% 50% 0
 *  + top: 50% 0% 0
 *  + bottom: 50% 100% 0
 * - 双值（第1值关键字只可取left/center/right，第2值关键字值可取top/center/bottom）
 *  + 第1值对应到x，第2值对于到y
 * - 三值（1、2值的逻辑与双值一致；第3值不可使用关键字，也不支持百分比）
 */
export interface UniCSSTransformOrigin {
  /**
   * X 轴原点
   */
  x?: UniCSSUnitValue|null;
  /**
   * Y 轴原点
   */
  y?: UniCSSUnitValue|null;
  /**
   * Z 轴原点
   * 可暂不支持
   */
  z?: UniCSSUnitValue|null;
}

/**
 * transform-origin 关键字枚举类型
 */
export enum UniCSSTransformOriginKeywordType {
  /**
   * 居左，对应值为0%
   * 对x轴方向有效
   */
  Left,
  /**
   * 居中，对应值为50%
   * 对x/y轴有效
   */
  Center,
  /**
   * 居右，对应值为100%
   * 对x轴有效
   */
  Right,
  /**
   * 居顶，对应值为0%
   * 对y轴有效
   */
  Top,
  /**
   * 居底，对应值为100%
   * 对y轴有效
   */
  Bottom,
}


