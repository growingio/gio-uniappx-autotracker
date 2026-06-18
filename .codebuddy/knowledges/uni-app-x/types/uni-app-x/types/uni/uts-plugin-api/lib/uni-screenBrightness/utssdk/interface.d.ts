export interface Uni {
	/**
	 * 设置屏幕亮度。
	 * @tutorial https://uniapp.dcloud.net.cn/api/system/brightness.html
	 * @tutorial_uni_app_x https://uniapp.dcloud.net.cn/api/system/brightness.html
	 * @tutorial_uni_app https://uniapp.dcloud.net.cn/api/system/brightness.html
	 *
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
     *     },
     *     "harmony": {
     *       "osVer": "3.0",
     *       "uniVer": "4.81",
     *       "unixVer": "4.81",
     *       "unixvVer": "5.0"
     *     }
     *   },
     *   "web": {
     *     "uniVer": "x",
     *     "unixVer": "x"
     *   },
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "1.2.0",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
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
     *   }
     * }
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html
     */
	setScreenBrightness(options : SetScreenBrightnessOptions) : void;
	/**
	* 获取屏幕亮度。
	* @tutorial https://uniapp.dcloud.net.cn/api/system/brightness.html
	* @tutorial_uni_app_x https://uniapp.dcloud.net.cn/api/system/brightness.html
	* @tutorial_uni_app https://uniapp.dcloud.net.cn/api/system/brightness.html
	*
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
    *     },
    *     "harmony": {
    *       "osVer": "3.0",
    *       "uniVer": "4.81",
    *       "unixVer": "4.81",
    *       "unixvVer": "5.0"
    *     }
    *   },
    *   "web": {
    *     "uniVer": "x",
    *     "unixVer": "x"
    *   },
    *   "mp": {
    *     "weixin": {
    *       "hostVer": "1.2.0",
    *       "uniVer": "√",
    *       "unixVer": "4.41"
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
    *   }
    * }
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html
     */
	getScreenBrightness(options : GetScreenBrightnessOptions) : void;
	/**
	* 设置是否保持常亮状态。仅在当前应用生效，离开应用后设置失效。
	* @tutorial https://uniapp.dcloud.net.cn/api/system/brightness.html
	* @tutorial_uni_app_x https://uniapp.dcloud.net.cn/api/system/brightness.html
	* @tutorial_uni_app https://uniapp.dcloud.net.cn/api/system/brightness.html
	*
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
    *     },
    *     "harmony": {
    *       "osVer": "3.0",
    *       "uniVer": "4.81",
    *       "unixVer": "4.81",
    *       "unixvVer": "5.0"
    *     }
    *   },
    *   "web": {
    *     "uniVer": "x",
    *     "unixVer": "x"
    *   },
    *   "mp": {
    *     "weixin": {
    *       "hostVer": "1.4.0",
    *       "uniVer": "√",
    *       "unixVer": "4.41"
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
    *   }
    * }
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setKeepScreenOn.html
     */
	setKeepScreenOn(options : SetKeepScreenOnOptions) : void;
}

export type SetScreenBrightness = (options : SetScreenBrightnessOptions) => void;
export type SetScreenBrightnessSuccess = {};
export type SetScreenBrightnessSuccessCallback = (result : SetScreenBrightnessSuccess) => void;
export type SetScreenBrightnessFail = UniError;
export type SetScreenBrightnessFailCallback = (result : SetScreenBrightnessFail) => void;
export type SetScreenBrightnessComplete = any;
export type SetScreenBrightnessCompleteCallback = (result : SetScreenBrightnessComplete) => void;

export type SetScreenBrightnessOptions = {
	/**
	* 屏幕亮度值，范围 0~1，0 最暗，1 最亮
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	value : number,
	/**
	 * 接口调用成功的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	success ?: SetScreenBrightnessSuccessCallback | null,
	/**
	 * 接口调用失败的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	fail ?: SetScreenBrightnessFailCallback | null,
	/**
	 * 接口调用结束的回调函数（调用成功、失败都会执行）
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	complete ?: SetScreenBrightnessCompleteCallback | null
};



export type GetScreenBrightness = (options : GetScreenBrightnessOptions) => void;
export type GetScreenBrightnessSuccess = {
	/**
	 * 屏幕亮度值，范围 0~1，0 最暗，1 最亮。
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	value : number
};
export type GetScreenBrightnessSuccessCallback = (result : GetScreenBrightnessSuccess) => void;
export type GetScreenBrightnessFail = UniError;
export type GetScreenBrightnessFailCallback = (result : GetScreenBrightnessFail) => void;
export type GetScreenBrightnessComplete = any;
export type GetScreenBrightnessCompleteCallback = (result : GetScreenBrightnessComplete) => void;
export type GetScreenBrightnessOptions = {
	/**
	 * 成功返回的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	success ?: GetScreenBrightnessSuccessCallback | null,
	/**
	 * 失败的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	fail ?: GetScreenBrightnessFailCallback | null,
	/**
	 * 结束的回调函数（调用成功、失败都会执行）
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	complete ?: GetScreenBrightnessCompleteCallback | null
};



export type SetKeepScreenOn = (options : SetKeepScreenOnOptions) => void;
export type SetKeepScreenOnSuccess = {
	/**
	 * 调用结果
	 */
	errMsg:string
};
export type SetKeepScreenOnSuccessCallback = (result : SetKeepScreenOnSuccess) => void;
export type SetKeepScreenOnFail = UniError;
export type SetKeepScreenOnFailCallback = (result : SetKeepScreenOnFail) => void;
export type SetKeepScreenOnComplete = any;
export type SetKeepScreenOnCompleteCallback = (result : SetKeepScreenOnComplete) => void;

export type SetKeepScreenOnOptions = {
	/**
	* 是否保持屏幕常亮
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	keepScreenOn : Boolean,
	/**
	 * 接口调用成功的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	success ?: SetScreenBrightnessSuccessCallback | null,
	/**
	 * 接口调用失败的回调函数
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	fail ?: SetScreenBrightnessFailCallback | null,
	/**
	 * 接口调用结束的回调函数（调用成功、失败都会执行）
     * @uniPlatform {
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "√",
     *       "uniVer": "√",
     *       "unixVer": "4.41"
     *     },
     *     "alipay": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "baidu": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "toutiao": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "lark": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "qq": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "kuaishou": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     },
     *     "jd": {
     *       "hostVer": "-",
     *       "uniVer": "-",
     *       "unixVer": "-"
     *     }
     *   }
     * }
     */
	complete ?: SetScreenBrightnessCompleteCallback | null
};
