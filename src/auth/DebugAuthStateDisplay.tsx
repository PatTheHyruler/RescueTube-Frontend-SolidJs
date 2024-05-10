import {createEffect, createSignal, Show, useContext} from "solid-js";
import AuthContext from "./AuthContext";
import styles from './DebugAuthStateDisplay.module.css';

const DebugAuthStateDisplay = () => {
    const authContext = useContext(AuthContext);
    const defaultState = {
        display: false
    }
    const storedValue = localStorage.getItem(debugAuthStateKey);
    let initialState = defaultState;
    if (storedValue) {
        try {
            const parsedValue = JSON.parse(storedValue);
            initialState = Object.assign(defaultState, parsedValue);
        } catch (_) {
        }
    }

    const [state, setState] = createSignal(initialState);

    createEffect(() => {
        localStorage.setItem(debugAuthStateKey, JSON.stringify(state()))
    })

    return (
        <>
            <div class={styles.floating} style={{bottom: 0, left: 0}}>
                <button onclick={() => setState(prev => ({ ...prev, display: !prev.display }))}>
                    {state() ? 'Hide' : 'Show auth debug'}
                </button>
                <Show when={state().display}>
                    <div>
                        <pre>
                            {JSON.stringify(authContext?.authState, null, 2)}
                        </pre>
                    </div>
                </Show>
            </div>
        </>
    );
}

const debugAuthStateKey = 'debugAuthState';

export default DebugAuthStateDisplay;