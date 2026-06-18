// 本文件为自动构建生成
  import {
    PromptErrorCode as PromptErrorCodeOrigin,
  IPromptError as IPromptErrorOrigin,
  ShowToastSuccess as ShowToastSuccessOrigin,
  ShowToastFail as ShowToastFailOrigin,
  ShowToastSuccessCallback as ShowToastSuccessCallbackOrigin,
  ShowToastFailCallback as ShowToastFailCallbackOrigin,
  ShowToastCompleteCallback as ShowToastCompleteCallbackOrigin,
  Icon as IconOrigin,
  ShowToastPosition as ShowToastPositionOrigin,
  ShowToastOptions as ShowToastOptionsOrigin,
  ShowToast as ShowToastOrigin,
  HideToast as HideToastOrigin,
  Uni as UniOrigin
  } from './interface'

  declare global {
    type PromptErrorCode = PromptErrorCodeOrigin
  type IPromptError = IPromptErrorOrigin
  type ShowToastSuccess = ShowToastSuccessOrigin
  type ShowToastFail = ShowToastFailOrigin
  type ShowToastSuccessCallback = ShowToastSuccessCallbackOrigin
  type ShowToastFailCallback = ShowToastFailCallbackOrigin
  type ShowToastCompleteCallback = ShowToastCompleteCallbackOrigin
  type Icon = IconOrigin
  type ShowToastPosition = ShowToastPositionOrigin
  type ShowToastOptions = ShowToastOptionsOrigin
  type ShowToast = ShowToastOrigin
  type HideToast = HideToastOrigin
  interface Uni extends UniOrigin { }
  }
  