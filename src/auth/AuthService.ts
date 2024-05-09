import axios from "axios";
import {JwtResponse} from "./model/JwtResponse";
import {JwtPayload} from "jwt-decode";

const baseApi = `https://${window.location.hostname}:7125/api`;

export const login = async (username: string, password: string) => {
    const r = await axios.post<JwtResponse>(`${baseApi}/v1/Account/Login`, {
        username,
        password,
    });
    return r.data;
}

export const logout = async (jwt: string, refreshToken: string) => {
    await axios.post(`${baseApi}/v1/Account/Logout`, {jwt, refreshToken});
}

export const JwtClaims = Object.freeze({
    name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    roles: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
});

export const authService = {
    login,
    logout,
}