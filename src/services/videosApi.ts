import {VideoSearchDtoV1, VideoSearchResponseDtoV1} from "../apiModels";
import {baseApi} from "./baseApi";

const searchVideos = async (query: VideoSearchDtoV1) => {
    return await baseApi.axios.post<VideoSearchResponseDtoV1>('/v1/videos/search', query);
}

export const videosApi = {
    searchVideos,
}