import { Image } from '../../../src/dom/image';
import { Bounds } from '../../../src/math/bounds';
import { Vector2 } from '../../../src/math/vector2';

describe('Image', () => {
    describe('bounds', () => {
        it('should return the Bounds.of the element', () => {
            let bounds = new Bounds(new Vector2(1, 2), new Vector2(3, 4));
            spyOn(Bounds, 'of').and.returnValue(bounds);

            let element: any = {};
            let image = new Image(element);

            expect(image.bounds()).toEqual(bounds);
        });
    });

    describe('hide', () => {
        it('should add the hidden class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let image = new Image(element);
            image.hide();

            expect(image.element.classList.add).toHaveBeenCalledWith(Image.HIDDEN_CLASS);
        });
    });

    describe('show', () => {
        it('should remove the hidden class', () => {
            let element: any = {
                classList: {
                    remove: jasmine.createSpy('remove')
                }
            };

            let image = new Image(element);
            image.show();

            expect(image.element.classList.remove).toHaveBeenCalledWith(Image.HIDDEN_CLASS);
        });
    });

    describe('isHidden', () => {
        it('should return true if the element does have the hidden class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token === Image.HIDDEN_CLASS;
                    }
                }
            };

            let image = new Image(element);

            expect(image.isHidden()).toEqual(true);
        });

        it('should return false if the element does not have hidden class', () => {
            let element: any = {
                classList: {
                    contains: (token: string) => {
                        return token !== Image.HIDDEN_CLASS;
                    }
                }
            };

            let image = new Image(element);

            expect(image.isHidden()).toEqual(false);
        });
    });

    describe('activate', () => {
        it('should add the active class', () => {
            let element: any = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            let image = new Image(element);
            image.activate();

            expect(image.element.classList.add).toHaveBeenCalledWith(Image.ACTIVE_CLASS);
        });
    });

    describe('deactivate', () => {
        it('should remove the active class', () => {
            let element: any = {
                classList: {
                    remove: jasmine.createSpy('remove')
                }
            };

            let image = new Image(element);
            image.deactivate();

            expect(image.element.classList.remove).toHaveBeenCalledWith(Image.ACTIVE_CLASS);
        });
    });

    describe('targetSize', () => {
        it('should return the target size of the element', () => {
            let size = new Vector2(1, 2);
            spyOn(Vector2, 'fromTargetSize').and.returnValue(size);

            let element: any = {};
            let image = new Image(element);

            expect(image.targetSize()).toEqual(size);
        });
    });

    describe('clearFixedSizes', () => {
        let image: Image;

        beforeEach(() => {
            let element: any = {
                removeAttribute: jasmine.createSpy('removeAttribute')
            };

            image = new Image(element);
            image.clearFixedSizes();
        });

        it('should remove the width attribute', () => {
            expect(image.element.removeAttribute).toHaveBeenCalledWith('width');
        });

        it('should remove the height attribute', () => {
            expect(image.element.removeAttribute).toHaveBeenCalledWith('height');
        });
    });
});
