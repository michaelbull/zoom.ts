import {
    ready,
    viewportWidth,
    viewportHeight,
    pageScrollY,
    createDiv,
    createClone
} from '../../lib/Document';

describe('ready', () => {
    it('should execute the callback immediately if the document is ready', () => {
        let document: any = {
            readyState: 'complete',
            addEventListener: jasmine.createSpy('EventListener')
        };

        let callback: jasmine.Spy = jasmine.createSpy('Function');
        ready(document, callback);

        expect(callback).toHaveBeenCalled();
        expect(document.addEventListener).toHaveBeenCalledTimes(0);
    });

    it('should add an event listener for the DOMContentLoaded event if the document is not ready', () => {
        let document: any = {
            readyState: 'loading',
            addEventListener: jasmine.createSpy('EventListener')
        };

        let callback: jasmine.Spy = jasmine.createSpy('Function');
        ready(document, callback);

        expect(callback).toHaveBeenCalledTimes(0);
        expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', jasmine.any(Function));
    });
});

describe('viewportWidth', () => {
    it('should use the documentElement property if present', () => {
        let document: any = {
            documentElement: {
                clientWidth: 500
            },
            body: {
                clientWidth: 350
            }
        };

        expect(viewportWidth(document)).toBe(500);
    });

    it('should fall back to the body property if documentElement is absent', () => {
        let document: any = {
            body: {
                clientWidth: 200
            }
        };

        expect(viewportWidth(document)).toBe(200);
    });
});

describe('viewportHeight', () => {
    it('should use the documentElement property if present', () => {
        let document: any = {
            documentElement: {
                clientHeight: 700
            },
            body: {
                clientHeight: 275
            }
        };

        expect(viewportHeight(document)).toBe(700);
    });

    it('should fall back to the body property if documentElement is absent', () => {
        let document: any = {
            body: {
                clientHeight: 50
            }
        };

        expect(viewportHeight(document)).toBe(50);
    });
});

describe('pageScrollY', () => {
    it('should use window.pageYOffset if present', () => {
        let window: any = {
            pageYOffset: 50
        };

        let document: any = {
            documentElement: {
                scrollTop: 150
            },
            body: {
                scrollTop: 200
            }
        };

        expect(pageScrollY(window, document)).toBe(50);
    });

    it('should fall back to document.documentElement if window.pageYOffset is absent', () => {
        let window: any = {};

        let document: any = {
            documentElement: {
                scrollTop: 250
            },
            body: {
                scrollTop: 300
            }
        };

        expect(pageScrollY(window, document)).toBe(250);
    });

    it('should fall back to document.body if window.pageYOffset and document.documentElement are absent', () => {
        let window: any = {};

        let document: any = {
            body: {
                scrollTop: 400
            }
        };

        expect(pageScrollY(window, document)).toBe(400);
    });
});

describe('createDiv', () => {
    it('should create a div element', () => {
        expect(createDiv('').tagName).toBe('DIV');
    });

    it('should set the className', () => {
        expect(createDiv('example-class').className).toBe('example-class');
    });
});

describe('createClone', () => {
    it('should create an img element', () => {
        expect(createClone('').tagName).toBe('IMG');
    });

    it('should set the className', () => {
        expect(createClone('').className).toBe('zoom__clone');
    });

    it('should set the src', () => {
        expect(createClone('clone-src').src).toContain('clone-src');
    });
});
