import { ZoomDOM } from '../dom';
import { centreOf } from '../dom/document';
import {
    Bounds,
    Vector2
} from '../math';
import { Features } from '../style';

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

        this._bounds = {
            position: wrapper.position(),
            size: this._bounds.size
        };

        if (wrapper.isTransitioning()) {
            container.fillViewport(this.features, this.targetSize, this._bounds);
        } else {
            let centre = centreOf(document, this.targetSize, this._bounds);
            container.setBounds(centre);
        }
    }

    get bounds(): Bounds {
        return this._bounds;
    }
}
