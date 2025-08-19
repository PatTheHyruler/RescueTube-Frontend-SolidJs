import { createResource, For, Show } from 'solid-js';
import { playlistsApi } from '@/services/playlistsApi';
import VideoSummary from '@/components/Videos/VideoSummary';
import routes from '@/utils/routes';
import styles from './PlaylistItems.module.css';

interface IProps {
    playlistId: string;
    playlistItemIndex?: number | null;
}

const PlaylistItems = (props: IProps) => {
    const [playlistItems] = createResource(async () => {
        const response = await playlistsApi.getPlaylistItems(props.playlistId);
        return response.data;
    });

    return (
        <Show when={playlistItems()}>
            {playlistItems => (
                <ol>
                    <For each={playlistItems().playlistItems} children={playlistItem => (
                        <li data-is-current={props.playlistItemIndex === playlistItem.position} class={styles.playlistItem}>
                            <VideoSummary video={playlistItem.video} videoWatchLink={`${routes.videos.watch(playlistItem.video.id)}?playlistId=${props.playlistId}&playlistItemIndex=${playlistItem.position}`} />
                        </li>
                    )} />
                    TODO: Load more items, scrolling
                </ol>
            )}
        </Show>
    );
};

export default PlaylistItems;