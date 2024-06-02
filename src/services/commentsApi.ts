import {CommentRootsResponseDtoV1, PaginationQuery} from "../apiModels";
import {baseApi} from "./baseApi";

const getVideoComments = async (videoId: string, paginationQuery: PaginationQuery) => {
    return await baseApi.axios.get<CommentRootsResponseDtoV1>(`/v1/videos/${videoId}/comments`);
}

export const commentsApi = {
    getVideoComments,
}
