import type {
    LinkSubmissionRequestDtoV1,
    LinkSubmissionResponseDtoV1,
} from '../apiModels';
import { baseApi } from './baseApi';
import { type AxiosRequestConfig } from 'axios';

const submitLink = async (
    data: LinkSubmissionRequestDtoV1,
    config?: AxiosRequestConfig
) => {
    return await baseApi.axios.post<LinkSubmissionResponseDtoV1>(
        '/v1/submissions/create',
        data,
        config
    );
};

export const submissionsApi = {
    submitLink,
};
