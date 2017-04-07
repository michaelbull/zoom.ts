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

export function dimension(element: HTMLElement, dimension: string): number {
    let value: string | null = element.getAttribute(`data-${dimension}`);
    return value === null ? Infinity : Number(value);
}

export function targetDimensions(element: HTMLElement): Vector {
    return [
        dimension(element, 'width'),
        dimension(element, 'height')
    ];
}

export function resetStyle(element: HTMLElement, property: string): void {
    (element.style as any)[property] = '';
}

export function hasParent(element: HTMLElement): boolean {
    return element.parentElement !== null;
}

export function hasGrandParent(element: HTMLElement): boolean {
    return hasParent(element) && hasParent(element.parentElement as HTMLElement);
}
