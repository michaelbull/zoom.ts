import { pageScrollY } from '../../../../src/dom/window';

let root: any = {
    scrollTop: 250
};

jest.mock('../../../../src/dom/document/rootElement', () => ({
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
