import { vendorProperties } from './Vendor';
export function repaint(element: HTMLElement): void {
    // tslint:disable-next-line
    element.offsetHeight;
}

export function srcAttribute(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}

export function hasClass(element: HTMLElement, name: string): boolean {
    return element.className.indexOf(name) !== -1;
}

export function addClass(element: HTMLElement, name: string): void {
    element.className += ` ${name}`;
}

export function removeClass(element: HTMLElement, name: string): void {
    let existing: string = element.className;

    if (existing.indexOf(' ') !== -1) {
        let classes: string[] = existing.split(' ');
        classes.splice(classes.indexOf(name), 1);
        element.className = classes.join(' ');
    } else if (existing === name) {
        element.className = '';
    }
}
