import { baseApi } from './baseApi';
import type { AuthorArchivalSettingsDtoV1, AuthorArchivalSettingsUpsertDtoV1, AuthorSimpleDtoV1 } from '@/apiModels';

const getAuthor = async (authorId: string) => {
    return await baseApi.axios.get<AuthorSimpleDtoV1>(`/v1/authors/${authorId}`);
};

const getAuthorArchivalSettings = async (authorId: string) => {
    return await baseApi.axios.get<AuthorArchivalSettingsDtoV1 | null>(`/v1/authors/${authorId}/archival-settings`);
};

interface UpsertAuthorRequest {
    authorId: string;
    settings: AuthorArchivalSettingsUpsertDtoV1;
}

const upsertAuthorArchivalSettings = async ({ authorId, settings }: UpsertAuthorRequest) => {
    return await baseApi.axios.put<AuthorArchivalSettingsUpsertDtoV1>(`/v1/authors/${authorId}/archival-settings`, settings);
};

export const authorsApi = {
    getAuthor,
    getAuthorArchivalSettings,
    upsertAuthorArchivalSettings,
};