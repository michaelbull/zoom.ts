// import { detectFeaturesOf } from '../../../src/browser/features';
// import * as Vendor from '../../../src/browser/vendor';
// import * as Transform from '../../../src/element/transform';
//
// describe('detectFeaturesOf', () => {
//     describe('transformProperty', () => {
//         it('should be the transform vendor property', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transform') {
//                     return 'WebkitTransform';
//                 }
//             });
//
//             expect(detectFeaturesOf().transformProperty).toBe('WebkitTransform');
//         });
//     });
//
//     describe('transitionProperty', () => {
//         it('should be the transition vendor property', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transition') {
//                     return 'MozTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().transitionProperty).toBe('MozTransition');
//         });
//     });
//
//     describe('transitionProperty', () => {
//         it('should be the transition vendor property', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transition') {
//                     return 'MozTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().transitionProperty).toBe('MozTransition');
//         });
//     });
//
//     describe('transitionEndEvent', () => {
//         it('should be the the end event of the corresponding transition vendor property', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transition') {
//                     return 'msTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().transitionEndEvent).toBe('MSTransitionEnd');
//         });
//
//         it('should be undefined if the transition vendor property is undefined', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property !== 'transition') {
//                     return 'OTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().transitionEndEvent).toBeUndefined();
//         });
//     });
//
//     describe('hasTransform', () => {
//         it('should be false if the transform vendor property is undefined', () => {
//             spyOn(Vendor, 'vendorProperty').and.returnValue(undefined);
//             expect(detectFeaturesOf().hasTransform).toBe(false);
//         });
//
//         it('should be true if the transform vendor property is defined', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transform') {
//                     return 'MozTransform';
//                 }
//             });
//
//             expect(detectFeaturesOf().hasTransform).toBe(true);
//         });
//     });
//
//     describe('hasTransform3d', () => {
//         it('should be false if the transform vendor property is undefined', () => {
//             spyOn(Vendor, 'vendorProperty').and.returnValue(undefined);
//             expect(detectFeaturesOf().hasTransform3d).toBe(false);
//         });
//
//         it('should be false if the transform vendor property is defined and supports3dTransformations returns false', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transform') {
//                     return 'OTransform';
//                 }
//             });
//             spyOn(Transform, 'supports3dTransformations').and.returnValue(false);
//
//             expect(detectFeaturesOf().hasTransform3d).toBe(false);
//         });
//
//         it('should be true if the transform vendor property is defined and supports3dTransformations returns true', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transform') {
//                     return 'OTransform';
//                 }
//             });
//             spyOn(Transform, 'supports3dTransformations').and.returnValue(true);
//
//             expect(detectFeaturesOf().hasTransform3d).toBe(true);
//         });
//     });
//
//     describe('hasTransitions', () => {
//         it('should be false if the vendor transition vendor property is undefined', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property !== 'transition') {
//                     return 'OTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().hasTransitions).toBe(false);
//         });
//
//         it('should be false if the transition vendor property has no corresponding end event', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transition') {
//                     return 'InvalidTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().hasTransitions).toBe(false);
//         });
//
//         it('should be true if there is a corresponding end event to the transition vendor property', () => {
//             spyOn(Vendor, 'vendorProperty').and.callFake((style: CSSStyleDeclaration, property: string): string | undefined => {
//                 if (property === 'transition') {
//                     return 'WebkitTransition';
//                 }
//             });
//
//             expect(detectFeaturesOf().hasTransitions).toBe(true);
//         });
//     });
// });
