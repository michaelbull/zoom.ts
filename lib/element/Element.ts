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

export function targetDimension(element: HTMLElement, dimension: string): number {
    let attribute: string | null = element.getAttribute(`data-${dimension}`);

    if (attribute !== null) {
        let value: number = Number(attribute);

        if (!isNaN(value)) {
            return value;
        }
    }

    return Infinity;
}

export function targetSize(element: HTMLElement): Vector {
    return [
        targetDimension(element, 'width'),
        targetDimension(element, 'height')
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
