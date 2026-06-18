// 本文件为自动构建生成
  import {
    WorkerOnErrorCallbackResultErrorCode as WorkerOnErrorCallbackResultErrorCodeOrigin,
  WorkerOnErrorCallbackResult as WorkerOnErrorCallbackResultOrigin,
  WorkerOnMessageCallback as WorkerOnMessageCallbackOrigin,
  WorkerOnErrorCallback as WorkerOnErrorCallbackOrigin,
  WorkerPostMessageOptions as WorkerPostMessageOptionsOrigin,
  Worker as WorkerOrigin,
  CreateWorker as CreateWorkerOrigin,
  Uni as UniOrigin
  } from './interface'

  declare global {
    type WorkerOnErrorCallbackResultErrorCode = WorkerOnErrorCallbackResultErrorCodeOrigin
  type WorkerOnErrorCallbackResult = WorkerOnErrorCallbackResultOrigin
  type WorkerOnMessageCallback = WorkerOnMessageCallbackOrigin
  type WorkerOnErrorCallback = WorkerOnErrorCallbackOrigin
  type WorkerPostMessageOptions = WorkerPostMessageOptionsOrigin
  type Worker = WorkerOrigin
  type CreateWorker = CreateWorkerOrigin
  interface Uni extends UniOrigin { }
  }
  