import { createSignal } from 'solid-js';

export function useResultListSelect<TId extends string = string>() {
    const [allSelected, setAllSelected] = createSignal(false);
    const [selectedIds, setSelectedIds] = createSignal<TId[]>([]);

    const isSelected = (id: TId) => {
        if (!allSelected()) {
            return selectedIds().includes(id);
        }
        return !selectedIds().includes(id);
    };
    const areAnyResultsSelected = () => allSelected() || (selectedIds().length > 0);
    const toggleSelected = (id: TId) => {
        setSelectedIds(ids => {
            if (ids.includes(id)) {
                return ids.filter(id => id !== id);
            } else {
                return [...ids, id];
            }
        });
    };

    return {
        isSelected,
        allSelected,
        selectedIds,
        setSelectedIds,
        setAllSelected,
        areAnyResultsSelected,
        toggleSelected,
    };
}

export type SelectListContext<TId extends string> = ReturnType<typeof useResultListSelect<TId>>;
