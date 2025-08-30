import VideoSettings from '@/components/VideoSettings';
import { useParams, useSearchParams } from '@solidjs/router';
import VideoPlayer from '@/components/VideoPlayer';
import { createMemo, createResource, createSignal, Show, Suspense } from 'solid-js';
import { videosApi } from '@/services/videosApi';
import { isGuid, translationToString, tryParseInt } from '@/utils';
import styles from './VideoWatch.module.css';
import VideoComments from '@/components/VideoComments';
import PlaylistContextInfo from '@/components/Playlists/PlaylistContextInfo';
import ManualDataFetches from '@/components/ManualDataFetches';
import { PlatformsWithDownloadSupport, EntityTypes } from '@/apiModels';

const getPlaylistParams = () => {
    const [searchParams] = useSearchParams();

    const playlistId = searchParams.playlistId;
    if (!playlistId || !isGuid(playlistId)) {
        return null;
    }

    let playlistItemIndex = tryParseInt(searchParams.playlistItemIndex);
    if (playlistItemIndex !== null && playlistItemIndex < 0) {
        playlistItemIndex = null;
    }

    return {
        playlistId,
        playlistItemIndex,
    };
};

const VideoWatch = () => {
    const params = useParams();
    const videoId = () => params.id;

    const playlistParams = createMemo(getPlaylistParams);

    const [video] = createResource(videoId, async (videoId) => {
        if (!videoId) {
            throw new Error('No videoId provided');
        }
        const response = await videosApi.getVideoDetails(videoId);
        return response.data;
    });
    const [videoInfoOpen, setVideoInfoOpen] = createSignal(false);

    return (
        <Show when={videoId()}>
            {(videoId) => (
                <div class={styles.container}>
                    <div class={styles.videoPlayer}>
                        <VideoPlayer videoId={videoId()} />
                    </div>
                    <Show
                        when={playlistParams()}
                        children={(playlistParams) => (
                            <div class={styles.playlistContext}>
                                <PlaylistContextInfo
                                    playlistId={playlistParams().playlistId}
                                    current={playlistParams().playlistItemIndex !== null ? {
                                        playlistItemIndex:
                                            playlistParams().playlistItemIndex!,
                                        videoId: videoId(),
                                    } : undefined}
                                />
                            </div>
                        )}
                    />
                    <div class={styles.videoSettings}>
                        <VideoSettings videoId={videoId()} />
                    </div>
                    <div>
                        <ManualDataFetches
                            entityType={EntityTypes.Video}
                            entityId={videoId()}
                            extraActions={video()?.platform && PlatformsWithDownloadSupport.includes(video()!.platform)
                                ? [
                                    {
                                        label: 'Download',
                                        onClick: () => videosApi.enqueueManualDownload(videoId()),
                                    },
                                ]
                                : undefined}
                        />
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <div class={styles.videoInfo}>
                            <h1>{translationToString(video()?.title)}</h1>
                            <div>
                                <div
                                    classList={{
                                        [styles.description]: true,
                                        [styles.expanded]: videoInfoOpen(),
                                    }}
                                >
                                    <span>
                                        {translationToString(
                                            video()?.description,
                                        )}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setVideoInfoOpen((v) => !v)}
                                >
                                    {videoInfoOpen()
                                        ? 'Show less'
                                        : 'Show more'}
                                </button>
                            </div>
                        </div>
                    </Suspense>
                    <div class={styles.comments}>
                        <VideoComments videoId={videoId()} />
                    </div>
                </div>
            )}
        </Show>
    );
};

export default VideoWatch;
