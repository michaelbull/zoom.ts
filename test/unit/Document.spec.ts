import {
    createDiv,
    isStandardsMode,
    QUIRKS_MODE,
    ready,
    rootElement,
    STANDARDS_MODE,
    viewportDimensions
} from '../../lib/Document';
import { Matrix } from '../../lib/Matrix';

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

describe('viewportDimensions', () => {
    it('should return the dimensions of document.documentElement if in standards mode', () => {
        let document: any = {
            compatMode: STANDARDS_MODE,
            documentElement: {
                clientWidth: 300,
                clientHeight: 400
            },
            body: {
                clientWidth: 500,
                clientHeight: 600
            }
        };

        let actual: Matrix = viewportDimensions(document);
        expect(actual[0]).toBe(300);
        expect(actual[1]).toBe(400);
    });

    it('should return the dimensions of document.body if not in standards mode', () => {
        let document: any = {
            compatMode: QUIRKS_MODE,
            documentElement: {
                clientWidth: 650,
                clientHeight: 750
            },
            body: {
                clientWidth: 850,
                clientHeight: 950
            }
        };

        let actual: Matrix = viewportDimensions(document);
        expect(actual[0]).toBe(850);
        expect(actual[1]).toBe(950);
    });
});

describe('createDiv', () => {
    let element: any;
    let document: any;

    beforeEach(() => {
        element = {};
        document = {
            createElement: jasmine.createSpy('createElement').and.callFake(() => element)
        };
    });

    it('should create a div element', () => {
        createDiv(document, '');
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should assign the className', () => {
        expect(createDiv(document, 'example').className).toBe('example');
    });
});
