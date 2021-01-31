import { ZoomDOM } from '../dom';

export class CollapseEndListener implements EventListenerObject {
    private eventType: string;
    private dom: ZoomDOM;

    constructor(eventType: string, dom: ZoomDOM) {
        this.eventType = eventType;
        this.dom = dom;
    }

    handleEvent(evt: Event): void {
        this.dom.container.element.removeEventListener(this.eventType, this);
        this.dom.collapsed();
    }
}
