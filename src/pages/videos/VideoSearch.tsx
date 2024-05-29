import {videosApi} from "../../services/videosApi";
import {VideoSearchDtoV1, VideoSortingOptions} from "../../apiModels";
import {createResource, createSignal, For, Show} from "solid-js";
import VideoSearchForm from "../../components/VideoSearchForm";
import {DateTimeDisplay} from "../../components/DateTimeDisplay";
import {DurationDisplay} from "../../components/DurationDisplay";

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
                <table class="table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Thumbnail</th>
                        <th>Duration</th>
                        <th>CreatedAt</th>
                        <th>ArchivedAt</th>
                    </tr>
                    </thead>
                    <tbody>
                    <For each={searchResults()!.data.videos}>
                        {(video) => <tr>
                            <td>{video.title[0].content}</td>
                            <td>
                                <Show when={video.thumbnail}>
                                    <img loading="lazy"
                                         src={video.thumbnail?.url}
                                         width={160}
                                         height={90}
                                         alt="Video thumbnail"
                                    />
                                </Show>
                            </td>
                            <td><DurationDisplay durationSeconds={video.durationSeconds}></DurationDisplay></td>
                            <td><DateTimeDisplay value={video.publishedAt ?? video.createdAt}></DateTimeDisplay></td>
                            <td><DateTimeDisplay value={video.addedToArchiveAt}></DateTimeDisplay></td>
                        </tr>}
                    </For>
                    </tbody>
                </table>
            </Show>
        </>
    );
}

export default VideoSearch;