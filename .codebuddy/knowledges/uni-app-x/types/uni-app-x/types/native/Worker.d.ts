export type WorkerPostMessageOptions = {
  /**
   * 是否支持符合Sendable协议的对象作为共享变量发送，使用postMessageWithSharedSendable实现，默认值为false
   */
  harmonySendable?: boolean
  /**
   * 可转移对象数组，默认值为空数组
   */
  transfer?: any[]
}

export class WorkerTaskImpl {
  entry(): void;
  onMessage(message: any): void;
  postMessage(
    message: any,
    options?: WorkerPostMessageOptions | null
  ): void
}
