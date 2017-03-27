import {
    createClone,
    isCloneLoaded,
    isCloneVisible,
    setCloneLoaded,
    setCloneVisible,
    unsetCloneVisible
} from '../../../lib/element/Clone';

describe('createClone', () => {
    let element: any;
    let document: any;
    let clone: any;
    let listener: EventListener;

    beforeEach(() => {
        element = {
            addEventListener: //
                jasmine.createSpy('addEventListener').and.callFake((event: string, evtListener: EventListener) => {
                    expect(event).toBe('load');
                    listener = evtListener;
                }),
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        document = {
            createElement: function (tagName: string): any {
                expect(tagName).toBe('img');
                return element;
            }
        };

        clone = createClone(document, 'example-src');
    });

    it('should set the element’s className', () => {
        expect(element.className).toBe('zoom__clone');
    });

    it('should set the element’s src', () => {
        expect(element.src).toBe('example-src');
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

        it('should should set the clone to loaded', () => {
            expect(isCloneLoaded(clone)).toBe(true);
        });
    });
});

describe('setCloneVisible', () => {
    it('should add the visible class', () => {
        let clone: any = { className: 'this-clone' };
        setCloneVisible(clone);
        expect(clone.className).toBe('this-clone zoom__clone--visible');
    });
});

describe('unsetCloneVisible', () => {
    it('should add the visible class', () => {
        let clone: any = { className: 'that-clone zoom__clone--visible' };
        unsetCloneVisible(clone);
        expect(clone.className).toBe('that-clone');
    });
});

describe('isCloneVisible', () => {
    it('should return true if the visible class is present', () => {
        let clone: any = { className: 'clone zoom__clone--visible' };
        expect(isCloneVisible(clone)).toBe(true);
    });

    it('should return false if the visible class is present', () => {
        let clone: any = { className: 'clone' };
        expect(isCloneVisible(clone)).toBe(false);
    });
});

describe('setCloneLoaded', () => {
    it('should add the loaded class', () => {
        let clone: any = { className: 'clone' };
        setCloneLoaded(clone);
        expect(clone.className).toBe('clone zoom__clone--loaded');
    });
});

describe('isCloneLoaded', () => {
    it('should return true if the loaded class is present', () => {
        let clone: any = { className: 'clone zoom__clone--loaded' };
        expect(isCloneLoaded(clone)).toBe(true);
    });

    it('should return false if the loaded class is present', () => {
        let clone: any = { className: 'clone' };
        expect(isCloneLoaded(clone)).toBe(false);
    });
});
