import type { Platform } from '@/apiModels';

const routes = Object.freeze({
    videos: {
        watch: (id: string) => `/videos/${id}/watch` as const,
        byPlatformId: (args: { platform: Platform; idOnPlatform: string }) => `/videos/${args.platform}/{${args.idOnPlatform}` as const,
    },
    playlists: {
        details: (id: string) => `/playlists/${id}` as const,
        byPlatformId: (args: { platform: Platform; idOnPlatform: string }) => `/playlists/${args.platform}/{${args.idOnPlatform}` as const,
    },
    authors: {
        details: (id: string) => `/authors/${id}` as const,
        byPlatformId: (args: { platform: Platform; idOnPlatform: string }) => `/authors/${args.platform}/{${args.idOnPlatform}` as const,
    },
});

export default routes;