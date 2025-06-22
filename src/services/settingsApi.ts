import { baseApi } from './baseApi';
import type { CookieFileInfoDtoV1, CreateCookieFileDtoV1, SettingValueDtoV1 } from '@/apiModels';
import type { AxiosResponse } from 'axios';

const getSettings = async () => {
    return await baseApi.axios.get<SettingValueDtoV1[]>('/v1/settings');
};

const mapSettingValueToUpdateDto = (settingValue: SettingValueDtoV1) => ({
    ['$type']: settingValue['$type'],
    key: settingValue.definition.key,
    value: settingValue.value,
});

const upsertSettings = async (settingValues: SettingValueDtoV1[]) => {
    await baseApi.axios.put('/v1/settings/bulk', settingValues.map(mapSettingValueToUpdateDto));   
};

const createYouTubeCookieFile = async (data: CreateCookieFileDtoV1) => {
    await baseApi.axios.put('/v1/settings/youtube/cookie-files', data);
};

const getYouTubeCookieFiles = async (): Promise<AxiosResponse<CookieFileInfoDtoV1[]>> => {
    return await baseApi.axios.get<CookieFileInfoDtoV1[]>('/v1/settings/youtube/cookie-files');
};

const deleteYouTubeCookieFile = async (fileName: string) => {
    await baseApi.axios.delete(`/v1/settings/youtube/cookie-files?fileName=${fileName}`);
};

export const settingsApi = {
    getSettings,
    upsertSettings,
    createYouTubeCookieFile,
    getYouTubeCookieFiles,
    deleteYouTubeCookieFile,
};