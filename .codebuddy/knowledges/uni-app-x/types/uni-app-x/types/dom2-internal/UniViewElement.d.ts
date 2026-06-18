import { UniElement } from './index'
import { UniElementStyles } from './UniElementType'

declare global {

  /**
   * UniViewElement
   */
  interface UniViewElement extends UniElement {

    /**
     * 以下方法在DOM层封装实现
     * - Android平台：kotlin层实现
     * - iOS平台：oc层实现
     * - 鸿蒙平台：c层实现
     */
    /**
     * 获取组件的绘制对象
     */
    getDrawableContext(): DrawableContext | null

    /**
     * 设置hover状态样式
     */
    setHoverStyles(style: UniElementStyles): void

    /**
     * 用于解决view组件 over 状态的样式更新与恢复，内部使用。
     * 区分更新样式是排版相关还是渲染相关
     * 排版相关通过FlexNode获取并备份数据，渲染相关需通过NativeView获取并备份数据：
     *  按下时调用backupAndUpdateStyle备份样式
     *  松开时调用restoreStyle恢复样式
     *
     *  Android平台：在kotlin/c层分别实现
     *  iOS平台/鸿蒙平台：在c层实现
     */
    /**
     * 备份并更新样式
     */
    backupAndUpdateStyle(): void
    /**
     * 恢复样式
     */
    restoreStyle(): void

  }



  /**
   *
   */
  interface DrawableContext {
    //Todo...
  }

}
