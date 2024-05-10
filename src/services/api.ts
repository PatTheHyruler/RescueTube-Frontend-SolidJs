import axios from "axios";

const baseUrl = import.meta.env.DEV
    ? `https://${window.location.hostname}:7125/api`
    : import.meta.env.VITE_API_URL;

const rtAxios = axios.create({
    baseURL: baseUrl,
});

export const api = {
    baseUrl,
    axios: rtAxios,
}