import { baseApi } from './baseApi';
import type { SettingValueDtoV1 } from '@/apiModels';

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

export const settingsApi = {
    getSettings,
    upsertSettings,
};