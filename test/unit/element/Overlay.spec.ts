import {
    createOverlay,
    hideOverlay,
    isOverlayVisible
} from '../../../lib/element/Overlay';

describe('createOverlay', () => {
    let overlay: any;
    let document: any;

    beforeEach(() => {
        overlay = { className: 'overlay' };
        document = {
            createElement: jasmine.createSpy('createElement').and.callFake(() => overlay),
            body: {
                appendChild: jasmine.createSpy('appendChild')
            }
        };
    });

    it('should create a div element', () => {
        createOverlay(document);
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should assign the className', () => {
        expect(createOverlay(document).className).toBe('zoom__overlay zoom__overlay--visible');
    });

    it('should add the overlay to the document.body', () => {
        createOverlay(document);
        expect(document.body.appendChild).toHaveBeenCalledWith(overlay);
    });

    it('should make the overlay visible', () => {
        createOverlay(document);
        expect(isOverlayVisible(overlay)).toBe(true);
    });
});

describe('hideOverlay', () => {
    it('should remove the visible class', () => {
        let overlay: any = { className: 'example-overlay zoom__overlay--visible' };
        hideOverlay(overlay);
        expect(overlay.className).toBe('example-overlay');
    });
});

describe('isOverlayVisible', () => {
    it('should return true if the visible class is present', () => {
        let overlay: any = { className: 'overlay zoom__overlay--visible' };
        expect(isOverlayVisible(overlay)).toBe(true);
    });

    it('should return false if the visible class is absent', () => {
        let overlay: any = { className: 'example' };
        expect(isOverlayVisible(overlay)).toBe(false);
    });
});
