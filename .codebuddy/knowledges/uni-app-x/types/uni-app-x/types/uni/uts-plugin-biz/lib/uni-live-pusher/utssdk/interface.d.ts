/**
 * 通用事件
 */
interface LivePusherEvent {
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
 * 推流状态变化事件
 */
export interface UniLivePusherStatechangeEvent extends LivePusherEvent {
	readonly detail : UniLivePusherStatechangeEventDetail
}

export type UniLivePusherStatechangeEventDetail = {
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
	code : LivePusherStateCode,
	/**
	 * 状态信息
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
	message : string
}

export type LivePusherStateCode = 
/**
 * 连接中
 */
1001 | 
/**
 * 已连接
 */
1002 | 
/**
 * 连接断开
 */
3004

/**
 * 推流网络状态事件
 */
export interface UniLivePusherNetstatusEvent extends LivePusherEvent {
	readonly detail : UniLivePusherNetstatusEventDetail
}

export type UniLivePusherNetstatusEventDetail = {
	/**
	 * 当前视频编/码器输出的比特率，单位 kbps
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
	videoBitrate : number,
	/**
	 * 当前音频编/码器输出的比特率，单位 kbps
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
	audioBitrate : number,
	/**
	 * 当前视频帧率
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
	videoFPS : number,
	/**
	 * 当前视频 GOP,也就是每两个关键帧(I帧)间隔时长，单位 s
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
	videoGOP : number,
	/**
	 * 当前的发送/接收速度
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
	netSpeed : number,
	/**
	 * 视频画面的宽度
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
	videoWidth : number,
	/**
	 * 视频画面的高度
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
	videoHeight : number
}

/**
 * 错误事件
 */

export interface UniLivePusherErrorEvent extends LivePusherEvent {
	readonly detail : UniLivePusherError
}

export interface UniLivePusherError extends IUniError {
    errCode : LivePusherErrorCode
}

export type LivePusherErrorCode =  
/**
 * 网络问题
 */
3005 | 
/**
 * 推流地址错误
 */
3006 | 
/**
 * 推流地址未授权
 */
3007 | 
/**
 * 包未授权
 */
3008 | 
/**
 * 音频录制错误（android）
 */
4001 | 
/**
 * 打开摄像头错误（android）
 */
4002 | 
/**
 * 没有 nv21 预览格式（android）
 */
4003 | 
/**
 * 开启视频编码错误（android）
 */
4004 | 
/**
 * 视频编码错误（android）
 */
4005 | 
/**
 * 开启音频编码错误（android）
 */
4006 | 
/**
 * 音频编码错误（android）
 */
4007 | 
/**
 * 编码器编码错误（iOS）
 */
5001 | 
/**
 * TLS 连接失败（iOS）
 */
5002 | 
/**
 * 没有 SSL 或者 TLS（iOS）
 */
5003 | 
/**
 * DNS 解析失败（iOS）
 */
5004 | 
/**
 * rtmp 发布失败（iOS）
 */
5005 | 
-1

/**
 * LivePusherContext
 */
export type LivePusherContextSettings = {
	url : string
	devicePosition : string
	mode : string
	localMirror : string
	remoteMirror : boolean
	autoFocus : boolean
	muted : boolean
	orientation : string
	beauty : number
	whiten : number
	enableCamera : boolean
	enableMic : boolean
	audioQuality : string
	minBitrate : number
	maxBitrate : number
	audioVolumeType : string
	aspect : string
	backgroundMute : boolean
	waitingImage : string
	zoom : number
	videoWidth : number
	videoHeight : number
}

export type StreamingStateListener = (info : UniLivePusherStatechangeEvent) => void

export type StreamingStatusListener = (info : UniLivePusherNetstatusEvent) => void

export type StreamingErrorListener = (info : UniLivePusherErrorEvent) => void



export type SnapCallbackMessage = {
	width : number,
	height : number,
	tempImagePath : string
}

export type LivePusherSuccess = UTSJSONObject;
export type LivePusherSuccessCallback = (res : LivePusherSuccess) => void;
export type LivePusherFail = UTSJSONObject;
export type LivePusherFailCallback = (res : LivePusherFail) => void;
export type LivePusherComplete = any;
export type LivePusherCompleteCallback = (res : LivePusherComplete) => void;

export type LivePusherOptions = {
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
	success?: LivePusherSuccessCallback | null,
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
	fail?: LivePusherFailCallback | null,
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
	complete?: LivePusherCompleteCallback | null
}

export interface LivePusherContext {
	/**
	 * 开始推流
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
	start(options? : LivePusherOptions) : void
	/**
	 * 停止推流
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
	stop(options? : LivePusherOptions) : void
	/**
	 * 切换前后摄像头
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
	switchCamera(options? : LivePusherOptions) : void
	/**
	 * 开关闪光灯
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
	toggleTorch(options? : LivePusherOptions) : void
	/**
	 * 暂停推流
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
	pause(options? : LivePusherOptions) : void
	/**
	 * 恢复推流
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
	resume(options? : LivePusherOptions) : void
	/**
	 * 获取最大缩放值
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
	getMaxZoom(options? : LivePusherOptions) : void
	/**
	 * 设置缩放
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
	setZoom(zoom : number, options? : LivePusherOptions) : void
	/**
	 * 开启摄像头预览
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
	startPreview(options? : LivePusherOptions) : void
	/**
	 * 关闭摄像头预览
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
	stopPreview(options? : LivePusherOptions) : void
	/**
	 * 快照
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
	snapshot(options? : LivePusherOptions) : void
	sendMessage(message : string, options? : LivePusherOptions) : void
}

export type CreateLivePusherContext = (livePusherId : string, component ?: ComponentPublicInstance | null) => LivePusherContext | null

export interface Uni {
	/**
	 * 创建并返回 live-pusher 组件上下文 LivePusherContext 对象
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
	 * @return {LivePusherContext} live-pusher 组件上下文对象
	 *
	 * @tutorial_uni_app https://uniapp.dcloud.net.cn/api/media/live-pusher-context.html#createLivePusherContext
	 * @tutorial_uni_app_x https://doc.dcloud.net.cn/uni-app-x/api/create-live-pusher-context.html#createLivePusherContext
	 * @tutorial https://doc.dcloud.net.cn/uni-app-x/api/create-live-pusher-context.html#createLivePusherContext
     * @tutorial_weixin https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.html
     */
	createLivePusherContext : (livePusherId : string, component ?: ComponentPublicInstance | null) => LivePusherContext | null;
}