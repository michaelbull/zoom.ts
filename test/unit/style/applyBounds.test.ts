import { Bounds } from '../../../src/math';
import { applyBounds } from '../../../src/style';

describe('applyBounds', () => {
    let style: any;

    beforeAll(() => {
        style = {
            left: '5em',
            top: '2em',
            width: '100px',
            maxWidth: '200px',
            height: '50px'
        };

        let bounds: Bounds = {
            position: {
                x: 20,
                y: 170
            },
            size: {
                x: 95,
                y: 240
            }
        };

        applyBounds(style, bounds);
    });

    it('sets the left property', () => {
        expect(style.left).toBe('20px');
    });

    it('sets the top property', () => {
        expect(style.top).toBe('170px');
    });

    it('sets the width property', () => {
        expect(style.width).toBe('95px');
    });

    it('sets the max-width property', () => {
        expect(style.maxWidth).toBe('95px');
    });

    it('sets the height property', () => {
        expect(style.height).toBe('240px');
    });
});
