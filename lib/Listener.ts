import {
    srcAttribute,
    OVERLAY_CLASS,
    ELEMENT_CLASS,
    CONTAINER_CLASS,
    CONTAINER_ACTIVE_CLASS
} from './Element';
import { Zoom } from './Zoom';

const transform: boolean = require('transform-property');

export class Listener {
    private readonly overlay: HTMLDivElement = document.createElement('div');

    start(): void {
        this.overlay.classList.add(OVERLAY_CLASS);
        document.body.addEventListener('click', this.clickListener);
    }

    private clickListener: EventListener = (event: MouseEvent) => {
        let target: EventTarget = event.target;

        if (target instanceof HTMLImageElement && target.classList.contains(ELEMENT_CLASS)) {
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

        if (parentClasses.contains(CONTAINER_CLASS) && !parentClasses.contains(CONTAINER_ACTIVE_CLASS)) {
            let zoom: Zoom = new Zoom(this.overlay, parent, element);
            zoom.show();
        }
    }
}
