// 本文件为自动构建生成
  import {
    OnAppCrashCallback as OnAppCrashCallbackOrigin,
  OnAppCrash as OnAppCrashOrigin,
  OffAppCrash as OffAppCrashOrigin,
  AppCrashInfo as AppCrashInfoOrigin,
  GetAppCrashInfo as GetAppCrashInfoOrigin,
  DeleteAppCrashInfo as DeleteAppCrashInfoOrigin,
  CreateAppCrash as CreateAppCrashOrigin,
  Uni as UniOrigin
  } from './interface'

  declare global {
    type OnAppCrashCallback = OnAppCrashCallbackOrigin
  type OnAppCrash = OnAppCrashOrigin
  type OffAppCrash = OffAppCrashOrigin
  type AppCrashInfo = AppCrashInfoOrigin
  type GetAppCrashInfo = GetAppCrashInfoOrigin
  type DeleteAppCrashInfo = DeleteAppCrashInfoOrigin
  type CreateAppCrash = CreateAppCrashOrigin
  interface Uni extends UniOrigin { }
  }
  