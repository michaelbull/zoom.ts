import { supports3dTransformations } from '../element/transform';
import { TRANSITION_END_EVENTS } from '../element/transition';
import { vendorProperty } from './vendor';

export class Features {
    static of(style: CSSStyleDeclaration): Features {
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

        return new Features(
            hasTransform,
            hasTransform3d,
            hasTransitions,
            transformProperty,
            transitionProperty,
            transitionEndEvent
        );
    }

    readonly hasTransform: boolean;
    readonly hasTransform3d: boolean;
    readonly hasTransitions: boolean;
    readonly transformProperty?: string;
    readonly transitionProperty?: string;
    readonly transitionEndEvent?: string;

    constructor(
        hasTransform: boolean,
        hasTransform3d: boolean,
        hasTransitions: boolean,
        transformProperty?: string,
        transitionProperty?: string,
        transitionEndEvent?: string
    ) {
        this.hasTransform = hasTransform;
        this.hasTransform3d = hasTransform3d;
        this.hasTransitions = hasTransitions;
        this.transformProperty = transformProperty;
        this.transitionProperty = transitionProperty;
        this.transitionEndEvent = transitionEndEvent;
    }
}
