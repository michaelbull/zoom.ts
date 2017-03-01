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
