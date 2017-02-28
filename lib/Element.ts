import { Dimension } from './Dimension';
import {
    viewportWidth,
    viewportHeight
} from './Document';

const TRANSITION_END_EVENTS: string[] = [
    'transitionend',
    'webkitTransitionEnd',
    'oTransitionEnd',
    'MSTransitionEnd'
];

export function repaint(element: HTMLElement): void {
    // tslint:disable-next-line
    element.offsetHeight;
}

export function translate(x: number, y: number): string {
    const has3d: boolean = require('has-translate3d');
    return has3d ? `translate3d(${x}px, ${y}px, 0)` : `translate(${x}px, ${y}px)`;
}

export function dimensions(element: HTMLElement): Dimension {
    let rect: ClientRect = element.getBoundingClientRect();
    return new Dimension(rect.left, rect.top, element.clientWidth, element.clientHeight);
}

export function addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    const hasTransitions: boolean = require('has-transitions');

    if (hasTransitions) {
        for (let eventName of TRANSITION_END_EVENTS) {
            element.addEventListener(eventName, listener);
        }
    } else {
        listener(new Event(TRANSITION_END_EVENTS[0]));
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let event of TRANSITION_END_EVENTS) {
        element.removeEventListener(event, listener);
    }
}

export function createDiv(className: string): HTMLDivElement {
    let overlay: HTMLDivElement = document.createElement('div');
    overlay.className = className;
    return overlay;
}

export function createClone(src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = 'zoom__clone';
    clone.src = src;
    return clone;
}

export function srcAttribute(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}

export function fillViewportScale(wrapper: HTMLElement, original: Dimension): number {
    let targetWidth: number = Number(wrapper.getAttribute('data-width') || Infinity);
    let targetHeight: number = Number(wrapper.getAttribute('data-height') || Infinity);
    let scaleX: number = Math.min(viewportWidth(), targetWidth) / original.width;
    let scaleY: number = Math.min(viewportHeight(), targetHeight) / original.height;
    return Math.min(scaleX, scaleY);
}
