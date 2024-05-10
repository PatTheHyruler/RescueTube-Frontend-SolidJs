import {createContext} from "solid-js";
import {SetStoreFunction} from "solid-js/store";
import {AuthState} from "./authTypes";

const AuthContext = createContext<
    { authState: AuthState, setAuthState: SetStoreFunction<AuthState> }
>();

export default AuthContext;