import {
    resetBounds,
    resetTransformation,
    scaleAndTranslate,
    setBoundsPx,
    setHeightPx,
    transform,
    translate,
    unsetHeight
} from '../../../lib/element/Style';

describe('transform', () => {
    it('should set the vendor property if non-null', () => {
        let style: any = { WebkitTransform: '' };
        transform(style, 'expected-value');
        expect(style.WebkitTransform).toBe('expected-value');
    });
});

describe('resetTransformation', () => {
    it('should clear the value assigned to the vendor property', () => {
        let style: any = { MozTransform: '' };
        transform(style, 'after-transform');
        resetTransformation(style);
        expect(style.MozTransform).toBe('');
    });
});

describe('resetBounds', () => {
    let style: any;

    beforeAll(() => {
        style = {
            left: 'left',
            top: 'top',
            width: 'width',
            maxWidth: 'max-width',
            height: 'height'
        };

        resetBounds(style);
    });

    it('should reset the left property', () => {
        expect(style.left).toBe('');
    });

    it('should reset the top property', () => {
        expect(style.top).toBe('');
    });

    it('should reset the width property', () => {
        expect(style.width).toBe('');
    });

    it('should reset the max-width property', () => {
        expect(style.maxWidth).toBe('');
    });

    it('should reset the height property', () => {
        expect(style.height).toBe('');
    });
});

describe('setBoundsPx', () => {
    let style: any;

    beforeAll(() => {
        style = {
            left: '5em',
            top: '2em',
            width: '100px',
            maxWidth: '200px',
            height: '50px'
        };

        setBoundsPx(style, [20, 170], [95, 240]);
    });

    it('should set the left property', () => {
        expect(style.left).toBe('20px');
    });

    it('should set the top property', () => {
        expect(style.top).toBe('170px');
    });

    it('should set the width property', () => {
        expect(style.width).toBe('95px');
    });

    it('should set the max-width property', () => {
        expect(style.maxWidth).toBe('95px');
    });

    it('should set the height property', () => {
        expect(style.height).toBe('240px');
    });
});

describe('setHeightPx', () => {
    it('should set the height', () => {
        let style: any = {
            height: '100px'
        };

        setHeightPx(style, 244);
        expect(style.height).toBe('244px');
    });
});

describe('unsetHeight', () => {
    it('should unset the height', () => {
        let style: any = {
            height: '300px'
        };

        unsetHeight(style);
        expect(style.height).toBe('');
    });
});

describe('translate', () => {
    it('should use translate3d if translate3d is available', () => {
        expect(translate([50, 120], true)).toBe('translate3d(50px, 120px, 0)');
    });

    it('should use translate if translate3d is unavailable', () => {
        expect(translate([90, 35], false)).toBe('translate(90px, 35px)');
    });
});

describe('scaleAndTranslate', () => {
    it('should use translate3d if translate3d is available', () => {
        expect(scaleAndTranslate(5, [10, 20], true)).toBe('scale(5) translate3d(10px, 20px, 0)');
    });

    it('should use translate if translate3d is unavailable', () => {
        expect(scaleAndTranslate(30, [40, 50], false)).toBe('scale(30) translate(40px, 50px)');
    });
});
