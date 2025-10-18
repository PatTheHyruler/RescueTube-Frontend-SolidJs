import type {
    AccessTokenDtoV1,
    VideoArchivalSettingsBulkUpdateDtoV1,
    VideoArchivalSettingsDtoV1,
    VideoSearchDtoV1,
    VideoSearchResponseDtoV1,
    VideoSimpleDtoV1,
} from '@/apiModels';
import { baseApi } from './baseApi';
import { createGetEntityIdEndpoint } from '@/services/common/platformEntityEndpoints';

const searchVideos = async (query: VideoSearchDtoV1) => {
    return await baseApi.axios.post<VideoSearchResponseDtoV1>(
        '/v1/videos/search',
        query,
    );
};

const getVideoDetails = async (videoId: string) => {
    return await baseApi.axios.get<VideoSimpleDtoV1>(`/v1/videos/${videoId}`);
};

const getVideoFileAccessToken = async (videoId: string) => {
    return await baseApi.axios.get<AccessTokenDtoV1>(
        `/v1/videos/${videoId}/file/accessToken`,
        { withCredentials: true },
    );
};

const getVideoArchivalSettings = async (videoId: string) => {
    return await baseApi.axios.get<VideoArchivalSettingsDtoV1>(`/v1/videos/${videoId}/archival-settings`);
};

interface UpsertVideoArchivalSettingsRequest {
    videoId: string;
    settings: VideoArchivalSettingsDtoV1;
}

const upsertVideoArchivalSettings = async ({ videoId, settings }: UpsertVideoArchivalSettingsRequest) => {
    return await baseApi.axios.put(`/v1/videos/${videoId}/archival-settings`, settings);
};

const bulkUpdateVideoArchivalSettings = async (settings: VideoArchivalSettingsBulkUpdateDtoV1) => {
    return await baseApi.axios.patch<number>('/v1/videos/archival-settings/bulk', settings);
};

const getVideoId = createGetEntityIdEndpoint('videos');

const enqueueManualDownload = async (videoId: string) => {
    return await baseApi.axios.post(`/v1/videos/${videoId}/enqueue-download`);
};

export const videosApi = {
    searchVideos,
    getVideoDetails,
    getVideoFileAccessToken,
    getVideoArchivalSettings,
    upsertVideoArchivalSettings,
    bulkUpdateVideoArchivalSettings,
    getVideoId,
    enqueueManualDownload,
};
