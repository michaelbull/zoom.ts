// import {
//     clientSize,
//     hasGrandParent,
//     hasParent,
//     resetStyle,
//     targetDimension,
//     targetSize
// } from '../../../lib/element/Element';
//
// describe('clientSize', () => {
//     it('should return the width and height', () => {
//         let element: any = {
//             clientWidth: 330,
//             clientHeight: 440
//         };
//
//         expect(clientSize(element)).toEqual([330, 440]);
//     });
// });
//
// describe('targetDimension', () => {
//     it('should return Infinity if the attribute is null', () => {
//         let element: any = {
//             getAttribute: (): string | null => {
//                 return null;
//             }
//         };
//
//         expect(targetDimension(element, '')).toBe(Infinity);
//     });
//
//     it('should return Infinity if the attribute is NaN', () => {
//         let element: any = {
//             getAttribute: (): string | null => {
//                 return 'not a number';
//             }
//         };
//
//         expect(targetDimension(element, '')).toBe(Infinity);
//     });
//
//     it('should return the numeric value if the attribute is a number', () => {
//         let element: any = {
//             getAttribute: (): string | null => {
//                 return '503';
//             }
//         };
//
//         expect(targetDimension(element, '')).toBe(503);
//     });
// });
//
// describe('targetSize', () => {
//     it('should return the width and height', () => {
//         let element: any = {
//             getAttribute: (name: string): string | null => {
//                 if (name === 'data-width') {
//                     return '1920';
//                 } else if (name === 'data-height') {
//                     return '1080';
//                 } else {
//                     return null;
//                 }
//             }
//         };
//
//         expect(targetSize(element)).toEqual([1920, 1080]);
//     });
// });
//
// describe('resetStyle', () => {
//     it('should set the style property to an empty string', () => {
//         let element: any = {
//             style: {
//                 width: '500px'
//             }
//         };
//
//         resetStyle(element, 'width');
//
//         expect(element.style.width).toBe('');
//     });
// });
//
// describe('hasParent', () => {
//     it('should return false if the parent is null', () => {
//         let element: any = { parentElement: null };
//         expect(hasParent(element)).toBe(false);
//     });
//
//     it('should return true if the parent is non-null', () => {
//         let element: any = { parentElement: 'parent' };
//         expect(hasParent(element)).toBe(true);
//     });
// });
//
// describe('hasGrandParent', () => {
//     it('should return false if the parent is null', () => {
//         let element: any = { parentElement: null };
//         expect(hasGrandParent(element)).toBe(false);
//     });
//
//     it('should return false if the parent is non-null and the grandparent is null', () => {
//         let element: any = {
//             parentElement: {
//                 parentElement: null
//             }
//         };
//         expect(hasGrandParent(element)).toBe(false);
//     });
//
//     it('should return true if the parent is non-null and the grandparent is non-null', () => {
//         let element: any = {
//             parentElement: {
//                 parentElement: 'grandparent'
//             }
//         };
//         expect(hasGrandParent(element)).toBe(true);
//     });
// });
