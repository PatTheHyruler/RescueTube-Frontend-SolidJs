import { createEffect, createMemo, createSignal, onCleanup, Show, useContext } from 'solid-js';
import AuthContext from './AuthContext';
import styles from './DebugAuthStateDisplay.module.css';

interface Position {
    x: number;
    y: number;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

function getClampedPosition(position: Position, element: HTMLElement | undefined, rootElement: Element): Position {
    const defaultWidth = 210;
    const defaultHeight = 70;

    return {
        x: clamp(position.x, 0, rootElement.clientWidth - (element?.clientWidth ?? defaultWidth)),
        y: clamp(position.y, 0, rootElement.clientHeight - (element?.clientHeight ?? defaultHeight)),
    };
}

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

    let debugElement!: HTMLDivElement;

    function getClampedPositionWrapper(position: Position) {
        return getClampedPosition(position, debugElement, document.documentElement);
    }

    const [state, setState] = createSignal(initialState);
    createEffect(() => {
        localStorage.setItem(debugAuthStateKey, JSON.stringify(state()));
    });

    const [position, setPosition] = createSignal({
        x: initialState.x,
        y: initialState.y,
    } satisfies Position);
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

    const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length <= 0 || !debugElement) {
            return;
        }

        const entry = entries[0]!;

        setPosition(p => getClampedPosition(p, debugElement, entry.target));
    });

    resizeObserver.observe(document.documentElement);

    onCleanup(() => {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMove);
        resizeObserver.unobserve(document.documentElement);
    });

    const clampedPosition = createMemo(() => getClampedPositionWrapper(position()));

    return (
        <>
            <div
                class={styles.floating}
                style={{
                    transform: `translate(${clampedPosition().x}px, ${clampedPosition().y}px)`,
                }}
                ref={debugElement}
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
