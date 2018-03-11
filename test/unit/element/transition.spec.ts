import * as element from '../../../src/element/element';
import * as style from '../../../src/element/style';
import { ignoreTransitions } from '../../../src/element/transition';

describe('ignoreTransitions', () => {
    it('should set the transition property to initial before calling the callback', () => {
        let example: any = {
            style: {
                transition: 'example'
            }
        };
        spyOn(element, 'repaint');
        spyOn(style, 'resetStyle');

        ignoreTransitions(example, 'transition', () => {
            expect(example.style.transition).toBe('initial');
        });
    });

    it('should repaint the element after calling the callback', () => {
        let example: any = {
            style: {
                transition: 'example'
            }
        };
        let callback: jasmine.Spy = jasmine.createSpy('callback');
        let repaint: jasmine.Spy = spyOn(element, 'repaint').and.callFake(() => {
            expect(callback).toHaveBeenCalled();
        });
        spyOn(style, 'resetStyle');

        ignoreTransitions(example, 'transition', callback);

        expect(repaint).toHaveBeenCalledWith(example);
    });

    it('should reset the transition property after calling the callback and repainting', () => {
        let example: any = {
            style: {
                transition: 'example'
            }
        };
        let callback: jasmine.Spy = jasmine.createSpy('callback');
        let repaint: jasmine.Spy = spyOn(element, 'repaint');
        let resetStyle: jasmine.Spy = spyOn(style, 'resetStyle').and.callFake(() => {
            expect(callback).toHaveBeenCalled();
            expect(repaint).toHaveBeenCalled();
        });

        ignoreTransitions(example, 'transition', callback);

        expect(resetStyle).toHaveBeenCalledWith(example.style, 'transition');
    });
});
