import type { SubmissionDtoV1 } from '@/apiModels';
import routes from '@/utils/routes';
import { Show } from 'solid-js';
import { A } from '@solidjs/router';

interface IProps {
    submission: SubmissionDtoV1;
}

const SubmissionEntityLink = (props: IProps) => {
    const getLink = () =>
        props.submission.videoId
            ? routes.videos.watch(props.submission.videoId)
            : props.submission.authorId
              ? routes.authors.details(props.submission.authorId)
              : props.submission.playlistId
                ? routes.playlists.details(props.submission.playlistId)
                : null;

    return (
        <Show
            when={getLink()}
            children={(link) => <A href={link()}>{props.submission.entityType}</A>}
            fallback={props.submission.entityType}
        />
    );
};

export default SubmissionEntityLink;