import { repaint } from './Element';

export const TRANSITION_END_EVENTS: { [key: string]: string } = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
    transition: 'transitionend'
};

/**
 * Ignore the transition lifecycle to perform a callback, then restore the element's original transitions.
 */
export function ignoreTransitions(element: HTMLElement, transitionProperty: string, callback: Function): void {
    let style: any = element.style;

    style[transitionProperty] = 'initial';
    callback();
    repaint(element);
    style[transitionProperty] = '';
}
