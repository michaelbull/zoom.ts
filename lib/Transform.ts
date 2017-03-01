import { vendorProperties } from './Vendor';

function getTransformProperty(): string {
    let properties: string[] = vendorProperties('transform');
    let element: HTMLParagraphElement = document.createElement('p');
    let style: any = element.style;
    return properties.find((property: string) => style[property] !== undefined);
}

export const transformProperty: string = getTransformProperty();

export function transform(element: HTMLElement, value: string): void {
    element.style.setProperty(transformProperty, value);
}
