export const vendorPrefixes: string[] = [
    'Webkit',
    'Moz',
    'ms',
    'O'
];

export function vendorProperties(property: string): string[] {
    let properties: string[] = [property];
    let formattedProperty: string = `${property.charAt(0).toUpperCase()}${property.substr(1)}`;

    for (let prefix of vendorPrefixes) {
        properties.push(`${prefix}${formattedProperty}`);
    }

    return properties;
}

export function vendorProperty(style: CSSStyleDeclaration, property: string): string | null {
    for (let vendorProperty of vendorProperties(property)) {
        if (vendorProperty in style) {
            return vendorProperty;
        }
    }

    return null;
}
