import {videosApi} from "../../services/videosApi";
import {VideoSearchDtoV1, VideoSortingOptions} from "../../apiModels";
import {createResource, createSignal, For, Show} from "solid-js";
import VideoSearchForm from "../../components/VideoSearchForm";

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
                <For each={searchResults()!.data.videos}>
                    {(item, index) => <>
                        <div>{item.title[0].content}</div>
                    </>}
                </For>
            </Show>
        </>
    );
}

export default VideoSearch;