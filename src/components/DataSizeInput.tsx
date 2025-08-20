import { createSignal, createEffect, For, Show, untrack } from 'solid-js';
import type { Component } from 'solid-js';

interface Props {
    name?: string;
    valueBytes: number | null;
    defaultValueBytes: number | null;
    onChange: (valueBytes: number | null) => void;
}

const Units = {
    B: 'B',
    kB: 'kB',
    KiB: 'KiB',
    MB: 'MB',
    MiB: 'MiB',
    GB: 'GB',
    GiB: 'GiB',
} as const;

type Unit = typeof Units[keyof typeof Units];

const UNIT_MULTIPLIERS: Record<Unit, number> = {
    B: 1,
    kB: 1000,
    KiB: 1024,
    MB: 1000 * 1000,
    MiB: 1024 * 1024,
    GB: 1000 * 1000 * 1000,
    GiB: 1024 * 1024 * 1024,
};

const getBestUnit = (bytes: number | null): Unit => {
    if (bytes === null) return 'MB';

    const absBytes = Math.abs(bytes);
    if (absBytes < UNIT_MULTIPLIERS.kB) return Units.B;
    if (absBytes < UNIT_MULTIPLIERS.KiB) return Units.kB;
    if (absBytes < UNIT_MULTIPLIERS.MB) return Units.KiB;
    if (absBytes < UNIT_MULTIPLIERS.MiB) return Units.MB;
    if (absBytes < UNIT_MULTIPLIERS.GB) return Units.MiB;
    if (absBytes < UNIT_MULTIPLIERS.GiB) return Units.GB;
    return Units.GiB;
};

export const DataSizeInput: Component<Props> = (props) => {
    const [unit, setUnit] = createSignal(getBestUnit(untrack(() => props.valueBytes ?? props.defaultValueBytes)));
    const [value, setValue] = createSignal<string | null>(null);
    const [error, setError] = createSignal<string | null>(null);

    createEffect(() => {
        if (props.valueBytes === null) {
            setValue('');
            return;
        }

        const currentUnit = unit();
        const multiplier = UNIT_MULTIPLIERS[currentUnit];
        const converted = props.valueBytes / multiplier;
        setValue(converted.toString());
    });

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        setError(null);

        if (newValue.trim().length === 0) {
            props.onChange(null);
            return;
        }

        const numericValue = parseFloat(newValue);
        if (isNaN(numericValue)) {
            setError('Please enter a valid number');
            return;
        }

        const multiplier = UNIT_MULTIPLIERS[unit()];
        const bytes = Math.floor(numericValue * multiplier);

        props.onChange(bytes);
    };

    const handleUnitChange = (newUnit: Unit) => {
        const currentValue = value();
        if (!currentValue?.trim().length) {
            setUnit(newUnit);
            return;
        }

        const oldMultiplier = UNIT_MULTIPLIERS[unit()];
        const newMultiplier = UNIT_MULTIPLIERS[newUnit];
        const currentBytes = parseFloat(currentValue) * oldMultiplier;

        setUnit(newUnit);
        setValue((currentBytes / newMultiplier).toString());
    };

    const placeholder = () => {
        if (props.defaultValueBytes === null) {
            return undefined;
        }
        const currentUnit = unit();
        const multiplier = UNIT_MULTIPLIERS[currentUnit];
        const converted = props.defaultValueBytes / multiplier;
        return converted.toString();
    };

    return (
        <div>
            <div classList={{ error: !error() }}>
                <input
                    name={props.name}
                    style={{ 'max-width': '10ch' }}
                    type="number"
                    value={value() ?? undefined}
                    placeholder={placeholder()}
                    onInput={(e) => handleValueChange(e.currentTarget.value)}
                    min="0"
                    step="any"
                />
                <select
                    value={unit()}
                    onChange={(e) => handleUnitChange(e.currentTarget.value as Unit)}
                >
                    <For each={Object.values(Units)}>
                        {(option: Unit) => (
                            <option value={option}>{option}</option>
                        )}
                    </For>
                </select>
            </div>
            <Show when={error()}>
                {error => (
                    <div class="text-danger">{error()}</div>
                )}
            </Show>
        </div>
    );
};

export default DataSizeInput;