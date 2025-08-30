import { createResource, Show } from 'solid-js';
import { playlistsApi } from '@/services/playlistsApi';
import { translationToString } from '@/utils';
import PlaylistItems from '@/components/Playlists/PlaylistItems';
import AuthorSummary from '@/components/AuthorSummary';
import { A } from '@solidjs/router';
import routes from '@/utils/routes';

interface IProps {
    playlistId: string;
    current?: {
        playlistItemIndex: number;
        videoId: string;
    };
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
                    <h2>
                        <A href={routes.playlists.details(props.playlistId)}>
                            {translationToString(playlist().title)}
                        </A>
                    </h2>
                    <Show when={playlist().authors[0]}
                          children={author => <AuthorSummary author={author()} />}
                          fallback={'No authors???'}
                    />
                    {playlist().videosCount} video(s)
                </>
            )} fallback={<h2>Loading playlist...</h2>} />
            <PlaylistItems playlistId={props.playlistId} current={props.current} />
        </section>
    );
};

export default PlaylistContextInfo;