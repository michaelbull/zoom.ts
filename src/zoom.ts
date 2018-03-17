import { Features } from './browser/features';
import { pageScrollY } from './browser/window';
import {
    Config,
    DEFAULT_CONFIG
} from './config';
import { ZoomDOM } from './dom/zoom-dom';
import { ignoreTransitions } from './element/transition';
import { CollapseEndListener } from './event/collapse-end-listener';
import { CollapseStartListener } from './event/collapse-start-listener';
import { EscKeyListener } from './event/esc-key-listener';
import { ExpandEndListener } from './event/expand-end-listener';
import { ResizeListener } from './event/resize-listener';
import { ScrollListener } from './event/scroll-listener';
import { ShowCloneListener } from './event/show-clone-listener';
import { Bounds } from './math/bounds';
import { Vector2 } from './math/vector2';

export class Zoom {
    private readonly dom: ZoomDOM;
    private readonly features: Features;
    private readonly config: Config;
    private readonly transition: boolean;
    private readonly targetSize: Vector2;

    private readonly collapseStartListener: CollapseStartListener;
    private readonly resizeListener: ResizeListener;
    private readonly scrollListener: ScrollListener;
    private readonly escKeyListener: EscKeyListener;

    private showCloneListener?: ShowCloneListener;
    private expandEndListener?: ExpandEndListener;
    private collapseEndListener?: CollapseEndListener;

    constructor(dom: ZoomDOM, features: Features, config: Config = DEFAULT_CONFIG) {
        this.dom = dom;
        this.features = features;
        this.config = config;
        this.transition = features.hasTransform && features.hasTransitions;
        this.targetSize = this.dom.image.targetSize();

        this.collapseStartListener = new CollapseStartListener(this);
        this.resizeListener = new ResizeListener(this.dom, this.features, this.targetSize);
        this.scrollListener = new ScrollListener(pageScrollY(), this.config.scrollDismissPx, this.collapseStartListener);
        this.escKeyListener = new EscKeyListener(this.collapseStartListener);
    }

    toggle(): void {
        if (this.dom.wrapper.isExpanding() || this.dom.wrapper.isExpanded()) {
            this.collapse();
        } else if (!this.dom.wrapper.isCollapsing()) {
            this.expand();
        }
    }

    expand(): void {
        if (!this.dom.wrapper.isTransitioning() && !this.dom.wrapper.isExpanded()) {
            this.showClone();

            if (this.transition) {
                this.expandTransition();
            } else {
                this.expandInstantly();
            }
        }
    }

    collapse(): void {
        if (!this.dom.wrapper.isCollapsing()) {
            if (this.dom.wrapper.isExpanding() || this.dom.wrapper.isExpanded()) {
                this.removeEventListeners();

                if (this.transition) {
                    this.collapseTransition();
                } else {
                    this.collapseInstantly();
                }
            }
        }
    }

    destroy(): void {
        this.removeEventListeners();

        if (this.dom.wrapper.isTransitioning() || this.dom.wrapper.isExpanded()) {
            this.collapseInstantly();
        }
    }

    /**
     * Shows the {@link clone} if it is loaded, otherwise adds a {@link ShowCloneListener} that will show it when the
     * <code>load</load> event is fired.
     */
    private showClone() {
        if (this.dom.clone !== undefined) {
            if (this.dom.clone.isLoaded()) {
                this.dom.replaceImageWithClone();
            } else if (this.showCloneListener === undefined) {
                this.showCloneListener = new ShowCloneListener(this.dom);
                this.dom.clone.element.addEventListener('load', this.showCloneListener);
            }
        }
    }

    private addDismissListeners(): void {
        this.dom.container.element.addEventListener('click', this.collapseStartListener);
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.escKeyListener);
    }

    private removeEventListeners(): void {
        let container = this.dom.container.element;

        container.removeEventListener('click', this.collapseStartListener);
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.escKeyListener);

        if (this.dom.clone !== undefined && this.showCloneListener !== undefined) {
            this.dom.clone.element.removeEventListener('load', this.showCloneListener);
        }

        let transitionEnd = this.features.transitionEndEvent;
        if (transitionEnd !== undefined) {
            if (this.expandEndListener !== undefined) {
                container.removeEventListener(transitionEnd, this.expandEndListener);
            }

            if (this.collapseEndListener !== undefined) {
                container.removeEventListener(transitionEnd, this.collapseEndListener);
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

        this.expandEndListener = new ExpandEndListener(this.dom, this.features, this.targetSize, this.resizeListener);
        this.dom.container.element.addEventListener(this.features.transitionEndEvent!, this.expandEndListener);

        this.dom.overlay.appendTo(document.body);
        this.dom.wrapper.startExpanding();
        this.dom.fixWrapperHeight();
        this.dom.image.activate();
        this.dom.image.clearFixedSizes();
        this.dom.container.fillViewport(this.features, this.targetSize, this.resizeListener.bounds);
    }

    private collapseInstantly(): void {
        this.dom.replaceCloneWithImage();
        this.dom.container.resetBounds();
        this.dom.wrapper.collapse();
        this.dom.collapsed();
    }

    private collapseTransition(): void {
        this.dom.overlay.hide();
        this.dom.wrapper.startCollapsing();
        this.dom.replaceCloneWithImage();

        this.collapseEndListener = new CollapseEndListener(this.features.transitionEndEvent!, this.dom);
        this.dom.container.element.addEventListener(this.features.transitionEndEvent!, this.collapseEndListener);

        if (this.dom.wrapper.isExpanding()) {
            this.dom.container.resetStyle(this.features.transformProperty!);
            this.dom.wrapper.finishExpanding();
        } else {
            ignoreTransitions(this.dom.container.element, this.features.transitionProperty!, () => {
                this.dom.container.fillViewport(this.features, this.targetSize, this.resizeListener.bounds);
            });

            this.dom.container.resetStyle(this.features.transformProperty!);
            this.dom.container.resetBounds();
            this.dom.wrapper.collapse();
        }
    }
}
