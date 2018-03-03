// import { STANDARDS_MODE } from '../../../lib/browser/Document';
// import {
//     Bounds,
//     boundsOf,
//     createBounds,
//     resetBounds,
//     setBounds,
//     setBoundsPx
// } from '../../../lib/math/Bounds';
// import { centreBounds } from '../../../lib/math/Centre';
// import { Vector2 } from '../../../lib/math/Vector2';
//
// describe('createBounds', () => {
//     it('should construct a Bounds object', () => {
//         let expected: Bounds = {
//             position: [55, 60],
//             size: [100, 150]
//         };
//
//         expect(createBounds([55, 60], [100, 150])).toEqual(expected);
//     });
// });
//
// describe('boundsOf', () => {
//     it('should construct a Bounds object using the position and size of the rect', () => {
//         let rect: ClientRect = {
//             top: 300,
//             right: 5,
//             bottom: 50,
//             left: 120,
//             width: 99,
//             height: 100
//         };
//
//         let element: any = {
//             getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue(rect)
//         };
//
//         let expected: Bounds = {
//             position: [120, 300],
//             size: [99, 100]
//         };
//
//         expect(boundsOf(element)).toEqual(expected);
//     });
// });
//
// describe('setBounds', () => {
//     let style: any;
//
//     beforeAll(() => {
//         style = {
//             left: '50em',
//             top: '10px',
//             width: '150rem',
//             maxWidth: '200px',
//             height: ''
//         };
//
//         setBounds(style, '20px', '30px', '40px', '50px');
//     });
//
//     it('should set the left property', () => {
//         expect(style.left).toBe('20px');
//     });
//
//     it('should set the top property', () => {
//         expect(style.top).toBe('30px');
//     });
//
//     it('should set the width property', () => {
//         expect(style.width).toBe('40px');
//     });
//
//     it('should set the max-width property', () => {
//         expect(style.maxWidth).toBe('40px');
//     });
//
//     it('should set the height property', () => {
//         expect(style.height).toBe('50px');
//     });
// });
//
// describe('resetBounds', () => {
//     let style: any;
//
//     beforeAll(() => {
//         style = {
//             left: 'left',
//             top: 'top',
//             width: 'width',
//             maxWidth: 'max-width',
//             height: 'height'
//         };
//
//         resetBounds(style);
//     });
//
//     it('should reset the left property', () => {
//         expect(style.left).toBe('');
//     });
//
//     it('should reset the top property', () => {
//         expect(style.top).toBe('');
//     });
//
//     it('should reset the width property', () => {
//         expect(style.width).toBe('');
//     });
//
//     it('should reset the max-width property', () => {
//         expect(style.maxWidth).toBe('');
//     });
//
//     it('should reset the height property', () => {
//         expect(style.height).toBe('');
//     });
// });
//
// describe('setBoundsPx', () => {
//     let style: any;
//
//     beforeAll(() => {
//         style = {
//             left: '5em',
//             top: '2em',
//             width: '100px',
//             maxWidth: '200px',
//             height: '50px'
//         };
//
//         let bounds: Bounds = {
//             position: [20, 170],
//             size: [95, 240]
//         };
//
//         setBoundsPx(style, bounds);
//     });
//
//     it('should set the left property', () => {
//         expect(style.left).toBe('20px');
//     });
//
//     it('should set the top property', () => {
//         expect(style.top).toBe('170px');
//     });
//
//     it('should set the width property', () => {
//         expect(style.width).toBe('95px');
//     });
//
//     it('should set the max-width property', () => {
//         expect(style.maxWidth).toBe('95px');
//     });
//
//     it('should set the height property', () => {
//         expect(style.height).toBe('240px');
//     });
// });
//
// describe('centreOf', () => {
//     let actual: Bounds;
//
//     beforeAll(() => {
//         let document: any = {
//             compatMode: STANDARDS_MODE,
//             documentElement: {
//                 clientWidth: 1920,
//                 clientHeight: 1080
//             }
//         };
//
//         let target: Vector2 = [1200, 800];
//
//         let bounds: Bounds = {
//             position: [300, 50],
//             size: [600, 300]
//         };
//
//         actual = centreBounds(document, target, bounds);
//     });
//
//     it('should centre the position', () => {
//         expect(actual.position).toEqual([60, 190]);
//     });
//
//     it('should scale the size to fit the viewport', () => {
//         expect(actual.size).toEqual([1200, 600]);
//     });
// });
