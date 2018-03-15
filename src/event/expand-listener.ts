import { Features } from '../browser/features';
import { ZoomDOM } from '../dom/zoom-dom';
import { ignoreTransitions } from '../element/transition';
import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
import { ResizeListener } from './resize-listener';

export class ExpandListener implements EventListenerObject {
    private readonly dom: ZoomDOM;
    private readonly features: Features;
    private readonly targetSize: Vector2;
    private readonly resizedListener: ResizeListener;

    constructor(dom: ZoomDOM, features: Features, targetSize: Vector2, resizedListener: ResizeListener) {
        this.dom = dom;
        this.features = features;
        this.targetSize = targetSize;
        this.resizedListener = resizedListener;
    }

    handleEvent(evt: Event): void {
        let container = this.dom.container;
        container.element.removeEventListener(this.features.transitionEndEvent!, this);

        this.dom.showCloneIfLoaded();
        this.dom.wrapper.finishExpanding();
        this.dom.wrapper.expanded();

        ignoreTransitions(container.element, this.features.transitionProperty!, () => {
            container.resetStyle(this.features.transformProperty!);
            container.setBounds(Bounds.centreOf(document, this.targetSize, this.resizedListener.bounds));
        });
    }
}
