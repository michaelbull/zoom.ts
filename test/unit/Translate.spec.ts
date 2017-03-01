import {
    translate3d,
    translate
} from '../../lib/Translate';

describe('translate3d', () => {
    it('should return the correct string', () => {
        expect(translate3d(50, 120)).toBe('translate3d(50px, 120px, 0)');
    });
});

describe('translate', () => {
    it('should return the correct string', () => {
        expect(translate(90, 35)).toBe('translate(90px, 35px)');
    });
});
