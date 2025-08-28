import type { DataFetchDtoV1 } from '@/apiModels';
import { createSignal, Match, Show, Switch } from 'solid-js';
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
                    <Switch>
                        <Match when={dataFetch().success}>
                            <span class="text-success">Succeeded</span>
                        </Match>
                        <Match when={!dataFetch().success}>
                            <span class="text-danger">Failed</span>
                        </Match>
                    </Switch>
                </td>
                <td>
                    <button onClick={() => setShouldShowJson(v => !v)}>
                        JSON
                    </button>
                    <Show when={dataFetch().videoId}>
                        {(videoId) => (
                            <A href={routes.videos.watch(videoId())}>
                                Video
                            </A>
                        )}
                    </Show>
                    <Show when={dataFetch().authorId}>
                        {(authorId) => (
                            <A href={routes.authors.details(authorId())}>
                                Author
                            </A>
                        )}
                    </Show>
                    <Show when={dataFetch().playlistId}>
                        {(playlistId) => (
                            <A href={routes.playlists.details(playlistId())}>
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