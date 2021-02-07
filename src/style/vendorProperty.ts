export const VENDOR_PREFIXES = [
    'Webkit',
    'Moz',
    'ms',
    'O'
];

export function vendorProperties(propertyName: string): string[] {
    let suffix = `${propertyName.charAt(0).toUpperCase()}${propertyName.substr(1)}`;
    let propertyNames = VENDOR_PREFIXES.map(prefix => `${prefix}${suffix}`);
    return [propertyName].concat(propertyNames);
}

export function vendorProperty(style: CSSStyleDeclaration, propertyName: string): string | undefined {
    for (let vendorProperty of vendorProperties(propertyName)) {
        if (vendorProperty in style) {
            return vendorProperty;
        }
    }
}

export function hasVendorProperty(style: CSSStyleDeclaration, propertyName: string): boolean {
    return vendorProperty(style, propertyName) !== undefined;
}
