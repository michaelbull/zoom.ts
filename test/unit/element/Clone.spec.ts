import * as ClassList from '../../../lib/element/ClassList';
import {
    addClass,
    hasClass,
    removeClass
} from '../../../lib/element/ClassList';
import {
    createClone,
    removeCloneLoadedListener,
    replaceCloneWithImage,
    replaceImageWithClone,
    showCloneOnceLoaded
} from '../../../lib/element/Clone';
import {
    HIDDEN_CLASS,
    isImageHidden
} from '../../../lib/element/Image';
import * as Wrapper from '../../../lib/element/Wrapper';
import * as EventListener from '../../../lib/event/EventListener';
import { fireEventListener } from '../../../lib/event/EventListener';

describe('createClone', () => {
    let config: any;
    let element: any;
    let listener: EventListener;
    let clone: any;

    beforeEach(() => {
        config = {
            cloneClass: 'clone',
            cloneLoadedClass: 'clone--loaded'
        };

        element = {
            addEventListener: jasmine.createSpy('addEventListener').and.callFake((event: string, evtListener: EventListener) => {
                listener = evtListener;
            }),
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        spyOn(document, 'createElement').and.returnValue(element);

        clone = createClone(config, 'dummy-src');
    });

    it('should create an img element', () => {
        expect(document.createElement).toHaveBeenCalledWith('img');
    });

    it('should set the className', () => {
        expect(clone.className).toBe(config.cloneClass);
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
            expect(hasClass(clone, config.cloneLoadedClass)).toBe(true);
        });
    });
});

describe('showCloneOnceLoaded', () => {
    let config: any;
    let event: any;
    let addClass: jasmine.Spy;

    beforeEach(() => {
        config = {
            cloneVisibleClass: 'visible'
        };

        event = jasmine.createSpy('event');
        addClass = spyOn(ClassList, 'addClass');
    });

    it('should not show the clone if the clone is undefined', () => {
        let elements: any = {};
        let listener: EventListener = showCloneOnceLoaded(config, elements);
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
        let listener: EventListener = showCloneOnceLoaded(config, elements);
        spyOn(Wrapper, 'isWrapperExpanded').and.returnValue(false);

        fireEventListener(listener, event);

        expect(addClass).toHaveBeenCalledTimes(0);
    });

    it('should not show the clone if the clone is already visible', () => {
        let elements: any = {
            clone: {
                className: `clone ${config.cloneVisibleClass}`
            }
        };
        let listener: EventListener = showCloneOnceLoaded(config, elements);
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
        let listener: EventListener = showCloneOnceLoaded(config, elements);
        spyOn(Wrapper, 'isWrapperExpanded').and.returnValue(true);

        fireEventListener(listener, event);

        expect(addClass).toHaveBeenCalledTimes(2);
    });
});

describe('removeCloneLoadedListener', () => {
    let config: any;
    let showCloneListener: any;
    let removeEventListener: jasmine.Spy;

    beforeEach(() => {
        config = {
            cloneLoadedClass: 'loaded'
        };
        showCloneListener = jasmine.createSpy('showCloneListener');
        removeEventListener = spyOn(EventListener, 'removeEventListener');
    });

    it('should not remove the listener if the clone is undefined', () => {
        let elements: any = {};

        removeCloneLoadedListener(config, elements, showCloneListener);

        expect(removeEventListener).toHaveBeenCalledTimes(0);
    });

    it('should not remove the listener if the listener is undefined', () => {
        let elements: any = {
            clone: jasmine.createSpy('clone')
        };

        removeCloneLoadedListener(config, elements, undefined);

        expect(removeEventListener).toHaveBeenCalledTimes(0);
    });

    it('should check if the clone has been loaded', () => {
        let elements: any = { clone: jasmine.createSpy('clone') };
        let hasClass: jasmine.Spy = spyOn(ClassList, 'hasClass').and.returnValue(true);

        removeCloneLoadedListener(config, elements, showCloneListener);

        expect(hasClass).toHaveBeenCalledWith(elements.clone, config.cloneLoadedClass);
    });

    it('should not remove the listener if the clone is already loaded', () => {
        let elements: any = { clone: jasmine.createSpy('clone') };
        spyOn(ClassList, 'hasClass').and.returnValue(true);

        removeCloneLoadedListener(config, elements, showCloneListener);

        expect(removeEventListener).toHaveBeenCalledTimes(0);
    });

    it('should remove the listener if the clone is still loading', () => {
        let elements: any = { clone: jasmine.createSpy('clone') };
        spyOn(ClassList, 'hasClass').and.returnValue(false);

        removeCloneLoadedListener(config, elements, showCloneListener);

        expect(removeEventListener).toHaveBeenCalledWith(elements.clone, 'load', showCloneListener);
    });
});

describe('replaceImageWithClone', () => {
    let config: any;

    beforeEach(() => {
        config = {
            cloneVisibleClass: 'clone-visible'
        };
    });

    it('should show the clone before hiding the image', () => {
        let image: any = { className: 'image' };
        let clone: any = { className: 'clone' };
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((element: HTMLElement) => {
            if (element === clone) {
                expect(isImageHidden(image)).toBe(false);
            }
        });

        replaceImageWithClone(config, image, clone);

        expect(addClass).toHaveBeenCalledTimes(2);
    });

    it('should hide the image after showing the clone', () => {
        let image: any = { className: 'image' };
        let clone: any = { className: 'clone' };
        let original: Function = ClassList.addClass;
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((element: HTMLElement, add: string) => {
            if (element === image) {
                expect(hasClass(clone, config.cloneVisibleClass)).toBe(true);
            } else {
                original(element, add);
            }
        });

        replaceImageWithClone(config, image, clone);

        expect(addClass).toHaveBeenCalledTimes(2);
    });
});

describe('replaceCloneWithImage', () => {
    let config: any;

    beforeEach(() => {
        config = {
            cloneVisibleClass: 'clone-visible'
        };
    });

    it('should show the image before hiding the clone', () => {
        let image: any = { className: `image ${HIDDEN_CLASS}` };
        let clone: any = { className: `clone ${config.cloneVisibleClass}` };
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass').and.callFake((element: HTMLElement) => {
            if (element === image) {
                expect(hasClass(clone, config.cloneVisibleClass)).toBe(true);
            }
        });

        replaceCloneWithImage(config, image, clone);

        expect(removeClass).toHaveBeenCalledTimes(2);
    });

    it('should hide the clone after showing the image', () => {
        let image: any = { className: `image ${HIDDEN_CLASS}` };
        let clone: any = { className: `clone ${config.cloneVisibleClass}` };
        let original: Function = ClassList.removeClass;
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass').and.callFake((element: HTMLElement, remove: string) => {
            if (element === clone) {
                expect(isImageHidden(image)).toBe(false);
            } else {
                original(element, remove);
            }
        });

        replaceCloneWithImage(config, image, clone);

        expect(removeClass).toHaveBeenCalledTimes(2);
    });
});
