import type { SelectListContext } from '@/components/ResultListSelect/index';
import SelectAllCheckbox from '@/components/ResultListSelect/SelectAllCheckbox';

interface Props<TId extends string> {
    context: SelectListContext<TId>;
}

function SelectionSummary<TId extends string = string>(props: Props<TId>) {
    const getDisplayText = () => {
        const selectedAmount = props.context.selectedIds().length;
        if (props.context.allSelected()) {
            if (selectedAmount > 0) {
                return `All except ${selectedAmount} item${selectedAmount > 1 ? 's' : ''} selected`;
            } else {
                return 'All items selected';
            }
        } else {
            if (selectedAmount > 0) {
                return `${selectedAmount} item${selectedAmount > 1 ? 's' : ''} selected`;
            } else {
                return 'No items selected';
            }
        }
    };

    return (
        <div>
            <SelectAllCheckbox context={props.context} />
            {getDisplayText()}
        </div>
    );
}

export default SelectionSummary;
