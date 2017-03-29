import {
    addClass,
    hasClass,
    removeClass
} from '../../../lib/element/ClassList';

describe('hasClass', () => {
    it('should return true if the class is in the className', () => {
        let element: any = { className: 'class-yes class-no' };
        expect(hasClass(element, 'class-yes')).toBe(true);
    });

    it('should return false if the class is not in the className', () => {
        let element: any = { className: 'class-high class-low' };
        expect(hasClass(element, 'class-medium')).toBe(false);
    });

    it('should return false if the className is empty', () => {
        let element: any = { className: '' };
        expect(hasClass(element, 'class')).toBe(false);
    });
});

describe('addClass', () => {
    it('should set the className to an empty string when adding an empty class to an empty class list', () => {
        let element: any = { className: '    ' };
        addClass(element, '');
        expect(element.className).toBe('');
    });

    it('should replace the className when adding a class to an empty class list', () => {
        let element: any = { className: '' };
        addClass(element, 'new');
        expect(element.className).toBe('new');
    });

    it('should append to the className when adding a class to a populated class list', () => {
        let element: any = { className: 'class-one class-two' };
        addClass(element, 'class-three');
        expect(element.className).toBe('class-one class-two class-three');
    });

    it('should exclude empty classes from the className when adding a class to a populated class list', () => {
        let element: any = { className: '  this     that   those        these' };
        addClass(element, 'them');
        expect(element.className).toBe('this that those these them');
    });

    it('should not modify the className when adding an empty class to a populated class list', () => {
        let element: any = { className: 'existing' };
        addClass(element, '');
        expect(element.className).toBe('existing');
    });
});

describe('removeClass', () => {
    it('should set the className to an empty string when removing an empty class from an empty class list', () => {
        let element: any = { className: '    ' };
        removeClass(element, '');
        expect(element.className).toBe('');
    });

    it('should replace the className with an empty string when removing the only present class in a class list', () => {
        let element: any = { className: 'remove-me' };
        removeClass(element, 'remove-me');
        expect(element.className).toBe('');
    });

    it('should remove from the className when removing a present class from a populated class list', () => {
        let element: any = { className: 'list map set tree' };
        removeClass(element, 'set');
        expect(element.className).toBe('list map tree');
    });

    it('should exclude empty classes from the className when removing a class from a populated class list', () => {
        let element: any = { className: ' video  image   wrapper' };
        removeClass(element, 'image');
        expect(element.className).toBe('video wrapper');
    });

    it('should not modify the className when removing an absent class from a populated class list', () => {
        let element: any = { className: 'button container wrapper image' };
        removeClass(element, 'video');
        expect(element.className).toBe('button container wrapper image');
    });
});
