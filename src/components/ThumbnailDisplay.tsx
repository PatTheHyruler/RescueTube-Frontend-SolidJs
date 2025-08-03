import type { ImageDtoV1 } from '@/apiModels';
import { type JSX, Show } from 'solid-js';

interface IProps {
    thumbnail: ImageDtoV1 | null | undefined;
    children: (thumbnail: ImageDtoV1) => JSX.Element;
}

const ThumbnailDisplay = (props: IProps) => {
    return (
        <Show
            when={props.thumbnail}
            fallback={<div>No thumbnails :(</div>}
            children={thumbnail => props.children(thumbnail())}
        />
    );
};

export default ThumbnailDisplay;