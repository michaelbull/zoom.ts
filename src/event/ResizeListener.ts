import { ZoomDOM } from '../dom';
import { centreOf } from '../dom/document';
import { Vector2 } from '../math';

export class ResizeListener implements EventListenerObject {
    private readonly dom: ZoomDOM;
    private readonly size: Vector2;
    private readonly targetSize: Vector2;

    constructor(dom: ZoomDOM, size: Vector2, targetSize: Vector2) {
        this.dom = dom;
        this.size = size;
        this.targetSize = targetSize;
    }

    handleEvent(evt: Event): void {
        let wrapper = this.dom.wrapper;
        let container = this.dom.container;

        if (wrapper.isTransitioning()) {
            container.transformToCentre(wrapper.position(), this.size, this.targetSize);
        } else {
            let centre = centreOf(document, wrapper.position(), this.size, this.targetSize);
            container.setBounds(centre);
        }
    }
}
