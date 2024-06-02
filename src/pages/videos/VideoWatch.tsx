import {useParams} from "@solidjs/router";
import VideoPlayer from "../../components/VideoPlayer";
import {createResource, createSignal, Show, Suspense} from "solid-js";
import {videosApi} from "../../services/videosApi";
import {translationToString} from "../../utils";
import styles from './VideoWatch.module.css'
import VideoComments from "../../components/VideoComments";

const VideoWatch = () => {
    const params = useParams();
    const videoId = params.id;

    const [video] = createResource(async () => {
        const response = await videosApi.getVideoDetails(videoId);
        return response.data;
    });
    const [videoInfoOpen, setVideoInfoOpen] = createSignal(false);

    return (
        <>
            <div class={styles.container}>
                <div class={styles.videoPlayer}>
                    <VideoPlayer videoId={videoId}/>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <div class={styles.videoInfo}>
                        <h1>
                            {translationToString(video()?.title)}
                        </h1>
                        <div>
                            <div classList={{[styles.description]: true, [styles.expanded]: videoInfoOpen() }}>
                                <span>
                                    {translationToString(video()?.description)}
                                </span>
                            </div>
                            <button onClick={() => setVideoInfoOpen(v => !v)}>
                                {videoInfoOpen() ? 'Show less' : 'Show more'}
                            </button>
                        </div>
                    </div>
                </Suspense>
                <VideoComments videoId={videoId} />
            </div>
        </>
    );
}

export default VideoWatch;