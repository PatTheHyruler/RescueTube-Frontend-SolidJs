import {
    type Component,
    createEffect,
    createResource,
    ErrorBoundary,
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
import { RootErrorHandler } from './components/RootErrorHandler';

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

    createResource(
        () => authState.jwtState,
        async () => {
            if (authState.jwtState) {
                const response = await accountApi.getCurrentUserDetails();
                const userDetails = response.data;
                setAuthState('userDetails', userDetails);
                return userDetails;
            }
            return null;
        }
    );

    createEffect(() => {
        persistJwt(authState.jwtState);
    });

    return (
        <ErrorBoundary fallback={RootErrorHandler}>
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <div class={styles.App}>
                    <header class={styles.header}>
                        {/*<img src={logo} class={styles.logo} alt="logo"/>*/}
                        <NavBar></NavBar>
                    </header>
                    {props.children}
                </div>
                <Show when={import.meta.env.DEV}>
                    <DebugAuthStateDisplay></DebugAuthStateDisplay>
                </Show>
            </AuthContext.Provider>
        </ErrorBoundary>
    );
};

export default App;
