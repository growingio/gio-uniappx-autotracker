export type UniRichTextItemClickEventDetail = {
    src: string | null;
    href: string | null;
};
export class UniRichTextItemClickEvent extends UniCustomEvent<UniRichTextItemClickEventDetail> {
    constructor(type: string, detail: UniRichTextItemClickEventDetail);
}
