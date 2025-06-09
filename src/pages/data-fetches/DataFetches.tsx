import { createResource, createSignal, For } from 'solid-js';
import { dataFetchesApi } from '@/services/dataFetchesApi';
import type { DataFetchesQueryDtoV1 } from '@/apiModels';
import PaginationComponent from '@/components/PaginationComponent';
import DataFetchRow from '@/pages/data-fetches/DataFetchRow';

const DataFetches = () => {
    const [query, setQuery] = createSignal<DataFetchesQueryDtoV1>({
        page: 0,
        limit: 50,
        orderByDescending: true,
    });

    const [dataFetches, { refetch }] = createResource(async () => {
        const response = await dataFetchesApi.getDataFetches(query());
        return response.data;
    });

    return (
        <div>
            <PaginationComponent
                paginationQuery={query()}
                paginationResult={dataFetches()}
                onUpdate={p => setQuery(q => ({ ...q, ...p }))}
                onSubmit={refetch}
            />
            <table>
                <thead>
                    <tr>
                        <th>
                            Occurred at
                            <button onClick={() => {
                                setQuery(q => ({ ...q, orderByDescending: !q.orderByDescending }));
                                refetch();
                            }}>
                                {query().orderByDescending ? '↓' : '↑'}
                            </button>
                        </th>
                        <th>Type</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <For each={dataFetches()?.dataFetches}>
                        {(dataFetch) => (
                            <DataFetchRow dataFetch={dataFetch} />
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    );
};

export default DataFetches;