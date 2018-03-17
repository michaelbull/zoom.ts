import { Features } from '../browser/features';
import { ZoomDOM } from '../dom/zoom-dom';
import { Vector2 } from '../math/vector2';
import { ResizeListener } from './resize-listener';
export declare class ExpandEndListener implements EventListenerObject {
    private readonly dom;
    private readonly features;
    private readonly targetSize;
    private readonly resizedListener;
    constructor(dom: ZoomDOM, features: Features, targetSize: Vector2, resizedListener: ResizeListener);
    handleEvent(evt: Event): void;
}
