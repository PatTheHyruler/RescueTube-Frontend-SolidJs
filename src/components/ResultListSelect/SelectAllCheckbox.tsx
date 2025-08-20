import type { SelectListContext } from '@/components/ResultListSelect/index';

interface Props<TId extends string> {
    selection: SelectListContext<TId>;
}

function SelectAllCheckbox<TId extends string = string>(props: Props<TId>) {
    return (
        <input
            type="checkbox"
            checked={props.selection.allSelected()}
            /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
            indeterminate={props.selection.allSelected() && props.selection.selectedIds().length > 0}
            onChange={e => {
                const selection = props.selection;
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
