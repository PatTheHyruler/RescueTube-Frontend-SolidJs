import { type DataFetchDtoV1, DataFetchStatuses } from '@/apiModels';
import { createSignal, Show } from 'solid-js';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';
import { A } from '@solidjs/router';
import routes from '@/utils/routes';

interface DataFetchProps {
    dataFetch: DataFetchDtoV1;
}

const DataFetchRow = (props: DataFetchProps) => {
    const dataFetch = () => props.dataFetch;
    const [shouldShowJson, setShouldShowJson] = createSignal<boolean>(false);

    return (
        <>
            <tr>
                <td>
                    <DateTimeDisplay
                        value={dataFetch().occurredAt}
                        customDisplay={dt => dt?.toFormat('yyyy-MM-dd HH:mm:ss')} />
                </td>
                <td>{dataFetch().type}</td>
                <td>{dataFetch().source}</td>
                <td>
                    <span classList={{
                        'text-success': dataFetch().status === DataFetchStatuses.Succeeded,
                        'text-danger': dataFetch().status === DataFetchStatuses.Failed,
                    }}>
                        {dataFetch().status}
                    </span>
                </td>
                <td>
                    <button onClick={() => setShouldShowJson(v => !v)}>
                        JSON
                    </button>
                    <Show when={dataFetch().videoIdOnPlatform}>
                        {(videoId) => (
                            <A href={routes.videos.byPlatformId({ platform: dataFetch().platform, idOnPlatform: videoId() })}>
                                Video
                            </A>
                        )}
                    </Show>
                    <Show when={dataFetch().authorIdOnPlatform}>
                        {(authorId) => (
                            <A href={routes.authors.byPlatformId({ platform: dataFetch().platform, idOnPlatform: authorId() })}>
                                Author
                            </A>
                        )}
                    </Show>
                    <Show when={dataFetch().playlistIdOnPlatform}>
                        {(playlistId) => (
                            <A href={routes.playlists.byPlatformId({ platform: dataFetch().platform, idOnPlatform: playlistId() })}>
                                Playlist
                            </A>
                        )}
                    </Show>
                </td>
            </tr>
            <Show when={shouldShowJson()}>
                <tr>
                    <td colspan={5}>
                        <pre>
                            {JSON.stringify(dataFetch, null, 2)}
                        </pre>
                    </td>
                </tr>
            </Show>
        </>
    );
};

export default DataFetchRow;