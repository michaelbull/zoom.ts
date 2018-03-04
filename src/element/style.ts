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
    let padding = style.getPropertyValue(`padding-${direction}`);
    let parsed = parseFloat(padding);

    if (isNaN(parsed)) {
        return 0;
    } else {
        return parsed;
    }
}
