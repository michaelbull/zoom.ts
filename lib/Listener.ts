import {
    srcAttribute,
    createOverlay
} from './Element';
import { Zoom } from './Zoom';

const transform: boolean = require('transform-property');

let overlay: HTMLDivElement = createOverlay();

const clickListener: EventListener = (event: MouseEvent): void => {
    let target: EventTarget = event.target;

    if (target instanceof HTMLImageElement && target.classList.contains('zoom__element')) {
        event.preventDefault();

        if (transform && !event.metaKey && !event.ctrlKey) {
            zoom(target);
        } else {
            window.open(srcAttribute(target), '_blank');
        }
    }
};

function zoom(element: HTMLImageElement): void {
    let parent: HTMLElement | null = element.parentElement;

    if (parent === null) {
        return;
    }

    let parentClasses: DOMTokenList = parent.classList;

    if (parentClasses.contains('zoom') && !parentClasses.contains('zoom--active')) {
        let zoom: Zoom = new Zoom(overlay, parent, element);
        zoom.show();
    }
}

export function start(): void {
    document.body.addEventListener('click', clickListener);
}
