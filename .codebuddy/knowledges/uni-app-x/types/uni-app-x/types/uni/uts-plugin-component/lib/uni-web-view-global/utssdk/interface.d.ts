declare class UniWebViewBaseEvent<T> extends UniCustomEvent<T> {
    constructor(target: UniElement, type: string, detail?: T);
}
export type UniWebViewMessageEventDetail = {
    data: UTSJSONObject[];
};
export class UniWebViewMessageEvent extends UniWebViewBaseEvent<UniWebViewMessageEventDetail> {
    constructor(target: UniElement, type: string, detail: UniWebViewMessageEventDetail);
}
export type UniWebViewLoadEventDetail = {
    url: string;
    src: string;
};
export class UniWebViewLoadEvent extends UniWebViewBaseEvent<UniWebViewLoadEventDetail> {
    constructor(target: UniElement, type: string, detail: UniWebViewLoadEventDetail);
}
export type UniWebViewLoadingEventDetail = {
    url: string;
    src: string;
};
export class UniWebViewLoadingEvent extends UniWebViewBaseEvent<UniWebViewLoadingEventDetail> {
    constructor(target: UniElement, type: string, detail: UniWebViewLoadingEventDetail);
}
export type UniWebViewDownloadEventDetail = {
    url: string;
    userAgent: string;
    contentDisposition: string;
    mimetype: string;
    contentLength: number;
};
export class UniWebViewDownloadEvent extends UniWebViewBaseEvent<UniWebViewDownloadEventDetail> {
    constructor(target: UniElement, type: string, detail: UniWebViewDownloadEventDetail);
}
export type UniWebViewContentHeightChangeEventDetail = {
    height: number;
};
export class UniWebViewContentHeightChangeEvent extends UniWebViewBaseEvent<UniWebViewContentHeightChangeEventDetail> {
    constructor(target: UniElement, type: string, detail: UniWebViewContentHeightChangeEventDetail);
}
export type UniWebViewErrorEventDetail = {
    errSubject: string;
    errCode: number;
    errMsg: string;
    url: string;
    fullUrl: string;
    src: string;
};
export class UniWebViewErrorEvent extends UniWebViewBaseEvent<UniWebViewErrorEventDetail> {
    constructor(target: UniElement, type: string, detail: UniWebViewErrorEventDetail);
}
export {};
