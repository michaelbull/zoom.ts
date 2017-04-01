import { Vector } from '../math/Vector';

export function repaint(element: HTMLElement): void {
    // tslint:disable-next-line
    element.offsetHeight;
}

export function clientSize(element: HTMLElement): Vector {
    return [
        element.clientWidth,
        element.clientHeight
    ];
}

function dimension(element: HTMLElement, dimension: string): number {
    let value: string | null = element.getAttribute(`data-${dimension}`);
    return value === null ? Infinity : Number(value);
}

export function targetDimensions(element: HTMLElement): Vector {
    return [
        dimension(element, 'width'),
        dimension(element, 'height')
    ];
}
