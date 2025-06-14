import { createResource, createSignal, For, Show } from 'solid-js';
import styles from './Select.module.css';

interface Option {
    id: string;
    name?: string | null;
}

interface SelectProps<TOption extends Option> {
    fetchOptions: (search: string | null) => Promise<TOption[]>;
    selectedOptions: TOption[] | null | undefined;
    onChange: (options: TOption[]) => Promise<void> | void;
}

const Select = <TOption extends Option = Option>(props: SelectProps<TOption>) => {
    const [search, setSearch] = createSignal<string>('');
    const [result] = createResource(search, async (search) => {
        if (!search) {
            return [];
        }
        return await props.fetchOptions(search);
    });

    const [isOpen, setIsOpen] = createSignal(false);

    const removeValue = (index: number) => {
        if (!props.selectedOptions) {
            return;
        }
        props.onChange([
            ...props.selectedOptions.slice(0, index),
            ...props.selectedOptions.slice(index + 1),
        ]);
    };

    const toggleSelected = (option: TOption) => {
        if (!props.selectedOptions) {
            props.onChange([option]);
            return;
        }
        const index = props.selectedOptions?.findIndex(o => o.id === option.id);
        if (index >= 0) {
            removeValue(index);
        }
        else {
            props.onChange([
                ...props.selectedOptions,
                option,
            ]);
        }
    };

    const isSelected = (option: TOption) => {
        if (!props.selectedOptions) {
            return false;
        }
        return props.selectedOptions.findIndex(o => o.id === option.id) >= 0;
    };

    return (
        <>
            <div
                class={styles.solidSelectControl}
                data-multiple={true}
                data-has-value={props.selectedOptions?.length}
            >
                <For each={props.selectedOptions}>
                    {(option, index) => (
                        <div class={styles.solidSelectMultiValue}>
                            {option.name ?? option.id}
                            <button
                                type="button"
                                class={styles.solidSelectMultiValueRemove}
                                onClick={() => removeValue(index())}
                            >
                                x
                            </button>
                        </div>
                    )}
                </For>
                <input
                    type="search"
                    class={styles.solidSelectInput}
                    onInput={e => {
                        const value = e.currentTarget.value;
                        setSearch(value);
                        setIsOpen(!!value);
                    }}
                />
            </div>
            <Show when={isOpen() && result()?.length}>
                <div class={styles.solidSelectList}>
                    <Show when={result()}>
                        {result => (
                            <For each={result()}>
                                {option => (
                                    <div
                                        data-selected={isSelected(option)}
                                        role="button"
                                        class={styles.solidSelectOption}
                                        onClick={() => toggleSelected(option)}
                                    >
                                        {option.name ?? option.id}
                                    </div>
                                )}
                            </For>
                        )}
                    </Show>
                </div>
            </Show>
        </>
    );
};

export default Select;