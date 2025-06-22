export const limitedFileNameRegex = /^[a-zA-Z0-9_-][a-zA-Z0-9_\-.]*$/;

export const youTubeCookieFileNameMaxLength = 30;

export const validateYouTubeCookieFileName = (
    value: string | null | undefined,
) => {
    if (!value) {
        return undefined;
    }
    if (value.length > youTubeCookieFileNameMaxLength) {
        return 'Filename must be less than 30 characters long.';
    }
    if (!limitedFileNameRegex.test(value)) {
        return 'Disallowed filename.';
    }
    return undefined;
};
