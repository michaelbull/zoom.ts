import { listeners } from './EventListeners';
const transform: any = require('transform-property');

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

function hasTransitions(element?: HTMLElement): boolean {
    const PROPERTIES: string[] = [
        'transitionDuration',
        'MozTransitionDuration',
        'WebkitTransitionDuration'
    ];

    let supportedProperties: string[] = PROPERTIES.filter((type: string) => type in document.body.style);

    if (supportedProperties.length < 1) {
        return false;
    }

    if (element === undefined) {
        return true;
    }

    let property: string = supportedProperties[0];
    let style: any = getComputedStyle(element);
    let duration: any = style[property];
    return duration.length > 0 && parseFloat(duration) !== 0;
}

export function addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    if (hasTransitions(element)) {
        for (let eventName of TRANSITION_END_EVENTS) {
            listeners.add(element, eventName, listener);
        }
    } else {
        listener(new Event(TRANSITION_END_EVENTS[0]));
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let eventName of TRANSITION_END_EVENTS) {
        listeners.remove(element, eventName, listener);
    }
}

export function srcAttribute(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}
