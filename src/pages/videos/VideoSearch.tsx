import {videosApi} from "../../services/videosApi";
import {VideoSearchDtoV1, VideoSortingOptions} from "../../apiModels";
import {createResource, createSignal, For, Show} from "solid-js";
import VideoSearchForm from "../../components/VideoSearchForm";
import {DateTimeDisplay} from "../../components/DateTimeDisplay";
import {secondsToDurationString} from "../../services/timeUtils";

const VideoSearch = () => {
    const [query, setQuery] = createSignal<VideoSearchDtoV1>({
        nameQuery: '',
        authorQuery: '',

        sortingOptions: VideoSortingOptions.CreatedAt,
        descending: true,

        page: 0,
        limit: 50,
    });
    const [searchResults, searchResultActions] =
        createResource(() => videosApi.searchVideos(
            query())
        );
    const applySearch = () => {
        searchResultActions.refetch();
    }

    return (
        <>
            <VideoSearchForm query={query()} onSubmit={applySearch} setQuery={setQuery}></VideoSearchForm>
            <Show when={searchResults()?.data}>
                <div>
                    <For each={searchResults()!.data.videos}>
                        {(video) => (
                            <div style={{margin: '8px', display: 'flex'}}>
                                <div style={{
                                    "border-radius": '6px',
                                    overflow: 'hidden',
                                    width: 'fit-content',
                                    height: 'fit-content',
                                }}>
                                    <Show when={video.thumbnail} fallback={<div>No thumbnails :(</div>}>
                                        <img loading="lazy"
                                             src={video.thumbnail?.url}
                                             width={160}
                                             height={90}
                                             alt="Video thumbnail"
                                        />
                                    </Show>
                                </div>
                                <div>
                                    <div>
                                        {video.title[0].content}
                                    </div>
                                    <div>
                                        {video.authors[0].displayName}
                                    </div>
                                    <div style={{display: 'flex', gap: '3px'}}>
                                        <DateTimeDisplay value={video.createdAt ?? video.publishedAt}></DateTimeDisplay>
                                        <div>
                                            Duration: {secondsToDurationString(video.durationSeconds)}
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
}

export default VideoSearch;