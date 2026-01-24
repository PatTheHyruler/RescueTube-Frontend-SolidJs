import type {
    LinkSubmissionRequestDtoV1,
    LinkSubmissionResponseDtoV1,
    SubmissionSearchResponseDtoV1,
    SubmissionsSearchDtoV1,
} from '@/apiModels';
import { baseApi } from './baseApi';
import { type AxiosRequestConfig } from 'axios';

const submitLink = async (data: LinkSubmissionRequestDtoV1, config?: AxiosRequestConfig) => {
    return await baseApi.axios.post<LinkSubmissionResponseDtoV1>('/v1/submissions/create', data, config);
};

const getSubmissions = async (query: SubmissionsSearchDtoV1) => {
    const urlParams = new URLSearchParams();
    if (query.page) {
        urlParams.append('page', query.page.toString());
    }
    if (query.limit) {
        urlParams.append('limit', query.limit.toString());
    }
    if (query.completed !== null && query.completed !== undefined) {
        urlParams.append('completed', query.completed.toString());
    }
    if (query.orderBy && query.orderBy.length > 0) {
        const orderByString = query.orderBy
            .map((order) => {
                const suffix = order.descending ? '↓' : '↑';
                return `${order.propertyName}${suffix}`;
            })
            .join(',');
        urlParams.append('orderBy', orderByString);
    }

    return await baseApi.axios.get<SubmissionSearchResponseDtoV1>(`/v1/submissions?${urlParams.toString()}`);
};

const handleSubmission = async (submissionId: string) => {
    return await baseApi.axios.post(`/v1/submissions/${submissionId}/handle`);
};

export const submissionsApi = {
    submitLink,
    getSubmissions,
    handleSubmission,
};
