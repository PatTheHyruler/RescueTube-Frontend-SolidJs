import { For, Show } from 'solid-js';
import { playlistsApi } from '@/services/playlistsApi';
import VideoSummary from '@/components/Videos/VideoSummary';
import routes from '@/utils/routes';
import styles from './PlaylistItems.module.css';
import type { PaginationResult, PlaylistItemDtoV1 } from '@/apiModels';
import { useInfiniteQuery } from '@tanstack/solid-query';
import { isLastPage } from '@/utils/pagination';

interface IProps {
    playlistId: string;
    current?: {
        playlistItemIndex: number;
        videoId: string;
    };
}

const PlaylistItems = (props: IProps) => {
    const pageSize = 50;

    const initialPageParam = () => {
        if (!props.current) {
            return 0;
        }
        return Math.floor(props.current.playlistItemIndex / pageSize);
    };

    const getPreviousPage = (paginationResult: PaginationResult): number | null => {
        if (paginationResult.page === 0) {
            return null;
        }
        return paginationResult.page - 1;
    };
    const getNextPage = (paginationResult: PaginationResult): number | null => {
        if (isLastPage(paginationResult)) {
            return null;
        }
        return paginationResult.page + 1;
    };
    const infiniteQuery = useInfiniteQuery(() => ({
        queryKey: ['playlistItems', { playlistId: props.playlistId }],
        queryFn: async ({ pageParam }) => {
            const response = await playlistsApi.getPlaylistItems({
                id: props.playlistId,
                pagination: { page: pageParam, limit: pageSize },
            });
            return response.data;
        },
        initialPageParam: initialPageParam(),
        getPreviousPageParam: (firstPage) => getPreviousPage(firstPage.paginationResult),
        getNextPageParam: (lastPage) => getNextPage(lastPage.paginationResult),
    }));

    const isCurrent = (playlistItem: PlaylistItemDtoV1): boolean => {
        if (!props.current) {
            return false;
        }
        return playlistItem.video.id === props.current.videoId && playlistItem.position === props.current.playlistItemIndex;
    };

    return (
        <div>
            <Show when={infiniteQuery.hasPreviousPage}>
                <button onClick={() => infiniteQuery.fetchPreviousPage()} disabled={infiniteQuery.isFetching}>
                    {infiniteQuery.isFetchingPreviousPage
                        ? 'Loading more...'
                        : 'Load more'}
                </button>
            </Show>
            <ol>
                <For each={infiniteQuery.data?.pages.flatMap(x => x.playlistItems)} children={playlistItem => (
                    <li data-is-current={isCurrent(playlistItem)} class={styles.playlistItem} value={playlistItem.position + 1}>
                        <VideoSummary video={playlistItem.video} videoWatchLink={`${routes.videos.watch(playlistItem.video.id)}?playlistId=${props.playlistId}&playlistItemIndex=${playlistItem.position}`} />
                    </li>
                )} />
            </ol>
            <Show when={infiniteQuery.hasNextPage}>
                <button onClick={() => infiniteQuery.fetchNextPage()} disabled={infiniteQuery.isFetching}>
                    {infiniteQuery.isFetchingNextPage
                        ? 'Loading more...'
                        : 'Load more'}
                </button>
            </Show>
        </div>
    );
};

export default PlaylistItems;