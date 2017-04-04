import {
    QUIRKS_MODE,
    STANDARDS_MODE
} from '../../lib/window/Document';
import {
    hasTransitions,
    hasTranslate3d,
    pageScrollY
} from '../../lib/window/Window';

describe('hasTransitions', () => {
    it('should return false if window.getComputedStyle is undefined', () => {
        let window: any = {};
        let element: any = { style: {} };
        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if window.getComputedStyle is not a function', () => {
        let window: any = { getComputedStyle: '' };
        let element: any = { style: {} };
        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if no transitionDuration property is present', () => {
        let element: any = {
            style: []
        };
        let window: any = {};

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should compute the style of the element', () => {
        let computedStyle: any = {
            MozTransitionDuration: '55'
        };

        let element: any = {
            style: computedStyle
        };

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
            if (elt === element) {
                return computedStyle;
            }
        });

        hasTransitions(window, element);
        expect(window.getComputedStyle).toHaveBeenCalledWith(element);
    });

    it('should return false if the duration is an empty string', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: ''
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if the duration is not a number', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: 'this is NaN'
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if the duration is zero', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: '0'
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return true if the duration is a non-zero number', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: '100'
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(true);
    });
});

describe('hasTranslate3d', () => {
    it('should return false if window.getComputedStyle is undefined', () => {
        let window: any = {};
        expect(hasTranslate3d(window, 'MozTransform')).toBe(false);
    });

    it('should return false if window.getComputedStyle is not a function', () => {
        let window: any = { getComputedStyle: '' };
        expect(hasTranslate3d(window, 'WebkitTransform')).toBe(false);
    });

    it('should return false if the transformProperty is invalid', () => {
        let window: any = {
            getComputedStyle: (): void => {
            }
        };

        expect(hasTranslate3d(window, 'invalid')).toBe(false);
    });

    describe('if window.getComputedStyle is a function and the transformProperty is valid', () => {
        let window: any;
        let child: any;

        beforeEach(() => {
            child = {
                style: []
            };

            let computedStyle: any = {
                getPropertyValue: (name: string): string => {
                    if (name === '-o-transform') {
                        return 'example';
                    } else if (name === 'o-ms-transform') {
                        return 'none';
                    } else {
                        return '';
                    }
                }
            };

            window = {
                getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => computedStyle),
                document: {
                    createElement: jasmine.createSpy('createElement').and.callFake((tagName: string) => child),
                    body: {
                        appendChild: jasmine.createSpy('appendChild'),
                        removeChild: jasmine.createSpy('removeChild')
                    }
                }
            };
        });

        it('should create a div element', () => {
            hasTranslate3d(window, 'WebkitTransform');
            expect(window.document.createElement).toHaveBeenCalledWith('p');
        });

        it('should assign the translate3d property to the child element', () => {
            hasTranslate3d(window, 'transform');
            expect(child.style['transform']).toBe('translate3d(1px,1px,1px)');
        });

        it('should append the child to window.document.body', () => {
            hasTranslate3d(window, 'transform');
            expect(window.document.body.appendChild).toHaveBeenCalledWith(child);
        });

        it('should compute the style of the child', () => {
            hasTranslate3d(window, 'OTransform');
            expect(window.getComputedStyle).toHaveBeenCalledWith(child);
        });

        it('should remove the child from window.document.body', () => {
            hasTranslate3d(window, 'msTransform');
            expect(window.document.body.removeChild).toHaveBeenCalledWith(child);
        });

        it('should return true if the transform property is present', () => {
            expect(hasTranslate3d(window, 'OTransform')).toBe(true);
        });

        it('should return false if the transform property is absent', () => {
            expect(hasTranslate3d(window, 'WebkitTransform')).toBe(false);
        });

        it('should return false if the transform property resolves to "none"', () => {
            expect(hasTranslate3d(window, 'msTransform')).toBe(false);
        });
    });
});

describe('pageScrollY', () => {
    it('should use window.pageYOffset if present', () => {
        let window: any = {
            pageYOffset: 50,
            document: {
                compatMode: STANDARDS_MODE,
                documentElement: {
                    scrollTop: 150
                },
                body: {
                    scrollTop: 200
                }
            }
        };

        expect(pageScrollY(window)).toBe(50);
    });

    it('should fall back to document.documentElement if window.pageYOffset is absent and in standards mode', () => {
        let window: any = {
            document: {
                compatMode: STANDARDS_MODE,
                documentElement: {
                    scrollTop: 250
                },
                body: {
                    scrollTop: 300
                }
            }
        };

        expect(pageScrollY(window)).toBe(250);
    });

    it('should fall back to document.body if window.pageYOffset is absent and not in standards mode', () => {
        let window: any = {
            document: {
                compatMode: QUIRKS_MODE,
                documentElement: {
                    scrollTop: 100
                },
                body: {
                    scrollTop: 400
                }
            }
        };

        expect(pageScrollY(window)).toBe(400);
    });
});
