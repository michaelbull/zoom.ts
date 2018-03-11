import { Clone } from '../../../src/zoom';
import { AddClassListener } from '../../../src/event/add-class-listener';

describe('Clone', () => {
    describe('create', () => {
        let clone: Clone;

        beforeEach(() => {
            let element: any = {
                className: 'example-class',
                src: 'example-src',
                addEventListener: jasmine.createSpy('addEventListener')
            };

            spyOn(document, 'createElement').and.callFake((tagName: string) => {
                if (tagName === 'img') {
                    return element;
                } else {
                    fail();
                }
            });

            clone = Clone.create('different-src');
        });

        it('should set the class name', () => {
            expect(clone.element.className).toEqual(Clone.CLASS);
        });

        it('should set the src attribute', () => {
            expect(clone.element.src).toEqual('different-src');
        });

        it('should add the load event listener', () => {
            expect(clone.element.addEventListener).toHaveBeenCalledWith('load', jasmine.any(AddClassListener));
        });
    });

    describe('show', () => {
        it('should add the visible class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let clone = new Clone(element);
            clone.show();

            expect(clone.element.classList.add).toHaveBeenCalledWith(Clone.VISIBLE_CLASS);
        });
    });

    describe('hide', () => {
        it('should remove the visible class', () => {
            let element: any = {
                classList: {
                    remove: jasmine.createSpy('remove')
                }
            };

            let clone = new Clone(element);
            clone.hide();

            expect(clone.element.classList.remove).toHaveBeenCalledWith(Clone.VISIBLE_CLASS);
        });
    });

    describe('isVisible', () => {
        it('should return true if the element does have the visible class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Clone.VISIBLE_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isVisible()).toEqual(true);
        });

        it('should return false if the element does not have visible class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Clone.VISIBLE_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isVisible()).toEqual(false);
        });
    });

    describe('isHidden', () => {
        it('should return false if the element does have the visible class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Clone.VISIBLE_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isHidden()).toEqual(false);
        });

        it('should return false if the element does not have visible class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Clone.VISIBLE_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isHidden()).toEqual(true);
        });
    });

    describe('loaded', () => {
        it('should add the loaded class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let clone = new Clone(element);
            clone.loaded();

            expect(clone.element.classList.add).toHaveBeenCalledWith(Clone.LOADED_CLASS);
        });
    });

    describe('isLoaded', () => {
        it('should return true if the element does have the loaded class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Clone.LOADED_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isLoaded()).toEqual(true);
        });

        it('should return false if the element does not have loaded class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Clone.LOADED_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isLoaded()).toEqual(false);
        });
    });

    describe('isLoading', () => {
        it('should return false if the element does have the loaded class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Clone.LOADED_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isLoading()).toEqual(false);
        });

        it('should return true if the element does not have loaded class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Clone.LOADED_CLASS;
                    }
                }
            };

            let clone = new Clone(element);

            expect(clone.isLoading()).toEqual(true);
        });
    });
});
