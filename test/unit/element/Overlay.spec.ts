import * as Document from '../../../lib/browser/Document';
import * as ClassList from '../../../lib/element/ClassList';
import * as Element from '../../../lib/element/Element';
import {
    addOverlay,
    CLASS,
    hideOverlay,
    isOverlayVisible,
    VISIBLE_CLASS
} from '../../../lib/element/Overlay';

describe('addOverlay', () => {
    let overlay: any;
    let createDiv: jasmine.Spy;

    beforeEach(() => {
        overlay = { className: 'overlay' };
        createDiv = spyOn(Document, 'createDiv').and.returnValue(overlay);
    });

    it('should create a div element', () => {
        spyOn(document.body, 'appendChild');

        addOverlay();

        expect(createDiv).toHaveBeenCalledWith(CLASS);
    });

    it('should append the hidden overlay to the document body', () => {
        let appendChild: jasmine.Spy = spyOn(document.body, 'appendChild').and.callFake((): void => {
            expect(isOverlayVisible(overlay)).toBe(false);
        });

        addOverlay();

        expect(appendChild).toHaveBeenCalledWith(overlay);
    });

    it('should repaint the hidden overlay after adding it to the document body', () => {
        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        spyOn(document.body, 'appendChild').and.callFake((): void => {
            expect(repaint).toHaveBeenCalledTimes(0);
        });

        addOverlay();

        expect(repaint).toHaveBeenCalled();
    });

    it('should show the overlay after repainting it', () => {
        spyOn(document.body, 'appendChild');
        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((): void => {
            expect(repaint).toHaveBeenCalled();
        });

        addOverlay();

        expect(addClass).toHaveBeenCalledWith(overlay, VISIBLE_CLASS);
    });

    it('should return the overlay', () => {
        spyOn(document.body, 'appendChild');
        expect(addOverlay()).toBe(overlay);
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
