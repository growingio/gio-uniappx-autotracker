export interface IGetClipboardDataError extends IUniError {
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
 * uni.getClipboardData成功回调参数
 */
export type GetClipboardDataSuccess = {
  /**
   * 剪贴板的内容
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
    /** */
    errMsg?: string;
}
/**
 * uni.getClipboardData失败回调参数
 */
export type GetClipboardDataFail = IGetClipboardDataError;
/**
 * uni.getClipboardData成功回调函数定义
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
export type GetClipboardDataSuccessCallback = (res: GetClipboardDataSuccess) => void
/**
 * uni.getClipboardData失败回调函数定义
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
export type GetClipboardDataFailCallback = (res: GetClipboardDataFail) => void
/**
 * uni.getClipboardData完成回调函数定义
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
export type GetClipboardDataCompleteCallback = (res: GetClipboardDataGeneralCallbackResult) => void

/**
 * uni.getClipboardData
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
interface GetClipboardDataOptions {
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
  success?: GetClipboardDataSuccessCallback;
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
  fail?:GetClipboardDataFailCallback;
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
  complete?:GetClipboardDataCompleteCallback;
}


export type GetClipboardData = (options: GetClipboardDataOptions) => void


export interface Uni {
    /**
     * 获得系统剪贴板的内容
     *
     * @tutorial http://uniapp.dcloud.io/api/system/clipboard?id=getclipboarddata
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
     *       "unixVer": "√"
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
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.getClipboardData.html
     */
    getClipboardData(options: GetClipboardDataOptions): void;
}

export type GetClipboardDataGeneralCallbackResult = {
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
