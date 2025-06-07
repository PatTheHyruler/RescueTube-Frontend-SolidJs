import type { DataFetchesResponseDtoV1, PaginationQuery } from '@/apiModels';
import { baseApi } from '@/services/baseApi';

export const getDataFetches = async (query: PaginationQuery) => {
    return await baseApi.axios.get<DataFetchesResponseDtoV1>(`/v1/data-fetches?page=${query.page}&limit=${query.limit}`);
};

export const dataFetchesApi = {
    getDataFetches,
};