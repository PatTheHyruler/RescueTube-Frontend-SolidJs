import { createSignal, For, onMount } from 'solid-js';
import { useAuthContext } from './AuthContext';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { accountApi } from './accountApi';
import { processJwtResponse } from './jwtStorage';
import { getValidationErrors } from './authUtils';
import { getUrlParamString } from '@/utils';

const getValidRelativePath = (url: string): string | null => {
    try {
        const parsedUrl = new URL(url, window.location.origin);
        if (parsedUrl.origin !== window.location.origin) {
            return null;
        }
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    } catch {
        return null;
    }
};

const Login = () => {
    const { setAuthState, authState } = useAuthContext();
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
        [] as string[]
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

        const returnUrl = getUrlParamString(searchParams.returnUrl);
        if (returnUrl) {
            const relativePath = getValidRelativePath(returnUrl);
            if (relativePath) {
                navigate(relativePath);
                return;
            }
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
