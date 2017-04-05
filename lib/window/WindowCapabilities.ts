import { TRANSITION_END_EVENTS } from '../element/Transition';
import { vendorProperty } from './Vendor';
import { hasTranslate3d as windowHasTranslate3d } from './Window';

export interface WindowCapabilities {
    transformProperty: string | undefined;
    transitionProperty: string | undefined;
    transitionEndEvent: string | undefined;

    hasTransform: boolean;
    hasTransitions: boolean;
    hasTranslate3d: boolean;
}

export function capabilitiesOf(window: Window): WindowCapabilities {
    let bodyStyle: CSSStyleDeclaration = document.body.style;

    let transformProperty: string | undefined = vendorProperty(bodyStyle, 'transform');
    let transitionProperty: string | undefined = vendorProperty(bodyStyle, 'transition');
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
        hasTranslate3d = windowHasTranslate3d(window, transformProperty);
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

