import { Dimension } from './Dimension';
import {
    dimensions,
    srcAttribute
} from './Element';
import { Zoom } from './Zoom';

const transform: boolean = require('transform-property');

export function addListeners(): void {
    let overlay: HTMLDivElement = document.createElement('div');
    overlay.classList.add('zoom__overlay');

    document.body.addEventListener('click', (event: MouseEvent) => {
        let target: EventTarget = event.target;

        if (target instanceof HTMLImageElement && target.classList.contains('zoom__element')) {
            event.preventDefault();

            if (transform && !event.metaKey && !event.ctrlKey) {
                let parentElement: HTMLElement | null = target.parentElement;

                if (parentElement !== null && parentElement.classList.contains('zoom')) {
                    let original: Dimension = dimensions(target);
                    let zoom: Zoom = new Zoom(overlay, parentElement, target, original);
                    zoom.show();
                }
            } else {
                window.open(srcAttribute(target), '_blank');
            }
        }
    });
}
