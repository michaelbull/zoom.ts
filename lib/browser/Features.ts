import { supportsTranslate3d } from '../element/Transform';
import { TRANSITION_END_EVENTS } from '../element/Transition';
import { vendorProperty } from './Vendor';

export interface Features {
    readonly transformProperty: string | undefined;
    readonly transitionProperty: string | undefined;
    readonly transitionEndEvent: string | undefined;

    readonly hasTransform: boolean;
    readonly hasTransitions: boolean;
    readonly hasTranslate3d: boolean;
}

export function detectFeatures(): Features {
    let style: CSSStyleDeclaration = document.body.style;
    let transformProperty: string | undefined = vendorProperty(style, 'transform');
    let transitionProperty: string | undefined = vendorProperty(style, 'transition');
    let transitionEndEvent: string | undefined;

    let hasTransform: boolean = false;
    if (transformProperty !== undefined) {
        hasTransform = true;
    }

    let hasTransitions: boolean = false;
    if (transitionProperty !== undefined) {
        transitionEndEvent = TRANSITION_END_EVENTS[transitionProperty];
        hasTransitions = transitionEndEvent !== undefined;
    }

    let hasTranslate3d: boolean = false;
    if (transformProperty !== undefined) {
        hasTranslate3d = supportsTranslate3d(transformProperty);
    }

    return {
        transformProperty,
        transitionProperty,
        transitionEndEvent,
        hasTransform,
        hasTransitions,
        hasTranslate3d
    };
}
