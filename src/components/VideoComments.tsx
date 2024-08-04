import { createResource, createSignal, For, Show } from 'solid-js';
import { commentsApi } from '../services/commentsApi';
import VideoComment from './VideoComment';
import { type PaginationQuery } from '../apiModels';
import PaginationComponent from './PaginationComponent';

interface IProps {
    videoId: string;
}

const VideoComments = ({ videoId }: IProps) => {
    const [paginationQuery, setPaginationQuery] = createSignal<PaginationQuery>(
        {
            page: 0,
            limit: 50,
        }
    );
    const [comments, { refetch }] = createResource(async () => {
        const response = await commentsApi.getVideoComments(
            videoId,
            paginationQuery()
        );
        return response.data;
    });

    return (
        <>
            <div class="h3">Comments</div>
            <PaginationComponent
                paginationQuery={paginationQuery()}
                paginationResult={comments()?.paginationResult}
                onUpdate={(p) => setPaginationQuery(p)}
                onSubmit={refetch}
            />
            <For each={comments()?.comments}>
                {(comment) => <VideoComment comment={comment} />}
            </For>
            <Show when={comments()?.comments.length ?? 0 > 5}>
                <PaginationComponent
                    paginationQuery={paginationQuery()}
                    paginationResult={comments()?.paginationResult}
                    onUpdate={(p) => setPaginationQuery(p)}
                    onSubmit={refetch}
                />
            </Show>
        </>
    );
};

export default VideoComments;
