import {
    srcAttribute,
    hasClass,
    addClass,
    removeClass
} from '../../lib/Element';

describe('srcAttribute', () => {
    let element: HTMLElement;
    let image: HTMLImageElement;

    beforeEach(() => {
        element = document.createElement('div');
        image = document.createElement('img');
    });

    it('should return the value of the data-src attribute if present', () => {
        element.setAttribute('data-src', 'test-value');
        expect(srcAttribute(element, image)).toBe('test-value');
    });

    it('should return the src of the image if the data-src attribute is absent', () => {
        image.src = 'example-src';
        expect(srcAttribute(element, image)).toContain('example-src');
    });
});

describe('hasClass', () => {
    it('should return true if the class is present', () => {
        let element: HTMLElement = document.createElement('div');
        element.className = 'class-yes class-no';
        expect(hasClass(element, 'class-yes')).toBe(true);
    });

    it('should return false if the class is absent', () => {
        let element: HTMLElement = document.createElement('div');
        element.className = 'class-high class-low';
        expect(hasClass(element, 'class-medium')).toBe(false);
    });

    it('should return false if there are no classes', () => {
        let element: HTMLElement = document.createElement('div');
        expect(hasClass(element, 'class')).toBe(false);
    });
});

describe('addClass', () => {
    it('should replace the className if the class list is empty', () => {
        let element: HTMLElement = document.createElement('div');
        addClass(element, 'another-class');
        expect(element.className).toBe('another-class');
    });

    it('should append if the class list is populated', () => {
        let element: HTMLElement = document.createElement('div');
        element.className = 'existing-class';
        addClass(element, 'new-class');
        expect(element.className).toBe('existing-class new-class');
    });
});

describe('removeClass', () => {
    it('should empty the className when removing the only class', () => {
        let element: HTMLElement = document.createElement('div');
        element.className = 'remove-me';
        removeClass(element, 'remove-me');
        expect(element.className.length).toBe(0);
    });

    it('should remove the class but leave others', () => {
        let element: HTMLElement = document.createElement('div');
        element.className = 'keep-me remove-me keep-me-too';
        removeClass(element, 'remove-me');
        expect(element.className).toBe('keep-me keep-me-too');
    });
});
