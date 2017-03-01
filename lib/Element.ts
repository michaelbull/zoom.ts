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

export function srcAttribute(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}
