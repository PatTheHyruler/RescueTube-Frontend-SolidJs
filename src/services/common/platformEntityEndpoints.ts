import type { Platform } from '@/apiModels';
import { baseApi } from '@/services/baseApi';
import type { AxiosResponse } from 'axios';

interface GetEntityIdRequest {
    platform: Platform;
    idOnPlatform: string;
}

export type GetEntityIdHandler = (request: GetEntityIdRequest) => Promise<AxiosResponse<string>>;

const getEntityId = async (
    entitiesPath: string,
    request: GetEntityIdRequest,
) => {
    return await baseApi.axios.get<string>(
        `/v1/${entitiesPath}/${encodeURIComponent(request.platform)}/${encodeURIComponent(request.idOnPlatform)}`,
    );
};

export const createGetEntityIdEndpoint =
    (entitiesPath: string) => (request: GetEntityIdRequest) =>
        getEntityId(entitiesPath, request);