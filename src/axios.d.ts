import "axios";

import {AuthBehavior} from "./auth/authTypes";

declare module "axios" {
    export interface AxiosRequestConfig {
        tokenRefreshAttempted?: boolean,
        authBehavior?: AuthBehavior,
    }
}