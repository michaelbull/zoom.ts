export function resetStyle(style: CSSStyleDeclaration, property: string): void {
    (style as any)[property] = '';
}
