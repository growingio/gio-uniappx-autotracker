import { UniNativeBaseView } from "./UniNativeBaseView"
import { UniImageModeType } from "./UniImageElement";



/**
 * 图片组件 image
 */
export interface UniNativeImageView extends UniNativeBaseView {

  /**
   * 设置图片资源地址
   * 注：如果在c层实现统一的图片管理库，可能不再需要此API，目前各平台分别使用图片库需要此API
   */
  src(src: string): void;

  /**
   * 设置图片裁剪、缩放模式
   */
  mode(value: UniImageModeType): void;

  /**
   * 设置是否懒加载
   */
  lazyLoad(value: boolean): void;

  /**
   * 图片显示动画效果
   */
  fadeShow(value: boolean): void;
}


