import { clone } from '@/utils';
import { describe, expectTypeOf, test } from 'vitest';

describe('clone', () => {
    test('returns correct type for simple interface', () => {
        // Arrange
        interface A {
            a: string;
        }

        const a: A = {
            a: '',
        };

        // Act
        const result = clone(a);

        // Assert
        expectTypeOf(result).toEqualTypeOf<A>();
    });

    test('returns correct type for tuple literal prop', () => {
        const result = clone({
            a: [1, 2] satisfies [1, 2],
        });
        expectTypeOf(result).toEqualTypeOf<{ a: [1, 2] }>();
    });

    test('returns correct type for tuple literal prop with different types', () => {
        const result = clone({
            a: [1, 'b', { c: 'd' }] satisfies [1, 'b', { c: 'd' }],
        });
        expectTypeOf(result).toEqualTypeOf<{ a: [1, 'b', { c: 'd' }] }>();
    });

    test('returns correct type for type union array prop', () => {
        const result = clone({
            a: [1, 'b', { c: 'd' }],
        });
        expectTypeOf(result).toEqualTypeOf<{
            a: (string | number | { c: string })[];
        }>();
    });

    test('returns correct type for nested type union array prop', () => {
        const result =
            clone({
                a: {
                    a: [1, 'b', { c: 'd' }],
                },
            });
        expectTypeOf(result).toEqualTypeOf<{
            a: {
                a: (string | number | { c: string })[];
            };
        }>();
    });

    test('returns correct type for number array', () => {
        const result = clone([1, 2]);
        expectTypeOf(result).toEqualTypeOf<number[]>();
    });

    test('returns correct type for object array', () => {
        const result = clone([{ a: 'b' }]);
        expectTypeOf(result).toEqualTypeOf<{ a: string }[]>();
    });

    describe('disallows function types', () => {
        test('function', () => {
            // @ts-expect-error Clone should not support functions
            clone(() => {});
        });

        test('object with simple function prop', () => {
            // @ts-expect-error Clone should not support functions
            clone({
                f: () => {},
            });
        });

        test('object with non-void function prop', () => {
            // @ts-expect-error Clone should not support functions
            clone({
                f: () => 'Hello world',
            });
        });

        test('nested object with function prop', () => {
            // @ts-expect-error Clone should not support functions
            clone({
                a: 'b',
                c: {
                    d: (e: string) => console.log(e),
                },
            });
        });

        test('function array', () => {
            // @ts-expect-error Clone should not support functions
            clone([() => {}]);
        });

        test('object with function array prop', () => {
            // @ts-expect-error Clone should not support functions
            clone({
                a: [() => {}],
            });
        });
    });

    describe('nesting tests', () => {
        test('returns type error for deeply nested object', () => {
            // @ts-expect-error Very deep nesting should not be allowed
            clone({
                d1: {
                    d2: {
                        d3: {
                            d4: {
                                d5: {
                                    d6: {
                                        d7: {
                                            d8: {
                                                d9: {
                                                    d10: {

                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });

        test('allows slightly nested object', () => {
            clone({
                d1: {
                    d2: {
                        d3: {
                            d4: {
                                d5: {
                                },
                            },
                        },
                    },
                },
            });
        });

        test('returns type error for deeply nested array', () => {
            // @ts-expect-error Very deep nesting should not be allowed
            clone([
                [
                    [
                        [
                            [
                                [
                                    [
                                        [
                                            [
                                                [
                                                    [
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
        });

        test('allows slightly nested array', () => {
            clone([
                [
                    [
                        [
                            [
                                [
                                    [
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
        });

        test('returns type error for deeply nested array + object combo', () => {
            // @ts-expect-error Very deep nesting should not be allowed
            clone({
                d1: [{
                    d2: [{
                        d3: [{
                            d4: [{
                                d5: [{
                                    d6: [{
                                    }],
                                }],
                            }],
                        }],
                    }],
                }],
            });
        });

        test('Allows slightly nested array + object combo', () => {
            clone({
                d1: [{
                    d2: [{
                        d3: [{
                        }],
                    }],
                }],
            });
        });
    });
});
