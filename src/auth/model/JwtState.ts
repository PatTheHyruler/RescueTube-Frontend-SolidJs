export interface JwtState {
    jwt: string,
    refreshToken: string,
    jwtExpiresAt: Date,
    refreshTokenExpiresAt: Date,
}