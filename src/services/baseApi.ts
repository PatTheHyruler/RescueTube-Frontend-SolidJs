import axios from 'axios';

interface ConfigWindow extends Window {
    apiBaseUrl?: string;
}

declare const window: ConfigWindow & typeof globalThis;

const _getApiBaseUrl = async (): Promise<string> => {
    const envConfigUrl = import.meta.env.VITE_API_URL;
    if (envConfigUrl) {
        return envConfigUrl;
    }
    let configJsonFetchError: unknown | null = null;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const configJsonResponse = await fetch('/config.json', {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const configData = await configJsonResponse.json();
        const jsonConfigUrl = configData?.baseApiUrl;
        if (jsonConfigUrl) {
            return jsonConfigUrl;
        }
    } catch (e) {
        configJsonFetchError = e;
    }
    if (import.meta.env.DEV) {
        return `https://${window.location.hostname}:7125/api`;
    }
    if (configJsonFetchError) {
        throw new Error('Failed to configure API base URL', {
            cause: configJsonFetchError,
        });
    } else {
        throw new Error('Failed to configure API base URL');
    }
};

const getApiBaseUrl = async (): Promise<string> => {
    if (window.apiBaseUrl) {
        return window.apiBaseUrl;
    }
    const apiBaseUrl = await _getApiBaseUrl();
    window.apiBaseUrl = apiBaseUrl;
    return apiBaseUrl;
};

const getApiBaseUrlWithoutPrefix = async () => {
    const apiBaseUrl = await getApiBaseUrl();
    const match = /(.*)\/api.*/.exec(apiBaseUrl);
    if (!match) {
        throw new Error('Invalid API base URL');
    }
    return match[1];
};

const rtAxios = axios.create({
    baseURL: await getApiBaseUrl(),
    headers: {
        'X-RescueTube-ApiBaseUrl': await getApiBaseUrlWithoutPrefix(),
    },
});

export const baseApi = {
    baseUrl: await getApiBaseUrl(),

    baseUrlWithoutPrefix: await getApiBaseUrlWithoutPrefix(),
    axios: rtAxios,
};
