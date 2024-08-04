import {type JwtPayload} from "jwt-decode";

export interface JwtState {
    jwt: string,
    refreshToken: string,
    jwtExpiresAt: Date,
    refreshTokenExpiresAt: Date,
}

export interface JwtResponse {
    jwt: string,
    refreshToken: string,
    refreshTokenExpiresAt: string,
}

export interface LoginRequest {
    userName: string,
    password: string,
}

export interface RegisterRequest {
    userName: string,
    password: string,
}

export interface LogoutRequest {
    jwt: string,
    refreshToken: string,
}

export interface RefreshRequest {
    jwt: string,
    refreshToken: string,
}

export interface Role {
    id: string,
    name: string,
    normalizedName: string,
}

export interface User {
    id: string,
    userName: string,
    normalizedUserName: string,
    isApproved: boolean,
    roles: Role[],
}

export interface UserDetails {
    user: User,
}

export interface AuthState {
    jwtState: JwtState | null,
    userDetails: UserDetails | null,
}

export class LoginRequiredError extends Error {
}

export enum AuthBehavior {
    RequireAuth = 'RequireAuth',
    AllowAnonymous = 'AllowAnonymous',
    SkipAuth = 'SkipAuth',
}

export const JwtClaims = Object.freeze({
    name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    roles: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
});

export type DecodedJwt = JwtPayload & {
    [JwtClaims.name]: string,
    [JwtClaims.roles]: string,
}