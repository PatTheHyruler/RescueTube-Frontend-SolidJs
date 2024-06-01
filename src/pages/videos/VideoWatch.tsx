import {useParams} from "@solidjs/router";
import VideoPlayer from "../../components/VideoPlayer";

const VideoWatch = () => {
    const params = useParams();
    const videoId = params.id;

    return (
        <>
            <VideoPlayer videoId={videoId} />
        </>
    );
}

export default VideoWatch;