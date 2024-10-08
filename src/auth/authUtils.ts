import { baseApi } from '../services/baseApi';
import { type InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { accountApi } from './accountApi';
import {
    AuthBehavior,
    type JwtState,
    LoginRequiredError,
    type User,
} from './authTypes';
import { processJwtResponse } from './jwtStorage';
import { Roles } from './Roles';

export const interceptorAuthState = {
    jwtState: null as JwtState | null,
    setJwtState: (() => {}) as (jwtState: JwtState | null) => void,
    ongoingRefreshPromise: null as Promise<JwtState | null> | null,
};

const refreshToken = async () => {
    if (interceptorAuthState.ongoingRefreshPromise != null) {
        return await interceptorAuthState.ongoingRefreshPromise;
    }
    const refreshPromise = _refreshToken();
    interceptorAuthState.ongoingRefreshPromise = refreshPromise;
    const completedRefreshPromise = await refreshPromise;
    interceptorAuthState.ongoingRefreshPromise = null;
    return completedRefreshPromise;
};

const _refreshToken = async (): Promise<JwtState | null> => {
    try {
        if (
            interceptorAuthState.jwtState &&
            !isTimeInPast(interceptorAuthState.jwtState.refreshTokenExpiresAt)
        ) {
            const response = await accountApi.refreshToken(
                interceptorAuthState.jwtState
            );
            const jwtState = processJwtResponse(response.data);
            interceptorAuthState.setJwtState(jwtState);
            interceptorAuthState.jwtState = jwtState;
            return jwtState;
        }
    } catch (error) {
        return null;
    }

    return null;
};

const isTimeInPast = (time: Date) => {
    const currentTimestampMilliseconds = new Date().getTime();
    const timeInPast = currentTimestampMilliseconds - 1000 * 5;
    return time.getTime() < timeInPast;
};

export const registerAuthInterceptors = () => {
    baseApi.axios.interceptors.request.use(async (config) => {
        if (!config.authBehavior) {
            config.authBehavior = AuthBehavior.RequireAuth;
        }

        if (config.authBehavior === AuthBehavior.SkipAuth) {
            return config;
        }

        const jwtState = interceptorAuthState.jwtState;
        if (!jwtState) {
            if (config.authBehavior === AuthBehavior.RequireAuth) {
                throw new LoginRequiredError();
            }
            return config;
        }

        if (!isTimeInPast(jwtState.jwtExpiresAt)) {
            setAuthHeader(config, jwtState.jwt);
            return config;
        }

        const jwtResponse = await refreshToken();
        if (jwtResponse) {
            setAuthHeader(config, jwtResponse.jwt);
            return config;
        }

        if (config.authBehavior === AuthBehavior.RequireAuth) {
            throw new LoginRequiredError();
        }

        return config;
    });
    baseApi.axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (
                isAxiosError(error) &&
                error.config?.authBehavior !== AuthBehavior.SkipAuth
            ) {
                if (
                    error.response?.status === 401 &&
                    error.config?.headers.Authorization
                ) {
                    const config = error.config;
                    if (
                        !config.tokenRefreshAttempted &&
                        interceptorAuthState.jwtState &&
                        !isTimeInPast(
                            interceptorAuthState.jwtState.refreshTokenExpiresAt
                        )
                    ) {
                        config.tokenRefreshAttempted = true;
                        const jwtResponse = await refreshToken();
                        if (!jwtResponse) {
                            throw new LoginRequiredError();
                        }
                        setAuthHeader(error.config, jwtResponse.jwt);
                        return await baseApi.axios.request(config);
                    }

                    throw new LoginRequiredError();
                }
            }

            throw error;
        }
    );
};

const setAuthHeader = (request: InternalAxiosRequestConfig, jwt: string) => {
    request.headers.Authorization = `Bearer ${jwt}`;
};

export const getValidationErrors = (error: any) => {
    // TODO: better errors (also on API side)
    if (isAxiosError(error) && error.response?.data) {
        return ['Error: ' + JSON.stringify(error.response.data)];
    } else {
        return 'Unknown error occurred.';
    }
};

export const isInRole = (user: User | null | undefined, ...roles: string[]) => {
    if (!user) {
        return false;
    }
    return roles.some((role) => user.roles.some((ur) => ur.name === role));
};

export const isAdmin = (user: User | null | undefined) => {
    return isInRole(user, ...Roles.AdminRoles);
};
