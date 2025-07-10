import type { SelectListContext } from '@/components/ResultListSelect';

interface Props<TId extends string> {
    selection: SelectListContext<TId>;
    id: TId;
}

function SelectItemCheckbox<TId extends string>(props: Props<TId>) {
    const selection = props.selection;

    return (
        <input
            type="checkbox"
            checked={selection.isSelected(props.id)}
            onChange={() =>
                selection.toggleSelected(props.id)
            }
        />
    );
}

export default SelectItemCheckbox;
