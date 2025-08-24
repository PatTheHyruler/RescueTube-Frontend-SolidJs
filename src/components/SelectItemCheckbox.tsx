import type { SelectListContext } from '@/components/ResultListSelect';

interface Props<TId extends string> {
    selection: SelectListContext<TId>;
    id: TId;
}

function SelectItemCheckbox<TId extends string>(props: Props<TId>) {
    return (
        <input
            type="checkbox"
            checked={props.selection.isSelected(props.id)}
            onChange={() =>
                props.selection.toggleSelected(props.id)
            }
        />
    );
}

export default SelectItemCheckbox;
