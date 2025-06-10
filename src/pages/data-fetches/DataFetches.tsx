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

    const updateQueryAndRefetch = async <TKey extends keyof DataFetchesQueryDtoV1, TValue extends DataFetchesQueryDtoV1[TKey]>(key: TKey, value: TValue | ((previous: DataFetchesQueryDtoV1) => TValue)) => {
        setQuery(q => ({ ...q, [key]: typeof value === 'function' ? value(q) : value }));
        await refetch();
    };

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
                            <button onClick={() => updateQueryAndRefetch('orderByDescending', q => !q.orderByDescending)}>
                                {query().orderByDescending ? '↓' : '↑'}
                            </button>
                        </th>
                        <th>
                            Type
                            <input
                                type="text"
                                value={query().type ?? ''}
                                onChange={e => updateQueryAndRefetch('type', e.currentTarget.value)} />
                        </th>
                        <th>
                            Source
                            <input
                                type="text"
                                value={query().source ?? ''}
                                onChange={e => updateQueryAndRefetch('source', e.currentTarget.value)} />
                        </th>
                        <th>
                            Status
                            <input
                                type="checkbox"
                                /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
                                indeterminate={query().success === undefined}
                                checked={query().success}
                                onClick={() => updateQueryAndRefetch('success', q => {
                                    if (q.success === undefined) {
                                        return true;
                                    }
                                    if (q.success) {
                                        return false;
                                    }
                                    return undefined;
                                })}
                            />
                        </th>
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