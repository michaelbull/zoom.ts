import { Features } from './browser/features';
import { Config } from './config';
import { ZoomDOM } from './dom/zoom-dom';
export declare class Zoom {
    private readonly dom;
    private readonly features;
    private readonly config;
    private readonly transition;
    private readonly targetSize;
    private readonly collapseStartListener;
    private readonly resizeListener;
    private readonly scrollListener;
    private readonly escKeyListener;
    private showCloneListener?;
    private expandEndListener?;
    private collapseEndListener?;
    constructor(dom: ZoomDOM, features: Features, config?: Config);
    toggle(): void;
    expand(): void;
    collapse(): void;
    destroy(): void;
    /**
     * Shows the {@link clone} if it is loaded, otherwise adds a {@link ShowCloneListener} that will show it when the
     * <code>load</load> event is fired.
     */
    private showClone();
    private addDismissListeners();
    private removeEventListeners();
    private expandInstantly();
    private expandTransition();
    private collapseInstantly();
    private collapseTransition();
}
