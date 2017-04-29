import * as Clone from '../../../lib/element/Clone';
import * as Container from '../../../lib/element/Container';
import * as Image from '../../../lib/element/Image';
import {
    setUpElements,
    useExistingElements
} from '../../../lib/element/ZoomElements';

describe('useExistingElements', () => {
    let overlay: any;
    let wrapper: any;
    let container: any;
    let image: any;

    beforeEach(() => {
        overlay = jasmine.createSpy('overlay');
        wrapper = jasmine.createSpy('wrapper');

        container = {
            parentElement: wrapper
        };

        image = {
            parentElement: container,
            src: 'example-src'
        };
    });

    it('should determine the full src of the image', () => {
        let fullSrc: jasmine.Spy = spyOn(Image, 'fullSrc').and.returnValue('example-src');

        useExistingElements(overlay, image);

        expect(fullSrc).toHaveBeenCalledWith(wrapper, image);
    });

    describe('overlay', () => {
        it('should be the provided overlay', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(useExistingElements(overlay, image).overlay).toBe(overlay);
        });
    });

    describe('wrapper', () => {
        it('should be the parent element of the container', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(useExistingElements(overlay, image).wrapper).toBe(wrapper);
        });
    });

    describe('container', () => {
        it('should be the parent element of the image', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(useExistingElements(overlay, image).container).toBe(container);
        });
    });

    describe('image', () => {
        it('should be the provided image', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(useExistingElements(overlay, image).image).toBe(image);
        });
    });

    describe('clone', () => {
        describe('if the image src and full src are equal', () => {
            beforeEach(() => {
                spyOn(Image, 'fullSrc').and.returnValue('example-src');
            });

            it('should be undefined', () => {
                expect(useExistingElements(overlay, image).clone).toBeUndefined();
            });
        });

        describe('if the image src and full src are unequal', () => {
            beforeEach(() => {
                spyOn(Image, 'fullSrc').and.returnValue('different');
            });

            it('should be the second child element of the container', () => {
                let clone: jasmine.Spy = jasmine.createSpy('clone');
                container.children = {
                    item: (index: number) => {
                        expect(index).toBe(1);
                        return clone;
                    }
                };

                expect(useExistingElements(overlay, image).clone).toBe(clone);
            });
        });
    });
});

describe('setUpElements', () => {
    let overlay: any;
    let wrapper: any;
    let container: any;
    let image: any;
    let createContainer: jasmine.Spy;

    beforeEach(() => {
        overlay = jasmine.createSpy('overlay');
        wrapper = jasmine.createSpy('wrapper');
        container = jasmine.createSpy('container');

        image = {
            parentElement: wrapper,
            src: 'example-src'
        };

        createContainer = spyOn(Container, 'createContainer').and.returnValue(container);
    });

    it('should determine the full src of the image', () => {
        let fullSrc: jasmine.Spy = spyOn(Image, 'fullSrc').and.returnValue('example-src');

        setUpElements(overlay, image);

        expect(fullSrc).toHaveBeenCalledWith(wrapper, image);
    });

    describe('overlay', () => {
        it('should be the provided overlay', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(setUpElements(overlay, image).overlay).toBe(overlay);
        });
    });

    describe('wrapper', () => {
        it('should be the parent element of the image', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(setUpElements(overlay, image).wrapper).toBe(wrapper);
        });
    });

    describe('container', () => {
        it('should create a container', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');

            setUpElements(overlay, image);

            expect(createContainer).toHaveBeenCalled();
        });

        it('should be the created container', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(setUpElements(overlay, image).container).toBe(container);
        });
    });

    describe('image', () => {
        it('should be the provided image', () => {
            spyOn(Image, 'fullSrc').and.returnValue('example-src');
            expect(setUpElements(overlay, image).image).toBe(image);
        });
    });

    describe('clone', () => {
        describe('if the image src and full src are equal', () => {
            beforeEach(() => {
                spyOn(Image, 'fullSrc').and.returnValue('example-src');
            });

            it('should be undefined', () => {
                expect(setUpElements(overlay, image).clone).toBeUndefined();
            });
        });

        describe('if the image src and full src are unequal', () => {
            beforeEach(() => {
                spyOn(Image, 'fullSrc').and.returnValue('different');
            });

            it('should create a clone', () => {
                let clone: jasmine.Spy = jasmine.createSpy('clone');
                let createClone: jasmine.Spy = spyOn(Clone, 'createClone').and.returnValue(clone);

                setUpElements(overlay, image);

                expect(createClone).toHaveBeenCalledWith('different');
            });

            it('should be the created clone', () => {
                let clone: jasmine.Spy = jasmine.createSpy('clone');
                spyOn(Clone, 'createClone').and.returnValue(clone);

                expect(setUpElements(overlay, image).clone).toBe(clone);
            });
        });
    });
});
