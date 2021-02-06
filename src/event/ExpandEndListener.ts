import { ZoomDOM } from '../dom';
import { Vector2 } from '../math';
import { Features } from '../style';
import { ResizeListener } from './ResizeListener';

export class ExpandEndListener implements EventListenerObject {
    private readonly dom: ZoomDOM;
    private readonly features: Features;
    private readonly size: Vector2;
    private readonly targetSize: Vector2;
    private readonly resizedListener: ResizeListener;

    constructor(dom: ZoomDOM, features: Features, size: Vector2, targetSize: Vector2, resizedListener: ResizeListener) {
        this.dom = dom;
        this.features = features;
        this.size = size;
        this.targetSize = targetSize;
        this.resizedListener = resizedListener;
    }

    handleEvent(evt: Event): void {
        this.dom.container.removeTransitionEndListener(this);
        this.dom.showCloneIfLoaded();
        this.dom.wrapper.finishExpanding();
        this.dom.wrapper.expanded();
        this.dom.container.expanded(this.dom.wrapper.position(), this.size, this.targetSize);
    }
}
