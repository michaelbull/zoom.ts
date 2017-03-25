import { addEventListener } from './Events';

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
    if (element.className.length === 0) {
        element.className = name;
    } else {
        element.className += ` ${name}`;
    }
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

export function createDiv(document: Document, className: string): HTMLDivElement {
    let overlay: HTMLDivElement = document.createElement('div');
    overlay.className = className;
    return overlay;
}

export function createClone(document: Document, src: string, loaded: EventListener): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = 'zoom__clone';
    clone.src = src;
    addEventListener(clone, 'load', loaded);
    return clone;
}

export function activateZoom(wrapper: HTMLElement, element: HTMLElement): void {
    addClass(wrapper, 'zoom--active');
    addClass(element, 'zoom__element--active');
}

export function deactivateZoom(wrapper: HTMLElement, element: HTMLElement): void {
    removeClass(wrapper, 'zoom--active');
    removeClass(element, 'zoom__element--active');
}

export function showClone(image: HTMLImageElement, clone: HTMLImageElement): void {
    addClass(image, 'zoom__element--hidden');
    addClass(clone, 'zoom__clone--visible');
}

export function hideClone(image: HTMLImageElement, clone: HTMLImageElement): void {
    removeClass(image, 'zoom__element--hidden');
    removeClass(clone, 'zoom__clone--visible');
}
