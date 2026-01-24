import { type Params, useSearchParams } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import {
    type DeepPartial,
    excludeUndefinedFields,
    reduceForSearchParams,
} from '@/utils/index';
import { createEffect, createResource, untrack } from 'solid-js';

interface UseSearchArgs<
    TSearchParams extends Params,
    TSearchDto,
    TSearchResult
> {
    defaultSearch: TSearchDto;
    mapSearchToDto: (searchParams: Partial<TSearchParams>) => DeepPartial<TSearchDto>;
    mapDtoToSearch: (searchDto: Partial<TSearchDto>) => Partial<TSearchParams>;
    fetch: (searchDto: TSearchDto) => Promise<TSearchResult>;
    getSnapshot: (searchDto: TSearchDto) => TSearchDto;
    beforeApplySearch?: (args: { query: TSearchDto; previousQuery: TSearchDto }) => void;
}

export const useSearch = <
    TSearchParams extends Params,
    TSearchDto extends object,
    TSearchResult
>(args: UseSearchArgs<TSearchParams, TSearchDto, TSearchResult>) => {
    const [searchParams, setSearchParams] = useSearchParams<TSearchParams>();
    const [query, setQuery] = createStore<TSearchDto>({
        ...args.defaultSearch,
        ...excludeUndefinedFields(args.mapSearchToDto(searchParams)),
    });
    createEffect(() => {
        setQuery({
            ...args.defaultSearch,
            ...excludeUndefinedFields(args.mapSearchToDto(searchParams)),
        });
        searchResultActions.refetch();
    });
    const [searchResults, searchResultActions] = createResource(() => args.fetch(query));

    // I think this untrack is correct?
    let previousQuery: TSearchDto = args.getSnapshot(untrack(() => query));
    const applySearch = () => {
        if (args.beforeApplySearch) {
            args.beforeApplySearch({ query: query, previousQuery: previousQuery });
        }
        previousQuery = args.getSnapshot(query);
        setSearchParams(args.mapDtoToSearch(reduceForSearchParams(query, args.defaultSearch)));
        searchResultActions.refetch();
    };

    return {
        searchResults,
        searchResultActions,
        applySearch,
        query,
        setQuery,
    };
};