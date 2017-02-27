import {
    srcAttribute,
    createOverlay
} from './Element';
import { Zoom } from './Zoom';

const transform: boolean = require('transform-property');

export class Listener {
    private readonly overlay: HTMLDivElement = createOverlay();

    start(): void {
        document.body.addEventListener('click', this.clickListener);
    }

    private clickListener: EventListener = (event: MouseEvent) => {
        let target: EventTarget = event.target;

        if (target instanceof HTMLImageElement && target.classList.contains('zoom__element')) {
            event.preventDefault();

            if (transform && !event.metaKey && !event.ctrlKey) {
                this.zoom(target);
            } else {
                window.open(srcAttribute(target), '_blank');
            }
        }
    };

    private zoom(element: HTMLImageElement): void {
        let parent: HTMLElement | null = element.parentElement;

        if (parent === null) {
            return;
        }

        let parentClasses: DOMTokenList = parent.classList;

        if (parentClasses.contains('zoom') && !parentClasses.contains('zoom--active')) {
            let zoom: Zoom = new Zoom(this.overlay, parent, element);
            zoom.show();
        }
    }
}
