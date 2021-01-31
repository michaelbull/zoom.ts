import { TRANSITION_END_EVENTS } from '../dom/element';
import { Features } from './Features';
import { hasTransform3d } from './hasTransform3d';
import { vendorProperty } from './vendorProperty';

export function detectFeatures(style: CSSStyleDeclaration): Features {
    let transformProperty = vendorProperty(style, 'transform');
    let transitionProperty = vendorProperty(style, 'transition');

    let transform = false;
    if (transformProperty !== undefined) {
        transform = true;
    }

    let transitions = false;
    let transitionEndEvent: string | undefined;
    if (transitionProperty !== undefined) {
        transitionEndEvent = TRANSITION_END_EVENTS[transitionProperty];
        transitions = transitionEndEvent !== undefined;
    }

    let transform3d = false;
    if (transformProperty !== undefined) {
        transform3d = hasTransform3d(document.body.style);
    }

    return {
        transform,
        transform3d,
        transitions,
        transformProperty,
        transitionProperty,
        transitionEndEvent
    };
}
