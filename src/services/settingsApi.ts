import { baseApi } from './baseApi';
import type { SettingValueDtoV1 } from '../apiModels';

const getSettings = async () => {
    return await baseApi.axios.get<SettingValueDtoV1[]>('/v1/settings');
};

const upsertSetting = async (settingValue: SettingValueDtoV1) => {
    await baseApi.axios.put('/v1/settings', {
        ['$type']: settingValue['$type'],
        key: settingValue.definition.key,
        value: settingValue.value,
    });
};

export const settingsApi = {
    getSettings,
    upsertSetting,
};