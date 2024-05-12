import {baseApi} from "../services/baseApi";
import {
    AuthBehavior,
    JwtResponse,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    UserDetails
} from "./authTypes";

const register = async (data: RegisterRequest) => {
    return await baseApi.axios.post<JwtResponse>('/v1/Account/Register', data, {authBehavior: AuthBehavior.SkipAuth});
}

const login = async (data: LoginRequest) => {
    return await baseApi.axios.post<JwtResponse>('/v1/Account/Login', data, {authBehavior: AuthBehavior.SkipAuth});
}

const logout = async (data: LogoutRequest) => {
    return await baseApi.axios.post('/v1/Account/Logout', data, {authBehavior: AuthBehavior.SkipAuth});
}

const getCurrentUserDetails = async () => {
    return await baseApi.axios.get<UserDetails>('/v1/Account/Me');
}

const refreshToken = async (data: RefreshRequest) => {
    return await baseApi.axios.post<JwtResponse>('/v1/Account/RefreshToken', data, {authBehavior: AuthBehavior.SkipAuth});
}

export const accountApi = {
    register,
    login,
    logout,
    getCurrentUserDetails,
    refreshToken,
}