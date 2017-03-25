import {
    hideOverlay,
    showOverlay
} from '../../lib/Overlay';

describe('showOverlay', () => {
    it('should be appended to the node', () => {
        let node: any = {
            appendChild: jasmine.createSpy('appendChild')
        };
        let overlay: any = {
            className: 'example-overlay'
        };

        showOverlay(node, overlay);
        expect(node.appendChild).toHaveBeenCalledWith(overlay);
    });

    it('should add the visible class', () => {
        let node: any = {
            appendChild: jasmine.createSpy('appendChild')
        };
        let overlay: any = {
            className: 'this-is-an-overlay'
        };

        showOverlay(node, overlay);
        expect(overlay.className).toBe('this-is-an-overlay zoom__overlay--visible');
    });
});

describe('hideOverlay', () => {
    it('should remove the visible class', () => {
        let overlay: any = {
            className: 'example-overlay zoom__overlay--visible'
        };

        hideOverlay(overlay);
        expect(overlay.className).toBe('example-overlay');
    });
});
