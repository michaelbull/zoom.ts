import * as Document from '../../../lib/browser/Document';
import { rootElement } from '../../../lib/browser/Document';
import { pageScrollY } from '../../../lib/browser/Window';

describe('pageScrollY', () => {
    it('should use window.pageYOffset if present', () => {
        let window: any = { pageYOffset: 50 };
        expect(pageScrollY(window)).toBe(50);
    });

    it('should fall back to the root element’s scrollTop if window.pageYOffset is absent', () => {
        let window: any = {};
        let root: any = { scrollTop: 250 };
        spyOn(Document, 'rootElement').and.returnValue(root);

        expect(pageScrollY(window)).toBe(250);
    });
});
