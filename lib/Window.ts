import { rootElement } from './Document';
import { vendorProperty } from './Vendor';

export function hasTransitions(window: Window, element: HTMLElement): boolean {
    if (window.getComputedStyle === undefined) {
        return false;
    }

    let property: string | null = vendorProperty(element.style, 'transitionDuration');

    if (property === null) {
        return false;
    }

    let style: any = window.getComputedStyle(element);
    let value: string = style[property];

    if (value === '') {
        return false;
    }

    let duration: number = parseFloat(value);
    return !isNaN(duration) && duration !== 0;
}

export function hasTranslate3d(window: Window, transformProperty: string): boolean {
    if (typeof window.getComputedStyle !== 'function') {
        return false;
    }

    let map: { [key: string]: string } = {
        WebkitTransform: '-webkit-transform',
        MozTransform: '-moz-transform',
        msTransform: '-ms-transform',
        OTransform: '-o-transform',
        transform: 'transform'
    };

    if (!(transformProperty in map)) {
        return false;
    }

    let child: HTMLDivElement = window.document.createElement('div');
    let style: any = child.style;

    style[transformProperty] = 'translate3d(1px,1px,1px)';
    window.document.body.appendChild(child);

    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(child);
    let value: string = computedStyle.getPropertyValue(map[transformProperty as string]);
    window.document.body.removeChild(child);

    return value.length > 0 && value !== 'none';
}

/**
 * Calculates the number of pixels in the document have been scrolled past vertically.
 * @returns {number} The number of pixels in the document have been scrolled past vertically.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
export function pageScrollY(window: Window): number {
    if (window.pageYOffset === undefined) { // <IE9
        return rootElement(window.document).scrollTop;
    } else {
        return window.pageYOffset;
    }
}
