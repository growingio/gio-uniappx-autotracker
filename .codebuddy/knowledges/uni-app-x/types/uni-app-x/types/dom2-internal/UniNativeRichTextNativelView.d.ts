import { UniNativeBaseView,  } from "./UniNativeBaseView"



/**
 * 富文本（原生渲染）组件 rich-text-native
 */
export interface UniNativeRichTextNativeView extends UniNativeBaseView {
  /**
   * 设置富文本内容
   */
  html(html: string): void;

}

