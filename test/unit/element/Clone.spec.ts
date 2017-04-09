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
    VISIBLE_CLASS
} from '../../../lib/element/Clone';
import {
    HIDDEN_CLASS,
    isImageHidden
} from '../../../lib/element/Image';

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

    it('should assign the className', () => {
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
    it('should call hasClass with the visible class', () => {
        let clone: jasmine.Spy = jasmine.createSpy('clone');
        let hasClass: jasmine.Spy = spyOn(ClassList, 'hasClass');

        isCloneVisible(clone as any);

        expect(hasClass).toHaveBeenCalledWith(clone, VISIBLE_CLASS);
    });
});

describe('isCloneLoaded', () => {
    it('should call hasClass with the visible class', () => {
        let clone: jasmine.Spy = jasmine.createSpy('clone');
        let hasClass: jasmine.Spy = spyOn(ClassList, 'hasClass');

        isCloneLoaded(clone as any);

        expect(hasClass).toHaveBeenCalledWith(clone, LOADED_CLASS);
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
