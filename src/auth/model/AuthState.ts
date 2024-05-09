import {JwtState} from "./JwtState";
import {UserDetails} from "./UserDetails";

export interface AuthState {
    jwtState?: JwtState,
    user?: UserDetails,
}