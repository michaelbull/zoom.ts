import { Vector2 } from '../../math';

export function clientSize(element: HTMLElement): Vector2 {
    return {
        x: element.clientWidth,
        y: element.clientHeight
    };
}
