import { defaultConfig } from '../../lib/Config';

describe('defaultConfig', () => {
    describe('scrollDismissPx', () => {
        it('should default to 50', () => {
            expect(defaultConfig().scrollDismissPx).toBe(50);
        });
    });
});
