import { Dimension } from './Dimension';
import {
    viewportWidth,
    viewportHeight
} from './Document';

const hasTransitions: boolean = require('has-transitions');
const has3d: boolean = require('has-translate3d');

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
    return has3d ? `translate3d(${x}px, ${y}px, 0)` : `translate(${x}px, ${y}px)`;
}

export function dimensions(element: HTMLElement): Dimension {
    let rect: ClientRect = element.getBoundingClientRect();
    return new Dimension(rect.left, rect.top, element.clientWidth, element.clientHeight);
}

export function addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
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

export function srcAttribute(element: HTMLImageElement): string {
    let parent: HTMLElement | null = element.parentElement;

    if (parent !== null) {
        let attribute: string | null = parent.getAttribute('data-src');

        if (attribute !== null) {
            return attribute;
        }
    }

    return element.src as string;
}

export function fillViewportScale(container: HTMLElement, original: Dimension): number {
    let targetWidth: number = Number(container.getAttribute('data-width') || Infinity);
    let targetHeight: number = Number(container.getAttribute('data-height') || Infinity);
    let scaleX: number = Math.min(viewportWidth(), targetWidth) / original.width;
    let scaleY: number = Math.min(viewportHeight(), targetHeight) / original.height;
    return Math.min(scaleX, scaleY);
}
