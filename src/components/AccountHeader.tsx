import {Show, useContext} from "solid-js";
import AuthContext from "../auth/AuthContext";
import {A, useNavigate} from "@solidjs/router";
import {authService} from "../auth/AuthService";

const AccountHeader = () => {
    const {authState, setAuthState} = useContext(AuthContext)!;
    const navigate = useNavigate();

    const logOut = async () => {
        if (authState.jwtState) {
            void authService.logout(authState.jwtState.jwt, authState.jwtState.refreshToken);
        }
        setAuthState({jwtState: undefined, user: undefined});
        navigate("/");
    }

    return (
        <>
            <Show when={authState.jwtState}>
                <Show when={authState.user}>
                    <li class="nav-item">
                        {authState.user!.username}
                    </li>
                </Show>
                <li class="nav-item">
                    <button onclick={() => logOut()}
                            type="submit"
                            class="nav-link btn btn-link">
                        Logout
                    </button>
                </li>
            </Show>
            <Show when={!authState.jwtState}>
                <li class="nav-item">
                    <A href="/login" class="nav-link">Login</A>
                </li>
                <li class="nav-item">
                    <A href="/register" class="nav-link">Register</A>
                </li>
            </Show>
        </>
    );
}

export default AccountHeader;