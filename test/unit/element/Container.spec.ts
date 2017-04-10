import * as Document from '../../../lib/browser/Document';
import {
    CLASS,
    createContainer,
    isContainer
} from '../../../lib/element/Container';

describe('createContainer', () => {
    it('should create a div element with the correct class', () => {
        let createDiv: jasmine.Spy = spyOn(Document, 'createDiv');

        createContainer();

        expect(createDiv).toHaveBeenCalledWith(CLASS);
    });
});

describe('isContainer', () => {
    it('should return true if the container class is present', () => {
        let container: any = { className: CLASS };
        expect(isContainer(container)).toBe(true);
    });

    it('should return false if the container class is absent', () => {
        let container: any = { className: '' };
        expect(isContainer(container)).toBe(false);
    });
});
