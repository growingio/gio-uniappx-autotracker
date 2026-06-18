import {
  SetClipboardDataSuccess as SetClipboardDataSuccessOrigin,
  SetClipboardDataFail as SetClipboardDataFailOrigin,
  SetClipboardDataSuccessCallback as SetClipboardDataSuccessCallbackOrigin,
  SetClipboardDataFailCallback as SetClipboardDataFailCallbackOrigin,
  SetClipboardDataCompleteCallback as SetClipboardDataCompleteCallbackOrigin,
  SetClipboardDataOptions as SetClipboardDataOptionsOrigin,
  setClipboardData as setClipboardDataOrigin,
  Uni as UniOrigin
} from './interface'

declare global {
  type SetClipboardDataSuccess = SetClipboardDataSuccessOrigin
  type SetClipboardDataFail = SetClipboardDataFailOrigin
  type SetClipboardDataSuccessCallback = SetClipboardDataSuccessCallbackOrigin
  type SetClipboardDataFailCallback = SetClipboardDataFailCallbackOrigin
  type SetClipboardDataCompleteCallback = SetClipboardDataCompleteCallbackOrigin
  type SetClipboardDataOptions = SetClipboardDataOptionsOrigin
  type setClipboardData = setClipboardDataOrigin
  interface Uni extends UniOrigin { }
}
