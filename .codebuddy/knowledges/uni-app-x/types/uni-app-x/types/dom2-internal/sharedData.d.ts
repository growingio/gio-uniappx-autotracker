declare global {
  // TODO 这两个应该在 @vue/runtime-vapor-dom2 中
  type UniElementBlock = unknown
  type UniNativeViewBlock = unknown

  type UniSharedDataJSONObject = Record<string, any | null>
  type UniSharedDataArray = Array<UniSharedDataAny>

  type UniSharedDataAny =
    | boolean
    | number
    | string
    | null
    | UniSharedData
    | UniSharedDataJSONObject
    | UniSharedDataArray
    | UniSharedDataFunctionEventListener
    | UniSharedDataFunctionSetTemplateRef

  type UniSharedDataFunctionEventListener = (event: /* UniSharedDataEvent */ UniEvent) => void
  type UniSharedDataFunctionSetTemplateRef = (el: UniElement) => void

  enum UniSharedDataSchedulerJobType {
    /**
     * 各种渲染任务，比如设置属性，样式，更新文字等
     */
    RENDER_EFFECT,
    /**
     * v-if 任务
     */
    V_IF,
    /**
     * v-for 任务
     */
    V_FOR,
  }

  type UniSharedDataSchedulerJob = {
    // 指定线程执行
    thread?: string
    type: UniSharedDataSchedulerJobType
  }

  class UniSharedDataEvent {
    /**
     * 事件是否冒泡
     */
    bubbles: boolean
    /**
     * 事件是否可取消
     */
    cancelable: boolean
    /**
     * 事件类型
     */
    type: string
    /**
     * 触发事件的节点ID
     */
    target: string
    /**
     * 注册事件的节点ID
     */
    currentTarget: string
    /**
     * 事件创建的时间
     */
    timeStamp: number
  }

  class UniSharedData {
    /**
     * 所属文件
     * @internal
     */
    _filename?: string | null
    /**
     * 属性变更标识
     * @internal
     */
    _flag0: number
    /**
     * ArkTS 层数据缓存，主要用于 ArkTS 层判断属性值是否有变化
     * @internal
     */
    _cacheProps: Map<string, UniSharedDataAny>
    /**
     * 所属页面，用于批量执行响应式变更
     * @internal
     */
    _scope: UniSharedDataPage
    /**
     * 是否已初始化完成，主要用于二次更新时触发响应式
     * @internal
     */
    _setReady(): void
    /**
     * 属性变更时收集 Jobs
     * @internal
     */
    _queueJobs: (key: string) => void
    /**
     * 设置callMethod
     * @internal
     */
    _setCallMethod(fn: (...args: any[]) => void): void
    constructor(scope: UniSharedDataPage)
  }

  enum UniSharedDataComponentStyleIsolation {
    Isolated,
    App,
    AppAndPage
  }

  enum UniSharedDataComponentRenderer {
    Component,
    Page,
  }

  enum UniSharedDataComponentFlatten {
    None,
    True,
    False,
  }

  interface UniSharedDataComponentOptions {
    vueId: number
    styleIsolation: UniSharedDataComponentStyleIsolation
    renderer: UniSharedDataComponentRenderer
    flatten: UniSharedDataComponentFlatten
  }

  abstract class UniSharedDataComponent extends UniSharedData {
    /**
     * 组件的类名
     */
    static className: string
    /**
     * 当前页面或组件的样式表
     * @internal
     */
    static _styleSheet: Map<string, Map<string, Map<number, any>>>
    /**
     * vue实例ID
     * @internal
     */
    _vueId: number
    /**
     * 当前页面或组件关联的 UniPage 对象
     * @internal
     */
    _page: UniPage
    /**
     * 当前组件所在的上下文，主要用于查找上下文组件的样式表
     * @internal
     */
    _ctx: UniSharedDataComponent | null
    /**
     * 当前组件或页面样式隔离策略
     */
    _styleIsolation: UniSharedDataComponentStyleIsolation
    /**
     * 当前组件实例是否拍平
     */
    _flatten: UniSharedDataComponentFlatten
    /**
     * 当前组件或页面渲染类型，页面也有可能作为组件来渲染
     */
    _renderer: UniSharedDataComponentRenderer
    /**
     * 自定义组件需要透传的属性，需要暴露给js层设置: _set_inheritAttrs()
     * @internal
     */
    inheritAttrs: UniSharedDataJSONObject
    constructor(scope: UniSharedDataPage, options: UniSharedDataComponentOptions)
    /**
     * 监听组件根节点样式变更
     * @internal
     */
    useComputedStyle(options: {
      properties: number[]
      filterProperties?: boolean | null
      callback: (result: Array<[string, any | null]>) => void
    }): Map<string, any | null>
    /**
     * 由编译器动态生成的子类中的 Element 渲染器
     * @internal
     */
    abstract _renderElement(): UniElementBlock
    /**
     * 由编译器动态生成的子类中的 NativeView 渲染器
     * @internal
     */
    abstract _renderNativeView(): UniNativeViewBlock
  }

  abstract class UniSharedDataPage extends UniSharedDataComponent {
    /**
     * 当前页面内的组件样式缓存，主要用于缓存组件的样式表，避免重复计算
     * key 是组件class名称
     * @internal
     */
    _styleSheetCache: Map<string, Map<string, Map<string, Map<string, unknown>>>>
    /**
     * 本次更新收集到的 Jobs，用于批量执行响应式变更
     * @internal
     */
    _jobs: Array<Array<UniSharedDataSchedulerJob[]>>
    constructor(pageId: number, options: UniSharedDataComponentOptions)
    /**
     * 批量执行响应式变更
     * @internal
     */
    _flushJobs: () => Promise<void> | void
    /**
     * 页面渲染函数
     * 调用页面的 _renderElement 和 _renderNativeView
     * 执行 Element 渲染器（子线程执行）和 NativeView 渲染器（主线程执行）
     * 拿到两个渲染器执行后的 Block 后，插入到页面的根 NativeView 和根 Dom元素中
     * @internal
     */
    _render: () => Promise<void>
  }

  abstract class UniSharedDataApp extends UniSharedData {
    /**
     * 当前应用全局样式
     * @internal
     */
    static _styleSheet: Map<string, Map<string, Map<number, any>>>
  }

  enum UniSharedDataVForDirty {
    /**
     * 无变更
     */
    NONE,
    /**
     * 快速变更模式，读取 mount、unmount、update的列表，进行快速更新
     */
    FAST,
    /**
     * 全量模式，触发数组全量diff更新
     */
    FULL,
  }

  type UniSharedDataVForMount = {
    readonly index: number
  }

  type UniSharedDataVForUnmount = {
    /**
     * 需要移除的索引值
     * 重要：该索引值是oldBlocks中的索引值
     */
    readonly index: number
    readonly doRemove: boolean
    readonly doDeregister: boolean
  }

  type UniSharedDataVForUpdate = {
    /**
     * 需要更新的索引值
     * update((newBlocks[index] = oldBlocks[oldIndex]), getItem(source, i))
     */
    readonly index: number
    /**
     * 旧索引值
     */
    readonly oldIndex: number
  }

  class UniSharedDataVFor<T extends UniSharedData> extends UniSharedData {
    setData(data: T[]): void
    setMount(mount: UniSharedDataVForMount[]): void
    setUnmount(unmount: UniSharedDataVForUnmount[]): void
    setUpdate(update: UniSharedDataVForUpdate[]): void
    setDirty(dirty: UniSharedDataVForDirty): void
    create: () => T
    constructor(scope: UniSharedDataPage)
  }

  class VueReactivity {}

  // 编译宏

  interface UniSharedDataRegistry {}

  type InferSharedData<T, R extends UniSharedData = UniSharedData> = T extends keyof UniSharedDataRegistry ? UniSharedDataRegistry[T] : R

  function useSharedData<T extends string>(scope: UniSharedDataPage): InferSharedData<T>

  function useSharedDataPage<T extends string>(pageIdOrScope: number | UniSharedDataPage, options: UniSharedDataComponentOptions): InferSharedData<T, UniSharedDataPage>

  function useSharedDataComponent<T extends string>(
    scope: UniSharedDataPage,
    options: UniSharedDataComponentOptions
  ): InferSharedData<T, UniSharedDataComponent>

  function useSharedDataVFor<T, S extends UniSharedData>(sharedDataVFor: S): S

  function useSharedDataRecycleVFor<T, S extends UniSharedData>(sharedDataVFor: S): S
}

export {}
