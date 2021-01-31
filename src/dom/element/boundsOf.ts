import { Bounds } from '../../math';

export function boundsOf(element: HTMLElement): Bounds {
    let rect = element.getBoundingClientRect();

    return {
        position: {
            x: rect.left,
            y: rect.top
        },
        size: {
            x: rect.width,
            y: rect.height
        }
    };
}
