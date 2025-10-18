import { baseApi } from '@/services/baseApi';
import type {
    PaginationQuery,
    PlaylistItemsResponseDtoV1,
    PlaylistSearchDtoV1,
    PlaylistSearchResponseDtoV1,
    PlaylistSimpleDtoV1,
} from '@/apiModels';
import { createGetEntityIdEndpoint } from '@/services/common/platformEntityEndpoints';

export const searchPlaylists = async (search: PlaylistSearchDtoV1) => {
    return await baseApi.axios.post<PlaylistSearchResponseDtoV1>('/v1/playlists/search', search);
};

export const getPlaylist = async (id: string) => {
    return await baseApi.axios.get<PlaylistSimpleDtoV1>(`/v1/playlists/${id}`);
};

export interface GetPlaylistItemsQuery {
    id: string;
    pagination?: PaginationQuery;
}
export const getPlaylistItems = async ({ id, pagination }: GetPlaylistItemsQuery) => {
    let url = `/v1/playlists/${id}/items`;
    if (pagination) {
        const search = new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
        });
        url += '?' + search.toString();
    }
    return await baseApi.axios.get<PlaylistItemsResponseDtoV1>(url);
};

const getPlaylistId = createGetEntityIdEndpoint('playlists');

export const playlistsApi = {
    searchPlaylists,
    getPlaylist,
    getPlaylistItems,
    getPlaylistId,
};