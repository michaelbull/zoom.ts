import { pageScrollY } from '../../../src/browser';

let root: any = {
    scrollTop: 250
};

jest.mock('../../../src/browser/document', () => ({
    rootElement: jest.fn(() => root)
}));

describe('pageScrollY', () => {
    it('uses window.pageYOffset if present', () => {
        let window: any = { pageYOffset: 50 };
        expect(pageScrollY(window)).toBe(50);
    });

    it('falls back to the root element’s scrollTop if window.pageYOffset is absent', () => {
        let window: any = {};
        expect(pageScrollY(window)).toBe(250);
    });
});
