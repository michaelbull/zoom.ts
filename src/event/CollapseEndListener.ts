import { ZoomDOM } from '../dom';

export class CollapseEndListener implements EventListenerObject {
    private readonly dom: ZoomDOM;

    constructor(dom: ZoomDOM) {
        this.dom = dom;
    }

    handleEvent(evt: Event): void {
        this.dom.container.removeTransitionEndListener(this);
        this.dom.collapsed();
    }
}
