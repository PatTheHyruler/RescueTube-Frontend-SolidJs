import { createSignal, For, onMount, useContext } from 'solid-js';
import AuthContext from './AuthContext';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { accountApi } from './accountApi';
import { processJwtResponse } from './jwtStorage';
import { getValidationErrors } from './authUtils';

const Login = () => {
    const { setAuthState, authState } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    onMount(() => {
        if (authState.jwtState) {
            void accountApi.logout(authState.jwtState);
            setAuthState({ jwtState: undefined, userDetails: undefined });
        }
    });

    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [validationErrors, setValidationErrors] = createSignal(
        [] as string[],
    );

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        setValidationErrors([]);
        // setPendingApproval(false);

        if (username().length === 0 || password().length === 0) {
            setValidationErrors((prev) => [...prev, 'Bad values']);
            return;
        }

        let jwtResponse;
        try {
            jwtResponse = await accountApi.login({
                userName: username(),
                password: password(),
            });
        } catch (error) {
            setValidationErrors((prev) => [
                ...prev,
                ...getValidationErrors(error),
            ]);
            return;
        }
        setAuthState('jwtState', processJwtResponse(jwtResponse.data));

        if (searchParams.returnUrl) {
            window.location.href = searchParams.returnUrl; // TODO: Open redirect vulnerability?
            return;
        }

        navigate('/');
        return;
    };

    return (
        <>
            <form class="w-100 m-auto" onSubmit={onSubmit}>
                <h2>Login</h2>
                <hr />
                TODO: pending approval
                <For each={validationErrors()}>
                    {(item) => <div class="text-danger">{item}</div>}
                </For>
                <div class="form-floating mb-3">
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        value={username()}
                        class="form-control"
                        aria-required="true"
                        autocomplete="username"
                        type="text"
                        id="Username"
                        required
                    />
                    <label for="Username">Username</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password()}
                        class="form-control"
                        aria-required="true"
                        autocomplete="current-password"
                        type="password"
                        id="Password"
                        required
                    />
                    <label for="Password">Password</label>
                </div>
                <button type="submit" class="w-100 btn btn-lg btn-primary">
                    Login
                </button>
            </form>
        </>
    );
};

export default Login;
