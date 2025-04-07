import { baseApi } from './baseApi';

const getJobStats = async () => {
    return await baseApi.axios.get<object>('/v1/jobs/stats');
};

export const jobsApi = {
    getJobStats,
};