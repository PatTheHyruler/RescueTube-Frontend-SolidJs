import type { SelectListContext } from '@/components/ResultListSelect/index';

interface Props<TId extends string> {
    selection: SelectListContext<TId>;
}

function SelectAllCheckbox<TId extends string = string>(props: Props<TId>) {
    const selection = props.selection;

    return (
        <input
            type="checkbox"
            checked={selection.allSelected()}
            /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
            indeterminate={selection.allSelected() && selection.selectedIds().length > 0}
            onChange={e => {
                if (selection.allSelected()) {
                    if (selection.selectedIds().length > 0) {
                        selection.setSelectedIds([]);
                    } else {
                        selection.setAllSelected(false);
                    }
                } else {
                    selection.setSelectedIds([]);
                    selection.setAllSelected(true);
                }
                e.currentTarget.checked = selection.allSelected();
            }}
        />
    );
}

export default SelectAllCheckbox;
