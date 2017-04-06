import { TRANSFORM_PROPERTIES } from '../element/Transform';
import { TRANSITION_END_EVENTS } from '../element/Transition';
import { vendorProperty } from './Vendor';

export interface WindowCapabilities {
    readonly transformProperty: string | undefined;
    readonly transitionProperty: string | undefined;
    readonly transitionEndEvent: string | undefined;

    readonly hasTransform: boolean;
    readonly hasTransitions: boolean;
    readonly hasTranslate3d: boolean;
}

export function capabilitiesOf(window: Window): WindowCapabilities {
    let body: HTMLElement = document.body;
    let bodyStyle: CSSStyleDeclaration = body.style;

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
        hasTransitions = transitionEndEvent !== null;
    }

    let hasTranslate3d: boolean = false;
    if (transformProperty !== undefined) {
        hasTranslate3d = supportsTranslate3d(window, transformProperty);
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

export function supportsTranslate3d(window: Window, transformProperty: string): boolean {
    let computeStyle: any = window.getComputedStyle;
    let property: string = TRANSFORM_PROPERTIES[transformProperty];

    if (typeof computeStyle === 'function' && property !== undefined) {
        let document: Document = window.document;
        let body: HTMLElement = document.body;

        let child: HTMLParagraphElement = document.createElement('p');
        (child.style as any)[transformProperty] = 'translate3d(1px,1px,1px)';

        body.appendChild(child);
        let value: string = computeStyle(child).getPropertyValue(property);
        body.removeChild(child);

        return value.length > 0 && value !== 'none';
    } else {
        return false;
    }
}
