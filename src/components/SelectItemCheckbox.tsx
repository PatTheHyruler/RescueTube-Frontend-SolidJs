import type { SelectListContext } from '@/components/ResultListSelect';

interface Props<TId extends string> {
    context: SelectListContext<TId>;
    id: TId;
}

function SelectItemCheckbox<TId extends string>(props: Props<TId>) {
    const context = props.context;

    return (
        <input
            type="checkbox"
            checked={context.isSelected(props.id)}
            onChange={() =>
                context.toggleSelected(props.id)
            }
        />
    );
}

export default SelectItemCheckbox;
