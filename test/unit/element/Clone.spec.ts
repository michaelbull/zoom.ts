import {
    CLASS,
    createClone,
    hideClone,
    isCloneLoaded,
    isCloneVisible,
    LOADED_CLASS,
    showClone,
    VISIBLE_CLASS
} from '../../../lib/element/Clone';

describe('createClone', () => {
    let element: any;
    let document: any;
    let listener: EventListener;
    let clone: any;

    beforeEach(() => {
        element = {
            addEventListener: //
                jasmine.createSpy('addEventListener').and.callFake((event: string, evtListener: EventListener) => {
                    listener = evtListener;
                }),
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        document = {
            createElement: jasmine.createSpy('createElement').and.callFake(() => element)
        };

        clone = createClone(document, 'dummy-src');
    });

    it('should create an img element', () => {
        expect(document.createElement).toHaveBeenCalledWith('img');
    });

    it('should assign the className', () => {
        expect(clone.className).toBe(CLASS);
    });

    it('should set the src', () => {
        expect(clone.src).toBe('dummy-src');
    });

    it('should add a load event listener', () => {
        expect(element.addEventListener).toHaveBeenCalledWith('load', listener);
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
        let clone: any = { className: '' };
        showClone(clone);
        expect(isCloneVisible(clone)).toBe(true);
    });
});

describe('hideClone', () => {
    it('should remove the visible class', () => {
        let clone: any = { className: VISIBLE_CLASS };
        hideClone(clone);
        expect(isCloneVisible(clone)).toBe(false);
    });
});

describe('isCloneVisible', () => {
    it('should return true if the visible class is present', () => {
        let clone: any = { className: VISIBLE_CLASS };
        expect(isCloneVisible(clone)).toBe(true);
    });

    it('should return false if the visible class is present', () => {
        let clone: any = { className: '' };
        expect(isCloneVisible(clone)).toBe(false);
    });
});

describe('isCloneLoaded', () => {
    it('should return true if the loaded class is present', () => {
        let clone: any = { className: LOADED_CLASS };
        expect(isCloneLoaded(clone)).toBe(true);
    });

    it('should return false if the loaded class is present', () => {
        let clone: any = { className: '' };
        expect(isCloneLoaded(clone)).toBe(false);
    });
});
