import {
  GetClipboardDataSuccess as GetClipboardDataSuccessOrigin,
  GetClipboardDataFail as GetClipboardDataFailOrigin,
  GetClipboardDataSuccessCallback as GetClipboardDataSuccessCallbackOrigin,
  GetClipboardDataFailCallback as GetClipboardDataFailCallbackOrigin,
  GetClipboardDataCompleteCallback as GetClipboardDataCompleteCallbackOrigin,
  GetClipboardDataOptions as GetClipboardDataOptionsOrigin,
  GetClipboardData as GetClipboardDataOrigin,
  Uni as UniOrigin
} from './interface'

declare global {
  type GetClipboardDataSuccess = GetClipboardDataSuccessOrigin
  type GetClipboardDataFail = GetClipboardDataFailOrigin
  type GetClipboardDataSuccessCallback = GetClipboardDataSuccessCallbackOrigin
  type GetClipboardDataFailCallback = GetClipboardDataFailCallbackOrigin
  type GetClipboardDataCompleteCallback = GetClipboardDataCompleteCallbackOrigin
  type GetClipboardDataOptions = GetClipboardDataOptionsOrigin
  type GetClipboardData = GetClipboardDataOrigin
  interface Uni extends UniOrigin { }
}
