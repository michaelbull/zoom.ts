import { vendorProperties } from './Vendor';

export function transformProperty(): string | null {
    for (let property of vendorProperties('transform')) {
        if (property in document.body.style) {
            return property;
        }
    }

    return null;
}
