import { Features } from '../browser/features';
import { Config } from '../config';
import { ZoomDOM } from '../dom/zoom-dom';
import { EscKeyListener } from '../event/esc-key-listener';
import { ResizeListener } from '../event/resize-listener';
import { ScrollListener } from '../event/scroll-listener';
import { ShowCloneListener } from '../event/show-clone-listener';
import { removeEventListener } from '../event/util';

export abstract class ZoomInstance {
    protected resizeListener?: ResizeListener;
    protected scrollListener?: ScrollListener;
    protected escKeyListener?: EscKeyListener;
    protected showCloneListener?: ShowCloneListener;
    protected dismissListener?: EventListener;

    protected readonly features: Features;
    protected readonly config: Config;
    protected readonly dom: ZoomDOM;

    constructor(features: Features, config: Config, dom: ZoomDOM) {
        this.features = features;
        this.config = config;
        this.dom = dom;
    }

    expand(): void {
        if (this.dom.clone !== undefined) {
            if (this.dom.clone.isLoaded()) {
                this.dom.replaceImageWithClone();
            } else {
                this.showCloneListener = new ShowCloneListener(this.dom);
                this.dom.clone.element.addEventListener('load', this.showCloneListener);
            }
        }
    }

    destroy(): void {
        removeEventListener(this.dom.container.element, 'click', this.dismissListener);
        removeEventListener(window, 'resize', this.resizeListener);
        removeEventListener(window, 'scroll', this.scrollListener);
        removeEventListener(document, 'keyup', this.escKeyListener);

        if (this.dom.clone !== undefined && this.showCloneListener !== undefined) {
            this.dom.clone.element.removeEventListener('load', this.showCloneListener);
        }
    }
}
