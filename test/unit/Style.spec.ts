import {
    freezeWrapperHeight,
    resetBounds,
    resetTransformation,
    setBoundsPx,
    transform,
    unfreezeWrapperHeight
} from '../../lib/Style';

describe('transform', () => {
    it('should set the vendor property if non-null', () => {
        let style: any = { WebkitTransform: '' };
        transform(style, 'expected-value');
        expect(style.WebkitTransform).toBe('expected-value');
    });
});

describe('resetTransformation', () => {
    it('should clear the vendor property', () => {
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

        setBoundsPx(style, 20, 170, 95, 240);
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

describe('freezeWrapperHeight', () => {
    it('should set the wrapper’s height to the image’s height', () => {
        let wrapper: any = {
            style: {
                height: '100px'
            }
        };

        let image: any = {
            height: 244
        };

        freezeWrapperHeight(wrapper, image);
        expect(wrapper.style.height).toBe('244px');
    });
});

describe('unfreezeWrapperHeight', () => {
    it('should reset the wrapper’s height', () => {
        let wrapper: any = {
            style: {
                height: '300px'
            }
        };

        unfreezeWrapperHeight(wrapper);
        expect(wrapper.style.height).toBe('');
    });
});
