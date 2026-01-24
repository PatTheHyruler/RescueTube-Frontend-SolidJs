import PaginationComponent from '@/components/PaginationComponent';
import SortControls, { type SortOption } from '@/components/SortControls';
import type { PaginationResult, SubmissionsSearchDtoV1 } from '@/apiModels';
import { SubmissionSortingOptions } from '@/apiModels';
import type { SetStoreFunction } from 'solid-js/store';
import { updatePaginationQuery } from '@/utils/pagination';
import { getNextIndeterminateBooleanState } from '@/utils';

interface IProps {
    query: SubmissionsSearchDtoV1;
    setQuery: SetStoreFunction<SubmissionsSearchDtoV1>;
    paginationResult: PaginationResult | null | undefined;
    onSubmit: (() => Promise<void>) | (() => void);
}

const submissionSortOptions: SortOption[] = [
    { value: SubmissionSortingOptions.AddedAt, label: 'Added at' },
    { value: SubmissionSortingOptions.ApprovedAt, label: 'Approved at' },
    { value: SubmissionSortingOptions.CompletedAt, label: 'Completed at' },
    { value: SubmissionSortingOptions.Platform, label: 'Platform' },
    { value: SubmissionSortingOptions.EntityType, label: 'Entity type' },
    { value: SubmissionSortingOptions.Id, label: 'ID' },
];

const SubmissionSearchForm = (props: IProps) => {
    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    return props.onSubmit();
                }}
            >
                <label for="completed">
                    Completed
                    <input
                        type="checkbox"
                        checked={props.query.completed ?? undefined}
                        /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
                        indeterminate={props.query.completed === null || props.query.completed === undefined}
                        onChange={() => {
                            props.setQuery('completed', getNextIndeterminateBooleanState(props.query.completed));
                        }}
                    />
                </label>

                <SortControls query={props.query} setQuery={props.setQuery} sortOptions={submissionSortOptions} />

                <button type="submit">Search</button>
            </form>
            <PaginationComponent
                paginationQuery={props.query}
                paginationResult={props.paginationResult}
                onUpdate={(p) => updatePaginationQuery(p, props.setQuery)}
                onSubmit={props.onSubmit}
            />
        </>
    );
};

export default SubmissionSearchForm;
