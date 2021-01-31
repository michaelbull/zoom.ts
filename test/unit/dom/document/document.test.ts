import {
    isStandardsMode,
    QUIRKS_MODE,
    ready,
    rootElement,
    STANDARDS_MODE,
    viewportSize
} from '../../../../src/dom/document';
import { fireEventListener } from '../../../../src/event';

describe('isStandardsMode', () => {
    it('returns true if compatMode is CSS1Compat', () => {
        let document: any = {
            compatMode: STANDARDS_MODE
        };

        expect(isStandardsMode(document)).toBe(true);
    });

    it('returns false if compatMode is not CSS1Compat', () => {
        let document: any = {
            compatMode: QUIRKS_MODE
        };

        expect(isStandardsMode(document)).toBe(false);
    });
});

describe('rootElement', () => {
    it('returns documentElement if in standards mode', () => {
        let document: any = {
            compatMode: STANDARDS_MODE,
            documentElement: jest.fn()
        };

        expect(rootElement(document)).toBe(document.documentElement);
    });

    it('returns body if not in standards mode', () => {
        let document: any = {
            compatMode: QUIRKS_MODE,
            body: jest.fn()
        };

        expect(rootElement(document)).toBe(document.body);
    });
});

describe('viewportSize', () => {
    it('returns the dimensions of document.documentElement if in standards mode', () => {
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

        expect(viewportSize(document)).toEqual({
            x: 300,
            y: 400
        });
    });

    it('returns the dimensions of document.body if not in standards mode', () => {
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

        expect(viewportSize(document)).toEqual({
            x: 850,
            y: 950
        });
    });
});

describe('ready', () => {
    describe('if document.readyState is loading', () => {
        let document: any;

        beforeEach(() => {
            document = {
                readyState: 'loading'
            };
        });

        it('does not call the callback', () => {
            document.addEventListener = jest.fn();
            let callback = jest.fn();

            ready(callback, document);

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('listens for the DOMContentLoaded event', () => {
            let registeredListener: any;

            document.addEventListener = jest.fn((type: string, listener: EventListenerOrEventListenerObject) => {
                registeredListener = listener;
            });

            ready(jest.fn(), document);

            expect(registeredListener).toBeDefined();
            expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', registeredListener);
        });

        it('executes the callback when the DOMContentLoaded event is fired', () => {
            let registeredListener: any;
            document.addEventListener = jest.fn((type: string, listener: EventListenerOrEventListenerObject) => {
                registeredListener = listener;
            });
            document.removeEventListener = jest.fn();
            let callback = jest.fn();
            let event: any = jest.fn();

            ready(callback, document);
            fireEventListener(document, registeredListener, event);

            expect(registeredListener).toBeDefined();
            expect(callback).toHaveBeenCalled();
            expect(document.removeEventListener).toHaveBeenCalledWith('DOMContentLoaded', registeredListener);
        });
    });

    describe('if document.readyState is not loading', () => {
        let document: any;

        beforeEach(() => {
            document = {
                readyState: 'complete'
            };
        });

        it('executes the callback immediately if document.readyState is complete', () => {
            document.addEventListener = jest.fn();
            let callback = jest.fn();

            ready(callback, document);

            expect(callback).toHaveBeenCalled();
            expect(document.addEventListener).toHaveBeenCalledTimes(0);
        });
    });
});
