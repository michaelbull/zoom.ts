import { Matrix } from '../Matrix';

export function repaint(element: HTMLElement): void {
    // tslint:disable-next-line
    element.offsetHeight;
}

export function clientDimensions(element: HTMLElement): Matrix {
    return [
        element.clientWidth,
        element.clientHeight
    ];
}

function dimension(element: HTMLElement, dimension: string): number {
    let value: string | null = element.getAttribute(`data-${dimension}`);
    return value === null ? Infinity : Number(value);
}

export function targetDimensions(element: HTMLElement): Matrix {
    return [
        dimension(element, 'width'),
        dimension(element, 'height')
    ];
}
