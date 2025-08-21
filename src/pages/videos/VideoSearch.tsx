import { videosApi } from '@/services/videosApi';
import { type VideoSearchDtoV1, type VideoSearchFilterDtoV1, VideoSortingOptions } from '@/apiModels';
import {
    createEffect,
    createResource,
    For,
    Show,
    untrack,
} from 'solid-js';
import VideoSearchForm from '@/components/VideoSearchForm';
import { type Params, useSearchParams } from '@solidjs/router';
import {
    reduceForSearchParams,
    tryParseBool,
    tryParseInt,
    tryParseObjEnum,
    excludeUndefinedFields,
    type DeepPartial,
    isDeepEqual,
    clone,
} from '@/utils';
import VideoBulkActions from '@/components/VideoBulkActions';
import { useResultListSelect } from '@/components/ResultListSelect';
import SelectionSummary from '@/components/ResultListSelect/SelectionSummary';
import { createStore } from 'solid-js/store';
import VideoSummary from '@/components/Videos/VideoSummary';

const defaultSearch: VideoSearchDtoV1 = {
    filter: {
        nameQuery: '',
        authorQuery: '',
        authorIds: null,
    },
    sortingOptions: VideoSortingOptions.CreatedAt,
    descending: true,
    page: 0,
    limit: 50,
};

interface SearchParams extends Params {
    name: string;
    author: string;
    authorIds: string;
    sortingOptions: string;
    descending: string;
    page: string;
    limit: string;
}

function mapSearchToDto(
    searchParams: Partial<SearchParams>,
): DeepPartial<VideoSearchDtoV1> {
    return {
        filter: {
            nameQuery: searchParams.name,
            authorQuery: searchParams.author,
            authorIds: searchParams.authorIds?.split(','),
        },
        sortingOptions:
            tryParseObjEnum(searchParams.sort, VideoSortingOptions) ??
            undefined,
        descending: tryParseBool(searchParams.descending) ?? undefined,
        page: tryParseInt(searchParams.page) ?? undefined,
        limit: tryParseInt(searchParams.limit) ?? undefined,
    };
}

function mapDtoToSearch(dto: Partial<VideoSearchDtoV1>): Partial<SearchParams> {
    return {
        name: dto.filter?.nameQuery ?? undefined,
        author: dto.filter?.authorQuery ?? undefined,
        authorIds: dto.filter?.authorIds?.join(','),
        sort: dto.sortingOptions,
        descending: dto.descending?.toString() ?? undefined,
        page: dto.page?.toString() ?? undefined,
        limit: dto.limit?.toString() ?? undefined,
    };
}

const VideoSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams<SearchParams>();
    const [query, setQuery] = createStore<VideoSearchDtoV1>({
        ...defaultSearch,
        ...excludeUndefinedFields(mapSearchToDto(searchParams)),
    });
    createEffect(() => {
        setQuery({
            ...defaultSearch,
            ...excludeUndefinedFields(mapSearchToDto(searchParams)),
        });
        searchResultActions.refetch();
    });
    const [searchResults, searchResultActions] = createResource(() =>
        videosApi.searchVideos(query),
    );

    // I think this untrack is correct?
    let previousFilter: VideoSearchFilterDtoV1 = clone(untrack(() => query.filter));
    const applySearch = () => {
        if (!isDeepEqual(previousFilter, query.filter)) {
            videoSelection.clear();
            setQuery('page', 0);
        }
        previousFilter = clone(query.filter);
        setSearchParams(
            mapDtoToSearch(reduceForSearchParams(query, defaultSearch)),
        );
        searchResultActions.refetch();
    };

    const videoSelection = useResultListSelect();

    return (
        <>
            <VideoSearchForm
                query={query}
                onSubmit={applySearch}
                setQuery={setQuery}
                paginationResult={searchResults()?.data.paginationResult}
            />
            <SelectionSummary selection={videoSelection} />
            <Show when={videoSelection.areAnyResultsSelected()}>
                <VideoBulkActions
                    query={query}
                    videoIds={videoSelection.selectedIds()}
                    selectAll={videoSelection.allSelected()}
                />
            </Show>
            <Show when={searchResults()?.data}>
                <div>
                    <For each={searchResults()!.data.videos}>
                        {(video) => (
                            <VideoSummary video={video} videoSelection={videoSelection} />
                        )}
                    </For>
                </div>
            </Show>
        </>
    );
};

export default VideoSearch;
