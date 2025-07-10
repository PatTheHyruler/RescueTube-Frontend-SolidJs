import type { SelectListContext } from '@/components/ResultListSelect/index';
import SelectAllCheckbox from '@/components/ResultListSelect/SelectAllCheckbox';

interface Props<TId extends string> {
    selection: SelectListContext<TId>;
}

function SelectionSummary<TId extends string = string>(props: Props<TId>) {
    const getDisplayText = () => {
        const selectedAmount = props.selection.selectedIds().length;
        if (props.selection.allSelected()) {
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
            <SelectAllCheckbox selection={props.selection} />
            {getDisplayText()}
        </div>
    );
}

export default SelectionSummary;
