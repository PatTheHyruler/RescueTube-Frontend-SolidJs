import {Role} from "./Role";

export interface UserDetails {
    id: string,
    username: string,
    normalizedUsername: string,
    isApproved: boolean,
    roles: Role[],
}