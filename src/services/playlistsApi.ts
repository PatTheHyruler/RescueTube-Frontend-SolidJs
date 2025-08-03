import { baseApi } from '@/services/baseApi';
import type { PlaylistSearchDtoV1, PlaylistSearchResponseDtoV1 } from '@/apiModels';

export const searchPlaylists = async (search: PlaylistSearchDtoV1) => {
    return await baseApi.axios.post<PlaylistSearchResponseDtoV1>('/v1/playlists/search', search);
};

export const playlistsApi = {
    searchPlaylists,
};