export function repaint(element: HTMLElement): void {
    element.offsetHeight;
}

export function targetDimension(element: Element, dimension: string): number {
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
