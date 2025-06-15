import {
    type AuthorSimpleDtoV1,
    type PaginationResult,
    type VideoSearchDtoV1,
    VideoSortingOptions,
} from '@/apiModels';
import { createResource, For, type Setter } from 'solid-js';
import PaginationComponent from './PaginationComponent';
import { useOnPaginationQueryUpdate } from '@/utils/pagination';
import type { Values } from '@/utils';
import { authorsApi } from '@/services/authorsApi';
import Select, { type Option } from '@/components/Select/Select';
import { createStore } from 'solid-js/store';

interface IProps {
    query: VideoSearchDtoV1;
    setQuery: Setter<VideoSearchDtoV1>;
    paginationResult?: PaginationResult | null;
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

    const onPaginationQueryUpdate = useOnPaginationQueryUpdate(props.setQuery);

    const [authorCache, setAuthorCache] = createStore<Record<string, AuthorSimpleDtoV1>>({});
    const [fetchedSelectedAuthors] = createResource(
        () => props.query.authorIds,
        async (authorIds) => {
            if (!authorIds?.length) {
                return [];
            }
            const uncachedIds = authorIds.filter(id => !authorCache[id]);
            if (uncachedIds.length > 0) {
                const response = await authorsApi.searchAuthors({
                    limit: uncachedIds.length,
                    page: 0,
                    authorIds: uncachedIds,
                });
                response.data.authors.forEach(author => {
                    setAuthorCache(cache => ({ ...cache, [author.id]: author }));
                });
            }
            return authorIds
                .map(id => authorCache[id])
                .filter<AuthorSimpleDtoV1>(x => !!x);
        },
    );
    const selectedAuthors = () => {
        if (!props.query.authorIds?.length) {
            return [];
        }
        const authors = fetchedSelectedAuthors();
        if (!authors) {
            return null;
        }
        const options: AuthorOption[] = authors.map(mapAuthorToAuthorOption);
        for (const authorId of props.query.authorIds) {
            if (authors.findIndex(x => x.id == authorId) === -1) {
                options.push({ id: authorId, name: `id: ${authorId}`, author: null });
            }
        }
        return options;
    };

    return (
        <>
            <form onSubmit={onSubmit} class="d-inline-flex gap-1">
                <label for="nameQuery">
                    Name:
                    <input
                        id="nameQuery"
                        value={props.query.nameQuery ?? ''}
                        onInput={(e) =>
                            props.setQuery((v) => ({
                                ...v,
                                nameQuery: e.target.value,
                            }))
                        }
                    />
                </label>
                <label for="authorIds">
                    Author:
                    <Select
                        id="authorIds"
                        fetchOptions={async (search) => {
                            const response = await authorsApi.searchAuthors({
                                name: search,
                                excludeAuthorIds: props.query.authorIds,
                                limit: 10,
                                page: 0,
                            });
                            const authors = response.data.authors;
                            setAuthorCache(cache => ({
                                ...cache,
                                ...Object.fromEntries(authors.map(author => [author.id, author])),
                            }));
                            return authors.map(mapAuthorToAuthorOption);
                        }}
                        selectedOptions={selectedAuthors()}
                        onChange={selectedAuthors => {
                            props.setQuery(q => ({ ...q, authorIds: selectedAuthors.map(author => author.id) }));
                        }}
                        disabled={fetchedSelectedAuthors.loading}
                    />
                </label>
                <label for="sortingOptions">
                    Sort by:
                    <select
                        id="sortingOptions"
                        value={props.query.sortingOptions}
                        onChange={(e) =>
                            props.setQuery((p) => ({
                                ...p,
                                sortingOptions: e.target.value as Values<typeof VideoSortingOptions>,
                            }))
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
                            props.setQuery((p) => ({
                                ...p,
                                descending: !p.descending,
                            }))
                        }
                    />
                </label>
                <button type="submit">Apply</button>
            </form>
            <PaginationComponent
                paginationQuery={props.query}
                paginationResult={props.paginationResult}
                onUpdate={onPaginationQueryUpdate}
                onSubmit={props.onSubmit}
            />
        </>
    );
};

export default VideoSearchForm;
