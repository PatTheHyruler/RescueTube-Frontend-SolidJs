import {DecodedJwt, JwtResponse, JwtState} from "./authTypes";
import {jwtDecode} from "jwt-decode";

export const processJwtResponse = (jwtResponse: JwtResponse): JwtState => {
    const jwtDecoded = jwtDecode<DecodedJwt>(jwtResponse.jwt);
    return {
        jwt: jwtResponse.jwt,
        jwtExpiresAt: new Date(jwtDecoded.exp! * 1000),
        refreshToken: jwtResponse.refreshToken,
        refreshTokenExpiresAt: new Date(jwtResponse.refreshTokenExpiresAt),
    };
}

const localStorageKeys = Object.freeze({
    jwtState: Object.freeze({
        JWT: 'JWT',
        JWT_EXPIRES_AT: 'JWT_EXPIRES_AT',
        REFRESH_TOKEN: 'REFRESH_TOKEN',
        REFRESH_TOKEN_EXPIRES_AT: 'REFRESH_TOKEN_EXPIRES_AT',
    })
});

export const persistJwt = (jwtState: JwtState | null) => {
    if (jwtState == null) {
        clearJwt();
        return;
    }

    const jwtKeys = localStorageKeys.jwtState;
    window.localStorage.setItem(jwtKeys.JWT, jwtState.jwt);
    window.localStorage.setItem(jwtKeys.JWT_EXPIRES_AT, jwtState.jwtExpiresAt.toISOString());
    window.localStorage.setItem(jwtKeys.REFRESH_TOKEN, jwtState.refreshToken);
    window.localStorage.setItem(jwtKeys.REFRESH_TOKEN_EXPIRES_AT, jwtState.refreshTokenExpiresAt.toISOString());
}

export const clearJwt = () => {
    Object.values(localStorageKeys.jwtState).forEach(key => {
        window.localStorage.removeItem(key);
    })
}

export const readPersistedJwt = (): JwtState | null => {
    const jwtKeys = localStorageKeys.jwtState;

    const jwt = window.localStorage.getItem(jwtKeys.JWT);
    const jwtExpiresAtString = window.localStorage.getItem(jwtKeys.JWT_EXPIRES_AT);
    const refreshToken = window.localStorage.getItem(jwtKeys.REFRESH_TOKEN);
    const refreshTokenExpiresAtString = window.localStorage.getItem(jwtKeys.REFRESH_TOKEN_EXPIRES_AT);

    if (!(jwt && jwtExpiresAtString && refreshToken && refreshTokenExpiresAtString)) {
        return null;
    }

    const jwtExpiresAt = new Date(jwtExpiresAtString);
    const refreshTokenExpiresAt = new Date(refreshTokenExpiresAtString);

    if ([jwtExpiresAt, refreshTokenExpiresAt].some(d => isNaN(d.valueOf()))) {
        return null;
    }

    return {
        jwt,
        refreshToken,
        jwtExpiresAt,
        refreshTokenExpiresAt,
    };
}