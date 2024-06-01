import {AccessTokenDtoV1, VideoSearchDtoV1, VideoSearchResponseDtoV1} from "../apiModels";
import {baseApi} from "./baseApi";

const searchVideos = async (query: VideoSearchDtoV1) => {
    return await baseApi.axios.post<VideoSearchResponseDtoV1>('/v1/videos/search', query);
}

const getVideoFileAccessToken = async (videoId: string) => {
    return await baseApi.axios.get<AccessTokenDtoV1>(`/v1/videos/${videoId}/file/accessToken`, {withCredentials: true});
}

export const videosApi = {
    searchVideos,
    getVideoFileAccessToken,
}