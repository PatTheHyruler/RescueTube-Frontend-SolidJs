import { baseApi } from '@/services/baseApi';
import type { JobSettingsDtoV1 } from '@/apiModels';

const getJobSettings = async () => {
    return await baseApi.axios.get<JobSettingsDtoV1[]>('/v1/jobs/settings');
};

export const jobsApi = {
    getJobSettings,
};
