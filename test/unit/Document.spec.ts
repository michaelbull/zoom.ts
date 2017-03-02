import { ready } from '../../lib/Document';

describe('ready', () => {
    it('should execute the callback immediately if the document is ready', () => {
        let document: any = {
            readyState: 'complete',
            addEventListener: jasmine.createSpy('EventListener')
        };

        let callback: jasmine.Spy = jasmine.createSpy('Function');
        ready(document, callback);

        expect(callback).toHaveBeenCalled();
        expect(document.addEventListener).toHaveBeenCalledTimes(0);
    });

    it('should add an event listener for the DOMContentLoaded event if the document is not ready', () => {
        let document: any = {
            readyState: 'loading',
            addEventListener: jasmine.createSpy('EventListener')
        };

        let callback: jasmine.Spy = jasmine.createSpy('Function');
        ready(document, callback);

        expect(callback).toHaveBeenCalledTimes(0);
        expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', jasmine.any(Function));
    });
});
