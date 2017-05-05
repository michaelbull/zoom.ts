import * as ClassList from '../../../lib/element/ClassList';
import {
    addClass,
    removeClass
} from '../../../lib/element/ClassList';
import {
    CLASS,
    createClone,
    hideClone,
    isCloneLoaded,
    isCloneVisible,
    LOADED_CLASS,
    replaceCloneWithImage,
    replaceImageWithClone,
    showClone,
    showCloneOnceLoaded,
    VISIBLE_CLASS
} from '../../../lib/element/Clone';
import {
    HIDDEN_CLASS,
    isImageHidden
} from '../../../lib/element/Image';
import * as Wrapper from '../../../lib/element/Wrapper';
import { fireEventListener } from '../../../lib/event/EventListener';

describe('createClone', () => {
    let element: any;
    let listener: EventListener;
    let clone: any;

    beforeEach(() => {
        element = {
            addEventListener: jasmine.createSpy('addEventListener').and.callFake((event: string, evtListener: EventListener) => {
                listener = evtListener;
            }),
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        spyOn(document, 'createElement').and.returnValue(element);

        clone = createClone('dummy-src');
    });

    it('should create an img element', () => {
        expect(document.createElement).toHaveBeenCalledWith('img');
    });

    it('should set the className', () => {
        expect(clone.className).toBe(CLASS);
    });

    it('should set the src', () => {
        expect(clone.src.indexOf('dummy-src') === -1).toBe(false);
    });

    it('should add a load event listener', () => {
        expect(element.addEventListener).toHaveBeenCalledWith('load', listener, false);
    });

    describe('when the loaded event is fired', () => {
        let event: any;

        beforeEach(() => {
            event = {};
            listener(event);
        });

        it('should remove the load event listener', () => {
            expect(clone.removeEventListener).toHaveBeenCalledWith('load', listener);
        });

        it('should add the loaded class', () => {
            expect(isCloneLoaded(clone)).toBe(true);
        });
    });
});

describe('showCloneOnceLoaded', () => {
    let event: any;
    let addClass: jasmine.Spy;

    beforeEach(() => {
        event = jasmine.createSpy('event');
        addClass = spyOn(ClassList, 'addClass');
    });

    it('should not show the clone if the clone is undefined', () => {
        let elements: any = {};
        let listener: EventListener = showCloneOnceLoaded(elements);
        spyOn(Wrapper, 'isWrapperExpanded').and.returnValue(true);

        fireEventListener(listener, event);

        expect(addClass).toHaveBeenCalledTimes(0);
    });

    it('should not show the clone if the wrapper is not expanded', () => {
        let elements: any = {
            clone: {
                className: 'clone'
            }
        };
        let listener: EventListener = showCloneOnceLoaded(elements);
        spyOn(Wrapper, 'isWrapperExpanded').and.returnValue(false);

        fireEventListener(listener, event);

        expect(addClass).toHaveBeenCalledTimes(0);
    });

    it('should not show the clone if the clone is already visible', () => {
        let elements: any = {
            clone: {
                className: `clone ${VISIBLE_CLASS}`
            }
        };
        let listener: EventListener = showCloneOnceLoaded(elements);
        spyOn(Wrapper, 'isWrapperExpanded').and.returnValue(true);

        fireEventListener(listener, event);

        expect(addClass).toHaveBeenCalledTimes(0);
    });

    it('should show the clone if the wrapper is expanded and the clone is not already visible', () => {
        let elements: any = {
            clone: {
                className: 'clone'
            }
        };
        let listener: EventListener = showCloneOnceLoaded(elements);
        spyOn(Wrapper, 'isWrapperExpanded').and.returnValue(true);

        fireEventListener(listener, event);

        expect(addClass).toHaveBeenCalledTimes(2);
    });
});

describe('showClone', () => {
    it('should add the visible class', () => {
        let clone: jasmine.Spy = jasmine.createSpy('clone');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');

        showClone(clone as any);

        expect(addClass).toHaveBeenCalledWith(clone, VISIBLE_CLASS);
    });
});

describe('hideClone', () => {
    it('should remove the visible class', () => {
        let clone: jasmine.Spy = jasmine.createSpy('clone');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        hideClone(clone as any);

        expect(removeClass).toHaveBeenCalledWith(clone, VISIBLE_CLASS);
    });
});

describe('isCloneVisible', () => {
    it('should return true if the visible class is present', () => {
        let clone: any = { className: VISIBLE_CLASS };
        expect(isCloneVisible(clone)).toBe(true);
    });

    it('should return false if the visible class is absent', () => {
        let clone: any = { className: '' };
        expect(isCloneVisible(clone)).toBe(false);
    });
});

describe('isCloneLoaded', () => {
    it('should return true if the loaded class is present', () => {
        let clone: any = { className: LOADED_CLASS };
        expect(isCloneLoaded(clone)).toBe(true);
    });

    it('should return false if the loaded class is absent', () => {
        let clone: any = { className: '' };
        expect(isCloneLoaded(clone)).toBe(false);
    });
});

describe('replaceImageWithClone', () => {
    it('should show the clone before hiding the image', () => {
        let image: any = { className: 'image' };
        let clone: any = { className: 'clone' };
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((element: HTMLElement) => {
            if (element === clone) {
                expect(isImageHidden(image)).toBe(false);
            }
        });

        replaceImageWithClone(image, clone);

        expect(addClass).toHaveBeenCalledTimes(2);
    });

    it('should hide the image after showing the clone', () => {
        let image: any = { className: 'image' };
        let clone: any = { className: 'clone' };
        let original: Function = ClassList.addClass;
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((element: HTMLElement, add: string) => {
            if (element === image) {
                expect(isCloneVisible(clone)).toBe(true);
            } else {
                original(element, add);
            }
        });

        replaceImageWithClone(image, clone);

        expect(addClass).toHaveBeenCalledTimes(2);
    });
});

describe('replaceCloneWithImage', () => {
    it('should show the image before hiding the clone', () => {
        let image: any = { className: `image ${HIDDEN_CLASS}` };
        let clone: any = { className: `clone ${VISIBLE_CLASS}` };
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass').and.callFake((element: HTMLElement) => {
            if (element === image) {
                expect(isCloneVisible(clone)).toBe(true);
            }
        });

        replaceCloneWithImage(image, clone);

        expect(removeClass).toHaveBeenCalledTimes(2);
    });

    it('should hide the clone after showing the image', () => {
        let image: any = { className: `image ${HIDDEN_CLASS}` };
        let clone: any = { className: `clone ${VISIBLE_CLASS}` };
        let original: Function = ClassList.removeClass;
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass').and.callFake((element: HTMLElement, remove: string) => {
            if (element === clone) {
                expect(isImageHidden(image)).toBe(false);
            } else {
                original(element, remove);
            }
        });

        replaceCloneWithImage(image, clone);

        expect(removeClass).toHaveBeenCalledTimes(2);
    });
});
