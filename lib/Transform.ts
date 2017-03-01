import { vendorProperties } from './Vendor';

export function transformProperty(element: HTMLElement): string | null {
    for (let property of vendorProperties('transform')) {
        if (property in element.style) {
            return property;
        }
    }

    return null;
}
