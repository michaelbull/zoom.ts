import {
    CLASS,
    createContainer,
    isContainer,
    refreshContainer,
    restoreContainer
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
        expect(createContainer(document).className).toBe(CLASS);
    });
});

describe('isContainer', () => {
    it('should return true if the class is present', () => {
        let element: any = { className: CLASS };
        expect(isContainer(element)).toBe(true);
    });

    it('should return false if the class is absent', () => {
        let element: any = { className: '' };
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
        refreshContainer(container, () => {
            expect(container.style.transition).toBe('initial');
        });
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

describe('restoreContainer', () => {
    it('should reset the transformation', () => {
        let container: any = {
            style: {
                msTransform: 'scale(5)'
            }
        };
        restoreContainer(container);
        expect(container.style.msTransform).toBe('');
    });

    it('should reset the bounds', () => {
        let container: any = {
            style: {
                left: '50px',
                top: '10px',
                width: '100px',
                maxWidth: '100px',
                height: '200px'
            }
        };
        restoreContainer(container);
        expect(container.style.left).toBe('');
        expect(container.style.top).toBe('');
        expect(container.style.width).toBe('');
        expect(container.style.maxWidth).toBe('');
        expect(container.style.height).toBe('');
    });
});
