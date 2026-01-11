import PaginationComponent from '@/components/PaginationComponent';
import type { PaginationResult, SubmissionsSearchDtoV1 } from '@/apiModels';
import type { SetStoreFunction } from 'solid-js/store';
import { updatePaginationQuery } from '@/utils/pagination';
import { getNextIndeterminateBooleanState } from '@/utils';

interface IProps {
    query: SubmissionsSearchDtoV1;
    setQuery: SetStoreFunction<SubmissionsSearchDtoV1>;
    paginationResult: PaginationResult | null | undefined;
    onSubmit: (() => Promise<void>) | (() => void);
}

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