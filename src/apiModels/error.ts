export enum ErrorTypes {
    GenericError = 'GenericError',
    EntityNotFound = 'EntityNotFound',

    InvalidLoginCredentials = 'InvalidLoginCredentials',
    InvalidRegistrationData = 'InvalidRegistrationData',
    RegistrationDisabled = 'RegistrationDisabled',
    UserNotApproved = 'UserNotApproved',

    InvalidJwt = 'InvalidJwt',
    InvalidRefreshToken = 'InvalidRefreshToken',

    UnrecognizedUrl = 'UnrecognizedUrl',
    SubmissionEntityNotFound = 'SubmissionEntityNotFound',
}

export type ErrorType = `${ErrorTypes}` | string;

export interface ErrorResponseDto {
    errorType: ErrorType;
    message?: string;
    details?: object;
    subErrors: ErrorResponseDto[];
}

export function isErrorResponseDto(value: unknown): value is ErrorResponseDto {
    if (value === undefined || value === null) {
        return false;
    }
    const potentialErrorValue = value as ErrorResponseDto;
    return !!potentialErrorValue.errorType && typeof potentialErrorValue.errorType === 'string';
}
