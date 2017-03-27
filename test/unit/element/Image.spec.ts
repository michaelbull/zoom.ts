import {
    isImageActive,
    isImageHidden,
    isZoomable,
    setImageActive,
    setImageHidden,
    unsetImageActive,
    unsetImageHidden
} from '../../../lib/element/Image';

describe('setImageHidden', () => {
    it('should add the hidden class', () => {
        let image: any = { className: 'my-image' };
        setImageHidden(image);
        expect(image.className).toBe('my-image zoom__element--hidden');
    });
});

describe('unsetImageHidden', () => {
    it('should remove the hidden class', () => {
        let image: any = { className: 'another-image zoom__element--hidden' };
        unsetImageHidden(image);
        expect(image.className).toBe('another-image');
    });
});

describe('isImageHidden', () => {
    it('should return true if the hidden class is present', () => {
        let image: any = { className: 'example zoom__element--hidden' };
        expect(isImageHidden(image)).toBe(true);
    });

    it('should return false if the hidden class is absent', () => {
        let image: any = { className: 'example' };
        expect(isImageHidden(image)).toBe(false);
    });
});

describe('setImageActive', () => {
    it('should add the active class', () => {
        let image: any = { className: 'this-image' };
        setImageActive(image);
        expect(image.className).toBe('this-image zoom__element--active');
    });
});

describe('unsetImageActive', () => {
    it('should remove the active class', () => {
        let image: any = { className: 'that-image zoom__element--active' };
        unsetImageActive(image);
        expect(image.className).toBe('that-image');
    });
});

describe('isImageActive', () => {
    it('should return true if the active class is present', () => {
        let image: any = { className: 'element zoom__element--active' };
        expect(isImageActive(image)).toBe(true);
    });

    it('should return false if the active class is absent', () => {
        let image: any = { className: 'element' };
        expect(isImageActive(image)).toBe(false);
    });
});

describe('isZoomable', () => {
    it('should return false if the target is not a HTMLImageElement', () => {
        let target: any = 'target';
        expect(isZoomable(target)).toBe(false);
    });

    it('should return false if the target does not have the zoomable class', () => {
        let element: HTMLImageElement = new Image();
        element.className = 'example';
        expect(isZoomable(element)).toBe(false);
    });

    it('should return true if the target does have the zoomable class', () => {
        let element: HTMLImageElement = new Image();
        element.className = 'zoom__element';
        expect(isZoomable(element)).toBe(true);
    });
});
