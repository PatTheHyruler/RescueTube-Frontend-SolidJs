import { createEffect, createResource, createSignal, Show } from 'solid-js';
import { videosApi } from '@/services/videosApi';
import { baseApi } from '@/services/baseApi';

interface IProps {
    videoId: string;
}

const persistVolume = (volume: number) => {
    window.localStorage.setItem('RescueTube-Volume', volume.toString());
};

const getPersistedVolume = () => {
    const volumeString = window.localStorage.getItem('RescueTube-Volume');
    if (!volumeString) {
        return null;
    }
    try {
        const volume = parseFloat(volumeString);
        return Math.max(0, Math.min(1, volume));
    } catch (error) {
        console.error('Failed to parse persisted volume', error);
        return null;
    }
};

const VideoPlayer = (props: IProps) => {
    const [accessToken, { refetch: refetchAccessToken }] =
        createResource(() => props.videoId, async (videoId) => {
            const tokenResponse =
                await videosApi.getVideoFileAccessToken(videoId);
            return tokenResponse.data;
        });
    setInterval(refetchAccessToken, 40_000);

    const [currentTimeSeconds, setCurrentTimeSeconds] = createSignal(0);
    const [lastErrorReloadAttempt, setLastErrorReloadAttempt] =
        createSignal<Date | null>(null);
    const onError = async (e: Event & { currentTarget: HTMLVideoElement }) => {
        console.log('refreshing error', e.currentTarget);
        const videoElement = e.currentTarget;
        const lastReloadAttempt = lastErrorReloadAttempt();
        if (
            lastReloadAttempt &&
            new Date().getTime() - lastReloadAttempt.getTime() < 5000
        ) {
            console.log('skipping video player error reload');
            return;
        }
        setLastErrorReloadAttempt(new Date());
        const token = await refetchAccessToken();
        if (token) {
            videoElement.load();
            videoElement.currentTime = currentTimeSeconds();
        }
    };

    let videoElement!: HTMLVideoElement;

    createEffect(previousVideoId => {
        if (videoElement && previousVideoId !== props.videoId) {
            videoElement.load();
            setCurrentTimeSeconds(0);
        }
        return props.videoId;
        // eslint-disable-next-line solid/reactivity
    }, props.videoId);

    return (
        <>
            <Show
                when={
                    accessToken.state === 'ready' ||
                    accessToken.state === 'refreshing'
                }
            >
                <video
                    controls
                    width="100%"
                    onTimeUpdate={(e) =>
                        setCurrentTimeSeconds(e.currentTarget.currentTime)
                    }
                    onLoadStart={(e) =>
                        (e.currentTarget.volume = getPersistedVolume() ?? 1)
                    }
                    onVolumeChange={(e) =>
                        persistVolume(e.currentTarget.volume)
                    }
                    onError={onError}
                    ref={videoElement}
                >
                    <source
                        src={`${baseApi.baseUrl}/v1/videos/${props.videoId}/file/data`}
                    />
                </video>
            </Show>
        </>
    );
};

export default VideoPlayer;
