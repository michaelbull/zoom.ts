import * as ClassList from '../../../lib/element/ClassList';
import * as Element from '../../../lib/element/Element';
import {
    activateImage,
    ACTIVE_CLASS,
    CLASS,
    deactivateImage,
    fullSrc,
    HIDDEN_CLASS,
    hideImage,
    isImageActive,
    isImageHidden,
    isZoomable,
    showImage
} from '../../../lib/element/Image';

describe('hideImage', () => {
    it('should add the hidden class', () => {
        let image: jasmine.Spy = jasmine.createSpy('image');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');

        hideImage(image as any);

        expect(addClass).toHaveBeenCalledWith(image, HIDDEN_CLASS);
    });
});

describe('showImage', () => {
    it('should remove the hidden class', () => {
        let image: jasmine.Spy = jasmine.createSpy('image');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        showImage(image as any);

        expect(removeClass).toHaveBeenCalledWith(image, HIDDEN_CLASS);
    });
});

describe('isImageHidden', () => {
    it('should return true if the hidden class is present', () => {
        let image: any = { className: HIDDEN_CLASS };
        expect(isImageHidden(image)).toBe(true);
    });

    it('should return false if the hidden class is absent', () => {
        let image: any = { className: '' };
        expect(isImageHidden(image)).toBe(false);
    });
});

describe('activateImage', () => {
    it('should add the active class', () => {
        let image: jasmine.Spy = jasmine.createSpy('image');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');

        activateImage(image as any);

        expect(addClass).toHaveBeenCalledWith(image, ACTIVE_CLASS);
    });
});

describe('deactivateImage', () => {
    it('should remove the active class', () => {
        let image: jasmine.Spy = jasmine.createSpy('image');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        deactivateImage(image as any);

        expect(removeClass).toHaveBeenCalledWith(image, ACTIVE_CLASS);
    });
});

describe('isImageActive', () => {
    it('should return true if the active class is present', () => {
        let image: any = { className: ACTIVE_CLASS };
        expect(isImageActive(image)).toBe(true);
    });

    it('should return false if the active class is absent', () => {
        let image: any = { className: '' };
        expect(isImageActive(image)).toBe(false);
    });
});

describe('isZoomable', () => {
    it('should return false if the target is not a HTMLImageElement', () => {
        let target: any = 'target';
        expect(isZoomable(target)).toBe(false);
    });

    it('should return false if the target does not have a parent', () => {
        let target: HTMLImageElement = document.createElement('img');
        spyOn(Element, 'hasParent').and.returnValue(false);
        expect(isZoomable(target)).toBe(false);
    });

    it('should return false if the target does not have a grandparent', () => {
        let target: HTMLImageElement = document.createElement('img');
        spyOn(Element, 'hasGrandParent').and.returnValue(false);
        expect(isZoomable(target)).toBe(false);
    });

    it('should return false if the target does not have the zoomable class', () => {
        let target: HTMLImageElement = document.createElement('img');
        target.className = 'invalid';
        expect(isZoomable(target)).toBe(false);
    });

    it('should return true if the target is an HTMLImageElement with a parent, grandparent, and the zoomable class', () => {
        let target: HTMLImageElement = document.createElement('img');
        target.className = CLASS;
        spyOn(Element, 'hasParent').and.returnValue(true);
        spyOn(Element, 'hasGrandParent').and.returnValue(true);
        expect(isZoomable(target)).toBe(true);
    });
});

describe('fullSrc', () => {
    it('should return the image’s src if the wrapper’s data-src attribute is null', () => {
        let image: any = { src: 'example.jpeg' };
        let wrapper: any = {
            getAttribute: (): string | null => {
                return null;
            }
        };

        expect(fullSrc(wrapper, image)).toBe('example.jpeg');
    });

    it('should return the wrapper’s data-src if non-null', () => {
        let image: any = { src: '' };
        let wrapper: any = {
            getAttribute: (name: string): string | null => {
                if (name === 'data-src') {
                    return 'example.png';
                } else {
                    return null;
                }
            }
        };

        expect(fullSrc(wrapper, image)).toBe('example.png');
    });
});
