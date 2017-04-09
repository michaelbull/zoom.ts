import * as ClassList from '../../../lib/element/ClassList';
import {
    CLASS,
    createContainer,
    isContainer
} from '../../../lib/element/Container';
import * as Document from '../../../lib/window/Document';

describe('createContainer', () => {
    it('should create a div element with the correct class', () => {
        let document: jasmine.Spy = jasmine.createSpy('document');
        let createDiv: jasmine.Spy = spyOn(Document, 'createDiv');

        createContainer(document as any);

        expect(createDiv).toHaveBeenCalledWith(document, CLASS);
    });
});

describe('isContainer', () => {
    it('should call hasClass with the container class', () => {
        let element: jasmine.Spy = jasmine.createSpy('element');
        let hasClass: jasmine.Spy = spyOn(ClassList, 'hasClass');

        isContainer(element as any);

        expect(hasClass).toHaveBeenCalledWith(element, CLASS);
    });
});
