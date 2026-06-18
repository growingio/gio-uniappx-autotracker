export type UniMapUpdatedEventDetail = {};
export class UniMapUpdatedEvent extends UniCustomEvent<UniMapUpdatedEventDetail> {
    constructor(type: string, detail: UniMapUpdatedEventDetail);
}
export type UniMapTapEventDetail = {
    latitude: number | null;
    longitude: number | null;
};
export class UniMapTapEvent extends UniPointerEvent {
    detail?: UniMapTapEventDetail;
    constructor(type: string, x: number, y: number, clientX: number, clientY: number, pageX: number, pageY: number, screenX: number, screenY: number);
}
export type UniMapRegionChangeEventDetail = {
    skew: number | null;
    rotate: number | null;
};
export class UniMapRegionChangeEvent extends UniCustomEvent<UniMapRegionChangeEventDetail | null> {
    causedBy?: string | null;
    constructor(type: string, detail: UniMapRegionChangeEventDetail | null);
}
export type UniMapMarkerTapEventDetail = {
    markerId: number | null;
};
export class UniMapMarkerTapEvent extends UniPointerEvent {
    detail?: UniMapMarkerTapEventDetail;
    constructor(type: string, x: number, y: number, clientX: number, clientY: number, pageX: number, pageY: number, screenX: number, screenY: number);
}
export type UniMapControlTapEventDetail = {
    controlId: number | null;
};
export class UniMapControlTapEvent extends UniCustomEvent<UniMapControlTapEventDetail> {
    constructor(type: string, detail: UniMapControlTapEventDetail);
}
export type UniMapAnchorPointTapEventDetail = {
    latitude: number | null;
    longitude: number | null;
};
export class UniMapAnchorPointTapEvent extends UniPointerEvent {
    detail?: UniMapAnchorPointTapEventDetail;
    constructor(type: string, x: number, y: number, clientX: number, clientY: number, pageX: number, pageY: number, screenX: number, screenY: number);
}
export type UniMapPoiTapEventDetail = {
    latitude: number | null;
    longitude: number | null;
    name: string | null;
};
export class UniMapPoiTapEvent extends UniPointerEvent {
    detail?: UniMapPoiTapEventDetail;
    constructor(type: string, x: number, y: number, clientX: number, clientY: number, pageX: number, pageY: number, screenX: number, screenY: number);
}
export type UniMapCalloutTapEventDetail = {
    markerId: number | null;
};
export class UniMapCalloutTapEvent extends UniCustomEvent<UniMapCalloutTapEventDetail> {
    constructor(type: string, detail: UniMapCalloutTapEventDetail);
}
