import {
    type Component,
    createEffect,
    createResource,
    type JSX,
    Show,
} from 'solid-js';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import { createStore } from 'solid-js/store';
import AuthContext from './auth/AuthContext';
import {
    interceptorAuthState,
    registerAuthInterceptors,
} from './auth/authUtils';
import { type AuthState } from './auth/authTypes';
import { accountApi } from './auth/accountApi';
import DebugAuthStateDisplay from './auth/DebugAuthStateDisplay';
import { persistJwt, readPersistedJwt } from './auth/jwtStorage';
import { Toaster, ToastProvider } from 'solid-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const queryClient = new QueryClient();

declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__: QueryClient;
    }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const App: Component = (props: { children?: JSX.Element }) => {
    const persistedJwt = readPersistedJwt();

    const [authState, setAuthState] = createStore<AuthState>({
        jwtState: persistedJwt,
        userDetails: null,
    });

    createEffect(() => {
        interceptorAuthState.jwtState = authState.jwtState;
        interceptorAuthState.setJwtState = (jwtState) =>
            setAuthState('jwtState', jwtState);
    });
    registerAuthInterceptors();

    const [userDetailsResource] = createResource(
        () => authState.jwtState,
        async (jwtState) => {
            if (jwtState) {
                const response = await accountApi.getCurrentUserDetails();
                return response.data;
            }
            return null;
        },
    );

    createEffect(() => {
        persistJwt(authState.jwtState);
    });

    createEffect(() => {
        setAuthState('userDetails', userDetailsResource());
    });

    return (
        <QueryClientProvider client={queryClient}>
        <ToastProvider>
        <AuthContext.Provider value={{ authState, setAuthState, userDetailsResource }}>
            <Toaster />
            <div class={styles.App}>
                <header class={styles.header}>
                    {/*<img src={logo} class={styles.logo} alt="logo"/>*/}
                    <NavBar />
                </header>
                {props.children}
            </div>
            <Show when={import.meta.env.DEV}>
                <DebugAuthStateDisplay />
            </Show>
        </AuthContext.Provider>
        </ToastProvider>
        </QueryClientProvider>
    );
};

export default App;
