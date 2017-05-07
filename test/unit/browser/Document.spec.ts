import {
    createDiv,
    isStandardsMode,
    QUIRKS_MODE,
    ready,
    rootElement,
    STANDARDS_MODE,
    viewportSize
} from '../../../lib/browser/Document';
import { fireEventListener } from '../../../lib/event/EventListener';

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
    describe('if document.readyState is complete', () => {
        let document: any;

        beforeEach(() => {
            document = {
                readyState: 'complete'
            };
        });

        it('should execute the callback immediately if document.readyState is complete', () => {
            document.addEventListener = jasmine.createSpy('addEventListener');
            let callback: jasmine.Spy = jasmine.createSpy('callback');

            ready(document, callback);

            expect(callback).toHaveBeenCalled();
            expect(document.addEventListener).toHaveBeenCalledTimes(0);
        });
    });

    describe('if document.readyState is not complete', () => {
        let document: any;

        beforeEach(() => {
            document = {
                readyState: 'loading'
            };
        });

        it('should not call the callback', () => {
            document.addEventListener = jasmine.createSpy('addEventListener');
            let callback: jasmine.Spy = jasmine.createSpy('callback');

            ready(document, callback);

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('should listen for the DOMContentLoaded event', () => {
            let registeredListener: any;
            document.addEventListener = jasmine.createSpy('addEventListener').and.callFake((type: string, listener: EventListenerOrEventListenerObject) => {
                registeredListener = listener;
            });

            ready(document, jasmine.createSpy('callback'));

            expect(registeredListener).toBeDefined();
            expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', registeredListener, false);
        });

        it('should execute the callback when the DOMContentLoaded event is fired', () => {
            let registeredListener: any;
            document.addEventListener = jasmine.createSpy('addEventListener').and.callFake((type: string, listener: EventListenerOrEventListenerObject) => {
                registeredListener = listener;
            });
            let callback: jasmine.Spy = jasmine.createSpy('callback');
            let event: any = jasmine.createSpy('event');

            ready(document, callback);
            fireEventListener(registeredListener, event);

            expect(registeredListener).toBeDefined();
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('viewportSize', () => {
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

        expect(viewportSize(document)).toEqual([300, 400]);
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

        expect(viewportSize(document)).toEqual([850, 950]);
    });
});

describe('createDiv', () => {
    let element: any;
    let createElement: jasmine.Spy;

    beforeEach(() => {
        element = {};
        createElement = spyOn(document, 'createElement').and.returnValue(element);
    });

    it('should create a div element', () => {
        createDiv('');
        expect(createElement).toHaveBeenCalledWith('div');
    });

    it('should set the className', () => {
        expect(createDiv('example').className).toBe('example');
    });

    it('should return the created element', () => {
        expect(createDiv('')).toBe(element);
    });
});
