import { transformProperty } from '../../lib/Transform';

describe('transformProperty', () => {
    it('should use a paragraph element', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        transformProperty();
        expect(document.createElement).toHaveBeenCalledWith('p');
    });

    it('should evaluate the transform property', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        transformProperty();
        expect(element.style.getPropertyValue).toHaveBeenCalledWith('transform');
    });

    it('should evaluate the Webkit vendor-property', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        transformProperty();
        expect(element.style.getPropertyValue).toHaveBeenCalledWith('WebkitTransform');
    });

    it('should evaluate the Mozilla vendor-property', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        transformProperty();
        expect(element.style.getPropertyValue).toHaveBeenCalledWith('MozTransform');
    });

    it('should evaluate the Microsoft vendor-property', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        transformProperty();
        expect(element.style.getPropertyValue).toHaveBeenCalledWith('msTransform');
    });

    it('should evaluate the Opera vendor-property', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        transformProperty();
        expect(element.style.getPropertyValue).toHaveBeenCalledWith('OTransform');
    });

    it('should return null if no property is present', () => {
        let element: any = absentProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        expect(transformProperty()).toBeNull();
    });

    it('should return the property if the property is present', () => {
        let element: any = dummyProperty();
        document.createElement = jasmine.createSpy('createElement').and.callFake(() => element);
        expect(transformProperty()).toBe('OTransform');
    });
});

function dummyProperty(): any {
    return {
        style: {
            getPropertyValue: jasmine.createSpy('getPropertyValue').and.callFake((propertyName: string) => {
                if (propertyName === 'OTransform') {
                    return 'dummy-property';
                }
            })
        }
    };
}

function absentProperty(): any {
    return {
        style: {
            getPropertyValue: jasmine.createSpy('getPropertyValue').and.callThrough()
        }
    };
}
