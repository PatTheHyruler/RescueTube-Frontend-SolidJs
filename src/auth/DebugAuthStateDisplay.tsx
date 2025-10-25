import { createEffect, createSignal, onCleanup, Show, useContext } from 'solid-js';
import AuthContext from './AuthContext';
import styles from './DebugAuthStateDisplay.module.css';

const DebugAuthStateDisplay = () => {
    const authContext = useContext(AuthContext);
    const defaultState = {
        display: false,
        x: 0,
        y: 0,
    };
    const storedValue = localStorage.getItem(debugAuthStateKey);
    let initialState = defaultState;
    if (storedValue) {
        try {
            const parsedValue = JSON.parse(storedValue);
            initialState = Object.assign(defaultState, parsedValue);
        } catch (error) {
            console.error('Failed to parse stored debug auth state', error);
        }
    }

    const [state, setState] = createSignal(initialState);
    createEffect(() => {
        localStorage.setItem(debugAuthStateKey, JSON.stringify(state()));
    });

    const [position, setPosition] = createSignal({
        x: initialState.x,
        y: initialState.y,
    });
    const [isPressed, setIsPressed] = createSignal(false);

    const onMove = (e: MouseEvent) => {
        if (isPressed()) {
            setPosition((p) => ({
                x: p.x + e.movementX,
                y: p.y + e.movementY,
            }));
        }
    };

    const onMouseUp = () => {
        const wasPressed = isPressed();
        setIsPressed(false);
        if (wasPressed) {
            setState((v) => ({ ...v, x: position().x, y: position().y }));
        }
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMove);

    onCleanup(() => {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMove);
    });

    return (
        <>
            <div
                class={styles.floating}
                style={{
                    transform: `translate(${position().x}px, ${position().y}px)`,
                }}
            >
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsPressed(true);
                    }}
                    style={{ cursor: 'move' }}
                >
                    MOVE
                </button>
                <button
                    onClick={() =>
                        setState((prev) => ({
                            ...prev,
                            display: !prev.display,
                        }))
                    }
                >
                    {state().display ? 'Hide' : 'Show auth debug'}
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
};

const debugAuthStateKey = 'debugAuthState';

export default DebugAuthStateDisplay;
