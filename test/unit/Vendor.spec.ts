import {
    vendorProperties,
    vendorPrefixes,
    vendorProperty
} from '../../lib/Vendor';

describe('vendorProperties', () => {
    let properties: string[];

    beforeAll(() => {
        properties = vendorProperties('example');
    });

    it('should contain the property itself', () => {
        expect(properties).toContain('example');
    });

    it('should contain the Webkit-prefixed property', () => {
        expect(properties).toContain('WebkitExample');
    });

    it('should contain the Mozilla-prefixed property', () => {
        expect(properties).toContain('MozExample');
    });

    it('should contain the Microsoft-prefixed property', () => {
        expect(properties).toContain('msExample');
    });

    it('should contain the Opera-prefixed property', () => {
        expect(properties).toContain('OExample');
    });

    it('should not contain extra properties', () => {
        expect(properties.length).toBe(vendorPrefixes.length + 1);
    });
});

describe('vendorProperty', () => {
    it('should return the default property if present', () => {
        let element: any = { style: { example: '' } };
        expect(vendorProperty(element, 'example')).toBe('example');
    });

    it('should return the Webkit property if present', () => {
        let element: any = { style: { WebkitExample: '' } };
        expect(vendorProperty(element, 'example')).toBe('WebkitExample');
    });

    it('should return the Mozilla property if present', () => {
        let element: any = { style: { MozExample: '' } };
        expect(vendorProperty(element, 'example')).toBe('MozExample');
    });

    it('should return the Microsoft property if present', () => {
        let element: any = { style: { msExample: '' } };
        expect(vendorProperty(element, 'example')).toBe('msExample');
    });

    it('should return the Opera property if present', () => {
        let element: any = { style: { OExample: '' } };
        expect(vendorProperty(element, 'example')).toBe('OExample');
    });

    it('should ignore an invalid property and return null', () => {
        let element: any = { style: { invalid: '' } };
        expect(vendorProperty(element, 'valid')).toBeNull();
    });

    it('should return null if property absent', () => {
        let element: any = { style: {} };
        expect(vendorProperty(element, 'example')).toBeNull();
    });
});
