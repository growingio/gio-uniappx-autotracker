export interface ISetClipboardDataError extends IUniError {
	errCode: number
    /**
     * 错误信息
     *
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
    errMsg?: string;
}
/**
 * uni.setClipboardData成功回调参数
 */
export type SetClipboardDataSuccess = {
    /**
     * 错误信息
     *
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
    errMsg?: string;
}
/**
 * uni.setClipboardData失败回调参数
 */
export type SetClipboardDataFail = ISetClipboardDataError;
/**
 * uni.setClipboardData成功回调函数定义
 * @uniPlatform {
 *   "mp": {
 *     "weixin": {
 *       "hostVer": "√",
 *       "uniVer": "√",
 *       "unixVer": "-"
 *     },
 *     "alipay": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "baidu": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "toutiao": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "lark": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "qq": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "kuaishou": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "jd": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     }
 *   }
 * }
 */
export type SetClipboardDataSuccessCallback = (res: SetClipboardDataSuccess) => void
/**
 * uni.setClipboardData失败回调函数定义
 * @uniPlatform {
 *   "mp": {
 *     "weixin": {
 *       "hostVer": "√",
 *       "uniVer": "√",
 *       "unixVer": "-"
 *     },
 *     "alipay": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "baidu": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "toutiao": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "lark": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "qq": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "kuaishou": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "jd": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     }
 *   }
 * }
 */
export type SetClipboardDataFailCallback = (res: SetClipboardDataFail) => void
/**
 * uni.setClipboardData完成回调函数定义
 * @uniPlatform {
 *   "mp": {
 *     "weixin": {
 *       "hostVer": "√",
 *       "uniVer": "√",
 *       "unixVer": "-"
 *     },
 *     "alipay": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "baidu": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "toutiao": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "lark": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "qq": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "kuaishou": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "jd": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     }
 *   }
 * }
 */
export type SetClipboardDataCompleteCallback = (res: SetClipboardDataGeneralCallbackResult) => void

/**
 * uni.setClipboardData
 * @uniPlatform {
 *   "mp": {
 *     "weixin": {
 *       "hostVer": "√",
 *       "uniVer": "√",
 *       "unixVer": "-"
 *     },
 *     "alipay": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "baidu": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "toutiao": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "lark": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "qq": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "kuaishou": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     },
 *     "jd": {
 *       "hostVer": "x",
 *       "uniVer": "x",
 *       "unixVer": "x"
 *     }
 *   }
 * }
 */
interface SetClipboardDataOptions {
  /**
   * 需要设置的内容
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "-"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
  data: string;
  /**
   * 是否弹出提示，默认弹出提示
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "-"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
  showToast?: boolean;
  /**
   * 成功返回的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "-"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
  success?:SetClipboardDataSuccessCallback;
  /**
   * 失败的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "-"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
  fail?:SetClipboardDataFailCallback;
  /**
   * 结束的回调函数（调用成功、失败都会执行）
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "-"
     *     },
     *     "alipay": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "x",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   }
     * }
     */
  complete?:SetClipboardDataCompleteCallback;
}

export type SetClipboardData = (options: SetClipboardDataOptions) => void


export interface Uni {
    /**
     * 设置系统剪贴板的内容
     *
     * @tutorial https://uniapp.dcloud.net.cn/api/system/clipboard.html
     * @uniPlatform {
     *   "app": {
     *     "android": {
     *       "osVer": "5.0",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "ios": {
     *       "osVer": "12.0",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     }
     *   },
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "1.1.0",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "alipay": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "baidu": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "toutiao": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "lark": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "qq": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "kuaishou": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "jd": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     }
     *   },
     *   "web": {
     *     "uniVer": "√",
     *     "unixVer": "4.0"
     *   }
     * }
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html
     */
    setClipboardData(options: SetClipboardDataOptions): void;
}

export type SetClipboardDataGeneralCallbackResult = {
    /**
    * 错误信息
    * 
    * @uniPlatform {
    *   "mp": {
    *     "weixin": {
    *       "hostVer": "√",
    *       "uniVer": "√",
    *       "unixVer": "-"
    *     },
    *     "alipay": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     },
    *     "baidu": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     },
    *     "toutiao": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     },
    *     "lark": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     },
    *     "qq": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     },
    *     "kuaishou": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     },
    *     "jd": {
    *       "hostVer": "x",
    *       "uniVer": "x",
    *       "unixVer": "x"
    *     }
    *   }
    * }
    */
    errMsg: string
};
