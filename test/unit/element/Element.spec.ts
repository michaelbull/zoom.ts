import {
    addClass,
    clientDimensions,
    hasClass,
    joinClasses,
    removeClass,
    targetDimensions
} from '../../../lib/element/Element';

describe('clientDimensions', () => {
    it('should return the clientWidth', () => {
        let element: any = { clientWidth: 330 };
        expect(clientDimensions(element)[0]).toBe(330);
    });

    it('should return the clientHeight', () => {
        let element: any = { clientHeight: 440 };
        expect(clientDimensions(element)[1]).toBe(440);
    });
});

describe('targetDimensions', () => {
    it('should return the specified width if the data-width attribute is present', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-width') {
                    return '550';
                } else {
                    return null;
                }
            }
        };

        expect(targetDimensions(element)[0]).toBe(550);
    });

    it('should return the specified height if the data-height attribute is present', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-height') {
                    return '660';
                } else {
                    return null;
                }
            }
        };

        expect(targetDimensions(element)[1]).toBe(660);
    });

    it('should return Infinity as the width if the data-width attribute is absent', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-width') {
                    return null;
                } else {
                    return '500';
                }
            }
        };

        expect(targetDimensions(element)[0]).toBe(Infinity);
    });

    it('should return Infinity as the height if the data-height attribute is absent', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-height') {
                    return null;
                } else {
                    return '600';
                }
            }
        };

        expect(targetDimensions(element)[1]).toBe(Infinity);
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

// describe('truncateClass', () => {
//     describe('if there are no classes', () => {
//         it('should return an empty string', () => {
//             expect(truncateClass('', 'remove-me')).toBe('');
//         });
//     });
//
//     describe('if there is a single class', () => {
//         it('should return an empty string when removing the remaining class', () => {
//             expect(truncateClass('example-class', 'example-class')).toBe('');
//         });
//
//         it('should return the unmodified className when removing a different class', () => {
//             expect(truncateClass('keep-me', 'remove-me')).toBe('keep-me');
//         });
//     });
//
//     describe('if there are multiple classes', () => {
//         it('should return a className without the class when removing a class that is present', () => {
//             expect(truncateClass('example button container wrapper', 'container')).toBe('example button wrapper');
//         });
//
//         it('should return the unmodified className when removing a different class', () => {
//             expect(truncateClass('list map set tree', 'vector')).toBe('list map set tree');
//         });
//     });
// });
