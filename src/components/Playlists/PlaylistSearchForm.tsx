import type { PaginationResult, PlaylistSearchDtoV1 } from '@/apiModels';
import type { SetStoreFunction } from 'solid-js/store';
import PaginationComponent from '@/components/PaginationComponent';
import { useOnPaginationQueryUpdate } from '@/utils/pagination';

interface IProps {
    query: PlaylistSearchDtoV1;
    setQuery: SetStoreFunction<PlaylistSearchDtoV1>;
    paginationResult: PaginationResult | null | undefined;
    onSubmit: (() => Promise<void>) | (() => void);
}

const PlaylistSearchForm = (props: IProps) => {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        return props.onSubmit();
    };

    const onPaginationQueryUpdate = useOnPaginationQueryUpdate(props.setQuery);

    return (
        <>
            <form onSubmit={onSubmit}>
                <label for="name">
                    Name:
                    <input
                        id="name"
                        name="name"
                        value={props.query.filter?.name ?? ''}
                        onChange={e => props.setQuery('filter', 'name', e.target.value)}
                    />
                </label>
                <button type="submit">Apply</button>
            </form>
            <PaginationComponent paginationQuery={props.query} paginationResult={props.paginationResult} onUpdate={onPaginationQueryUpdate} onSubmit={props.onSubmit} />
        </>
    );
};

export default PlaylistSearchForm;