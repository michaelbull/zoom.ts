export const VENDOR_PREFIXES: string[] = [
    'Webkit',
    'Moz',
    'ms',
    'O'
];

export function vendorProperties(property: string): string[] {
    let suffix: string = `${property.charAt(0).toUpperCase()}${property.substr(1)}`;
    let vendorProperties: string[] = VENDOR_PREFIXES.map((prefix: string) => `${prefix}${suffix}`);
    return [property].concat(vendorProperties);
}

export function vendorProperty(style: CSSStyleDeclaration, property: string): string | undefined {
    for (let vendorProperty of vendorProperties(property)) {
        if (vendorProperty in style) {
            return vendorProperty;
        }
    }
}
