export type UniCameraStopEventDetail = {
    errorCause?: string;
    errSubject?: string;
    errCode?: number;
    errMsg?: string;
    data?: Object;
    cause?: Object;
};
export class UniCameraStopEvent extends UniCustomEvent<UniCameraStopEventDetail> {
    constructor(type: string, detail: UniCameraStopEventDetail);
}
export type UniCameraErrorEventDetail = {
    msg?: string;
    errSubject?: string;
    errCode?: number;
    errMsg?: string;
    data?: Object;
    cause?: Object;
};
export class UniCameraErrorEvent extends UniCustomEvent<UniCameraErrorEventDetail> {
    constructor(type: string, detail: UniCameraErrorEventDetail);
}
export type UniCameraInitDoneEventDetail = {
    maxZoom?: number;
};
export class UniCameraInitDoneEvent extends UniCustomEvent<UniCameraInitDoneEventDetail> {
    constructor(type: string, detail: UniCameraInitDoneEventDetail);
}
export type UniCameraScanCodeEventDetail = {
    type?: string;
    result?: string;
    rawData?: string;
    charSet?: string;
    scanArea?: Array<number>;
};
export class UniCameraScanCodeEvent extends UniCustomEvent<UniCameraScanCodeEventDetail> {
    constructor(type: string, detail: UniCameraScanCodeEventDetail);
}
