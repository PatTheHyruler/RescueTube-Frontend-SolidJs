import {
    type AuthorSimpleDtoV1,
    type PaginationResult,
    type VideoSearchDtoV1,
    VideoSortingOptions,
} from '@/apiModels';
import { createMemo, createResource, For } from 'solid-js';
import PaginationComponent from './PaginationComponent';
import { updatePaginationQuery } from '@/utils/pagination';
import { isDeepEqual, type Values } from '@/utils';
import { authorsApi } from '@/services/authorsApi';
import Select, { type Option } from '@/components/Select/Select';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';

interface IProps {
    query: VideoSearchDtoV1;
    setQuery: SetStoreFunction<VideoSearchDtoV1>;
    paginationResult: PaginationResult | null | undefined;
    onSubmit: (() => Promise<void>) | (() => void);
}

interface AuthorOption extends Option {
    author: AuthorSimpleDtoV1 | null;
}

const mapAuthorToAuthorOption = (author: AuthorSimpleDtoV1): AuthorOption => {
    return {
        id: author.id,
        name: author.displayName ?? author.userName,
        author: author,
    };
};

const VideoSearchForm = (props: IProps) => {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        return props.onSubmit();
    };

    const [authorCache, setAuthorCache] = createStore<Record<string, AuthorSimpleDtoV1>>({});
    const uncachedAuthorIds = createMemo(
        () => props.query.filter?.authorIds?.filter(id => !authorCache[id]) ?? [],
        [],
        { equals: isDeepEqual },
    );
    const [fetchedUncachedAuthors] = createResource(
        uncachedAuthorIds,
        async (unCachedAuthorIds) => {
            if (!unCachedAuthorIds.length) {
                return [];
            }

            const response = await authorsApi.searchAuthors({
                limit: unCachedAuthorIds.length,
                page: 0,
                authorIds: unCachedAuthorIds,
            });
            setAuthorCache(produce(cache => {
                response.data.authors.forEach(author => {
                    cache[author.id] = author;
                });
            }));
            return response.data.authors;
        },
    );

    const selectedAuthors = createMemo(() => {
        const authorIds = props.query.filter?.authorIds;
        if (!authorIds?.length) {
            return [];
        }

        if (fetchedUncachedAuthors.loading || fetchedUncachedAuthors.error) {
            return null;
        }

        const authors = authorIds.map(id => authorCache[id]).filter(x => x !== undefined);

        const options: AuthorOption[] = authors.map(mapAuthorToAuthorOption);
        for (const authorId of authorIds) {
            if (authors.findIndex(x => x.id == authorId) === -1) {
                options.push({ id: authorId, name: `id: ${authorId}`, author: null });
            }
        }
        return options;
    });

    const handleFetchOptions = async (search: string | null) => {
        const response = await authorsApi.searchAuthors({
            name: search,
            excludeAuthorIds: props.query.filter?.authorIds,
            limit: 10,
            page: 0,
        });
        const authors = response.data.authors;
        setAuthorCache(cache => ({
            ...cache,
            ...Object.fromEntries(authors.map(author => [author.id, author])),
        }));
        return authors.map(mapAuthorToAuthorOption);
    };

    return (
        <>
            <form onSubmit={onSubmit} class="d-inline-flex gap-1">
                <label for="nameQuery">
                    Name:
                    <input
                        id="nameQuery"
                        value={props.query.filter?.nameQuery ?? ''}
                        onChange={(e) => {
                            props.setQuery('filter', 'nameQuery', e.target.value);
                        }}
                    />
                </label>
                <label for="authorIds">
                    Author:
                    <Select
                        id="authorIds"
                        fetchOptions={handleFetchOptions}
                        selectedOptions={selectedAuthors()}
                        onChange={selectedAuthors => {
                            props.setQuery('filter', 'authorIds', selectedAuthors.map(
                                (author) => author.id,
                            ));
                        }}
                        disabled={selectedAuthors() === null}
                    />
                </label>
                <label for="sortingOptions">
                    Sort by:
                    <select
                        id="sortingOptions"
                        value={props.query.sortingOptions}
                        onChange={(e) =>
                            props.setQuery('sortingOptions', e.target.value as Values<typeof VideoSortingOptions>)
                        }
                    >
                        <For each={Object.values(VideoSortingOptions)}>
                            {(item) => (
                                <>
                                    <option>{item.toString()}</option>
                                </>
                            )}
                        </For>
                    </select>
                </label>
                <label for="descending">
                    Descending?
                    <input
                        type="checkbox"
                        id="descending"
                        checked={props.query.descending}
                        onChange={() =>
                            props.setQuery('descending', v => !v)
                        }
                    />
                </label>
                <button type="submit">Apply</button>
            </form>
            <PaginationComponent
                paginationQuery={props.query}
                paginationResult={props.paginationResult}
                onUpdate={p => updatePaginationQuery(p, props.setQuery)}
                onSubmit={props.onSubmit}
            />
        </>
    );
};

export default VideoSearchForm;
