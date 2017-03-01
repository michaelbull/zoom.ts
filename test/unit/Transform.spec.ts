import { transformProperty } from '../../lib/Transform';

describe('transformProperty', () => {
    it('should return the transform property if present', () => {
        let element: any = { style: { transform: '' } };
        expect(transformProperty(element)).toBe('transform');
    });

    it('should return the WebkitTransform property if present', () => {
        let element: any = { style: { WebkitTransform: '' } };
        expect(transformProperty(element)).toBe('WebkitTransform');
    });

    it('should return the MozTransform property if present', () => {
        let element: any = { style: { MozTransform: '' } };
        expect(transformProperty(element)).toBe('MozTransform');
    });

    it('should return the msTransform property if present', () => {
        let element: any = { style: { msTransform: '' } };
        expect(transformProperty(element)).toBe('msTransform');
    });

    it('should return the OTransform property if present', () => {
        let element: any = { style: { OTransform: '' } };
        expect(transformProperty(element)).toBe('OTransform');
    });

    it('should return null if invalid property present', () => {
        let element: any = { style: { invalid: '' } };
        expect(transformProperty(element)).toBeNull();
    });

    it('should return null if property absent', () => {
        let element: any = { style: {} };
        expect(transformProperty(element)).toBeNull();
    });
});
