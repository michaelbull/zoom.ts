import { isCloneVisible } from '../../../lib/element/Clone';
import { isImageHidden } from '../../../lib/element/Image';
import {
    cloneLoaded,
    ESCAPE_KEY_CODE,
    escKeyPressed,
    scrolled
} from '../../../lib/event/EventListeners';

describe('escKeyPressed', () => {
    let listener: EventListener;
    let callback: jasmine.Spy;

    beforeEach(() => {
        callback = jasmine.createSpy('callback');
        listener = escKeyPressed(callback);
    });

    describe('if a key other than escape was pressed', () => {
        let event: any;

        beforeAll(() => {
            event = {
                keyCode: 55,
                preventDefault: jasmine.createSpy('preventDefault')
            };
        });

        it('should not prevent the event from propagating further', () => {
            listener(event);
            expect(event.preventDefault).toHaveBeenCalledTimes(0);
        });

        it('should not execute the callback', () => {
            listener(event);
            expect(callback).toHaveBeenCalledTimes(0);
        });
    });

    describe('if the escape key was pressed', () => {
        let event: any;

        beforeAll(() => {
            event = {
                keyCode: ESCAPE_KEY_CODE,
                preventDefault: jasmine.createSpy('preventDefault')
            };
        });

        it('should prevent the event from propagating further', () => {
            listener(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should execute the callback', () => {
            listener(event);
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('scrolled', () => {
    let event: any;
    let callback: jasmine.Spy;

    beforeEach(() => {
        event = jasmine.createSpy('event');
        callback = jasmine.createSpy('callback');
    });

    it('should execute the callback if the scroll delta is greater than the minimum delta', () => {
        let listener: EventListener = scrolled(50, 70, callback, () => 200);
        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should execute the callback if the scroll delta is equal to the minimum delta', () => {
        let listener: EventListener = scrolled(100, 100, callback, () => 200);
        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should not execute the callback if the scroll delta is less than the minimum delta', () => {
        let listener: EventListener = scrolled(100, 100, callback, () => 199);
        listener(event);
        expect(callback).toHaveBeenCalledTimes(0);
    });
});

describe('cloneLoaded', () => {
    describe('if the wrapper is not expanded', () => {
        let clone: any;
        let image: any;
        let listener: EventListener;

        beforeEach(() => {
            let wrapper: any = { className: '' };
            image = { className: '' };
            clone = {
                className: '',
                removeEventListener: jasmine.createSpy('removeEventListener')
            };

            let event: any = {};

            listener = cloneLoaded(wrapper, image, clone);
            listener(event);
        });

        it('should remove itself', () => {
            expect(clone.removeEventListener).toHaveBeenCalledWith('load', listener);
        });

        it('should keep the image visible', () => {
            expect(isImageHidden(image)).toBe(false);
        });

        it('should keep the clone hidden', () => {
            expect(isCloneVisible(clone)).toBe(false);
        });
    });

    describe('if the wrapper is expanded', () => {
        let wrapper: any;
        let clone: any;
        let listener: EventListener;

        beforeEach(() => {
            wrapper = { className: 'zoom--expanded' };
            clone = {
                className: '',
                removeEventListener: jasmine.createSpy('removeEventListener')
            };
        });

        describe('and the clone is visible', () => {
            let clone: any;
            let image: any;

            beforeEach(() => {
                clone = {
                    className: 'zoom__clone--visible',
                    removeEventListener: jasmine.createSpy('removeEventListener')
                };
                image = { className: 'zoom__element--hidden' };

                let event: any = {};

                listener = cloneLoaded(wrapper, image, clone);
                listener(event);
            });

            it('should remove itself', () => {
                expect(clone.removeEventListener).toHaveBeenCalledWith('load', listener);
            });

            it('should keep the image hidden', () => {
                expect(isImageHidden(image)).toBe(true);
            });

            it('should keep the clone visible', () => {
                expect(isCloneVisible(clone)).toBe(true);
            });
        });

        describe('and the clone is not visible', () => {
            let clone: any;
            let image: any;

            beforeEach(() => {
                clone = {
                    className: '',
                    removeEventListener: jasmine.createSpy('removeEventListener')
                };
                image = { className: '' };

                let event: any = {};

                listener = cloneLoaded(wrapper, image, clone);
                listener(event);
            });

            it('should remove itself', () => {
                expect(clone.removeEventListener).toHaveBeenCalledWith('load', listener);
            });

            it('should hide the image', () => {
                expect(isImageHidden(image)).toBe(true);
            });

            it('should show the clone', () => {
                expect(isCloneVisible(clone)).toBe(true);
            });
        });
    });
});

// describe('collapsed', () => {
//     let overlay: any;
//     let window: any;
//     let wrapper: any;
//     let container: any;
//     let image: any;
//     let clone: any;
//     let listener: EventListener;
//
//     beforeEach(() => {
//         overlay = { className: '' };
//         window = {
//             document: {
//                 body: {
//                     removeChild: jasmine.createSpy('removeChild')
//                 }
//             }
//         };
//         wrapper = {
//             className: 'wrapper zoom--collapsing',
//             style: {
//                 height: '50px'
//             }
//         };
//         container = { removeEventListener: jasmine.createSpy('removeEventListener') };
//         image = { className: 'image zoom__element--active zoom__element--hidden' };
//         clone = { className: 'zoom__clone--visible' };
//
//         let event: any = {};
//
//         listener = collapsed(overlay, window, wrapper, container, image, clone);
//         listener(event);
//     });
//
//     it('should remove itself', () => {
//         expect(container.removeEventListener).toHaveBeenCalledWith('transitionend', listener);
//     });
//
//     it('should remove the overlay', () => {
//         expect(window.document.body.removeChild).toHaveBeenCalledWith(overlay);
//     });
//
//     it('should stop collapsing the wrapper', () => {
//         expect(isWrapperCollapsing(wrapper)).toBe(false);
//     });
//
//     it('should clear the height of the wrapper', () => {
//         expect(wrapper.style.height).toBe('');
//     });
//
//     it('should show the image', () => {
//         expect(isImageHidden(image)).toBe(false);
//     });
//
//     it('should set the image to inactive', () => {
//         expect(isImageActive(image)).toBe(false);
//     });
//
//     it('should hide the clone', () => {
//         expect(isCloneVisible(clone)).toBe(false);
//     });
// });
