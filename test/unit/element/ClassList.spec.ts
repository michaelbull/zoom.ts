import {
    addClass,
    classesFrom,
    classFilter,
    hasClass,
    removeClass
} from '../../../lib/element/ClassList';

describe('classFilter', () => {
    it('should return false if the className is an empty string', () => {
        expect(classFilter('', 1, [])).toBe(false);
    });

    it('should return false if the class list already contains the className', () => {
        expect(classFilter('duped', 20, ['this', 'class', 'is', 'duped'])).toBe(false);
    });

    it('should return true if the className is not empty and it is not in the class list', () => {
        expect(classFilter('one', 1, ['zero', 'one', 'two'])).toBe(true);
    });
});

describe('classesFrom', () => {
    it('should return an empty array if the class list is empty', () => {
        expect(classesFrom('')).toEqual([]);
    });

    it('should return a single-element array if the class list has no separators', () => {
        expect(classesFrom('example')).toEqual(['example']);
    });

    it('should not contain duplicates', () => {
        expect(classesFrom('dupe not-dupe dupe   another-dupe  dupe')).toEqual(['dupe', 'not-dupe', 'another-dupe']);
    });

    it('should not contain empty classes', () => {
        expect(classesFrom('example  class one   two     three')).toEqual(['example', 'class', 'one', 'two', 'three']);
    });
});

describe('hasClass', () => {
    it('should return false if the class is not in the className', () => {
        let element: any = { className: 'class-high class-low' };
        expect(hasClass(element, 'class-medium')).toBe(false);
    });

    it('should return false if the className is empty', () => {
        let element: any = { className: '' };
        expect(hasClass(element, 'class')).toBe(false);
    });

    it('should return true if the class is in the className', () => {
        let element: any = { className: 'class-yes class-no' };
        expect(hasClass(element, 'class-yes')).toBe(true);
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

    it('should not modify the className when adding a duplicate class to a populated class list', () => {
        let element: any = { className: 'duplicate' };
        addClass(element, 'duplicate');
        expect(element.className).toBe('duplicate');
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
