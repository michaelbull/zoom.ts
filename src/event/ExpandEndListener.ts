import { ZoomDOM } from '../dom';
import { Vector2 } from '../math';

export class ExpandEndListener implements EventListenerObject {
    private readonly dom: ZoomDOM;
    private readonly size: Vector2;
    private readonly targetSize: Vector2;

    constructor(dom: ZoomDOM, size: Vector2, targetSize: Vector2) {
        this.dom = dom;
        this.size = size;
        this.targetSize = targetSize;
    }

    handleEvent(evt: Event): void {
        this.dom.container.removeTransitionEndListener(this);
        this.dom.showCloneIfLoaded();
        this.dom.wrapper.finishExpanding();
        this.dom.wrapper.expanded();
        this.dom.container.expanded(this.dom.wrapper.position(), this.size, this.targetSize);
    }
}
