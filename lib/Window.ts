import { rootElement } from './Document';
import { vendorProperty } from './Vendor';

export function hasTransitions(window: Window, element: HTMLElement): boolean {
    let computeStyle: any = window.getComputedStyle;
    let property: string | null = vendorProperty(element.style, 'transitionDuration');

    if (typeof computeStyle === 'function' && property !== null) {
        let value: string = computeStyle(element)[property];
        let duration: number = parseFloat(value);
        return !isNaN(duration) && duration !== 0;
    } else {
        return false;
    }
}

export const TRANSFORM_PROPERTIES: { [key: string]: string } = {
    WebkitTransform: '-webkit-transform',
    MozTransform: '-moz-transform',
    msTransform: '-ms-transform',
    OTransform: '-o-transform',
    transform: 'transform'
};

export const TRANSITION_END_EVENTS: { [key: string]: string } = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
    transition: 'transitionend'
};

export function hasTranslate3d(window: Window, transformProperty: string): boolean {
    let computeStyle: any = window.getComputedStyle;
    let property: string = TRANSFORM_PROPERTIES[transformProperty];

    if (typeof computeStyle === 'function' && property !== undefined) {
        let document: Document = window.document;

        let child: HTMLParagraphElement = document.createElement('p');
        (child.style as any)[transformProperty] = 'translate3d(1px,1px,1px)';

        let body: HTMLElement = document.body;
        body.appendChild(child);

        let value: string = computeStyle(child).getPropertyValue(property);
        body.removeChild(child);

        return value.length > 0 && value !== 'none';
    } else {
        return false;
    }
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
