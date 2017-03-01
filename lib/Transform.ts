import { vendorProperties } from './Vendor';

export function transformProperty(): string | null {
    let properties: string[] = vendorProperties('transform');
    let element: HTMLParagraphElement = document.createElement('p');

    for (let property of properties) {
        if (element.style.getPropertyValue(property) !== undefined) {
            return property;
        }
    }

    return null;
}
