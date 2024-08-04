import { createSignal, For, useContext } from 'solid-js';
import { accountApi } from './accountApi';
import AuthContext from './AuthContext';
import { processJwtResponse } from './jwtStorage';
import { useNavigate } from '@solidjs/router';
import { getValidationErrors } from './authUtils';

const Register = () => {
    const { setAuthState, authState } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');
    const [validationErrors, setValidationErrors] = createSignal(
        [] as string[]
    );

    const [shouldLogOut, setShouldLogOut] = createSignal(true);

    if (authState.jwtState && shouldLogOut()) {
        void accountApi.logout(authState.jwtState);
        setAuthState({ jwtState: undefined, userDetails: undefined });
        setShouldLogOut(false);
    }

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        setValidationErrors([]);

        if (username().length === 0) {
            setValidationErrors((prev) => [...prev, 'Username is required']);
        }
        if (password().length === 0) {
            setValidationErrors((prev) => [...prev, 'Password is required']);
        }
        if (confirmPassword() !== password()) {
            setValidationErrors((prev) => [...prev, "Passwords don't match"]);
        }

        if (validationErrors().length > 0) {
            return;
        }

        let jwtResponse;
        try {
            jwtResponse = await accountApi.register({
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
        navigate('/');
    };

    return (
        <>
            <form class="w-100 m-auto" onSubmit={onSubmit}>
                <h2>Register</h2>
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
                    />
                    <label for="Username">Username</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password()}
                        class="form-control"
                        aria-required="true"
                        autocomplete="new-password"
                        type="password"
                        id="Password"
                        required
                    />
                    <label for="Password">Password</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword()}
                        class="form-control"
                        aria-required="true"
                        autocomplete="new-password"
                        type="password"
                        id="ConfirmPassword"
                        required
                    />
                    <label for="ConfirmPassword">Confirm password</label>
                </div>
                <button type="submit" class="w-100 btn btn-lg btn-primary">
                    Register
                </button>
            </form>
        </>
    );
};

export default Register;
