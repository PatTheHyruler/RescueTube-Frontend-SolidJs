import { useParams } from '@solidjs/router';
import { playlistsApi } from '@/services/playlistsApi';
import { createResource, Show } from 'solid-js';
import styles from './PlaylistDetails.module.css';
import ThumbnailDisplay from '@/components/ThumbnailDisplay';
import { translationToString } from '@/utils';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';
import AuthorSummary from '@/components/AuthorSummary';
import PlaylistItems from '@/components/Playlists/PlaylistItems';
import ManualDataFetches from '@/components/ManualDataFetches';
import { EntityTypes } from '@/apiModels';

const PlaylistDetails = () => {
    const params = useParams();
    const playlistId = params.id;

    const [playlist] = createResource(async () => {
        if (!playlistId) {
            throw new Error('No playlistId provided');
        }
        const response = await playlistsApi.getPlaylist(playlistId);
        return response.data;
    });

    return (
        <Show when={playlistId} children={playlistId => (
            <div class={styles.container}>
                <Show when={playlist()}>
                    {playlist => (
                        <div>
                            <ThumbnailDisplay thumbnail={playlist().thumbnail} children={thumbnail => (
                                <img
                                    loading="eager"
                                    src={thumbnail.url}
                                    width={160}
                                    height={90}
                                    alt="Playlist thumbnail"
                                />
                            )} />
                            <h1>{translationToString(playlist().title)}</h1>
                            <p>{translationToString(playlist().description) || 'No description'}</p>
                            <Show when={playlist().authors[0]} children={author => (
                                <AuthorSummary author={author()} />
                            )} fallback={'No author???'} />
                            <Show when={playlist().createdAt} children={createdAt => (
                                <div>
                                    Created at:&nbsp;
                                    <DateTimeDisplay value={createdAt()} />
                                </div>
                            )} />
                            <Show when={playlist().updatedAt} children={updatedAt => (
                                <div>
                                    Updated at:&nbsp;
                                    <DateTimeDisplay value={updatedAt()} />
                                </div>
                            )} />
                            <Show when={playlist().addedToArchiveAt} children={addedToArchiveAt => (
                                <div>
                                    Added to archive:&nbsp;
                                    <DateTimeDisplay value={addedToArchiveAt()} />
                                </div>
                            )} />
                            {playlist().videosCount} video(s)
                        </div>
                    )}
                </Show>
                <PlaylistItems playlistId={playlistId()} />
                <ManualDataFetches entityType={EntityTypes.Playlist} entityId={playlistId()} />
            </div>
        )} />
    );
};

export default PlaylistDetails;
