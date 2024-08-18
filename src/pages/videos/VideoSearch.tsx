import { videosApi } from '../../services/videosApi';
import { type VideoSearchDtoV1, VideoSortingOptions } from '../../apiModels';
import { createResource, createSignal, For, Show } from 'solid-js';
import VideoSearchForm from '../../components/VideoSearchForm';
import { DateTimeDisplay } from '../../components/DateTimeDisplay';
import { secondsToDurationString } from '../../services/timeUtils';
import { A, useSearchParams } from '@solidjs/router';
import {
    reduceForSearchParams,
    translationToString,
    tryParseBool,
    tryParseInt,
    tryParseObjEnum,
} from '../../utils';
import AuthorSummary from '../../components/AuthorSummary';

const defaultSearch: VideoSearchDtoV1 = {
    nameQuery: '',
    authorQuery: '',
    sortingOptions: VideoSortingOptions.CreatedAt,
    descending: true,
    page: 0,
    limit: 50,
};

const VideoSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = createSignal<VideoSearchDtoV1>({
        nameQuery: searchParams.name ?? defaultSearch.nameQuery,
        authorQuery: searchParams.author ?? defaultSearch.authorQuery,

        sortingOptions:
            tryParseObjEnum(searchParams.sort, VideoSortingOptions) ??
            defaultSearch.sortingOptions,
        descending:
            tryParseBool(searchParams.descending) ?? defaultSearch.descending,

        page: tryParseInt(searchParams.page) ?? defaultSearch.page,
        limit: tryParseInt(searchParams.limit) ?? defaultSearch.limit,
    });
    const [searchResults, searchResultActions] = createResource(() =>
        videosApi.searchVideos(query())
    );
    const applySearch = () => {
        const reduced = reduceForSearchParams(query(), defaultSearch);
        setSearchParams({
            name: reduced.nameQuery,
            author: reduced.authorQuery,
            sort: reduced.sortingOptions,
            descending: reduced.descending,
            page: reduced.page,
            limit: reduced.limit,
        });
        searchResultActions.refetch();
    };

    return (
        <>
            <VideoSearchForm
                query={query()}
                onSubmit={applySearch}
                setQuery={setQuery}
                paginationResult={searchResults()?.data.paginationResult}
            />
            <Show when={searchResults()?.data}>
                <div>
                    <For each={searchResults()!.data.videos}>
                        {(video) => (
                            <div style={{ margin: '8px', display: 'flex' }}>
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
                                                video.durationSeconds
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
