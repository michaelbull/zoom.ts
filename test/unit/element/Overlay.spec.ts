import * as Document from '../../../lib/browser/Document';
import * as ClassList from '../../../lib/element/ClassList';
import * as Element from '../../../lib/element/Element';
import {
    addOverlay,
    CLASS,
    createOverlay,
    hideOverlay,
    isOverlayVisible,
    VISIBLE_CLASS
} from '../../../lib/element/Overlay';

describe('createOverlay', () => {
    let overlay: jasmine.Spy;
    let createDiv: jasmine.Spy;

    beforeEach(() => {
        overlay = jasmine.createSpy('overlay');
        createDiv = spyOn(Document, 'createDiv').and.returnValue(overlay);
    });

    it('should create a div element with the correct className', () => {
        createOverlay();
        expect(Document.createDiv).toHaveBeenCalledWith(CLASS);
    });

    it('should return the created overlay', () => {
        expect(createOverlay()).toBe(overlay);
    });
});

describe('addOverlay', () => {
    let overlay: any;

    beforeEach(() => {
        overlay = { className: CLASS };
    });

    it('should append the hidden overlay to the document body', () => {
        let appendChild: jasmine.Spy = spyOn(document.body, 'appendChild').and.callFake((): void => {
            expect(isOverlayVisible(overlay)).toBe(false);
        });

        addOverlay(overlay);

        expect(appendChild).toHaveBeenCalledWith(overlay);
    });

    it('should repaint the hidden overlay after adding it to the document body', () => {
        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        spyOn(document.body, 'appendChild').and.callFake((): void => {
            expect(repaint).toHaveBeenCalledTimes(0);
        });

        addOverlay(overlay);

        expect(repaint).toHaveBeenCalled();
    });

    it('should show the overlay after repainting it', () => {
        spyOn(document.body, 'appendChild');
        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((): void => {
            expect(repaint).toHaveBeenCalled();
        });

        addOverlay(overlay);

        expect(addClass).toHaveBeenCalledWith(overlay, VISIBLE_CLASS);
    });
});

describe('hideOverlay', () => {
    it('should remove the visible class', () => {
        let overlay: jasmine.Spy = jasmine.createSpy('overlay');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        hideOverlay(overlay as any);

        expect(removeClass).toHaveBeenCalledWith(overlay, VISIBLE_CLASS);
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
