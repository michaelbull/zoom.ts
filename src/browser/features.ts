import {
    supports3dTransformations,
    TRANSITION_END_EVENTS
} from '../element';
import { vendorProperty } from './vendor';

export interface Features {
    readonly hasTransform: boolean;
    readonly hasTransform3d: boolean;
    readonly hasTransitions: boolean;
    readonly transformProperty?: string;
    readonly transitionProperty?: string;
    readonly transitionEndEvent?: string;
}

export function detectFeatures(style: CSSStyleDeclaration): Features {
    let transformProperty = vendorProperty(style, 'transform');
    let transitionProperty = vendorProperty(style, 'transition');
    let transitionEndEvent: string | undefined;

    let hasTransform = false;
    if (transformProperty !== undefined) {
        hasTransform = true;
    }

    let hasTransitions = false;
    if (transitionProperty !== undefined) {
        transitionEndEvent = TRANSITION_END_EVENTS[transitionProperty];
        hasTransitions = transitionEndEvent !== undefined;
    }

    let hasTransform3d = false;
    if (transformProperty !== undefined) {
        hasTransform3d = supports3dTransformations(document.body.style);
    }

    return {
        hasTransform,
        hasTransform3d,
        hasTransitions,
        transformProperty,
        transitionProperty,
        transitionEndEvent
    };
}
