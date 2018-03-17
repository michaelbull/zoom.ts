export declare const TRANSITION_END_EVENTS: {
    [key: string]: string;
};
/**
 * Ignore the transition lifecycle to perform a callback, then restore the element's original transitions.
 */
export declare function ignoreTransitions(element: HTMLElement, transitionProperty: string, callback: () => void): void;
