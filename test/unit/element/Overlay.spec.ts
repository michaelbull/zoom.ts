import {
    addOverlay,
    CLASS,
    hideOverlay,
    isOverlayVisible,
    VISIBLE_CLASS
} from '../../../lib/element/Overlay';

describe('addOverlay', () => {
    let element: any;
    let document: any;

    beforeEach(() => {
        element = { className: '' };
        document = {
            createElement: jasmine.createSpy('createElement').and.returnValue(element),
            body: {
                appendChild: jasmine.createSpy('appendChild').and.callFake((element: any) => {
                    expect(isOverlayVisible(element)).toBe(false);
                })
            }
        };
    });

    it('should create a div element', () => {
        addOverlay(document);
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should append the invisible overlay to the document.body', () => {
        addOverlay(document);
        expect(document.body.appendChild).toHaveBeenCalledWith(element);
    });

    it('should add the visible class', () => {
        expect(addOverlay(document).className).toBe(`${CLASS} ${VISIBLE_CLASS}`);
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
