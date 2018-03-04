// import * as Element from '../../../lib/element/Element';
// import {
//     fullSrc,
//     isZoomable
// } from '../../../lib/dom/Image';
//
// describe('isZoomable', () => {
//     let config: any;
//
//     beforeEach(() => {
//         config = {
//             imageClass: 'zoom__element'
//         };
//     });
//
//     it('should return false if the target is not a HTMLImageElement', () => {
//         let target: any = 'target';
//         expect(isZoomable(config, target)).toBe(false);
//     });
//
//     it('should return false if the target does not have a parent', () => {
//         let target: HTMLImageElement = document.createElement('img');
//         spyOn(Element, 'hasParent').and.returnValue(false);
//         expect(isZoomable(config, target)).toBe(false);
//     });
//
//     it('should return false if the target does not have a grandparent', () => {
//         let target: HTMLImageElement = document.createElement('img');
//         spyOn(Element, 'hasGrandParent').and.returnValue(false);
//         expect(isZoomable(config, target)).toBe(false);
//     });
//
//     it('should return false if the target does not have the zoomable class', () => {
//         let target: HTMLImageElement = document.createElement('img');
//         target.className = 'invalid';
//         expect(isZoomable(config, target)).toBe(false);
//     });
//
//     it('should return true if the target is an HTMLImageElement with a parent, grandparent, and the zoomable class', () => {
//         let target: HTMLImageElement = document.createElement('img');
//         target.className = config.imageClass;
//         spyOn(Element, 'hasParent').and.returnValue(true);
//         spyOn(Element, 'hasGrandParent').and.returnValue(true);
//         expect(isZoomable(config, target)).toBe(true);
//     });
// });
//
// describe('fullSrc', () => {
//     it('should return the image’s src if the wrapper’s data-src attribute is null', () => {
//         let image: any = { src: 'example.jpeg' };
//         let wrapper: any = {
//             getAttribute: (): string | null => {
//                 return null;
//             }
//         };
//
//         expect(fullSrc(wrapper, image)).toBe('example.jpeg');
//     });
//
//     it('should return the wrapper’s data-src if non-null', () => {
//         let image: any = { src: '' };
//         let wrapper: any = {
//             getAttribute: (name: string): string | null => {
//                 if (name === 'data-src') {
//                     return 'example.png';
//                 } else {
//                     return null;
//                 }
//             }
//         };
//
//         expect(fullSrc(wrapper, image)).toBe('example.png');
//     });
// });
