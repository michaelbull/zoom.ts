import {
    CLASS,
    createOverlay,
    hideOverlay,
    isOverlayVisible,
    showOverlay,
    VISIBLE_CLASS
} from '../../../lib/element/Overlay';

describe('createOverlay', () => {
    let document: any;
    let element: any;

    beforeEach(() => {
        element = {};
        document = {
            createElement: jasmine.createSpy('createElement').and.callFake(() => element)
        };
    });

    it('should create a div element', () => {
        createOverlay(document);
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should assign the className', () => {
        expect(createOverlay(document).className).toBe(CLASS);
    });
});

describe('showOverlay', () => {
    it('should add the visible class', () => {
        let overlay: any = { className: '' };
        showOverlay(overlay);
        expect(isOverlayVisible(overlay)).toBe(true);
    });
});

describe('hideOverlay', () => {
    it('should make the overlay not visible', () => {
        let overlay: any = { className: VISIBLE_CLASS };
        hideOverlay(overlay);
        expect(isOverlayVisible(overlay)).toBe(false);
    });
});

describe('isOverlayVisible', () => {
    it('should return true if the visible class is present', () => {
        let overlay: any = { className: VISIBLE_CLASS };
        expect(isOverlayVisible(overlay)).toBe(true);
    });

    it('should return false if the visible class is absent', () => {
        let overlay: any = { className: '' };
        expect(isOverlayVisible(overlay)).toBe(false);
    });
});
