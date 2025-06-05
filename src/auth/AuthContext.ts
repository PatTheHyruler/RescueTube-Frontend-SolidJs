import { createContext, useContext } from 'solid-js';
import { type SetStoreFunction } from 'solid-js/store';
import { type AuthState } from './authTypes';

const AuthContext = createContext<{
    authState: AuthState;
    setAuthState: SetStoreFunction<AuthState>;
}>();

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);
    if (authContext === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return authContext;
};

export default AuthContext;
