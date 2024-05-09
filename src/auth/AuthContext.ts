import {createContext} from "solid-js";
import {AuthState} from "./model/AuthState";
import {SetStoreFunction} from "solid-js/store";

const AuthContext = createContext<
    { authState: AuthState, setAuthState: SetStoreFunction<AuthState> }
>();

export default AuthContext;