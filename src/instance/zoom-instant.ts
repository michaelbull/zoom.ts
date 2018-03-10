import { pageScrollY } from '../browser/window';
import { EscKeyListener } from '../event/esc-key-listener';
import { ResizeListener } from '../event/resize-listener';
import { ScrollListener } from '../event/scroll-listener';
import { Bounds } from '../math/bounds';
import { ZoomInstance } from './zoom-instance';

export class ZoomInstant extends ZoomInstance {
    expand(): void {
        super.expand();

        let targetSize = this.dom.image.targetSize();

        /* create listeners */
        this.resizeListener = new ResizeListener(this.dom, this.features, targetSize);
        this.dismissListener = (event: Event): void => {
            event.preventDefault();
            event.stopPropagation();

            this.destroy();

            this.dom.wrapper.collapsed();
            this.dom.container.resetBounds();
            this.dom.collapsed();
        };
        this.scrollListener = new ScrollListener(pageScrollY(), this.config.scrollDismissPx, this.dismissListener);
        this.escKeyListener = new EscKeyListener(this.dismissListener);

        /* add listeners */
        this.dom.container.element.addEventListener('click', this.dismissListener);
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.escKeyListener);

        /* begin expanding */
        this.dom.overlay.appendTo(document.body);
        this.dom.showCloneIfLoaded();
        this.dom.wrapper.expanded();
        this.dom.fixWrapperHeight();
        this.dom.image.activate();
        this.dom.image.clearFixedSizes();
        this.dom.container.setBounds(Bounds.centreOf(document, targetSize, this.resizeListener.bounds));
    }
}
