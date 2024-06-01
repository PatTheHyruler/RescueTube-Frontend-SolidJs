import {TextTranslationDtoV1} from "../apiModels";

export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const isGuid = (value: any): boolean => {
    return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const translationToString = (translations: TextTranslationDtoV1[] | null | undefined) => {
    if (!translations || !translations.length) {
        return '';
    }
    return translations[0].content;
}