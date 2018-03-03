// import * as Element from '../../../lib/element/Element';
// import { ignoreTransitions } from '../../../lib/element/style/Transition';
//
// describe('ignoreTransitions', () => {
//     it('should set the transition property to initial before calling the callback', () => {
//         let element: any = {
//             style: {
//                 transition: 'example'
//             }
//         };
//         spyOn(Element, 'repaint');
//         spyOn(Element, 'resetStyle');
//
//         ignoreTransitions(element, 'transition', () => {
//             expect(element.style.transition).toBe('initial');
//         });
//     });
//
//     it('should repaint the element after calling the callback', () => {
//         let element: any = {
//             style: {
//                 transition: 'example'
//             }
//         };
//         let callback: jasmine.Spy = jasmine.createSpy('callback');
//         let repaint: jasmine.Spy = spyOn(Element, 'repaint').and.callFake(() => {
//             expect(callback).toHaveBeenCalled();
//         });
//         spyOn(Element, 'resetStyle');
//
//         ignoreTransitions(element, 'transition', callback);
//
//         expect(repaint).toHaveBeenCalledWith(element);
//     });
//
//     it('should reset the transition property after calling the callback and repainting', () => {
//         let element: any = {
//             style: {
//                 transition: 'example'
//             }
//         };
//         let callback: jasmine.Spy = jasmine.createSpy('callback');
//         let repaint: jasmine.Spy = spyOn(Element, 'repaint');
//         let resetStyle: jasmine.Spy = spyOn(Element, 'resetStyle').and.callFake(() => {
//             expect(callback).toHaveBeenCalled();
//             expect(repaint).toHaveBeenCalled();
//         });
//
//         ignoreTransitions(element, 'transition', callback);
//
//         expect(resetStyle).toHaveBeenCalledWith(element, 'transition');
//     });
// });
