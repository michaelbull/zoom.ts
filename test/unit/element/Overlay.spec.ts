import * as ClassList from '../../../lib/element/ClassList';
import { addClass } from '../../../lib/element/ClassList';
import * as Element from '../../../lib/element/Element';
import { addOverlay } from '../../../lib/element/Overlay';

describe('addOverlay', () => {
    let config: any;
    let overlay: any;

    beforeEach(() => {
        config = { overlayVisibleClass: 'overlay-visible' };
        overlay = jasmine.createSpy('overlay');
    });

    it('should append the hidden overlay to the document body before repainting', () => {
        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');
        let appendChild: jasmine.Spy = spyOn(document.body, 'appendChild').and.callFake(() => {
            expect(repaint).toHaveBeenCalledTimes(0);
            expect(addClass).toHaveBeenCalledTimes(0);
        });

        addOverlay(config, overlay);

        expect(appendChild).toHaveBeenCalledWith(overlay);
    });

    it('should repaint the hidden overlay after adding it to the document body', () => {
        let appendChild: jasmine.Spy = spyOn(document.body, 'appendChild');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');
        let repaint: jasmine.Spy = spyOn(Element, 'repaint').and.callFake(() => {
            expect(appendChild).toHaveBeenCalledTimes(1);
            expect(addClass).toHaveBeenCalledTimes(0);
        });

        addOverlay(config, overlay);

        expect(repaint).toHaveBeenCalledWith(overlay);
    });

    it('should show the overlay after repainting it', () => {
        let appendChild: jasmine.Spy = spyOn(document.body, 'appendChild');
        let repaint: jasmine.Spy = spyOn(Element, 'repaint');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass').and.callFake((): void => {
            expect(appendChild).toHaveBeenCalledTimes(1);
            expect(repaint).toHaveBeenCalledTimes(1);
        });

        addOverlay(config, overlay);

        expect(addClass).toHaveBeenCalledWith(overlay, config.overlayVisibleClass);
    });
});
