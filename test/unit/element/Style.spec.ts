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
import { Bounds } from '../../../lib/math/Bounds';
import { Vector } from '../../../lib/math/Vector';

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
        let position: Vector = [20, 170];
        let size: Vector = [95, 240];
        let bounds: Bounds = [position, size];

        setBoundsPx(style, bounds);

        expect(style.left).toBe('20px');
    });

    it('should set the top property', () => {
        let position: Vector = [50, 130];
        let size: Vector = [155, 0];
        let bounds: Bounds = [position, size];

        setBoundsPx(style, bounds);

        expect(style.top).toBe('130px');
    });

    it('should set the width property', () => {
        let position: Vector = [500, 22];
        let size: Vector = [103, 999];
        let bounds: Bounds = [position, size];

        setBoundsPx(style, bounds);

        expect(style.width).toBe('103px');
    });

    it('should set the max-width property', () => {
        let position: Vector = [5, -105];
        let size: Vector = [1011, 1221];
        let bounds: Bounds = [position, size];

        setBoundsPx(style, bounds);

        expect(style.maxWidth).toBe('1011px');
    });

    it('should set the height property', () => {
        let position: Vector = [344, 55];
        let size: Vector = [-5, -300];
        let bounds: Bounds = [position, size];

        setBoundsPx(style, bounds);

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
