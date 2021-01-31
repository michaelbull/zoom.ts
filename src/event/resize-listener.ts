import { Features } from '../browser';
import { ZoomDOM } from '../dom';
import {
    Bounds,
    Vector2
} from '../math';

export class ResizeListener implements EventListenerObject {
    private readonly dom: ZoomDOM;
    private readonly features: Features;
    private readonly targetSize: Vector2;

    private _bounds: Bounds;

    constructor(dom: ZoomDOM, features: Features, targetSize: Vector2) {
        this.dom = dom;
        this.features = features;
        this.targetSize = targetSize;
        this._bounds = dom.image.bounds();
    }

    handleEvent(evt: Event): void {
        let wrapper = this.dom.wrapper;
        let container = this.dom.container;

        this._bounds = new Bounds(wrapper.position(), this._bounds.size);

        if (wrapper.isTransitioning()) {
            container.fillViewport(this.features, this.targetSize, this._bounds);
        } else {
            container.setBounds(Bounds.centreOf(document, this.targetSize, this._bounds));
        }
    }

    get bounds(): Bounds {
        return this._bounds;
    }
}
