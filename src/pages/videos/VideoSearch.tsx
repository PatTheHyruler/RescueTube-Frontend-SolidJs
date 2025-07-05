import { videosApi } from '@/services/videosApi';
import { type VideoSearchDtoV1, VideoSortingOptions } from '@/apiModels';
import {
    createEffect,
    createResource,
    createSignal,
    For,
    Show,
} from 'solid-js';
import VideoSearchForm from '@/components/VideoSearchForm';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';
import { secondsToDurationString } from '@/services/timeUtils';
import { A, type Params, useSearchParams } from '@solidjs/router';
import {
    reduceForSearchParams,
    translationToString,
    tryParseBool,
    tryParseInt,
    tryParseObjEnum,
    excludeUndefinedFields,
} from '@/utils';
import AuthorSummary from '@/components/AuthorSummary';
import VideoBulkActions from '@/components/VideoBulkActions';
import { useResultListSelect } from '@/components/ResultListSelect';
import SelectAllCheckbox from '@/components/ResultListSelect/SelectAllCheckbox';
import SelectItemCheckbox from '@/components/SelectItemCheckbox';

const defaultSearch: VideoSearchDtoV1 = {
    nameQuery: '',
    authorQuery: '',
    authorIds: null,
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
): Partial<VideoSearchDtoV1> {
    return {
        nameQuery: searchParams.name,
        authorQuery: searchParams.author,
        authorIds: searchParams.authorIds?.split(','),
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
        name: dto.nameQuery ?? undefined,
        author: dto.authorQuery ?? undefined,
        authorIds: dto.authorIds?.join(','),
        sort: dto.sortingOptions,
        descending: dto.descending?.toString() ?? undefined,
        page: dto.page?.toString() ?? undefined,
        limit: dto.limit?.toString() ?? undefined,
    };
}

const VideoSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams<SearchParams>();
    const [query, setQuery] = createSignal<VideoSearchDtoV1>({
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
        videosApi.searchVideos(query()),
    );
    const applySearch = () => {
        setSearchParams(
            mapDtoToSearch(reduceForSearchParams(query(), defaultSearch)),
        );
        searchResultActions.refetch();
    };

    const videoSelection = useResultListSelect();
    createEffect(() => {
        if (searchResults.loading) {
            videoSelection.clear();
        }
    });

    return (
        <>
            <VideoSearchForm
                query={query()}
                onSubmit={applySearch}
                setQuery={setQuery}
                paginationResult={searchResults()?.data.paginationResult}
            />
            <SelectAllCheckbox context={videoSelection} />
            <Show when={videoSelection.areAnyResultsSelected()}>
                <VideoBulkActions
                    query={query()}
                    videoIds={videoSelection.selectedIds()}
                    selectAll={videoSelection.allSelected()}
                />
            </Show>
            <Show when={searchResults()?.data}>
                <div>
                    <For each={searchResults()!.data.videos}>
                        {(video) => (
                            <div style={{ margin: '8px', display: 'flex' }}>
                                <SelectItemCheckbox context={videoSelection} id={video.id} />
                                <div
                                    style={{
                                        'border-radius': '6px',
                                        overflow: 'hidden',
                                        width: 'fit-content',
                                        height: 'fit-content',
                                    }}
                                >
                                    <A href={`/videos/watch/${video.id}`}>
                                        <Show
                                            when={video.thumbnail}
                                            fallback={
                                                <div>No thumbnails :(</div>
                                            }
                                        >
                                            <img
                                                loading="lazy"
                                                src={video.thumbnail?.url}
                                                width={160}
                                                height={90}
                                                alt="Video thumbnail"
                                            />
                                        </Show>
                                    </A>
                                </div>
                                <div>
                                    <A href={`/videos/watch/${video.id}`}>
                                        <div>
                                            {translationToString(video.title)}
                                        </div>
                                    </A>
                                    <div>
                                        <Show
                                            when={video.authors[0]}
                                            fallback={'No author???'}
                                            keyed
                                        >
                                            {(author) => (
                                                <AuthorSummary
                                                    author={author}
                                                />
                                            )}
                                        </Show>
                                    </div>
                                    <div
                                        style={{ display: 'flex', gap: '3px' }}
                                    >
                                        <DateTimeDisplay
                                            value={
                                                video.createdAt ??
                                                video.publishedAt
                                            }
                                        ></DateTimeDisplay>
                                        <div>
                                            Duration:{' '}
                                            {secondsToDurationString(
                                                video.durationSeconds,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </>
    );
};

export default VideoSearch;
