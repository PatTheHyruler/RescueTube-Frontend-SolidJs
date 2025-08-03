import { playlistsApi } from '@/services/playlistsApi';
import { createEffect, createResource, For, Show } from 'solid-js';
import type { PlaylistSearchDtoV1, PlaylistSearchFilterDtoV1 } from '@/apiModels';
import { type Params, useSearchParams } from '@solidjs/router';
import {
    clone,
    type DeepPartial,
    excludeUndefinedFields,
    isDeepEqual,
    reduceForSearchParams,
    translationToString,
    tryParseInt,
} from '@/utils';
import { createStore } from 'solid-js/store';
import PlaylistSearchForm from '@/components/Playlists/PlaylistSearchForm';
import ThumbnailDisplay from '@/components/ThumbnailDisplay';

const defaultSearch: PlaylistSearchDtoV1 = {
    filter: {
        name: null,
    },
    page: 0,
    limit: 50,
};

interface SearchParams extends Params {
    name: string;
    page: string;
    limit: string;
}

function mapSearchToDto(searchParams: Partial<SearchParams>): DeepPartial<PlaylistSearchDtoV1> {
    return {
        filter: {
            name: searchParams.name,
        },
        page: tryParseInt(searchParams.page) ?? undefined,
        limit: tryParseInt(searchParams.limit) ?? undefined,
    };
}

function mapDtoToSearch(dto: Partial<PlaylistSearchDtoV1>): Partial<SearchParams> {
    return {
        name: dto.filter?.name ?? undefined,
        page: dto.page?.toString() ?? undefined,
        limit: dto.limit?.toString() ?? undefined,
    };
}

const PlaylistSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams<SearchParams>();
    const [query, setQuery] = createStore<PlaylistSearchDtoV1>({
        ...defaultSearch,
        ...excludeUndefinedFields(mapSearchToDto(searchParams)),
    });
    const [searchResults, searchResultActions] = createResource(async () => {
        const response = await playlistsApi.searchPlaylists(query);
        return response.data;
    });
    createEffect(() => {
        setQuery({
            ...defaultSearch,
            ...excludeUndefinedFields(mapSearchToDto(searchParams)),
        });
        searchResultActions.refetch();
    });

    let previousFilter: PlaylistSearchFilterDtoV1 | null | undefined = clone(query.filter);
    const applySearch = () => {
        if (!isDeepEqual(previousFilter, query.filter)) {
            // playlistSelection.clear(); TODO
            setQuery('page', 0);
        }
        previousFilter = clone(query.filter);
        setSearchParams(mapDtoToSearch(reduceForSearchParams(query, defaultSearch)));
        searchResultActions.refetch();
    };

    return (
        <>
            <PlaylistSearchForm
                query={query}
                setQuery={setQuery}
                onSubmit={applySearch}
                paginationResult={searchResults()?.paginationResult}
            />
            <Show when={searchResults()}>
                {(searchResults) => (
                    <div>
                        <For each={searchResults().playlists}>
                            {(playlist) => (
                                <div>
                                    <ThumbnailDisplay thumbnail={playlist.thumbnail}>
                                        {thumbnail => (
                                            <img
                                                loading="lazy"
                                                src={thumbnail.url}
                                                width={160}
                                                height={90}
                                                alt="Playlist thumbnail"
                                            />
                                        )}
                                    </ThumbnailDisplay>
                                    {translationToString(playlist.title)}
                                </div>
                            )}
                        </For>
                    </div>
                )}
            </Show>
        </>
    );
};

export default PlaylistSearch;
