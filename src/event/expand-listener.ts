import { Features } from '../browser/features';
import { ZoomDOM } from '../dom/zoom-dom';
import { ignoreTransitions } from '../element/transition';
import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
import { ResizeListener } from './resize-listener';

export class ExpandListener implements EventListenerObject {
    private readonly dom: ZoomDOM;
    private readonly targetSize: Vector2;
    private readonly resizedListener: ResizeListener;

    private transitionEnd: string;
    private transitionProperty: string;
    private transformProperty: string;

    constructor(dom: ZoomDOM, features: Features, targetSize: Vector2, resizedListener: ResizeListener) {
        this.dom = dom;
        this.targetSize = targetSize;
        this.resizedListener = resizedListener;

        this.transitionEnd = features.transitionEndEvent as string;
        this.transitionProperty = features.transitionProperty as string;
        this.transformProperty = features.transformProperty as string;
    }

    handleEvent(evt: Event): void {
        this.dom.container.element.removeEventListener(this.transitionEnd, this);

        this.dom.showCloneIfLoaded();
        this.dom.wrapper.finishExpanding();
        this.dom.wrapper.expanded();

        let container = this.dom.container;
        ignoreTransitions(container.element, this.transitionProperty, () => {
            container.resetStyle(this.transformProperty);
            container.setBounds(Bounds.centreOf(document, this.targetSize, this.resizedListener.bounds));
        });
    }
}
