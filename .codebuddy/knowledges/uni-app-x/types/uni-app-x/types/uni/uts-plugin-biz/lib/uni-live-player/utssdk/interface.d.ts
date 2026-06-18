export type StreamingContextListener = {
	play: () => void
	pause: () => void
	replay: () => void
	requestFullScreen: (callback?: LivePlayerOptions) => void
	exitFullScreen: (callback?: LivePlayerOptions) => void
}

export type StreamingBufferingListener = {
	onBufferingStart : () => void
	onBufferingEnd : () => void
}

export type StreamingMuteChangedListener = (isMute : boolean) => void

export type StreamingProgressListener = (progress : number, duration : number) => void

export type LivePlayerStreamingStateListener = (info : UniLivePlayerStatechangeEvent) => void

export type LivePlayerStreamingErrorListener = (info : UniLivePlayerErrorEvent) => void

export type StreamingFullScreenChangedListener = (info: UniLivePlayerFullscreenchangeEvent) => void


// 对外暴露接口 ------------------------------------------------

/**
 * 通用事件
 */
interface LivePlayerEvent {
	bubbles : boolean
	cancelable : boolean
	type : string
	target ?: UniElement | null
	currentTarget ?: UniElement | null
	readonly timeStamp : Long
	stopPropagation() : void
	preventDefault() : void
}

/**
 * 播放状态变化事件
 */
export interface UniLivePlayerStatechangeEvent extends LivePlayerEvent {
	readonly detail : UniLivePlayerStatechangeEventDetail
}

export type UniLivePlayerStatechangeEventDetail = {
	/**
	 * 状态码
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	code : LivePlayerStateCode
}

export type LivePlayerStateCode =  
10000 | 
/**
 * 初始化
 */
10001 | 
/**
 * 准备播放
 */
10002 | 
/**
 * 播放中
 */
10004 | 
/**
 * 停止渲染
 */
10006 | 
/**
 * 播放完成
 */
10007 | 
/**
 * 播放进度跳转中
 */
10008 | 
/**
 * 播放停止
 */
10009 | 
/**
 * 播放错误
 */
10010 | 
/**
 * 播放结束
 */
10011 | 
10012 | 
/**
 * 资源释放
 */
10013

/**
 * 全屏事件
 */
export interface UniLivePlayerFullscreenchangeEvent extends LivePlayerEvent {
	readonly detail: UniLivePlayerFullscreenchangeEventDetail
}

export type UniLivePlayerFullscreenchangeEventDetail = {
	/**
	 * 屏幕方向
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	direction : string
	/**
	 * 是否全屏
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	fullScreen: boolean
}

/**
 *  错误事件
 */
export interface UniLivePlayerErrorEvent extends LivePlayerEvent {
	readonly detail : UniLivePlayerError
}

export interface UniLivePlayerError extends IUniError {
    errCode : LivePlayerErrorCode
}

export type LivePlayerErrorCode =  
/**
 * 当前视频格式不支持，视频无法播放
 */
3001 | 
/**
 * 视频解码失败
 */
3002 | 
/**
 * 不支持的解码格式
 */
3003 | 
/**
 * 重连失败，请检查网络情况
 */
3004 | 
/**
 * 视频播放失败，请检查网络或视频资源
 */
3005

export type LivePlayerSuccess = UTSJSONObject;
export type LivePlayerSuccessCallback = (res : LivePlayerSuccess) => void;
export type LivePlayerFail = UTSJSONObject;
export type LivePlayerFailCallback = (res : LivePlayerFail) => void;
export type LivePlayerComplete = any;
export type LivePlayerCompleteCallback = (res : LivePlayerComplete) => void;

/**
 * 方法调用参数
 */
export type LivePlayerOptions = {
	/**
	 * 接口调用成功的回调函数
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	success?: LivePlayerSuccessCallback | null,
	/**
	 * 接口调用失败的回调函数
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	fail?: LivePlayerFailCallback | null,
	/**
	 * 接口调用结束的回调函数（调用成功、失败都会执行）
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	complete?: LivePlayerCompleteCallback | null
}

export interface LivePlayerContext {
	/**
	 * 播放
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	play(options?: LivePlayerOptions) : void
	/**
	 * 暂停
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	pause(options?: LivePlayerOptions) : void
	/**
	 * 停止
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	stop(options?: LivePlayerOptions) : void
	/**
	 * 恢复
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	resume(options?: LivePlayerOptions) : void
	/**
	 * 静音
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	mute(options?: LivePlayerOptions): void
	/**
	 * 全屏
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	requestFullScreen(options?: LivePlayerOptions): void
	/**
	 * 退出全屏
	 * @uniPlatform {
	 *   "app": {
	 *     "android": {
	 *       "osVer": "5.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "ios": {
	 *       "osVer": "12.0",
	 *       "uniVer": "x",
	 *       "unixVer": "4.81"
	 *     },
	 *     "harmony": {
	 *       "osVer": "5.0.0",
	 *       "uniVer": "x",
	 *       "unixVer": "x"
	 *     }
	 *   },
	 *   "web": {
	 *     "uniVer": "x",
	 *     "unixVer": "x"
	 *   },
	 *   "mp": {
	 *     "weixin": {
	 *       "hostVer": "1.9.6",
	 *       "uniVer": "√",
	 *       "unixVer": "x"
	 *     },
	 *     "alipay": {
	 *       "hostVer": "1.10.0",
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
	 */
	exitFullScreen(options?: LivePlayerOptions): void
}

/**
 * 创建 liveplayer context
 */
export type CreateLivePlayerContext = (livePlayerId : string, component ?: ComponentPublicInstance | null) => LivePlayerContext | null

export interface Uni {
	/**
	 * 创建并返回 live-player 组件上下文 LivePlayerContext 对象
	 * @uniPlatform {
     *   "app": {
     *     "android": {
     *       "osVer": "5.0",
     *       "uniVer": "x",
     *       "unixVer": "4.81"
     *     },
     *     "ios": {
     *       "osVer": "12.0",
     *       "uniVer": "x",
     *       "unixVer": "4.81"
     *     },
     *     "harmony": {
     *       "osVer": "5.0.0",
     *       "uniVer": "x",
     *       "unixVer": "x"
     *     }
     *   },
     *   "web": {
     *     "uniVer": "x",
     *     "unixVer": "x"
     *   },
     *   "mp": {
     *     "weixin": {
     *       "hostVer": "1.9.6",
     *       "uniVer": "√",
     *       "unixVer": "x"
     *     },
     *     "alipay": {
     *       "hostVer": "1.10.0",
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
	 * @uniVueVersion 2,3
	 * @return {LivePlayerContext} live-player 组件上下文对象
	 *
	 * @tutorial_uni_app https://uniapp.dcloud.net.cn/api/media/live-player-context.html#createLivePlayerContext
	 * @tutorial_uni_app_x https://doc.dcloud.net.cn/uni-app-x/api/create-live-player-context.html#createLivePlayerContext
	 * @tutorial https://doc.dcloud.net.cn/uni-app-x/api/create-live-player-context.html#createLivePlayerContext
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.html
     */
	createLivePlayerContext : (livePlayerId : string, component ?: ComponentPublicInstance | null) => LivePlayerContext | null;
}