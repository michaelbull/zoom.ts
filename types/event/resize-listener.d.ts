import { Features } from '../browser/features';
import { ZoomDOM } from '../dom/zoom-dom';
import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
export declare class ResizeListener implements EventListenerObject {
    private readonly dom;
    private readonly features;
    private readonly targetSize;
    private _bounds;
    constructor(dom: ZoomDOM, features: Features, targetSize: Vector2);
    handleEvent(evt: Event): void;
    readonly bounds: Bounds;
}
