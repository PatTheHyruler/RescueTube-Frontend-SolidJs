import type { Fetchable, TextTranslationDtoV1 } from '@/apiModels';
import { DateTime } from 'luxon';

export const isGuid = (value: unknown): boolean => {
    return (
        typeof value === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value,
        )
    );
};

export const translationToString = (
    translations: TextTranslationDtoV1[] | null | undefined,
) => {
    if (!translations || !translations.length || !translations[0]) {
        return '';
    }
    return translations.toSorted((a, b) =>
        (getDate(b.validSince)?.getTime() ?? 0) - (getDate(a.validSince)?.getTime() ?? 0))[0]?.content ?? '';
};

export type DateOrStringNullable = Date | string | null | undefined;

export const getDate = (value: DateOrStringNullable) => {
    let dateValue: Date | null = null;
    if (value instanceof Date) {
        dateValue = value;
    } else if (typeof value === 'string' && value) {
        dateValue = new Date(value);
    }
    return dateValue;
};

export const getDateTime = (value: DateOrStringNullable) => {
    if (value instanceof Date) {
        return DateTime.fromJSDate(value);
    }
    if (typeof value === 'string' && value) {
        return DateTime.fromISO(value);
    }
    if (!value) {
        return null;
    }
    return DateTime.invalid('Unknown parameter type', `Value: ${value}`);
};

export const getUnixTimeMillisOrMinimum = (value: Date | null | undefined) => {
    return value?.getTime() ?? Number.MIN_VALUE;
};

export const isLikelyDeleted = (entity: Fetchable) => {
    const diff =
        getUnixTimeMillisOrMinimum(getDate(entity.lastUnsuccessfulFetch)) -
        getUnixTimeMillisOrMinimum(getDate(entity.lastSuccessfulFetch));
    return diff > 24 * 60 * 1000;
};

export type Values<TObject> = TObject[keyof TObject];

export function tryParseObjEnum<TEnumObj extends Record<string, string>>(
    input: string | null | undefined,
    enumObj: TEnumObj,
    caseSensitive: boolean = false,
): Values<TEnumObj> | null {
    const values = Object.values(enumObj);
    const comparer: (value: string) => boolean = caseSensitive
        ? (v) => v === input
        : (v) => v.toLowerCase() === input?.toLowerCase();
    return (values.find(comparer) as Values<TEnumObj>) ?? null;
}

export function tryParseInt(value: string | null | undefined): number | null {
    if (value === null || value === undefined) {
        return null;
    }
    const result = parseInt(value);
    if (isNaN(result)) {
        return null;
    }
    return result;
}

export function tryParseBool(value: string | null | undefined): boolean | null {
    if (value === null || value === undefined) {
        return null;
    }
    value = value.trim().toLowerCase();
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return null;
}

export function reduceForSearchParams<TValues extends object>(
    values: TValues,
    defaultValues?: TValues | null,
): Partial<TValues> {
    const result: Partial<TValues> = {};
    Object.entries(values).forEach(([key, value]) => {
        const typedKey = key as keyof TValues;
        const defaultValue = defaultValues?.[typedKey];
        if (value !== undefined && value !== defaultValue) {
            result[typedKey] = value;
        }
    });
    return result;
}

type ExcludeUndefinedFields<T> = T extends unknown[]
    ? T
    : T extends object
      ? {
            [K in keyof T]-?: Exclude<ExcludeUndefinedFields<T[K]>, undefined>;
        }
      : T;

export function excludeUndefinedFields<T extends Record<string, unknown>>(
    obj: T,
): ExcludeUndefinedFields<T> {
    if (Array.isArray(obj)) {
        return obj as ExcludeUndefinedFields<T>;
    }
    const result: Record<string, unknown> = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined) {
            if (value !== null && typeof value === 'object') {
                result[key] = excludeUndefinedFields(value as Record<string, unknown>);
            } else {
                result[key] = value;
            }
        }
    });
    return result as ExcludeUndefinedFields<T>;
}

export type DeepPartial<T> = T extends unknown[]
    ? T
    : T extends object
      ? { [P in keyof T]?: DeepPartial<T[P]> }
      : T;

export function getNextIndeterminateBooleanState(current: boolean | undefined) {
    if (current === undefined) {
        return true;
    }
    if (current) {
        return false;
    }
    return undefined;
}
