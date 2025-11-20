import { baseApi } from '@/services/baseApi';
import type { JobSettingsDtoV1, JobSettingsUpdateDtoV1 } from '@/apiModels';

const getJobSettings = async () => {
    return await baseApi.axios.get<JobSettingsDtoV1[]>('/v1/jobs/settings');
};

const updateJobSettings = async (updates: JobSettingsUpdateDtoV1[]) => {
    return await baseApi.axios.put('/v1/jobs/settings', updates);
};

const triggerRecurringJob = async (recurringJobId: string) => {
    return await baseApi.axios.post(`/v1/jobs/recurring/${encodeURIComponent(recurringJobId)}/trigger`);
};

export const jobsApi = {
    getJobSettings,
    updateJobSettings,
    triggerRecurringJob,
};
