import { Features } from './browser/features';
import { pageScrollY } from './browser/window';
import {
    Config,
    DEFAULT_CONFIG
} from './config';
import { ZoomDOM } from './dom/zoom-dom';
import { ignoreTransitions } from './element/transition';
import { CollapseListener } from './event/collapse-listener';
import { EscKeyListener } from './event/esc-key-listener';
import { ExpandListener } from './event/expand-listener';
import { ResizeListener } from './event/resize-listener';
import { ScrollListener } from './event/scroll-listener';
import { ShowCloneListener } from './event/show-clone-listener';
import { Bounds } from './math/bounds';
import { Vector2 } from './math/vector2';

/**
 * Represents an instance of a zoomed image.
 */
export class ZoomInstance {
    private readonly dom: ZoomDOM;
    private readonly features: Features;
    private readonly config: Config;

    private readonly transition: boolean;
    private readonly targetSize: Vector2;
    private readonly resizeListener: ResizeListener;
    private readonly scrollListener: ScrollListener;
    private readonly escKeyListener: EscKeyListener;

    private showCloneListener?: ShowCloneListener;
    private expandListener?: ExpandListener;
    private collapseListener?: CollapseListener;

    constructor(dom: ZoomDOM, features: Features, config: Config = DEFAULT_CONFIG) {
        this.dom = dom;
        this.features = features;
        this.config = config;

        this.transition = features.hasTransform && features.hasTransitions;
        this.targetSize = this.dom.image.targetSize();
        this.resizeListener = new ResizeListener(this.dom, this.features, this.targetSize);
        this.scrollListener = new ScrollListener(pageScrollY(), this.config.scrollDismissPx, this.dismissListener);
        this.escKeyListener = new EscKeyListener(this.dismissListener);
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

        if (this.transition) {
            this.expandTransition();
        } else {
            this.expandInstantly();
        }
    }

    collapse(): void {
        if (this.transition) {
            this.collapseTransition();
        } else {
            this.collapseInstantly();
        }
    }

    destroy(): void {
        if (this.dom.wrapper.isTransitioning() || this.dom.wrapper.isExpanded()) {
            this.collapseInstantly();
        } else {
            this.removeEventListeners();
        }
    }

    private addDismissListeners(): void {
        this.dom.container.element.addEventListener('click', this.dismissListener);
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.escKeyListener);
    }

    private removeEventListeners(): void {
        let container = this.dom.container.element;

        container.removeEventListener('click', this.dismissListener);
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.escKeyListener);

        if (this.dom.clone !== undefined && this.showCloneListener !== undefined) {
            this.dom.clone.element.removeEventListener('load', this.showCloneListener);
        }

        let transitionEnd = this.features.transitionEndEvent;
        if (transitionEnd !== undefined) {
            if (this.expandListener !== undefined) {
                container.removeEventListener(transitionEnd, this.expandListener);
            }

            if (this.collapseListener !== undefined) {
                container.removeEventListener(transitionEnd, this.collapseListener);
            }
        }
    }

    private expandInstantly(): void {
        this.addDismissListeners();

        this.dom.overlay.appendTo(document.body);
        this.dom.showCloneIfLoaded();
        this.dom.wrapper.expanded();
        this.dom.fixWrapperHeight();
        this.dom.image.activate();
        this.dom.image.clearFixedSizes();
        this.dom.container.setBounds(Bounds.centreOf(document, this.targetSize, this.resizeListener.bounds));
    }

    private expandTransition(): void {
        this.addDismissListeners();

        this.expandListener = new ExpandListener(this.dom, this.features, this.targetSize, this.resizeListener);
        this.dom.container.element.addEventListener(this.features.transitionEndEvent!, this.expandListener);

        this.dom.overlay.appendTo(document.body);
        this.dom.wrapper.startExpanding();
        this.dom.fixWrapperHeight();
        this.dom.image.activate();
        this.dom.image.clearFixedSizes();
        this.dom.container.fillViewport(this.features, this.targetSize, this.resizeListener.bounds);
    }

    private collapseInstantly(): void {
        this.removeEventListeners();

        this.dom.replaceCloneWithImage();
        this.dom.container.resetBounds();
        this.dom.wrapper.collapsed();
        this.dom.collapse();
    }

    private collapseTransition(): void {
        this.removeEventListeners();

        this.dom.overlay.hide();
        this.dom.wrapper.startCollapsing();
        this.dom.replaceCloneWithImage();

        this.collapseListener = new CollapseListener(this.features.transitionEndEvent!, this.dom);
        this.dom.container.element.addEventListener(this.features.transitionEndEvent!, this.collapseListener);

        if (this.dom.wrapper.isExpanding()) {
            this.dom.container.resetStyle(this.features.transformProperty!);
            this.dom.wrapper.finishExpanding();
        } else {
            ignoreTransitions(this.dom.container.element, this.features.transitionProperty!, () => {
                this.dom.container.fillViewport(this.features, this.targetSize, this.resizeListener.bounds);
            });

            this.dom.container.resetStyle(this.features.transformProperty!);
            this.dom.container.resetBounds();
            this.dom.wrapper.collapsed();
        }
    }

    private dismissListener = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
        this.collapse();
    };
}
