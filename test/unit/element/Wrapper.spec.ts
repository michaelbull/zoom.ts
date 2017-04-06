// import {
//     startCollapsingWrapper,
//     COLLAPSING_CLASS,
//     EXPANDED_CLASS,
//     EXPANDING_CLASS,
//     startExpandingWrapper,
//     stopCollapsingWrapper,
//     finishExpandingWrapper,
//     isWrapperCollapsing,
//     isWrapperExpanded,
//     isWrapperExpanding,
//     isWrapperTransitioning,
//     resolveSrc,
//     stopExpandingWrapper
// } from '../../../lib/element/Wrapper';
//
// describe('resolveSrc', () => {
//     let element: HTMLElement;
//
//     beforeEach(() => {
//         element = document.createElement('div');
//     });
//
//     it('should return the value of the data-src attribute if present', () => {
//         let image: any = {};
//         element.setAttribute('data-src', 'test-value');
//         expect(resolveSrc(element, image)).toBe('test-value');
//     });
//
//     it('should return the src of the image if the data-src attribute is absent', () => {
//         let image: any = { src: 'example-src' };
//         expect(resolveSrc(element, image)).toBe('example-src');
//     });
// });
//
// describe('isWrapperExpanding', () => {
//     it('should return true if the expanding class is present', () => {
//         let wrapper: any = { className: EXPANDING_CLASS };
//         expect(isWrapperExpanding(wrapper)).toBe(true);
//     });
//
//     it('should return false if the expanding class is absent', () => {
//         let wrapper: any = { className: '' };
//         expect(isWrapperExpanding(wrapper)).toBe(false);
//     });
// });
//
// describe('isWrapperExpanded', () => {
//     it('should return true if the expanded class is present', () => {
//         let wrapper: any = { className: EXPANDED_CLASS };
//         expect(isWrapperExpanded(wrapper)).toBe(true);
//     });
//
//     it('should return false if the expanded class is absent', () => {
//         let wrapper: any = { className: '' };
//         expect(isWrapperExpanded(wrapper)).toBe(false);
//     });
// });
//
// describe('isWrapperCollapsing', () => {
//     it('should return true if the collapsing class is present', () => {
//         let wrapper: any = { className: COLLAPSING_CLASS };
//         expect(isWrapperCollapsing(wrapper)).toBe(true);
//     });
//
//     it('should return false if the collapsing class is absent', () => {
//         let wrapper: any = { className: '' };
//         expect(isWrapperCollapsing(wrapper)).toBe(false);
//     });
// });
//
// describe('isWrapperTransitioning', () => {
//     it('should return true if the expanding class is present', () => {
//         let wrapper: any = { className: EXPANDING_CLASS };
//         expect(isWrapperTransitioning(wrapper)).toBe(true);
//     });
//
//     it('should return true if the collapsing class is present', () => {
//         let wrapper: any = { className: COLLAPSING_CLASS };
//         expect(isWrapperTransitioning(wrapper)).toBe(true);
//     });
//
//     it('should return false if neither the expanding nor collapsing classes are present', () => {
//         let wrapper: any = { className: '' };
//         expect(isWrapperTransitioning(wrapper)).toBe(false);
//     });
// });
//
// describe('startExpandingWrapper', () => {
//     it('should add the expanding class', () => {
//         let wrapper: any = {
//             className: '',
//             style: {}
//         };
//
//         startExpandingWrapper(wrapper);
//         expect(isWrapperExpanding(wrapper)).toBe(true);
//     });
//
//     it('should set the height in pixels', () => {
//         let wrapper: any = {
//             className: '',
//             style: {}
//         };
//
//         startExpandingWrapper(wrapper);
//         expect(wrapper.style.height).toBe('50px');
//     });
// });
//
// describe('stopExpandingWrapper', () => {
//     it('should remove the expanding class', () => {
//         let wrapper: any = { className: EXPANDING_CLASS };
//         stopExpandingWrapper(wrapper);
//         expect(isWrapperExpanding(wrapper)).toBe(false);
//     });
// });
//
// describe('finishExpandingWrapper', () => {
//     it('should remove the expanding class', () => {
//         let wrapper: any = { className: EXPANDING_CLASS };
//         finishExpandingWrapper(wrapper);
//         expect(isWrapperExpanding(wrapper)).toBe(false);
//     });
//
//     it('should add the expanded class', () => {
//         let wrapper: any = { className: EXPANDING_CLASS };
//         finishExpandingWrapper(wrapper);
//         expect(isWrapperExpanded(wrapper)).toBe(true);
//     });
// });
//
// describe('startCollapsingWrapper', () => {
//     it('should remove the expanded class', () => {
//         let wrapper: any = { className: EXPANDED_CLASS };
//         startCollapsingWrapper(wrapper);
//         expect(isWrapperExpanded(wrapper)).toBe(false);
//     });
//
//     it('should add the collapsing class', () => {
//         let wrapper: any = { className: EXPANDED_CLASS };
//         startCollapsingWrapper(wrapper);
//         expect(isWrapperCollapsing(wrapper)).toBe(true);
//     });
// });
//
// describe('stopCollapsingWrapper', () => {
//     it('should remove the collapsing class', () => {
//         let wrapper: any = {
//             className: COLLAPSING_CLASS,
//             style: {}
//         };
//
//         stopCollapsingWrapper(wrapper);
//         expect(isWrapperCollapsing(wrapper)).toBe(false);
//     });
//
//     it('should reset the height', () => {
//         let wrapper: any = {
//             className: COLLAPSING_CLASS,
//             style: {
//                 height: '500px'
//             }
//         };
//
//         stopCollapsingWrapper(wrapper);
//         expect(wrapper.style.height).toBe('');
//     });
// });
