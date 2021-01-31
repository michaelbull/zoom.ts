import {
    VENDOR_PREFIXES,
    vendorProperties,
    vendorProperty
} from '../../../src/browser';

describe('vendorProperties', () => {
    it('contains the property itself', () => {
        expect(vendorProperties('example')).toContain('example');
    });

    it('contains the Webkit-prefixed property', () => {
        expect(vendorProperties('another')).toContain('WebkitAnother');
    });

    it('contains the Mozilla-prefixed property', () => {
        expect(vendorProperties('dummy')).toContain('MozDummy');
    });

    it('contains the Microsoft-prefixed property', () => {
        expect(vendorProperties('foo')).toContain('msFoo');
    });

    it('contains the Opera-prefixed property', () => {
        expect(vendorProperties('bar')).toContain('OBar');
    });

    it('does not contain extra properties', () => {
        expect(vendorProperties('extra').length).toBe(VENDOR_PREFIXES.length + 1);
    });
});

describe('vendorProperty', () => {
    it('returns the default property if present', () => {
        let style: any = { example: '' };
        expect(vendorProperty(style, 'example')).toBe('example');
    });

    it('returns the Webkit property if present', () => {
        let style: any = { WebkitExample: '' };
        expect(vendorProperty(style, 'example')).toBe('WebkitExample');
    });

    it('returns the Mozilla property if present', () => {
        let style: any = { MozExample: '' };
        expect(vendorProperty(style, 'example')).toBe('MozExample');
    });

    it('returns the Microsoft property if present', () => {
        let style: any = { msExample: '' };
        expect(vendorProperty(style, 'example')).toBe('msExample');
    });

    it('returns the Opera property if present', () => {
        let style: any = { OExample: '' };
        expect(vendorProperty(style, 'example')).toBe('OExample');
    });

    it('returns undefined if the property is invalid', () => {
        let style: any = { invalid: '' };
        expect(vendorProperty(style, 'valid')).toBeUndefined();
    });

    it('returns undefined if the property is absent', () => {
        let style: any = {};
        expect(vendorProperty(style, 'example')).toBeUndefined();
    });
});
