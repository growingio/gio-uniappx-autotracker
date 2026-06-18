import { UniElementImpl } from "./UniElement"
import { UniTextElement } from "./IUniElement"
import { PageNode } from "./PageNode"
import { INodeData } from "./NodeData"
import { UniTextLayout, UniLayoutSize } from "./index"
/**
 * text元素对象
 * @package io.dcloud.uniapp.runtime
 * @autodoc false
 */
export class UniTextElementImpl extends UniElementImpl implements UniTextElement {
  /**
   * 只读属性 text元素的文案内容
   */
  value: string

  /**
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "4.0"
   *        },
   *        "ios": {
   *            "osVer": "x",
   *            "uniVer": "x",
   *            "unixVer": "x"
   *   	  }
   *    }
   * }
   * @internal
   */
  getTextExtra(): any | null
  /**
   * 设置文本内容
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "4.81"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "x"
   *   	  }
   *    }
   * }
   */
  setTextLayout(layout: UniTextLayout): void
  /**
   * 获取内容宽高
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "4.81"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "x"
   *   	  }
   *    }
   * }
   */
  getContentSize(): UniLayoutSize
  constructor(data: INodeData, pageNode?: PageNode)
}
