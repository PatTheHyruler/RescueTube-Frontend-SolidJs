import { baseApi } from './baseApi';
import type {
    AuthorArchivalSettingsDtoV1,
    AuthorArchivalSettingsUpsertDtoV1, AuthorSearchRequestDtoV1,
    AuthorSearchResponseDtoV1,
    AuthorSimpleDtoV1,
} from '@/apiModels';

const getAuthor = async (authorId: string) => {
    return await baseApi.axios.get<AuthorSimpleDtoV1>(`/v1/authors/${authorId}`);
};

const searchAuthors = async (query: AuthorSearchRequestDtoV1) => {
    const urlParams = new URLSearchParams();
    if (query.page) {
         urlParams.append('page', query.page.toString());
    }
    if (query.limit) {
        urlParams.append('limit', query.limit.toString());
    }
    if (query.name) {
        urlParams.append('name', query.name);
    }
    if (query.authorIds) {
        urlParams.append('authorIds', query.authorIds.join(','));
    }
    if (query.excludeAuthorIds) {
        urlParams.append('excludeAuthorIds', query.excludeAuthorIds.join(','));
    }

    return await baseApi.axios.get<AuthorSearchResponseDtoV1>(`/v1/authors?${urlParams.toString()}`);
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
    searchAuthors,
    getAuthorArchivalSettings,
    upsertAuthorArchivalSettings,
};