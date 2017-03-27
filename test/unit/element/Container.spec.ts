import {
    createContainer,
    isContainer,
    refreshContainer
} from '../../../lib/element/Container';

describe('createContainer', () => {
    let container: any;
    let document: any;

    beforeEach(() => {
        container = {};
        document = {
            createElement: jasmine.createSpy('createElement').and.callFake((tagName: string): any => {
                expect(tagName).toBe('div');
                return container;
            })
        };
    });

    it('should create a div element', () => {
        createContainer(document);
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should assign the className', () => {
        expect(createContainer(document).className).toBe('zoom__container');
    });
});

describe('isContainer', () => {
    it('should return true if the class is present', () => {
        let element: any = { className: 'zoom__container' };
        expect(isContainer(element)).toBe(true);
    });

    it('should return false if the class is absent', () => {
        let element: any = { className: 'example' };
        expect(isContainer(element)).toBe(false);
    });
});

describe('refreshContainer', () => {
    let container: any;

    beforeEach(() => {
        container = {
            style: {
                transition: 'example'
            }
        };
    });

    it('should set the transition to initial before executing the callback', () => {
        let callback: Function = (): void => {
            expect(container.style.transition).toBe('initial');
        };

        refreshContainer(container, callback);
    });

    it('should execute the callback', () => {
        let callback: jasmine.Spy = jasmine.createSpy('callback');
        refreshContainer(container, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('should clear the transition after executing the callback', () => {
        refreshContainer(container, jasmine.createSpy('callback'));
        expect(container.style.transition).toBe('');
    });
});
