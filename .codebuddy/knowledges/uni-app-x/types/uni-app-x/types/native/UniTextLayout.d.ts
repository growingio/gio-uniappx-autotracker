declare global {

  /**
   * 文本对象
   */
  interface UniTextLayout {
    /**
     * 设置文本
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
     *   	    }
     *    }
     * }
     */
    setText(text: string): void
    /**
     * 设置文本颜色
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
     *   	    }
     *    }
     * }
     */
    setColor(color: string): void
    /**
     * 设置字体名称
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
     *   	    }
     *    }
     * }
     */
    setFontFamily(family: string): void
    /**
     * 设置字体大小
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
     *   	    }
     *    }
     * }
     */
    setFontSize(size: string): void
    /**
     * 设置字体样式
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
     *   	    }
     *    }
     * }
     */
    setFontStyle(style: string): void
    /**
     * 设置字体粗细
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
     *   	    }
     *    }
     * }
     */
    setFontWeight(weight: string): void
    /**
     * 设置行高
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
     *   	    }
     *    }
     * }
     */
    setLineHeight(height: string): void
    /**
     * 设置文字水平对齐方式
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
     *   	    }
     *    }
     * }
     */
    setTextAlign(align: string): void
    /**
     * 设置文字溢出裁剪方式
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
     *   	    }
     *    }
     * }
     */
    setTextOverflow(overflow: string): void
    /**
     * 设置文字阴影
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
     *   	    }
     *    }
     * }
     */
    setTextShadow(shadow: string): void
    /**
     * 设置文本修饰类型
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
     *   	    }
     *    }
     * }
     */
    setTextDecorationLine(decorationLine: string): void
    /**
     * 设置处理空白字符
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
     *   	    }
     *    }
     * }
     */
    setWhiteSpace(whiteSpace: string): void
    /**
     * 添加子文本对象
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
     *   	    }
     *    }
     * }
     */
    append(layout: UniTextLayout): void
    /**
     * 测量文本大小
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
     *   	    }
     *    }
     * }
     */
    measure(constraint: UniLayoutConstraintSize): UniLayoutSize
  }

  /**
   * 布局大小
   */
  interface UniLayoutSize {
    /**
     * 元素宽度，逻辑像素值
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
     *   	    }
     *    }
     * }
     */
    width: number
    /**
     * 元素高度，逻辑像素值
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
     *   	    }
     *    }
     * }
     */
    height: number
  }

  /**
   * 布局约束大小
   */
  interface UniLayoutConstraintSize {
    /**
     * 元素最小宽度，逻辑像素值
     * 可选值，不设置则认为没有最小宽度
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
     *   	    }
     *    }
     * }
     */
    minWidth?: number | null
    /**
       * 元素最大宽度，逻辑像素值
       * 可选值，不设置则认为可以无限宽
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
       *   	    }
       *    }
       * }
       */
    maxWidth?: number | null
    /**
       * 元素最小高度，逻辑像素值
       * 可选值，不设置则认为没有最小高度
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
       *   	    }
       *    }
       * }
       */
    minHeight?: number | null
    /**
       * 元素最大高度，逻辑像素值
       * 可选值，不设置则认为可以无限高
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
       *   	    }
       *    }
       * }
       */
    maxHeight?: number | null
  }

}

export { }
