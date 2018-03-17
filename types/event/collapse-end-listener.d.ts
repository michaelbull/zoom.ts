import { ZoomDOM } from '../dom/zoom-dom';
export declare class CollapseEndListener implements EventListenerObject {
    private eventType;
    private dom;
    constructor(eventType: string, dom: ZoomDOM);
    handleEvent(evt: Event): void;
}
