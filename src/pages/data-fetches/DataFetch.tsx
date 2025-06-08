import type { DataFetchDtoV1 } from '@/apiModels';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';

interface DataFetchProps {
    dataFetch: DataFetchDtoV1;
}

const DataFetch = (props: DataFetchProps) => {
    const dataFetch = props.dataFetch;
    const [shouldShowJson, setShouldShowJson] = createSignal<boolean>(false);

    return (
        <div>
            <DateTimeDisplay value={dataFetch.occurredAt} customDisplay={dt => dt?.toFormat('yyyy-MM-dd HH:mm:ss')} />
            &nbsp;-&nbsp;
            {dataFetch.type} by {dataFetch.source}
            &nbsp;-&nbsp;
            <Switch>
                <Match when={dataFetch.success}>
                    <span class="text-success">Succeeded</span>
                </Match>
                <Match when={!dataFetch.success}>
                    <span class="text-danger">Failed</span>
                </Match>
            </Switch>
            <button onclick={() => setShouldShowJson(v => !v)}>
                JSON
            </button>
            <Show when={shouldShowJson()}>
                <pre>
                    {JSON.stringify(dataFetch, null, 2)}
                </pre>
            </Show>
        </div>
    );
};

export default DataFetch;