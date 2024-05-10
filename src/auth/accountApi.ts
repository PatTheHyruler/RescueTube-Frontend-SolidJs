import {api} from "../services/api";
import {AuthBehavior, JwtResponse, LoginRequest, LogoutRequest, RefreshRequest, UserDetails} from "./authTypes";

const login = async (data: LoginRequest) => {
    return await api.axios.post<JwtResponse>('/v1/Account/Login', data, {authBehavior: AuthBehavior.SkipAuth});
}

const logout = async (data: LogoutRequest) => {
    return await api.axios.post('/v1/Account/Logout', data, {authBehavior: AuthBehavior.SkipAuth});
}

const getCurrentUserDetails = async () => {
    return await api.axios.get<UserDetails>('/v1/Account/Me');
}

const refreshToken = async (data: RefreshRequest) => {
    return await api.axios.post<JwtResponse>('/v1/Account/RefreshToken', data, {authBehavior: AuthBehavior.SkipAuth});
}

export const accountApi = {
    login,
    logout,
    getCurrentUserDetails,
    refreshToken,
}