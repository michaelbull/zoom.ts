import {
    clientDimensions,
    targetDimensions
} from '../../../lib/element/Element';

describe('clientDimensions', () => {
    it('should return the clientWidth', () => {
        let element: any = { clientWidth: 330 };
        expect(clientDimensions(element)[0]).toBe(330);
    });

    it('should return the clientHeight', () => {
        let element: any = { clientHeight: 440 };
        expect(clientDimensions(element)[1]).toBe(440);
    });
});

describe('targetDimensions', () => {
    it('should return the specified width if the data-width attribute is present', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-width') {
                    return '550';
                } else {
                    return null;
                }
            }
        };

        expect(targetDimensions(element)[0]).toBe(550);
    });

    it('should return the specified height if the data-height attribute is present', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-height') {
                    return '660';
                } else {
                    return null;
                }
            }
        };

        expect(targetDimensions(element)[1]).toBe(660);
    });

    it('should return Infinity as the width if the data-width attribute is absent', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-width') {
                    return null;
                } else {
                    return '500';
                }
            }
        };

        expect(targetDimensions(element)[0]).toBe(Infinity);
    });

    it('should return Infinity as the height if the data-height attribute is absent', () => {
        let element: any = {
            getAttribute: (attribute: string): string | null => {
                if (attribute === 'data-height') {
                    return null;
                } else {
                    return '600';
                }
            }
        };

        expect(targetDimensions(element)[1]).toBe(Infinity);
    });
});
