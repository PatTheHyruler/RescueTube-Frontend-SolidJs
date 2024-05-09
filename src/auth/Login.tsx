import {createSignal, For, useContext} from "solid-js";
import {JwtClaims, login} from "./AuthService";
import AuthContext from "./AuthContext";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {useNavigate} from "@solidjs/router";

const Login = () => {
    const {authState, setAuthState} = useContext(AuthContext)!;
    const navigate = useNavigate();

    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [validationErrors, setValidationErrors] = createSignal([] as string[]);

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        // setShouldLogOut(false);
        setValidationErrors([]);
        // setPendingApproval(false);

        if (username().length === 0 || password().length === 0) {
            setValidationErrors(prev => [...prev, "Bad values"]);
            return;
        }

        const jwtResponse = await login(username(), password());
        const jwtDecoded = jwtDecode<JwtPayload & {
            [JwtClaims.name]: string,
            [JwtClaims.roles]: string,
        }>(jwtResponse.jwt);
        setAuthState("jwtState", {
            jwt: jwtResponse.jwt,
            jwtExpiresAt: new Date(jwtDecoded.exp! * 1000),
            refreshToken: jwtResponse.refreshToken,
            refreshTokenExpiresAt: new Date(jwtResponse.refreshTokenExpiresAt),
        });

        navigate("/");
    }

    return (
        <>
            <form class="w-100 m-auto" onSubmit={onSubmit}>
                <h2>Login</h2>
                <hr/>

                TODO: pending approval
                <For each={validationErrors()}>
                    {(item, index) => (
                        <div class="text-danger">
                            {item}
                        </div>
                    )}
                </For>

                <div class="form-floating mb-3">
                    <input
                        onChange={e => setUsername(e.target.value)}
                        value={username()}
                        class="form-control"
                        aria-required="true"
                        autocomplete="username"
                        type="text"
                        id="Username"
                    />
                    <label for="Username">Username</label>
                </div>

                <div class="form-floating mb-3">
                    <input
                        onChange={e => setPassword(e.target.value)}
                        value={password()}
                        class="form-control"
                        aria-required="true"
                        autocomplete="password"
                        type="password"
                        id="Password"
                    />
                    <label for="Password">Password</label>
                </div>

                <button type="submit"
                        class="w-100 btn btn-lg btn-primary">
                    Login
                </button>
            </form>
        </>
    );
}

export default Login;