const routes = Object.freeze({
    videos: {
        watch: (id: string) => `/videos/${id}/watch` as const,
    },
    playlists: {
        details: (id: string) => `/playlists/${id}` as const,
    },
    authors: {
        details: (id: string) => `/authors/${id}` as const,
    },
});

export default routes;