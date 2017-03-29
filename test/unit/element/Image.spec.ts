import {
    ACTIVE_CLASS,
    CLASS,
    HIDDEN_CLASS,
    isImageActive,
    isImageHidden,
    isZoomable,
    activateImage,
    hideImage,
    showImage
} from '../../../lib/element/Image';

describe('hideImage', () => {
    it('should add the hidden class', () => {
        let image: any = { className: '' };
        hideImage(image);
        expect(isImageHidden(image)).toBe(true);
    });
});

describe('showImage', () => {
    it('should remove the hidden class', () => {
        let image: any = {className: HIDDEN_CLASS};
        showImage(image);
        expect(isImageHidden(image)).toBe(false);
    });

    it('should remove the active class', () => {
        let image: any = {className: ACTIVE_CLASS};
        showImage(image);
        expect(isImageActive(image)).toBe(false);
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
        let image: any = { className: '' };
        activateImage(image);
        expect(isImageActive(image)).toBe(true);
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

    it('should return false if the target has no parentElement', () => {
        let target: HTMLImageElement = document.createElement('img');
        target.className = CLASS;
        expect(isZoomable(target)).toBe(false);
    });

    it('should return false if the target does not have the zoomable class', () => {
        let target: HTMLImageElement = document.createElement('img');
        let parent: HTMLElement = document.createElement('div');
        parent.appendChild(target);

        expect(isZoomable(target)).toBe(false);
    });

    it('should return true if the target does have the zoomable class', () => {
        let target: HTMLImageElement = document.createElement('img');
        target.className = CLASS;
        let parent: HTMLElement = document.createElement('div');
        parent.appendChild(target);

        expect(isZoomable(target)).toBe(true);
    });
});
