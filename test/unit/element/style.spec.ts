import {
    parsePadding,
    resetStyle,
    setBounds
} from '../../../src/element/style';

describe('setBounds', () => {
    let style: any;

    beforeAll(() => {
        style = {
            left: '50em',
            top: '10px',
            width: '150rem',
            maxWidth: '200px',
            height: ''
        };

        setBounds(style, '20px', '30px', '40px', '50px');
    });

    it('should set the left property', () => {
        expect(style.left).toBe('20px');
    });

    it('should set the top property', () => {
        expect(style.top).toBe('30px');
    });

    it('should set the width property', () => {
        expect(style.width).toBe('40px');
    });

    it('should set the max-width property', () => {
        expect(style.maxWidth).toBe('40px');
    });

    it('should set the height property', () => {
        expect(style.height).toBe('50px');
    });
});

describe('resetStyle', () => {
    it('should set the style property to an empty string', () => {
        let style: any = {
            width: '500px'
        };

        resetStyle(style, 'width');

        expect(style.width).toBe('');
    });
});

describe('parsePadding', () => {
    it('should return the parsed value if it is a number', () => {
        let style: any = {
            getPropertyValue: (propertyName: string) => {
                if (propertyName === 'padding-left') {
                    return '50px';
                } else {
                    fail();
                }
            }
        };

        expect(parsePadding(style, 'left')).toBe(50);
    });

    it('should return 0 if the parsed value is NaN', () => {
        let style: any = {
            getPropertyValue: (propertyName: string) => {
                if (propertyName === 'padding-right') {
                    return 'this is not a number';
                } else {
                    fail();
                }
            }
        };

        expect(parsePadding(style, 'right')).toBe(0);
    });
});
