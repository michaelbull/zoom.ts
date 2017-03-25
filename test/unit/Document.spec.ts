import {
    isStandardsMode,
    pageScrollY,
    QUIRKS_MODE,
    ready,
    rootElement,
    STANDARDS_MODE
} from '../../lib/Document';

describe('isStandardsMode', () => {
    it('should return true if compatMode is CSS1Compat', () => {
        let document: any = {
            compatMode: STANDARDS_MODE
        };

        expect(isStandardsMode(document)).toBe(true);
    });

    it('should return false if compatMode is not CSS1Compat', () => {
        let document: any = {
            compatMode: QUIRKS_MODE
        };

        expect(isStandardsMode(document)).toBe(false);
    });
});

describe('rootElement', () => {
    it('should return documentElement if in standards mode', () => {
        let document: any = {
            compatMode: STANDARDS_MODE,
            documentElement: jasmine.createSpy('documentElement')
        };

        expect(rootElement(document)).toBe(document.documentElement);
    });

    it('should return body if not in standards mode', () => {
        let document: any = {
            compatMode: QUIRKS_MODE,
            body: jasmine.createSpy('body')
        };

        expect(rootElement(document)).toBe(document.body);
    });
});

describe('ready', () => {
    it('should execute the callback immediately if document.readyState is complete', () => {
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

describe('pageScrollY', () => {
    it('should use window.pageYOffset if present', () => {
        let window: any = {
            pageYOffset: 50,
            document: {
                compatMode: STANDARDS_MODE,
                documentElement: {
                    scrollTop: 150
                },
                body: {
                    scrollTop: 200
                }
            }
        };

        expect(pageScrollY(window)).toBe(50);
    });

    it('should fall back to document.documentElement if window.pageYOffset is absent and in standards mode', () => {
        let window: any = {
            document: {
                compatMode: STANDARDS_MODE,
                documentElement: {
                    scrollTop: 250
                },
                body: {
                    scrollTop: 300
                }
            }
        };

        expect(pageScrollY(window)).toBe(250);
    });

    it('should fall back to document.body if window.pageYOffset is absent and not in standards mode', () => {
        let window: any = {
            document: {
                compatMode: QUIRKS_MODE,
                documentElement: {
                    scrollTop: 100
                },
                body: {
                    scrollTop: 400
                }
            }
        };

        expect(pageScrollY(window)).toBe(400);
    });
});
