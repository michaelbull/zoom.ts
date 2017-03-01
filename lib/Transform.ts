import { vendorProperties } from './Vendor';

function getTransformProperty(): string | null {
    let properties: string[] = vendorProperties('transform');
    let element: HTMLParagraphElement = document.createElement('p');

    for (let property of properties) {
        if (element.style.getPropertyValue(property) !== undefined) {
            return property;
        }
    }

    return null;
}

export const transformProperty: string | null = getTransformProperty();

export function transform(element: HTMLElement, value: string): void {
    element.style.setProperty(transformProperty as string, value);
}
