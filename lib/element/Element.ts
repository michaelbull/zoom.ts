export function repaint(element: HTMLElement): void {
    element.offsetHeight;
}

export function targetDimension(element: HTMLElement, dimension: string): number {
    let attribute = element.getAttribute(`data-${dimension}`);

    if (attribute === null) {
        return Infinity;
    } else {
        let value = Number(attribute);

        if (isNaN(value)) {
            return Infinity;
        } else {
            return value;
        }
    }
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
