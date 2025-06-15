import { createEffect, createResource, createSignal, For, Show } from 'solid-js';
import styles from './Select.module.css';
import { isButtonElement } from '@/utils/dom';

export interface Option {
    id: string;
    name?: string | null;
}

interface SelectProps<TOption extends Option> {
    fetchOptions: (search: string | null) => Promise<TOption[]>;
    selectedOptions: TOption[] | null | undefined;
    onChange: (options: TOption[]) => Promise<void> | void;
    disabled?: boolean | null;
    keepSelectedOptions?: boolean;
    id?: string;
}

const Select = <TOption extends Option = Option>(props: SelectProps<TOption>) => {
    const [search, setSearch] = createSignal<string>('');
    const [result] = createResource(
        () => ({ search: search(), selectedIds: props.selectedOptions?.map(x => x.id) }),
        async (deps) => {
            const search = deps.search;
            if (!search) {
                return [];
            }
            return await props.fetchOptions(search);
        },
    );

    const [isOpen, setIsOpen] = createSignal(false);

    const [searchClearedAt, setSearchClearedAt] = createSignal(0);
    createEffect(() => {
        if (search() === '') {
            setSearchClearedAt(Date.now());
        }
    });

    let inputRef!: HTMLInputElement;

    const setSelectedOptions = (options: TOption[]) => {
        props.onChange(options);
        inputRef.focus();
    };

    const removeValue = (index: number) => {
        if (!props.selectedOptions) {
            return;
        }
        setSelectedOptions([
            ...props.selectedOptions.slice(0, index),
            ...props.selectedOptions.slice(index + 1),
        ]);
    };

    const toggleSelected = (option: TOption) => {
        if (!props.selectedOptions) {
            setSelectedOptions([option]);
            return;
        }
        const index = props.selectedOptions?.findIndex(o => o.id === option.id);
        if (index >= 0) {
            removeValue(index);
        }
        else {
            setSelectedOptions([
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

    const tryHandleKeyboardClear = (e: KeyboardEvent) => {
        if (search() || !props.selectedOptions?.length) {
            return;
        }
        if (searchClearedAt() + 1000 > Date.now()) {
            return;
        }
        if (e.key === 'Delete') {
            removeValue(0);
        }
        else if (e.key === 'Backspace') {
            removeValue(props.selectedOptions.length - 1);
        }
    };

    return (
        <>
            <div
                class={styles.solidSelectControl}
                data-disabled={props.disabled ?? false}
                data-multiple={true}
                data-has-value={props.selectedOptions?.length}
            >
                <input
                    ref={inputRef}
                    type="search"
                    class={styles.solidSelectInput}
                    disabled={props.disabled ?? false}
                    onInput={e => {
                        const value = e.currentTarget.value;
                        setSearch(value);
                        setIsOpen(!!value);
                    }}
                    onKeyUp={e => {
                        tryHandleKeyboardClear(e);
                    }}
                />
                <For each={props.selectedOptions}>
                    {(option, index) => (
                        <div class={styles.solidSelectMultiValue}>
                            {option.name ?? option.id}
                            <button
                                type="button"
                                disabled={props.disabled ?? false}
                                class={styles.solidSelectMultiValueRemove}
                                onClick={() => removeValue(index())}
                            >
                                x
                            </button>
                        </div>
                    )}
                </For>
            </div>
            <Show when={isOpen() && result()?.length}>
                <div 
                    class={styles.solidSelectList}
                    role="listbox"
                >
                    <Show when={result()}>
                        {result => (
                            <For each={result().filter(option => props.keepSelectedOptions || !isSelected(option))}>
                                {option => (
                                    <button
                                        type="button"
                                        disabled={props.disabled ?? false}
                                        class={styles.solidSelectOption}
                                        onClick={() => {
                                            if (props.disabled) {
                                                return;
                                            }
                                            toggleSelected(option);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                const next = e.currentTarget.nextElementSibling;
                                                if (isButtonElement(next)) {
                                                    next.focus();
                                                }
                                            }
                                            else if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                const previous = e.currentTarget.previousElementSibling;
                                                if (isButtonElement(previous)) {
                                                    previous.focus();
                                                }
                                            }
                                        }}
                                    >
                                        {option.name ?? option.id}
                                    </button>
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