import { UniElement } from './index'


/**
 * 图片裁剪、缩放的模式
 */
export enum UniImageModeType {
  /**
   * 不保持纵横比缩放图片
   */
  ScaleToFill,
  /**
   * 保持纵横比缩放图片，使图片的长边能完全显示出来
   */
  AspectFit,
  /**
   * 保持纵横比缩放图片，只保证图片的短边能完全显示出来
   */
  AspectFill,
  /**
   * 宽度不变，高度自动变化
   *  优先级高于css中设置的宽高
   */
  WidthFix,
  /**
   * 高度不变，宽度自动变化
   *  优先级高于css中设置的宽高
   */
  HeightFix,
  /**
   * 不缩放图片，只显示图片的顶部区域
   */
  Top,
  /**
   * 不缩放图片，只显示图片的底部区域
   */
  Bottom,
  /**
   * 不缩放图片，只显示图片的中间区域
   */
  Center,
  /**
   * 不缩放图片，只显示图片的左边区域
   */
  Left,
  /**
   * 不缩放图片，只显示图片的右边区域
   */
  Right,
  /**
   * 不缩放图片，只显示图片的左上边区域
   */
  TopLeft,
  /**
   * 不缩放图片，只显示图片的右上边区域
   */
  TopRight,
  /**
   * 不缩放图片，只显示图片的左下边区域
   */
  BottomLeft,
  /**
   * 不缩放图片，只显示图片的右下边区域
   */
  BottomRight
}

/**
 * 图片尺寸信息
 */
export type UniImageSize = {
  /**
   * 图片宽度
   */
  width: number,
  /**
   * 图片高度
   */
  height: number
}

declare global {

  /**
   * UniImageElement
   */
  interface UniImageElement extends UniElement {

    /**
     * 设置图片资源地址   // c层实现
     *  Android/iOS平台用于缓存图片大小信息，后续优化为在c层获取图片大小信息
     *  鸿蒙平台在子线程中加载图片
     * @param src - 图片资源地址
     * @param size - 图片大小，本地资源时编译器会传入大小，c层测量时直接使用，没有传入大小时优先从缓存中查找，没有查找到则通过kotlin/oc层获取
     * @internal
     */
    setSrc(src: string, size?: UniImageSize | null): void;

    /**
     * 设置图片裁剪、缩放模式  // c层实现
     * @internal
     */
    setMode(mode: UniImageModeType): void;
  }

}
