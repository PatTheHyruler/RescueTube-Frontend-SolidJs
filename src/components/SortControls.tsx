import type { OrderByPropertyDtoV1 } from '@/apiModels';
import type { SetStoreFunction } from 'solid-js/store';
import { For, Index } from 'solid-js';

export interface SortOption {
    value: string;
    label: string;
}

interface ISortControlsProps {
    query: { orderBy?: OrderByPropertyDtoV1[] | null };
    setQuery: SetStoreFunction<{ orderBy?: OrderByPropertyDtoV1[] | null }>;
    sortOptions: SortOption[];
}

const SortControls = (props: ISortControlsProps) => {
    const addSortField = () => {
        const currentOrderBy = props.query.orderBy || [];
        const existingFields = currentOrderBy.map((order) => order.propertyName);
        const availableFields = props.sortOptions
            .map((option) => option.value)
            .filter((field) => !existingFields.includes(field));

        if (availableFields.length > 0) {
            const newField = availableFields[0] as string;
            props.setQuery('orderBy', [...currentOrderBy, { propertyName: newField, descending: true }]);
        }
    };

    const removeSortField = (index: number) => {
        const currentOrderBy = props.query.orderBy || [];
        props.setQuery(
            'orderBy',
            currentOrderBy.filter((_, i) => i !== index)
        );
    };

    const updateSortField = (index: number, field: 'propertyName' | 'descending', value: string | boolean) => {
        const currentOrderBy = props.query.orderBy || [];
        props.setQuery(
            'orderBy',
            currentOrderBy.map((order, i) => (i === index ? { ...order, [field]: value } : order))
        );
    };

    const toggleSortDirection = (index: number) => {
        const currentOrderBy = props.query.orderBy || [];
        const currentField = currentOrderBy[index];
        if (currentField) {
            updateSortField(index, 'descending', !currentField.descending);
        }
    };

    const getAvailableOptions = (currentIndex: number) => {
        const currentOrderBy = props.query.orderBy || [];
        const existingFields = currentOrderBy
            .map((order, i) => (i === currentIndex ? null : order.propertyName))
            .filter(Boolean);
        return props.sortOptions.filter((option) => !existingFields.includes(option.value));
    };

    const getOptionLabel = (value: string) => {
        const option = props.sortOptions.find((opt) => opt.value === value);
        return option?.label || value;
    };

    return (
        <div class="sort-section">
            <Index each={props.query.orderBy || []}>
                {(orderBy, index) => (
                    <div class="sort-row">
                        <select
                            value={orderBy().propertyName}
                            onChange={(e) => updateSortField(index, 'propertyName', e.target.value)}
                        >
                            <For each={getAvailableOptions(index)}>
                                {(option) => <option value={option.value}>{option.label}</option>}
                            </For>
                            {/* Keep current option even if it's not in available options */}
                            <option value={orderBy().propertyName}>{getOptionLabel(orderBy().propertyName)}</option>
                        </select>
                        <button
                            type="button"
                            class="sort-direction-toggle"
                            onClick={() => toggleSortDirection(index)}
                            title={orderBy().descending ? 'Sort ascending' : 'Sort descending'}
                        >
                            {orderBy().descending ? '↓' : '↑'}
                        </button>
                        <button type="button" onClick={() => removeSortField(index)} title="Remove">
                            &nbsp;-&nbsp;
                        </button>
                    </div>
                )}
            </Index>
            {getAvailableOptions(-1).length > 0 && (
                <button type="button" onClick={addSortField}>
                    Add Sort Field
                </button>
            )}
        </div>
    );
};

export default SortControls;
