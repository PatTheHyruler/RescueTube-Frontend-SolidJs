import { dataFetchesApi } from '@/services/dataFetchesApi';
import { createResource, For, Show } from 'solid-js';
import type { EntityType } from '@/apiModels';

interface IProps {
    entityType: EntityType;
    entityId: string;
}

const ManualDataFetches = (props: IProps) => {
    const [dataFetchJobDefinitions] = createResource(async () => {
        const response = await dataFetchesApi.getDataFetchJobDefinitions();
        return response.data;
    });

    return (
        <div>
            <h3>Manual data fetches</h3>
            <Show when={dataFetchJobDefinitions()} fallback="Loading..." children={dataFetchJobDefinitions => (
                <ul>
                    <For
                        each={dataFetchJobDefinitions().jobDefinitions.filter(x => x.entityType === props.entityType)}
                        children={dataFetchJobDefinition => (
                            <li>
                                {dataFetchJobDefinition.jobName}
                                <button onClick={() => dataFetchesApi.enqueueDataFetchJob({
                                    jobName: dataFetchJobDefinition.jobName,
                                    entityId: props.entityId,
                                })}>
                                    Enqueue
                                </button>
                            </li>
                        )} />
                </ul>
            )} />
        </div>
    );
};

export default ManualDataFetches;