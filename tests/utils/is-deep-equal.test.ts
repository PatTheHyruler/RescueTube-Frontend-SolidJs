import { describe, expect, it } from 'vitest';
import { isDeepEqual } from '@/utils';

describe('isDeepEqual', () => {
    it('should return false when {} != {"name": "asdf"}', () => {
        // Act
        const result = isDeepEqual({}, { name: 'test' });

        // Assert
        expect(result).toBe(false);
    });
});