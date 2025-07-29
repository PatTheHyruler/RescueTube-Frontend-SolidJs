import { describe, expect, it } from 'vitest';
import { clone } from '@/utils';

describe('clone', () => {
    it('should deep clone nested object', () => {
        // Arrange
        const source = {
            a: {
                b: {
                    c: 1,
                },
            },
        };

        // Act
        const result = clone(source);

        // Assert
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        // (Sanity check; should already be covered by previous assertions)
        expect(result.a.b).toEqual(source.a.b);
        expect(result.a.b).not.toBe(source.a.b);
    });

    it('should deep clone nested array', () => {
        // Arrange
        const source = {
            a: [1, 2, 3],
        };

        // Act
        const result = clone(source);

        // Assert
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        // (Sanity check; should already be covered by previous assertions)
        expect(result.a.length).toEqual(source.a.length);
        expect(result.a).not.toBe(source.a);
    });

    it('should deep clone nested object array', () => {
        // Arrange
        const source = {
            a: [{ b: 1 }, { c: 2 }],
        };

        // Act
        const result = clone(source);

        // Assert
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        // (Sanity checks; should already be covered by previous assertions)
        expect(result.a.length).toEqual(source.a.length);
        expect(result.a).not.toBe(source.a);
        expect(result.a[0]).toEqual(source.a[0]);
        expect(result.a[0]).not.toBe(source.a[0]);
        expect(result.a[1]).toEqual(source.a[1]);
        expect(result.a[1]).not.toBe(source.a[1]);
    });

    it('should clone array of primitives', () => {
        // Arrange
        const source = [1, 2, 3];

        // Act
        const result = clone(source);

        // Assert
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
    });

    it('should deep clone array of objects', () => {
        // Arrange
        const source = [{ a: 1 }, { b: 2 }];

        // Act
        const result = clone(source);

        // Assert
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        // (Sanity checks; should already be covered by previous assertions)
        expect(result.length).toEqual(source.length);
        expect(result).not.toBe(source);
        expect(result[0]).toEqual(source[0]);
        expect(result[0]).not.toBe(source[0]);
        expect(result[1]).toEqual(source[1]);
        expect(result[1]).not.toBe(source[1]);
    });
});
