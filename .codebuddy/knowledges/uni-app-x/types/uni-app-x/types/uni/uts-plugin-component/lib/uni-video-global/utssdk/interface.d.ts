export type UniVideoEventDetail = {};
export class UniVideoEvent<T = UniVideoEventDetail> extends UniCustomEvent<T> {
    constructor(target: UniElement, type: string, detail?: T);
}
export type UniVideoControlsToggleEventDetail = {
    /**
     * 是否显示
     */
    show: boolean;
};
export class UniVideoControlsToggleEvent extends UniVideoEvent<UniVideoControlsToggleEventDetail> {
    constructor(target: UniElement, show: boolean);
}
/**
 * 统一错误码
 */
export type VideoErrorCode = 
/**
 * 网络错误
 */
100001 | 
/**
 * 内部错误
 */
200001 | 
/**
 * SDK错误
 */
300001;
export type UniWebViewErrorEventDetail = {
    errSubject: string;
    errCode: VideoErrorCode;
    errMsg: string;
};
export class UniVideoErrorEvent extends UniVideoEvent<UniWebViewErrorEventDetail> {
    constructor(target: UniElement, detail: UniWebViewErrorEventDetail);
}
export type UniVideoFullScreenDirection = 'vertical' | 'horizontal';
export type UniVideoFullScreenChangeEventDetail = {
    /**
     * 是否全屏
     */
    fullScreen: boolean;
    /**
     * 横竖屏
     */
    direction: UniVideoFullScreenDirection;
};
export class UniVideoFullScreenChangeEvent extends UniVideoEvent<UniVideoFullScreenChangeEventDetail> {
    constructor(target: UniElement, fullScreen: boolean, direction?: UniVideoFullScreenDirection);
}
export type UniVideoFullScreenClickEventDetail = {
    /**
     * 点击点相对于屏幕左侧边缘的 X 轴坐标
     */
    screenX: number;
    /**
     * 点击点相对于屏幕顶部边缘的 Y 轴坐标
     */
    screenY: number;
    /**
     * 屏幕总宽度
     */
    screenWidth: number;
    /**
     * 屏幕总高度
     */
    screenHeight: number;
};
export class UniVideoFullScreenClickEvent extends UniVideoEvent<UniVideoFullScreenClickEventDetail> {
    constructor(target: UniElement, screenX: number, screenY: number, screenWidth: number, screenHeight: number);
}
export type UniVideoProgressEventDetail = {
    /**
     * 加载进度百分比
     */
    buffered: number;
};
export class UniVideoProgressEvent extends UniVideoEvent<UniVideoProgressEventDetail> {
    constructor(target: UniElement, buffered: number);
}
export type UniVideoTimeUpdateEventDetail = {
    /**
     * 当前进度
     */
    currentTime: number;
    /**
     * 总进度
     */
    duration: number;
};
export class UniVideoTimeUpdateEvent extends UniVideoEvent<UniVideoTimeUpdateEventDetail> {
    constructor(target: UniElement, currentTime: number, duration: number);
}
/**
 * video组件回收时的状态信息
 */
export type UniVideoRecycleEventDetail = {
    /**
     * 回收时是否处于播放状态。回收时暂停状态此值为false
     */
    isPlaying: boolean;
    /**
     * 回收时播放视频的进度
     */
    currentTime: number;
    /**
     * 回收时播放视频的总时长
     */
    duration: number;
};
/**
 * video组件回收事件对象
 */
export class UniVideoRecycleEvent extends UniVideoEvent<UniVideoRecycleEventDetail> {
    constructor(target: UniElement, detail: UniVideoRecycleEventDetail);
}
export type UniVideoReuseEventDetail = {
    /**
     * 回收时是否处于播放状态。回收时暂停状态此值为false
     */
    isPlaying: boolean;
    /**
     * 回收时播放视频的进度
     */
    currentTime: number;
    /**
     * 回收时播放视频的总时长
     */
    duration: number;
};
export class UniVideoReuseEvent extends UniVideoEvent<UniVideoReuseEventDetail> {
    constructor(target: UniElement, detail: UniVideoReuseEventDetail);
}
