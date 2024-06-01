import {useParams} from "@solidjs/router";
import {baseApi} from "../../services/baseApi";
import {createResource, createSignal, Show} from "solid-js";
import {AccessTokenDtoV1} from "../../apiModels";
import {videosApi} from "../../services/videosApi";

const VideoWatch = () => {
    const params = useParams();
    const id = params.id;

    const [accessToken, {refetch: refetchAccessToken},] = createResource<AccessTokenDtoV1>(async () => {
        const tokenResponse = await videosApi.getVideoFileAccessToken(id);
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
                <video controls width={560} height={315}
                       onTimeUpdate={e => setCurrentTimeSeconds(e.currentTarget.currentTime)}
                       onError={onError}
                >
                    <source src={`${baseApi.baseUrl}/v1/videos/${id}/file/data`}/>
                </video>
            </Show>
        </>
    );
}

export default VideoWatch;