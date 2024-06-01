import {createResource, createSignal, Show} from "solid-js";
import {AccessTokenDtoV1} from "../apiModels";
import {videosApi} from "../services/videosApi";
import {baseApi} from "../services/baseApi";

interface IProps {
    videoId: string,
}

const VideoPlayer = ({videoId}: IProps) => {
    // Loss of reactivity due to props destructuring is ok, we don't expect videoId to change

    const [accessToken, {refetch: refetchAccessToken},] = createResource<AccessTokenDtoV1>(async () => {
        const tokenResponse = await videosApi.getVideoFileAccessToken(videoId);
        return tokenResponse.data;
    });
    setInterval(refetchAccessToken, 40_000);

    const [currentTimeSeconds, setCurrentTimeSeconds] = createSignal(0);
    const [lastErrorReloadAttempt, setLastErrorReloadAttempt] = createSignal<Date | null>(null);
    const onError = async (e: Event & {currentTarget: HTMLVideoElement}) => {
        console.log('refreshing error', e.currentTarget);
        const videoElement = e.currentTarget;
        const lastReloadAttempt = lastErrorReloadAttempt();
        if (lastReloadAttempt && (new Date().getTime() - lastReloadAttempt.getTime() < 5000)) {
            console.log('skipping video player error reload');
            return;
        }
        setLastErrorReloadAttempt(new Date());
        const token = await refetchAccessToken();
        if (token) {
            videoElement.load();
            videoElement.currentTime = currentTimeSeconds();
        }
    }

    return (
        <>
            <Show when={accessToken.state === 'ready' || accessToken.state === 'refreshing'}>
                <video controls width="100%"
                       onTimeUpdate={e => setCurrentTimeSeconds(e.currentTarget.currentTime)}
                       onError={onError}
                >
                    <source src={`${baseApi.baseUrl}/v1/videos/${videoId}/file/data`}/>
                </video>
            </Show>
        </>
    );
}

export default VideoPlayer;