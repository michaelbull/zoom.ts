import { detectFeatures } from '../../../lib/browser/Features';
import * as Vendor from '../../../lib/browser/Vendor';
import * as Transform from '../../../lib/element/Transform';

describe('detectFeatures', () => {
    describe('transformProperty', () => {
        it('should be the transform vendor property', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transform') {
                    return 'WebkitTransform';
                }
            });

            expect(detectFeatures().transformProperty).toBe('WebkitTransform');
        });
    });

    describe('transitionProperty', () => {
        it('should be the transition vendor property', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transition') {
                    return 'MozTransition';
                }
            });

            expect(detectFeatures().transitionProperty).toBe('MozTransition');
        });
    });

    describe('transitionEndEvent', () => {
        it('should be the the end event of the corresponding transition vendor property', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transition') {
                    return 'msTransition';
                }
            });

            expect(detectFeatures().transitionEndEvent).toBe('MSTransitionEnd');
        });

        it('should be undefined if the transition vendor property is undefined', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property !== 'transition') {
                    return 'OTransition';
                }
            });

            expect(detectFeatures().transitionEndEvent).toBeUndefined();
        });
    });

    describe('hasTransform', () => {
        it('should be false if the transform vendor property is undefined', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property !== 'transform') {
                    return '';
                }
            });

            expect(detectFeatures().hasTransform).toBe(false);
        });

        it('should be true if the transform vendor property is not undefined', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transform') {
                    return 'MozTransform';
                }
            });
            spyOn(Transform, 'supportsTranslate3d').and.returnValue(true);

            expect(detectFeatures().hasTransform).toBe(true);
        });
    });

    describe('hasTransitions', () => {
        it('should be false if the vendor transition vendor property is undefined', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property !== 'transition') {
                    return 'OTransition';
                }
            });

            expect(detectFeatures().hasTransitions).toBe(false);
        });

        it('should be false if the transition vendor property has no corresponding end event', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transition') {
                    return 'InvalidTransition';
                }
            });

            expect(detectFeatures().hasTransitions).toBe(false);
        });

        it('should be true if there is a corresponding end event to the transition vendor property', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transition') {
                    return 'WebkitTransition';
                }
            });

            expect(detectFeatures().hasTransitions).toBe(true);
        });
    });

    describe('hasTranslate3d', () => {
        it('should be false if the transform vendor property is undefined', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property !== 'transform') {
                    return 'OTransform';
                }
            });

            expect(detectFeatures().hasTranslate3d).toBe(false);
        });

        it('should be false if supportsTranslate3d returns false', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transform') {
                    return 'MsTransform';
                }
            });
            spyOn(Transform, 'supportsTranslate3d').and.returnValue(false);

            expect(detectFeatures().hasTranslate3d).toBe(false);
        });

        it('should be true if supportsTranslate3d returns true for the transform vendor property', () => {
            spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
                if (property === 'transform') {
                    return 'MozTransform';
                }
            });
            spyOn(Transform, 'supportsTranslate3d').and.returnValue(true);

            expect(detectFeatures().hasTranslate3d).toBe(true);
        });
    });
});
