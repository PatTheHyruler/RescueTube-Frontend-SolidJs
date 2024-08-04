import { baseApi } from './baseApi';

const getSupportedPlatforms = () =>
    baseApi.axios.get<string[]>('/v1/options/supportedPlatforms');

export const optionsApi = {
    getSupportedPlatforms,
};
