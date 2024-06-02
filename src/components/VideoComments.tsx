import {createResource, For, Suspense} from "solid-js";
import {commentsApi} from "../services/commentsApi";
import VideoComment from "./VideoComment";

interface IProps {
    videoId: string,
}

const VideoComments = ({videoId}: IProps) => {
    const [comments] = createResource(async () => {
        const response = await commentsApi.getVideoComments(videoId, {page: 1, limit: 2});
        return response.data;
    });

    return (
        <>
            <Suspense>
                <For each={comments()?.comments}>
                    {comment => (
                        <VideoComment comment={comment}/>
                    )}
                </For>
            </Suspense>
        </>
    );
}

export default VideoComments;