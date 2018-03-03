import { Features } from '../../../src';
import * as vendor from '../../../src/browser/vendor';
import * as transform from '../../../src/element/transform';

describe('Features', () => {
    let style: any;

    beforeEach(() => {
        style = jasmine.createSpy('style');
    });

    describe('transformProperty', () => {
        it('should be the transform vendor property', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transform') {
                    return 'WebkitTransform';
                }
            });

            expect(Features.of(style).transformProperty).toBe('WebkitTransform');
        });
    });

    describe('transitionProperty', () => {
        it('should be the transition vendor property', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transition') {
                    return 'MozTransition';
                }
            });

            expect(Features.of(style).transitionProperty).toBe('MozTransition');
        });
    });

    describe('transitionProperty', () => {
        it('should be the transition vendor property', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transition') {
                    return 'MozTransition';
                }
            });

            expect(Features.of(style).transitionProperty).toBe('MozTransition');
        });
    });

    describe('transitionEndEvent', () => {
        it('should be the the end event of the corresponding transition vendor property', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transition') {
                    return 'msTransition';
                }
            });

            expect(Features.of(style).transitionEndEvent).toBe('MSTransitionEnd');
        });

        it('should be undefined if the transition vendor property is undefined', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property !== 'transition') {
                    return 'OTransition';
                }
            });

            expect(Features.of(style).transitionEndEvent).toBeUndefined();
        });
    });

    describe('hasTransform', () => {
        it('should be false if the transform vendor property is undefined', () => {
            spyOn(vendor, 'vendorProperty').and.returnValue(undefined);
            expect(Features.of(style).hasTransform).toBe(false);
        });

        it('should be true if the transform vendor property is defined', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transform') {
                    return 'MozTransform';
                }
            });

            expect(Features.of(style).hasTransform).toBe(true);
        });
    });

    describe('hasTransform3d', () => {
        it('should be false if the transform vendor property is undefined', () => {
            spyOn(vendor, 'vendorProperty').and.returnValue(undefined);
            expect(Features.of(style).hasTransform3d).toBe(false);
        });

        it('should be false if the transform vendor property is defined and supports3dTransformations returns false', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transform') {
                    return 'OTransform';
                }
            });
            spyOn(transform, 'supports3dTransformations').and.returnValue(false);

            expect(Features.of(style).hasTransform3d).toBe(false);
        });

        it('should be true if the transform vendor property is defined and supports3dTransformations returns true', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transform') {
                    return 'OTransform';
                }
            });
            spyOn(transform, 'supports3dTransformations').and.returnValue(true);

            expect(Features.of(style).hasTransform3d).toBe(true);
        });
    });

    describe('hasTransitions', () => {
        it('should be false if the vendor transition vendor property is undefined', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property !== 'transition') {
                    return 'OTransition';
                }
            });

            expect(Features.of(style).hasTransitions).toBe(false);
        });

        it('should be false if the transition vendor property has no corresponding end event', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transition') {
                    return 'InvalidTransition';
                }
            });

            expect(Features.of(style).hasTransitions).toBe(false);
        });

        it('should be true if there is a corresponding end event to the transition vendor property', () => {
            spyOn(vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string) => {
                if (property === 'transition') {
                    return 'WebkitTransition';
                }
            });

            expect(Features.of(style).hasTransitions).toBe(true);
        });
    });
});
