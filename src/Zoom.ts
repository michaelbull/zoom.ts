import {
    Config,
    DEFAULT_CONFIG
} from './config';
import { ZoomDOM } from './dom';
import { centreOf } from './dom/document';
import { pageScrollY } from './dom/window';
import {
    CollapseEndListener,
    CollapseStartListener,
    EscKeyListener,
    ExpandEndListener,
    ResizeListener,
    ScrollListener,
    ShowCloneListener
} from './event';
import { Vector2 } from './math';
import { Features } from './style';

export class Zoom {
    static create(dom: ZoomDOM, features: Features, config: Config = DEFAULT_CONFIG) {
        let size = dom.image.size();
        let targetSize = dom.image.targetSize();
        let scrollY = pageScrollY();
        return new Zoom(dom, features, config, size, targetSize, scrollY);
    }

    private readonly dom: ZoomDOM;
    private readonly features: Features;
    private readonly config: Config;
    private readonly size: Vector2;
    private readonly targetSize: Vector2;

    private readonly collapseStartListener: CollapseStartListener;
    private readonly resizeListener: ResizeListener;
    private readonly scrollListener: ScrollListener;
    private readonly escKeyListener: EscKeyListener;

    private showCloneListener?: ShowCloneListener;
    private expandEndListener?: ExpandEndListener;
    private collapseEndListener?: CollapseEndListener;

    constructor(dom: ZoomDOM, features: Features, config: Config, size: Vector2, targetSize: Vector2, scrollY: number) {
        this.dom = dom;
        this.features = features;
        this.config = config;
        this.size = size;
        this.targetSize = targetSize;
        this.collapseStartListener = new CollapseStartListener(this);
        this.resizeListener = new ResizeListener(dom, size, targetSize);
        this.scrollListener = new ScrollListener(scrollY, config.scrollDismissPx, this.collapseStartListener);
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

            if (this.features.transform && this.features.transitions) {
                this.expandTransition();
            } else {
                this.expandInstantly();
            }
        }
    }

    collapse(): void {
        if (this.dom.wrapper.isCollapsing()) {
            return;
        }

        if (this.dom.wrapper.isExpanding() || this.dom.wrapper.isExpanded()) {
            this.removeEventListeners();

            if (this.features.transform && this.features.transitions) {
                this.collapseTransition();
            } else {
                this.collapseInstantly();
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
        if (this.dom.clone === undefined) {
            return;
        }

        if (this.dom.clone.isLoaded()) {
            this.dom.replaceImageWithClone();
        } else if (this.showCloneListener === undefined) {
            this.showCloneListener = new ShowCloneListener(this.dom);
            this.dom.clone.addLoadListener(this.showCloneListener);
        }
    }

    private addDismissListeners(): void {
        this.dom.container.addClickListener(this.collapseStartListener);
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.escKeyListener);
    }

    private removeEventListeners(): void {
        this.dom.container.removeClickListener(this.collapseStartListener);
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.escKeyListener);

        if (this.dom.clone !== undefined && this.showCloneListener !== undefined) {
            this.dom.clone.removeLoadListener(this.showCloneListener);
        }

        if (this.expandEndListener !== undefined) {
            this.dom.container.removeTransitionEndListener(this.expandEndListener);
        }

        if (this.collapseEndListener !== undefined) {
            this.dom.container.removeTransitionEndListener(this.collapseEndListener);
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
        this.dom.container.setBounds(centreOf(document, this.dom.wrapper.position(), this.size, this.targetSize));
    }

    private expandTransition(): void {
        this.addDismissListeners();

        this.expandEndListener = new ExpandEndListener(this.dom, this.size, this.targetSize);
        this.dom.container.addTransitionEndListener(this.expandEndListener);

        this.dom.overlay.appendTo(document.body);
        this.dom.wrapper.startExpanding();
        this.dom.fixWrapperHeight();
        this.dom.image.activate();
        this.dom.image.clearFixedSizes();
        this.dom.container.fillViewport(this.dom.wrapper.position(), this.size, this.targetSize);
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

        this.collapseEndListener = new CollapseEndListener(this.dom);
        this.dom.container.addTransitionEndListener(this.collapseEndListener);

        if (this.dom.wrapper.isExpanding()) {
            this.dom.container.resetStyle(this.features.transformProperty!);
            this.dom.wrapper.finishExpanding();
        } else {
            this.dom.container.fill(this.targetSize, this.dom.wrapper.position(), this.size);
            this.dom.container.resetStyle(this.features.transformProperty!);
            this.dom.container.resetBounds();
            this.dom.wrapper.collapse();
        }
    }
}
