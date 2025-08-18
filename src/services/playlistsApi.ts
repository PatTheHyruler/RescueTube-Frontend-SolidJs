import { baseApi } from '@/services/baseApi';
import type {
    PlaylistItemsResponseDtoV1,
    PlaylistSearchDtoV1,
    PlaylistSearchResponseDtoV1,
    PlaylistSimpleDtoV1,
} from '@/apiModels';

export const searchPlaylists = async (search: PlaylistSearchDtoV1) => {
    return await baseApi.axios.post<PlaylistSearchResponseDtoV1>('/v1/playlists/search', search);
};

export const getPlaylist = async (id: string) => {
    return await baseApi.axios.get<PlaylistSimpleDtoV1>(`/v1/playlists/${id}`);
};

export const getPlaylistItems = async (id: string) => {
    return await baseApi.axios.get<PlaylistItemsResponseDtoV1>(`/v1/playlists/${id}/items`);
};

export const playlistsApi = {
    searchPlaylists,
    getPlaylist,
    getPlaylistItems,
};