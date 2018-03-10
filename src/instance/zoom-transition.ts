import { pageScrollY } from '../browser/window';
import { Config } from '../config';
import { ignoreTransitions } from '../element/transition';
import { CollapseListener } from '../event/collapse-listener';
import { EscKeyListener } from '../event/esc-key-listener';
import { ExpandListener } from '../event/expand-listener';
import { ResizeListener } from '../event/resize-listener';
import { ScrollListener } from '../event/scroll-listener';
import { removeEventListener } from '../event/util';
import {
    Features,
    ZoomDOM
} from '../index';
import { ZoomInstance } from './zoom-instance';

export class ZoomTransition extends ZoomInstance {
    private expandedListener?: ExpandListener;
    private collapsedListener?: CollapseListener;

    private readonly transitionEnd: string;
    private readonly transitionProperty: string;
    private readonly transformProperty: string;

    constructor(features: Features, config: Config, dom: ZoomDOM) {
        super(features, config, dom);
        this.transitionEnd = this.features.transitionEndEvent as string;
        this.transitionProperty = this.features.transitionProperty as string;
        this.transformProperty = this.features.transformProperty as string;
    }

    expand(): void {
        super.expand();

        let targetSize = this.dom.image.targetSize();

        /* create listeners */
        this.resizeListener = new ResizeListener(this.dom, this.features, targetSize);
        this.expandedListener = new ExpandListener(this.dom, this.features, targetSize, this.resizeListener);
        this.dismissListener = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();

            this.destroy();

            this.dom.overlay.hide();
            this.dom.wrapper.startCollapsing();

            this.collapsedListener = new CollapseListener(this.transitionEnd, this.dom);
            this.dom.container.element.addEventListener(this.transitionEnd, this.collapsedListener);

            if (this.dom.wrapper.isExpanding()) {
                this.dom.container.resetStyle(this.transformProperty);
                this.dom.wrapper.finishExpanding();
            } else {
                ignoreTransitions(this.dom.container.element, this.transitionProperty, () => {
                    if (this.resizeListener !== undefined) {
                        this.dom.container.fillViewport(this.features, targetSize, this.resizeListener.bounds);
                    }
                });

                this.dom.container.resetStyle(this.transformProperty);
                this.dom.container.resetBounds();
                this.dom.wrapper.collapsed();
            }
        };
        this.scrollListener = new ScrollListener(pageScrollY(), this.config.scrollDismissPx, this.dismissListener);
        this.escKeyListener = new EscKeyListener(this.dismissListener);

        /* add listeners */
        this.dom.container.element.addEventListener('click', this.dismissListener);
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.escKeyListener);
        this.dom.container.element.addEventListener(this.transitionEnd, this.expandedListener);

        /* begin expanding */
        this.dom.overlay.appendTo(document.body);
        this.dom.wrapper.startExpanding();
        this.dom.fixWrapperHeight();
        this.dom.image.activate();
        this.dom.image.clearFixedSizes();
        this.dom.container.fillViewport(this.features, targetSize, this.resizeListener.bounds);
    }

    destroy(): void {
        super.destroy();
        removeEventListener(this.dom.container.element, this.transitionEnd, this.expandedListener);
        removeEventListener(this.dom.container.element, this.transitionEnd, this.collapsedListener);
    }
}
