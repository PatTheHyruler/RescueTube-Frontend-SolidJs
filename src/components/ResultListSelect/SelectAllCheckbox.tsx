import type { SelectListContext } from '@/components/ResultListSelect/index';

interface Props<TId extends string> {
    context: SelectListContext<TId>;
}

function SelectAllCheckbox<TId extends string = string>(props: Props<TId>) {
    const context = props.context;

    return (
        <input
            type="checkbox"
            checked={context.allSelected()}
            /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
            indeterminate={context.allSelected() && context.selectedIds().length > 0}
            onChange={e => {
                if (context.allSelected()) {
                    if (context.selectedIds().length > 0) {
                        context.setSelectedIds([]);
                    } else {
                        context.setAllSelected(false);
                    }
                } else {
                    context.setSelectedIds([]);
                    context.setAllSelected(true);
                }
                e.currentTarget.checked = context.allSelected();
            }}
        />
    );
}

export default SelectAllCheckbox;
