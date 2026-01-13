import { videosApi } from '@/services/videosApi';
import {
    type VideoSearchDtoV1,
    VideoSortingOptions,
} from '@/apiModels';
import {
    For,
    Show,
} from 'solid-js';
import VideoSearchForm from '@/components/VideoSearchForm';
import { type Params } from '@solidjs/router';
import {
    tryParseBool,
    tryParseInt,
    tryParseObjEnum,
    type DeepPartial,
    isDeepEqual,
    clone,
} from '@/utils';
import VideoBulkActions from '@/components/VideoBulkActions';
import { useResultListSelect } from '@/components/ResultListSelect';
import SelectionSummary from '@/components/ResultListSelect/SelectionSummary';
import VideoSummary from '@/components/Videos/VideoSummary';
import { useSearch } from '@/utils/search';

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
    const { searchResults, applySearch, query, setQuery } = useSearch({
        defaultSearch: defaultSearch,
        mapSearchToDto: mapSearchToDto,
        mapDtoToSearch: mapDtoToSearch,
        fetch: query => videosApi.searchVideos(query),
        getSnapshot: clone,
        beforeApplySearch: args => {
            if (!isDeepEqual(args.previousQuery.filter, args.query.filter, {
                emptyStringsAreEquivalentToNullAndUndefined: true,
            })) {
                videoSelection.clear();
                setQuery('page', 0);
            }
        },
    });


    const videoSelection = useResultListSelect();

    return (
        <div class="center-container">
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
            <Show
                when={searchResults()?.data}
                children={(data) => (
                    <div>
                        <For each={data().videos}>
                            {(video) => <VideoSummary video={video} videoSelection={videoSelection} />}
                        </For>
                    </div>
                )}
            />
        </div>
    );
};

export default VideoSearch;
