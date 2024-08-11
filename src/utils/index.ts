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
