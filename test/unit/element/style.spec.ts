import {
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

