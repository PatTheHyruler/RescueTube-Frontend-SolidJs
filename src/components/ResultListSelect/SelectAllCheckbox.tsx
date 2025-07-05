import type { useResultListSelect } from '@/components/ResultListSelect/index';

type Props<TId extends string> = ReturnType<typeof useResultListSelect<TId>>;

function SelectAllCheckbox<TId extends string = string>(props: Props<TId>) {
    return (
        <input
            type="checkbox"
            checked={props.allSelected()}
            /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
            indeterminate={props.allSelected() && props.selectedIds().length > 0}
            onChange={e => {
                if (props.allSelected()) {
                    if (props.selectedIds().length > 0) {
                        props.setSelectedIds([]);
                    } else {
                        props.setAllSelected(false);
                    }
                } else {
                    props.setSelectedIds([]);
                    props.setAllSelected(true);
                }
                e.currentTarget.checked = props.allSelected();
            }}
        />
    );
}

export default SelectAllCheckbox;
