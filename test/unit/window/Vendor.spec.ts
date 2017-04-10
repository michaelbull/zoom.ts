import {
    VENDOR_PREFIXES,
    vendorProperties,
    vendorProperty
} from '../../../lib/window/Vendor';

describe('vendorProperties', () => {
    it('should contain the property itself', () => {
        expect(vendorProperties('example')).toContain('example');
    });

    it('should contain the Webkit-prefixed property', () => {
        expect(vendorProperties('another')).toContain('WebkitAnother');
    });

    it('should contain the Mozilla-prefixed property', () => {
        expect(vendorProperties('dummy')).toContain('MozDummy');
    });

    it('should contain the Microsoft-prefixed property', () => {
        expect(vendorProperties('foo')).toContain('msFoo');
    });

    it('should contain the Opera-prefixed property', () => {
        expect(vendorProperties('bar')).toContain('OBar');
    });

    it('should not contain extra properties', () => {
        expect(vendorProperties('extra').length).toBe(VENDOR_PREFIXES.length + 1);
    });
});

describe('vendorProperty', () => {
    it('should return the default property if present', () => {
        let style: any = { example: '' };
        expect(vendorProperty(style, 'example')).toBe('example');
    });

    it('should return the Webkit property if present', () => {
        let style: any = { WebkitExample: '' };
        expect(vendorProperty(style, 'example')).toBe('WebkitExample');
    });

    it('should return the Mozilla property if present', () => {
        let style: any = { MozExample: '' };
        expect(vendorProperty(style, 'example')).toBe('MozExample');
    });

    it('should return the Microsoft property if present', () => {
        let style: any = { msExample: '' };
        expect(vendorProperty(style, 'example')).toBe('msExample');
    });

    it('should return the Opera property if present', () => {
        let style: any = { OExample: '' };
        expect(vendorProperty(style, 'example')).toBe('OExample');
    });

    it('should return undefined if the property is invalid', () => {
        let style: any = { invalid: '' };
        expect(vendorProperty(style, 'valid')).toBeUndefined();
    });

    it('should return undefined if the property is absent', () => {
        let style: any = {};
        expect(vendorProperty(style, 'example')).toBeUndefined();
    });
});
