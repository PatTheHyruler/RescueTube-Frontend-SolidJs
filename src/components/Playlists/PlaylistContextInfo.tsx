import { createResource, Show } from 'solid-js';
import { playlistsApi } from '@/services/playlistsApi';
import { translationToString } from '@/utils';
import PlaylistItems from '@/components/Playlists/PlaylistItems';
import AuthorSummary from '@/components/AuthorSummary';

interface IProps {
    playlistId: string;
    playlistItemIndex?: number | null;
}

const PlaylistContextInfo = (props: IProps) => {
    const [playlist] = createResource(async () => {
        const response = await playlistsApi.getPlaylist(props.playlistId);
        return response.data;
    });

    return (
        <section>
            <Show when={playlist()} children={playlist => (
                <>
                    <h2>{translationToString(playlist().title)}</h2>
                    <Show when={playlist().authors[0]}
                          children={author => <AuthorSummary author={author()} />}
                          fallback={'No authors???'}
                    />
                    {playlist().videosCount} video(s)
                </>
            )} fallback={<h2>Loading playlist...</h2>} />
            <PlaylistItems playlistId={props.playlistId} playlistItemIndex={props.playlistItemIndex} />
        </section>
    );
};

export default PlaylistContextInfo;