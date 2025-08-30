import type {
    DataFetchesQueryDtoV1,
    DataFetchesResponseDtoV1,
    DataFetchJobDefinitionsResponseDtoV1,
    EnqueueDataFetchJobRequestV1,
} from '@/apiModels';
import { baseApi } from '@/services/baseApi';

export const getDataFetches = async (query: DataFetchesQueryDtoV1) => {
    const urlParams = new URLSearchParams();
    urlParams.append('page', query.page.toString());
    urlParams.append('limit', query.limit.toString());
    urlParams.append('orderByDescending', query.orderByDescending.toString());
    if (query.occurredAtFrom) {
        urlParams.append('occurredAtFrom', query.occurredAtFrom);
    }
    if (query.occurredAtTo) {
        urlParams.append('occurredAtTo', query.occurredAtTo);
    }
    if (query.source) {
        urlParams.append('source', query.source);
    }
    if (query.type) {
        urlParams.append('type', query.type);
    }
    if (query.success !== undefined) {
        urlParams.append('success', query.success.toString());
    }
    return await baseApi.axios.get<DataFetchesResponseDtoV1>(`/v1/data-fetches?${urlParams.toString()}`);
};

export const getDataFetchJobDefinitions = async () => {
    return await baseApi.axios.get<DataFetchJobDefinitionsResponseDtoV1>('/v1/data-fetches/jobs/definitions');
};

export const enqueueDataFetchJob = async (request: EnqueueDataFetchJobRequestV1) => {
    return await baseApi.axios.post('/v1/data-fetches/jobs/enqueue', request);
};

export const dataFetchesApi = {
    getDataFetches,
    getDataFetchJobDefinitions,
    enqueueDataFetchJob,
};