import {
    resetBounds,
    resetTransformation,
    scaleBy,
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

    beforeEach(() => {
        style = {
            left: 'left',
            top: 'top',
            width: 'width',
            maxWidth: 'max-width',
            height: 'height'
        };
    });

    it('should reset the left property', () => {
        resetBounds(style);
        expect(style.left).toBe('');
    });

    it('should reset the top property', () => {
        resetBounds(style);
        expect(style.top).toBe('');
    });

    it('should reset the width property', () => {
        resetBounds(style);
        expect(style.width).toBe('');
    });

    it('should reset the max-width property', () => {
        resetBounds(style);
        expect(style.maxWidth).toBe('');
    });

    it('should reset the height property', () => {
        resetBounds(style);
        expect(style.height).toBe('');
    });
});

describe('setBoundsPx', () => {
    let style: any;

    beforeEach(() => {
        style = {
            left: '5em',
            top: '2em',
            width: '100px',
            maxWidth: '200px',
            height: '50px'
        };
    });

    it('should set the left property', () => {
        setBoundsPx(style, [20, 170, 95, 240]);
        expect(style.left).toBe('20px');
    });

    it('should set the top property', () => {
        setBoundsPx(style, [50, 130, 155, 0]);
        expect(style.top).toBe('130px');
    });

    it('should set the width property', () => {
        setBoundsPx(style, [500, 22, 103, 999]);
        expect(style.width).toBe('103px');
    });

    it('should set the max-width property', () => {
        setBoundsPx(style, [5, -105, 1011, 1221]);
        expect(style.maxWidth).toBe('1011px');
    });

    it('should set the height property', () => {
        setBoundsPx(style, [344, 55, -5, -300]);
        expect(style.height).toBe('-300px');
    });
});

describe('setHeightPx', () => {
    it('should set the height', () => {
        let style: any = { height: '100px' };
        setHeightPx(style, 244);
        expect(style.height).toBe('244px');
    });
});

describe('unsetHeight', () => {
    it('should unset the height', () => {
        let style: any = { height: '300px' };
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

describe('scaleBy', () => {
    it('should return the correct transformation', () => {
        expect(scaleBy(5)).toBe('scale(5)');
    });
});
