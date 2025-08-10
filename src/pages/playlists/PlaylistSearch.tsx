import { playlistsApi } from '@/services/playlistsApi';
import { createEffect, createResource, For, Show } from 'solid-js';
import type { PlaylistSearchDtoV1, PlaylistSearchFilterDtoV1 } from '@/apiModels';
import { A, type Params, useSearchParams } from '@solidjs/router';
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
import { DateTimeDisplay } from '@/components/DateTimeDisplay';

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
                                    <h4>
                                        <A href={`/playlists/${playlist.id}`}>
                                            {translationToString(playlist.title)}
                                        </A>
                                    </h4>
                                    <div>
                                        <div>
                                            Added to archive:
                                            <DateTimeDisplay value={playlist.addedToArchiveAt} />
                                        </div>
                                        <Show when={playlist.createdAt} children={createdAt => (
                                            <div>
                                                Created at:&nbsp;
                                                <DateTimeDisplay value={createdAt()} />
                                            </div>
                                        )} />
                                        <Show when={playlist.updatedAt} children={updatedAt => (
                                            <div>
                                                Updated at:&nbsp;
                                                <DateTimeDisplay value={updatedAt()} />
                                            </div>
                                        )} />
                                        <div>
                                            {playlist.videosCount} video<Show when={playlist.videosCount !== 1} children={'s'} />
                                        </div>
                                    </div>
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
