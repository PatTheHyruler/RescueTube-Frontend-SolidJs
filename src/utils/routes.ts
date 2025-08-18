const routes = Object.freeze({
    videos: {
        watch: (id: string) => `/videos/${id}/watch` as const,
    },
});

export default routes;