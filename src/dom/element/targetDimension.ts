export function targetDimension(element: Element, attributeName: string): number {
    let attribute = element.getAttribute(attributeName);

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
