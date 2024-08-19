import type { Fetchable, TextTranslationDtoV1 } from '../apiModels';

export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const isGuid = (value: any): boolean => {
    return (
        typeof value === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value
        )
    );
};

export const translationToString = (
    translations: TextTranslationDtoV1[] | null | undefined
) => {
    if (!translations || !translations.length || !translations[0]) {
        return '';
    }
    return translations[0].content;
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

export const getUnixTimeMillisOrMinimum = (value: Date | null | undefined) => {
    return value?.getTime() ?? Number.MIN_VALUE;
};

export const getLatest = (a: DateOrStringNullable, b: DateOrStringNullable) => {
    const aDate = getDate(a);
    const bDate = getDate(b);
    return getUnixTimeMillisOrMinimum(aDate) > getUnixTimeMillisOrMinimum(bDate)
        ? aDate
        : (bDate ?? aDate);
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
    caseSensitive: boolean = false
): Values<TEnumObj> | null {
    let values = Object.values(enumObj);
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

export function reduceForSearchParams<TValues extends Record<string, any>>(
    values: TValues,
    defaultValues?: TValues | null
): Partial<TValues> {
    const result: Partial<TValues> & Record<string, any> = {};
    Object.entries(values).forEach(([key, value]) => {
        const defaultValue = defaultValues?.[key];
        if (value !== undefined && value !== defaultValue) {
            (result as Record<string, any>)[key] = value;
        }
    });
    return result;
}

type ExcludeUndefinedFields<T> = Omit<
    T,
    { [K in keyof T]: T[K] extends undefined ? K : never }[keyof T]
>;

export function excludeUndefinedFields<T extends Record<string, any>>(
    obj: T
): ExcludeUndefinedFields<T> {
    const result: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined) {
            result[key] = value;
        }
    });
    return result as ExcludeUndefinedFields<T>;
}
