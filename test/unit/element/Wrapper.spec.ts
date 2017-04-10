import * as ClassList from '../../../lib/element/ClassList';
import {
    COLLAPSING_CLASS,
    EXPANDED_CLASS,
    EXPANDING_CLASS,
    isWrapperCollapsing,
    isWrapperExpanded,
    isWrapperExpanding,
    isWrapperTransitioning,
    setWrapperExpanded,
    startCollapsingWrapper,
    startExpandingWrapper,
    stopCollapsingWrapper,
    stopExpandingWrapper,
    unsetWrapperExpanded
} from '../../../lib/element/Wrapper';

describe('isWrapperExpanding', () => {
    it('should return true if the expanding class is present', () => {
        let wrapper: any = { className: EXPANDING_CLASS };
        expect(isWrapperExpanding(wrapper)).toBe(true);
    });

    it('should return false if the expanding class is absent', () => {
        let wrapper: any = { className: '' };
        expect(isWrapperExpanding(wrapper)).toBe(false);
    });
});

describe('startExpandingWrapper', () => {
    it('should add the expanding class to the wrapper', () => {
        let wrapper: jasmine.Spy = jasmine.createSpy('wrapper');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');

        startExpandingWrapper(wrapper as any);

        expect(addClass).toHaveBeenCalledWith(wrapper, EXPANDING_CLASS);
    });
});

describe('stopExpandingWrapper', () => {
    it('should remove the expanding class from the wrapper', () => {
        let wrapper: jasmine.Spy = jasmine.createSpy('wrapper');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        stopExpandingWrapper(wrapper as any);

        expect(removeClass).toHaveBeenCalledWith(wrapper, EXPANDING_CLASS);
    });
});

describe('isWrapperExpanded', () => {
    it('should return true if the expanded class is present', () => {
        let wrapper: any = { className: EXPANDED_CLASS };
        expect(isWrapperExpanded(wrapper)).toBe(true);
    });

    it('should return false if the expanded class is absent', () => {
        let wrapper: any = { className: '' };
        expect(isWrapperExpanded(wrapper)).toBe(false);
    });
});

describe('setWrapperExpanded', () => {
    it('should add the expanded class to the wrapper', () => {
        let wrapper: jasmine.Spy = jasmine.createSpy('wrapper');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');

        setWrapperExpanded(wrapper as any);

        expect(addClass).toHaveBeenCalledWith(wrapper, EXPANDED_CLASS);
    });
});

describe('unsetWrapperExpanded', () => {
    it('should remove the expanded class from the wrapper', () => {
        let wrapper: jasmine.Spy = jasmine.createSpy('wrapper');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        unsetWrapperExpanded(wrapper as any);

        expect(removeClass).toHaveBeenCalledWith(wrapper, EXPANDED_CLASS);
    });
});

describe('isWrapperCollapsing', () => {
    it('should return true if the collapsing class is present', () => {
        let wrapper: any = { className: COLLAPSING_CLASS };
        expect(isWrapperCollapsing(wrapper)).toBe(true);
    });

    it('should return false if the collapsing class is absent', () => {
        let wrapper: any = { className: '' };
        expect(isWrapperCollapsing(wrapper)).toBe(false);
    });
});

describe('startCollapsingWrapper', () => {
    it('should add the collapsing class to the wrapper', () => {
        let wrapper: jasmine.Spy = jasmine.createSpy('wrapper');
        let addClass: jasmine.Spy = spyOn(ClassList, 'addClass');

        startCollapsingWrapper(wrapper as any);

        expect(addClass).toHaveBeenCalledWith(wrapper, COLLAPSING_CLASS);
    });
});

describe('stopCollapsingWrapper', () => {
    it('should remove the collapsing class from the wrapper', () => {
        let wrapper: jasmine.Spy = jasmine.createSpy('wrapper');
        let removeClass: jasmine.Spy = spyOn(ClassList, 'removeClass');

        stopCollapsingWrapper(wrapper as any);

        expect(removeClass).toHaveBeenCalledWith(wrapper, COLLAPSING_CLASS);
    });
});

describe('isWrapperTransitioning', () => {
    it('should return true if the expanding class is present', () => {
        let wrapper: any = { className: EXPANDING_CLASS };
        expect(isWrapperTransitioning(wrapper)).toBe(true);
    });

    it('should return true if the collapsing class is present', () => {
        let wrapper: any = { className: COLLAPSING_CLASS };
        expect(isWrapperTransitioning(wrapper)).toBe(true);
    });

    it('should return false if the expanding and collapsing classes are absent', () => {
        let wrapper: any = { className: '' };
        expect(isWrapperTransitioning(wrapper)).toBe(false);
    });
});
