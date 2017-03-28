import {
    addClass,
    excludeClass,
    hasClass,
    joinClasses,
    removeClass
} from '../../../lib/element/ClassList';

describe('joinClasses', () => {
    it('should return an empty string when merging empty classes', () => {
        expect(joinClasses(['', '', ''])).toBe('');
    });

    it('should return a single class when merging with an existing empty class', () => {
        expect(joinClasses(['', 'new'])).toBe('new');
    });

    it('should return a single class when merging with a new empty class', () => {
        expect(joinClasses(['existing', ''])).toBe('existing');
    });
});

describe('excludeClass', () => {
    it('should return an empty string if there are no classes present', () => {
        expect(excludeClass('remove-me', [''])).toBe('');
    });

    it('should return an empty string when removing the only class', () => {
        expect(excludeClass('example-class', ['example-class'])).toBe('');
    });

    it('should return the unmodified className when removing an absent class', () => {
        let classes: string[] = ['list', 'map', 'set', 'tree'];
        expect(excludeClass('vector', classes)).toBe('list map set tree');
    });

    it('should return a className without the class when removing a class that is present', () => {
        let classes: string[] = ['example', 'button', 'container', 'wrapper'];
        expect(excludeClass('container', classes)).toBe('example button wrapper');
    });

    it('should exclude empty classes', () => {
        let classes: string[] = ['', 'example', '', 'image', '', '', 'wrapper'];
        expect(excludeClass('wrapper', classes)).toBe('example image');
    });
});

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
    describe('if the element has multiple classes', () => {
        let element: any;

        beforeAll(() => {
            element = { className: 'class-one class-two' };
        });

        it('should append the class to the className', () => {
            addClass(element, 'class-three');
            expect(element.className).toBe('class-one class-two class-three');
        });
    });

    describe('if the element has a single class', () => {
        let element: any;

        beforeAll(() => {
            element = { className: 'single-class' };
        });

        it('should append the class to the className', () => {
            addClass(element, 'new-class');
            expect(element.className).toBe('single-class new-class');
        });
    });

    describe('if the element has no classes', () => {
        let element: any;

        beforeAll(() => {
            element = { className: '' };
        });

        it('should replace the className', () => {
            addClass(element, 'another-class');
            expect(element.className).toBe('another-class');
        });
    });
});

describe('removeClass', () => {
    describe('if the element has multiple classes', () => {
        let element: any;

        beforeEach(() => {
            element = { className: 'button container wrapper image' };
        });

        it('should remove the class from the className if the class is present', () => {
            removeClass(element, 'container');
            expect(element.className).toBe('button wrapper image');
        });

        it('should not change the className if the class is absent', () => {
            removeClass(element, 'example');
            expect(element.className).toBe('button container wrapper image');
        });
    });

    describe('if the element has a single class', () => {
        let element: any;

        beforeEach(() => {
            element = { className: 'button' };
        });

        it('should empty the className if it is the same class', () => {
            removeClass(element, 'button');
            expect(element.className).toBe('');
        });

        it('should not change the className if it is a different class', () => {
            removeClass(element, 'different');
            expect(element.className).toBe('button');
        });
    });

    describe('if the element has no classes', () => {
        let element: any;

        beforeEach(() => {
            element = { className: '' };
        });

        it('should not change the className', () => {
            removeClass(element, 'another');
            expect(element.className).toBe('');
        });
    });
});
