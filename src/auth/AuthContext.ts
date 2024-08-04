import {createContext} from "solid-js";
import {type SetStoreFunction} from "solid-js/store";
import {type AuthState} from "./authTypes";

const AuthContext = createContext<
    { authState: AuthState, setAuthState: SetStoreFunction<AuthState> }
>();

export default AuthContext;