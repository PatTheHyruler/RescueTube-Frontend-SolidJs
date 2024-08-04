import type {CommentRootsResponseDtoV1, PaginationQuery} from "../apiModels";
import {baseApi} from "./baseApi";

const getVideoComments = async (videoId: string, paginationQuery: PaginationQuery) => {
    return await baseApi.axios.get<CommentRootsResponseDtoV1>(`/v1/videos/${videoId}/comments?page=${paginationQuery.page}&limit=${paginationQuery.limit}`);
}

export const commentsApi = {
    getVideoComments,
}
