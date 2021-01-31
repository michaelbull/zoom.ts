export function parsePadding(style: CSSStyleDeclaration, direction: string): number {
    let padding = style.getPropertyValue(`padding-${direction}`);
    let parsed = parseFloat(padding);

    if (isNaN(parsed)) {
        return 0;
    } else {
        return parsed;
    }
}
