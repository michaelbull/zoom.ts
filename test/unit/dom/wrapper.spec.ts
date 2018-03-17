import { Wrapper } from '../../../src/dom/wrapper';
import * as style from '../../../src/element/style';
import { Vector2 } from '../../../src/math/vector2';

describe('Wrapper', () => {
    describe('create', () => {
        let wrapper: Wrapper;

        beforeEach(() => {
            let element: any = {
                className: 'example-class'
            };

            spyOn(document, 'createElement').and.callFake((tagName: string) => {
                if (tagName === 'div') {
                    return element;
                } else {
                    fail();
                }
            });

            wrapper = Wrapper.create();
        });

        it('should set the class name', () => {
            expect(wrapper.element.className).toEqual(Wrapper.CLASS);
        });
    });

    describe('startExpanding', () => {
        it('should add the expanding class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let wrapper = new Wrapper(element);
            wrapper.startExpanding();

            expect(wrapper.element.classList.add).toHaveBeenCalledWith(Wrapper.EXPANDING_CLASS);
        });
    });

    describe('finishExpanding', () => {
        it('should remove the expanding class', () => {
            let element: any = {
                classList: {
                    remove: jasmine.createSpy('remove')
                }
            };

            let wrapper = new Wrapper(element);
            wrapper.finishExpanding();

            expect(wrapper.element.classList.remove).toHaveBeenCalledWith(Wrapper.EXPANDING_CLASS);
        });
    });

    describe('isExpanding', () => {
        it('should return true if the element does have the expanding class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Wrapper.EXPANDING_CLASS;
                    }
                }
            };

            let wrapper = new Wrapper(element);

            expect(wrapper.isExpanding()).toEqual(true);
        });

        it('should return false if the element does not have visible class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Wrapper.EXPANDING_CLASS;
                    }
                }
            };

            let wrapper = new Wrapper(element);

            expect(wrapper.isExpanding()).toEqual(false);
        });
    });

    describe('startCollapsing', () => {
        it('should add the collapsing class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let wrapper = new Wrapper(element);
            wrapper.startCollapsing();

            expect(wrapper.element.classList.add).toHaveBeenCalledWith(Wrapper.COLLAPSING_CLASS);
        });
    });

    describe('finishCollapsing', () => {
        let element: any;
        let wrapper: Wrapper;
        let resetStyle: jasmine.Spy;

        beforeEach(() => {
            element = {
                classList: {
                    remove: jasmine.createSpy('remove')
                },
                style: jasmine.createSpy('style')
            };

            resetStyle = spyOn(style, 'resetStyle');

            wrapper = new Wrapper(element);
            wrapper.finishCollapsing();
        });

        it('should remove the collapsing class', () => {
            expect(wrapper.element.classList.remove).toHaveBeenCalledWith(Wrapper.COLLAPSING_CLASS);
        });

        it('should reset the height style property', () => {
            expect(resetStyle).toHaveBeenCalledWith(element.style, 'height');
        });
    });

    describe('isCollapsing', () => {
        it('should return true if the element does have the collapsing class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Wrapper.COLLAPSING_CLASS;
                    }
                }
            };

            let wrapper = new Wrapper(element);

            expect(wrapper.isCollapsing()).toEqual(true);
        });

        it('should return false if the element does not have collapsing class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Wrapper.COLLAPSING_CLASS;
                    }
                }
            };

            let wrapper = new Wrapper(element);

            expect(wrapper.isCollapsing()).toEqual(false);
        });
    });

    describe('isTransitioning', () => {
        it('should return true if the element is expanding', () => {
            let element: any = jasmine.createSpy('element');
            let wrapper = new Wrapper(element);
            spyOn(wrapper, 'isExpanding').and.returnValue(true);
            spyOn(wrapper, 'isCollapsing').and.returnValue(false);

            expect(wrapper.isTransitioning()).toEqual(true);
        });

        it('should return true if the element is collapsing', () => {
            let element: any = jasmine.createSpy('element');
            let wrapper = new Wrapper(element);
            spyOn(wrapper, 'isExpanding').and.returnValue(false);
            spyOn(wrapper, 'isCollapsing').and.returnValue(true);

            expect(wrapper.isTransitioning()).toEqual(true);
        });

        it('should return true if the element is collapsing and expanding', () => {
            let element: any = jasmine.createSpy('element');
            let wrapper = new Wrapper(element);
            spyOn(wrapper, 'isExpanding').and.returnValue(true);
            spyOn(wrapper, 'isCollapsing').and.returnValue(true);

            expect(wrapper.isTransitioning()).toEqual(true);
        });

        it('should return false if the element is not collapsing nor expanding', () => {
            let element: any = jasmine.createSpy('element');
            let wrapper = new Wrapper(element);
            spyOn(wrapper, 'isExpanding').and.returnValue(false);
            spyOn(wrapper, 'isCollapsing').and.returnValue(false);

            expect(wrapper.isTransitioning()).toEqual(false);
        });
    });

    describe('expanded', () => {
        it('should add the expanded class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let wrapper = new Wrapper(element);
            wrapper.expanded();

            expect(wrapper.element.classList.add).toHaveBeenCalledWith(Wrapper.EXPANDED_CLASS);
        });
    });

    describe('collapsed', () => {
        it('should remove the expanded class', () => {
            let element: any = {
                classList: {
                    remove: jasmine.createSpy('remove')
                }
            };

            let wrapper = new Wrapper(element);
            wrapper.collapse();

            expect(wrapper.element.classList.remove).toHaveBeenCalledWith(Wrapper.EXPANDED_CLASS);
        });
    });

    describe('isExpanded', () => {
        it('should return true if the element does have the expanded class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Wrapper.EXPANDED_CLASS;
                    }
                }
            };

            let wrapper = new Wrapper(element);

            expect(wrapper.isExpanded()).toEqual(true);
        });

        it('should return false if the element does not have expanded class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Wrapper.EXPANDED_CLASS;
                    }
                }
            };

            let wrapper = new Wrapper(element);

            expect(wrapper.isExpanded()).toEqual(false);
        });
    });

    describe('position', () => {
        let position: Vector2;

        beforeEach(() => {
            let rect: ClientRect = {
                width: 800,
                height: 600,
                top: 100,
                left: 100,
                bottom: 0,
                right: 0
            };

            let element: any = {
                getBoundingClientRect: () => rect
            };

            let style: any = {
                getPropertyValue: (propertyName: string) => {
                    if (propertyName === 'padding-top') {
                        return '50px';
                    } else if (propertyName === 'padding-left') {
                        return '20px';
                    } else {
                        fail();
                    }
                }
            };

            spyOn(window, 'getComputedStyle').and.callFake((elt: Element) => {
                if (elt === element) {
                    return style;
                } else {
                    fail();
                }
            });

            let wrapper = new Wrapper(element);
            position = wrapper.position();
        });

        it('should calculate the correct x coordinate', () => {
            expect(position.x).toEqual(120);
        });

        it('should calculate the correct y coordinate', () => {
            expect(position.y).toEqual(150);
        });
    });
});
