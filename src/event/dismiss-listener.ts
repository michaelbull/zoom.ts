import { pageScrollY } from '../browser/window';
import { EscKeyListener } from './esc-key-listener';
import { ScrollListener } from './scroll-listener';

export class DismissListeners {
    static create(scrollDismissPx: number, delegateListener: EventListener): DismissListeners {
        let scrollListener = new ScrollListener(document, pageScrollY(), scrollDismissPx, delegateListener);
        let escKeyListener = new EscKeyListener(document, delegateListener);
        return new DismissListeners(delegateListener, scrollListener, escKeyListener);
    }

    private readonly delegateListener: EventListener;
    private readonly scrollListener: ScrollListener;
    private readonly escKeyListener: EscKeyListener;

    constructor(delegateListener: EventListener, scrollListener: ScrollListener, escKeyListener: EscKeyListener) {
        this.delegateListener = delegateListener;
        this.scrollListener = scrollListener;
        this.escKeyListener = escKeyListener;
    }

    addTo(context: Window, container: HTMLElement) {
        container.addEventListener('click', this.delegateListener);
        context.addEventListener('scroll', this.scrollListener);
        context.document.addEventListener('keyup', this.escKeyListener);
    }

    removeFrom(context: Window, container: HTMLElement): void {
        container.removeEventListener('click', this.delegateListener);
        context.removeEventListener('scroll', this.scrollListener);
        context.document.removeEventListener('keyup', this.escKeyListener);
    }
}
