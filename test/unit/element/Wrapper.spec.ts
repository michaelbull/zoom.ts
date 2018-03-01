import { isWrapperTransitioning } from '../../../lib/dom/Wrapper';

describe('isWrapperTransitioning', () => {
    let config: any;

    beforeEach(() => {
        config = {
            wrapperExpandingClass: 'wrapper-expanding',
            wrapperCollapsingClass: 'wrapper-collapsing'
        };
    });

    it('should return true if the expanding class is present', () => {
        let wrapper: any = { className: config.wrapperExpandingClass };
        expect(isWrapperTransitioning(config, wrapper)).toBe(true);
    });

    it('should return true if the collapsing class is present', () => {
        let wrapper: any = { className: config.wrapperCollapsingClass };
        expect(isWrapperTransitioning(config, wrapper)).toBe(true);
    });

    it('should return false if the expanding and collapsing classes are absent', () => {
        let wrapper: any = { className: '' };
        expect(isWrapperTransitioning(config, wrapper)).toBe(false);
    });
});
