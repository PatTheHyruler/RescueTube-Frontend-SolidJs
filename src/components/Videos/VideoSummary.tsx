import type { VideoSimpleDtoV1 } from '@/apiModels';
import SelectItemCheckbox from '@/components/SelectItemCheckbox';
import { A } from '@solidjs/router';
import routes from '@/utils/routes';
import ThumbnailDisplay from '@/components/ThumbnailDisplay';
import { translationToString } from '@/utils';
import { Show } from 'solid-js';
import AuthorSummary from '@/components/AuthorSummary';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';
import { secondsToDurationString } from '@/services/timeUtils';
import type { SelectListContext } from '@/components/ResultListSelect';

interface IProps {
    video: VideoSimpleDtoV1;
    videoSelection?: SelectListContext<string>;
    videoWatchLink?: string;
}

const VideoSummary = (props: IProps) => {
    const video = props.video;
    const videoWatchLink = props.videoWatchLink ?? routes.videos.watch(video.id);

    return (
        <div style={{ margin: '8px', display: 'flex' }}>
            <Show when={props.videoSelection} children={videoSelection => (
                <SelectItemCheckbox selection={videoSelection()} id={video.id} />
            )} />
            <div
                style={{
                    'border-radius': '6px',
                    overflow: 'hidden',
                    width: 'fit-content',
                    height: 'fit-content',
                }}
            >
                <A href={videoWatchLink}>
                    <ThumbnailDisplay thumbnail={video.thumbnail}>
                        {thumbnail => (
                            <img
                                loading="lazy"
                                src={thumbnail.url}
                                width={160}
                                height={90}
                                alt="Video thumbnail"
                            />
                        )}
                    </ThumbnailDisplay>
                </A>
            </div>
            <div>
                <A href={videoWatchLink}>
                    <div>
                        {translationToString(video.title)}
                    </div>
                </A>
                <div>
                    <Show
                        when={video.authors[0]}
                        fallback={'No author???'}
                        keyed
                    >
                        {(author) => (
                            <AuthorSummary
                                author={author}
                            />
                        )}
                    </Show>
                </div>
                <div
                    style={{ display: 'flex', gap: '3px' }}
                >
                    <DateTimeDisplay
                        value={
                            video.createdAt ??
                            video.publishedAt
                        }
                    ></DateTimeDisplay>
                    <div>
                        Duration:{' '}
                        {secondsToDurationString(
                            video.durationSeconds,
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoSummary;