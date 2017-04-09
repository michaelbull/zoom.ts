import * as ClassList from '../../../lib/element/ClassList';
import * as Element from '../../../lib/element/Element';
import {
    addOverlay,
    CLASS,
    hideOverlay,
    isOverlayVisible,
    VISIBLE_CLASS
} from '../../../lib/element/Overlay';
import * as Document from '../../../lib/window/Document';

describe('addOverlay', () => {
    it('should create a div element', () => {
        let overlay: any = { className: 'overlay' };
        let createDiv: jasmine.Spy = spyOn(Document, 'createDiv').and.returnValue(overlay);
        spyOn(document.body, 'appendChild');

        addOverlay();

        expect(createDiv).toHaveBeenCalledWith(document, CLASS);
    });

    it('should append the hidden overlay to the document body', () => {
        let overlay: any = { className: 'overlay' };
        spyOn(Document, 'createDiv').and.returnValue(overlay);
        let appendChild: jasmine.Spy = spyOn(document.body, 'appendChild').and.callFake((): void => {
            expect(isOverlayVisible(overlay)).toBe(false);
        });

        addOverlay();

        expect(appendChild).toHaveBeenCalledWith(overlay);
    });

    it('should repaint the hidden overlay after adding it to the document body', () => {
        let overlay: any = { className: 'overlay' };
        spyOn(Document, 'createDiv').and.returnValue(overlay);

        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        spyOn(document.body, 'appendChild').and.callFake((): void => {
            expect(repaint).toHaveBeenCalledTimes(0);
        });

        addOverlay();

        expect(repaint).toHaveBeenCalled();
    });

    it('should show the overlay after repainting it', () => {
        let overlay: any = { className: 'overlay' };
        spyOn(Document, 'createDiv').and.returnValue(overlay);
        spyOn(document.body, 'appendChild');

        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((): void => {
            expect(repaint).toHaveBeenCalled();
        });

        addOverlay();

        expect(addClass).toHaveBeenCalledWith(overlay, VISIBLE_CLASS);
    });

    it('should return the overlay', () => {
        let overlay: any = { className: 'overlay' };
        spyOn(Document, 'createDiv').and.returnValue(overlay);
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
    it('should call hasClass with the visible class', () => {
        let overlay: jasmine.Spy = jasmine.createSpy('overlay');
        let hasClass: jasmine.Spy = spyOn(ClassList, 'hasClass');

        isOverlayVisible(overlay as any);

        expect(hasClass).toHaveBeenCalledWith(overlay, VISIBLE_CLASS);
    });
});
