import {
    vendorProperties,
    vendorPrefixes
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
