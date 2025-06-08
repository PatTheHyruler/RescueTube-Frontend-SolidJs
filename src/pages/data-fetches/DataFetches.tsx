import { createResource, createSignal, For } from 'solid-js';
import { dataFetchesApi } from '@/services/dataFetchesApi';
import type { PaginationQuery } from '@/apiModels';
import PaginationComponent from '@/components/PaginationComponent';
import DataFetch from '@/pages/data-fetches/DataFetch';

const DataFetches = () => {
    const [paginationQuery, setPaginationQuery] = createSignal<PaginationQuery>({
        page: 0,
        limit: 50,
    });

    const [dataFetches, { refetch }] = createResource(async () => {
        const response = await dataFetchesApi.getDataFetches(paginationQuery());
        return response.data;
    });

    return (
        <div>
            <PaginationComponent
                paginationQuery={paginationQuery()}
                paginationResult={dataFetches()}
                onUpdate={p => setPaginationQuery(p)}
                onSubmit={refetch}
            />
            <For each={dataFetches()?.dataFetches}>
                {(dataFetch) => (
                    <DataFetch dataFetch={dataFetch} />
                )}
            </For>
        </div>
    );
};

export default DataFetches;