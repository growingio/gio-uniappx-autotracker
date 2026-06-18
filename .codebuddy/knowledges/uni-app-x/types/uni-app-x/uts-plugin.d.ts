/// <reference path='./types/uni/base/index.d.ts' />
/// <reference path='./types/uni/env/index.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-getAppBaseInfo/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-getDeviceInfo/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-getSystemInfo/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-network/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-prompt/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-actionSheet/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-modal/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-getNetworkType/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-storage/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-getElementById/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-location/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-chooseLocation/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-payment/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-fileSystemManager/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-websocket/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-biz/lib/uni-crash/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-event/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-dialogPage/utssdk/global.d.ts' />
/// <reference path='./types/uni/uts-plugin-api/lib/uni-createWorker/utssdk/global.d.ts' />
/// <reference path='./types/uni-cloud/index.d.ts' />
/// <reference path='./types/native-global/index.d.ts' />

import {
  UniError as UniErrorOrigin,
  SourceError as SourceErrorOrigin,
  UniAggregateError as UniAggregateErrorOrigin,
  UTSAndroidHookProxy as UTSAndroidHookProxyOrigin,
  IUniError as IUniErrorOrigin,
  AsyncApiSuccessResult as AsyncApiSuccessResultOrigin,
  UniNativeViewElement as UniNativeViewElementOrigin,
} from './types/native'

declare global {
  const UniError: typeof UniErrorOrigin
  type UniError = UniErrorOrigin
  type IUniError = IUniErrorOrigin
  const SourceError: typeof SourceErrorOrigin
  type SourceError = SourceErrorOrigin
  const UniAggregateError: typeof UniAggregateErrorOrigin
  type UniAggregateError = UniAggregateErrorOrigin
  type UTSAndroidHookProxy = UTSAndroidHookProxyOrigin
  type AsyncApiSuccessResult = AsyncApiSuccessResultOrigin
  type UniNativeViewElement = UniNativeViewElementOrigin
}
