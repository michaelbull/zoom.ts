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

export function resetStyle(style: CSSStyleDeclaration, property: string): void {
    (style as any)[property] = '';
}

export function setBounds(style: CSSStyleDeclaration, x: string, y: string, width: string, height: string): void {
    style.left = x;
    style.top = y;
    style.width = width;
    style.maxWidth = width;
    style.height = height;
}

export function parsePadding(style: CSSStyleDeclaration, direction: string): number {
    let parsed = parseFloat(style.getPropertyValue(`padding-${direction}`));

    if (isNaN(parsed)) {
        return 0;
    } else {
        return parsed;
    }
}
