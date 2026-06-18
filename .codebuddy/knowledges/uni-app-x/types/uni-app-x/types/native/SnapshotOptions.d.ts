/**
 * 截图成功的返回数据
 */
export type TakeSnapshotSuccess = {
  /**
   * 截图保存的临时文件路径
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x"
   *        },
   *        "harmony": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x",
   *            "unixvVer": "5.02"
   *        }
   *    },
   *    "mp": {
   *      "weixin": {
   *        "osVer": "x",
   *        "uniVer": "x",
   *        "unixVer": "x"
   *      }
   *    },
   *    "web": {
   *        "uniVer": "x",
   *        "unixVer": "x"
   *    }
   * }
   */
  tempFilePath: string
}

/**
 * 截图失败的返回数据
 */
export type TakeSnapshotFail = {
  /**
   * 截图失败时的错误描述信息
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x"
   *        },
   *        "harmony": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x",
   *            "unixvVer": "5.02"
   *        }
   *    },
   *    "mp": {
   *      "weixin": {
   *        "osVer": "x",
   *        "uniVer": "x",
   *        "unixVer": "x"
   *      }
   *    },
   *    "web": {
   *        "uniVer": "x",
   *        "unixVer": "x"
   *    }
   * }
   */
  errMsg: string
}


/**
 * 成功回调函数定义
 */
export type TakeSnapshotSuccessCallback = (res: TakeSnapshotSuccess) => void
/**
 * 失败回调函数定义
 */
export type TakeSnapshotFailCallback = (res: TakeSnapshotFail) => void
/**
 * 完成回调函数定义
 */
export type TakeSnapshotCompleteCallback = (res: any) => void


/**
 * 截图的参数配置选项
 * @uniPlatform {
 *    "app": {
 *        "android": {
 *            "osVer": "5.0",
 *            "uniVer": "x",
 *            "unixVer": "5.02"
 *        },
 *        "ios": {
 *            "osVer": "12.0",
 *            "uniVer": "x",
 *            "unixVer": "5.02",
 *            "unixUtsPlugin": "x"
 *        },
 *        "harmony": {
 *            "osVer": "5.0",
 *            "uniVer": "x",
 *            "unixVer": "5.02",
 *            "unixUtsPlugin": "x",
 *            "unixvVer": "5.02"
 *        }
 *    },
 *    "mp": {
 *      "weixin": {
 *        "osVer": "x",
 *        "uniVer": "x",
 *        "unixVer": "x"
 *      }
 *    },
 *    "web": {
 *        "uniVer": "x",
 *        "unixVer": "x"
 *    }
 * }
 */
export type TakeSnapshotOptions = {

  /**
   * 截图导出类型，目前仅支持 'file' 保存到临时文件目录
   * @defaultValue "file"
  * @uniPlatform {
  *    "app": {
  *        "android": {
  *            "osVer": "5.0",
  *            "uniVer": "x",
  *            "unixVer": "5.02"
  *
},
  *        "ios": {
  *            "osVer": "12.0",
  *            "uniVer": "x",
  *            "unixVer": "5.02",
  *            "unixUtsPlugin": "x"
  *
},
  *        "harmony": {
  *            "osVer": "5.0",
  *            "uniVer": "x",
  *            "unixVer": "5.02",
  *            "unixUtsPlugin": "x",
  *            "unixvVer": "5.02"
  *
}
  *
},
  *    "mp": {
  *      "weixin": {
  *        "osVer": "x",
  *        "uniVer": "x",
  *        "unixVer": "x"
  *
}
  *
},
  *    "web": {
  *        "uniVer": "x",
  *        "unixVer": "x"
  *
}
  *
}
   */
  type?: string | null
  /**
   * 截图文件格式，目前仅支持 'png'
   * @defaultValue "png"
   * @uniPlatform {
    *    "app": {
    *        "android": {
    *            "osVer": "5.0",
    *            "uniVer": "x",
    *            "unixVer": "5.02"
    *        },
    *        "ios": {
    *            "osVer": "12.0",
    *            "uniVer": "x",
    *            "unixVer": "5.02",
    *            "unixUtsPlugin": "x"
    *        },
    *        "harmony": {
    *            "osVer": "5.0",
    *            "uniVer": "x",
    *            "unixVer": "5.02",
    *            "unixUtsPlugin": "x",
    *            "unixvVer": "5.02"
    *        }
    *    },
    *    "mp": {
    *      "weixin": {
    *        "osVer": "x",
    *        "uniVer": "x",
    *        "unixVer": "x"
    *      }
    *    },
    *    "web": {
    *        "uniVer": "x",
    *        "unixVer": "x"
    *    }
    * }
   */
  format?: string | null

  /**
   * 接口调用成功的回调函数
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x"
   *        },
   *        "harmony": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x",
   *            "unixvVer": "5.02"
   *        }
   *    },
   *    "mp": {
   *      "weixin": {
   *        "osVer": "x",
   *        "uniVer": "x",
   *        "unixVer": "x"
   *      }
   *    },
   *    "web": {
   *        "uniVer": "x",
   *        "unixVer": "x"
   *    }
   * }
   */
  success?: TakeSnapshotSuccessCallback | null
  /**
   * 接口调用失败的回调函数
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x"
   *        },
   *        "harmony": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x",
   *            "unixvVer": "5.02"
   *        }
   *    },
   *    "mp": {
   *      "weixin": {
   *        "osVer": "x",
   *        "uniVer": "x",
   *        "unixVer": "x"
   *      }
   *    },
   *    "web": {
   *        "uniVer": "x",
   *        "unixVer": "x"
   *    }
   * }
   */
  fail?: TakeSnapshotFailCallback | null
  /**
   * 接口调用结束的回调函数（调用成功、失败都会执行）
   * @uniPlatform {
   *    "app": {
   *        "android": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02"
   *        },
   *        "ios": {
   *            "osVer": "12.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x"
   *        },
   *        "harmony": {
   *            "osVer": "5.0",
   *            "uniVer": "x",
   *            "unixVer": "5.02",
   *            "unixUtsPlugin": "x",
   *            "unixvVer": "5.02"
   *        }
   *    },
   *    "mp": {
   *      "weixin": {
   *        "osVer": "x",
   *        "uniVer": "x",
   *        "unixVer": "x"
   *      }
   *    },
   *    "web": {
   *        "uniVer": "x",
   *        "unixVer": "x"
   *    }
   * }
   */
  complete?: TakeSnapshotCompleteCallback | null

}
