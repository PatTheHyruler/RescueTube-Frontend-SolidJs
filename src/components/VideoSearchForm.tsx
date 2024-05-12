import {VideoSearchDtoV1, VideoSortingOptions} from "../apiModels";
import {For, Setter} from "solid-js";

interface IProps {
    query: VideoSearchDtoV1,
    setQuery: Setter<VideoSearchDtoV1>,
    onSubmit: (() => Promise<void>) | (() => void),
}

const VideoSearchForm = (props: IProps) => {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        return props.onSubmit();
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <label for="nameQuery">Name:</label>
                <input id="nameQuery" value={props.query.nameQuery ?? ''}
                       onInput={e => props.setQuery(v => ({...v, nameQuery: e.target.value}))}/>
                <label for="authorQuery">Author:</label>
                <input id="authorQuery" value={props.query.authorQuery ?? ''}
                       onInput={e => props.setQuery(v => ({...v, authorQuery: e.target.value}))}/>
                <label for="sortingOptions">Sort by:</label>
                <select id="sortingOptions" value={props.query.sortingOptions}
                        onChange={e => props.setQuery(p => ({
                            ...p,
                            sortingOptions: e.target.value as VideoSortingOptions
                        }))}>
                    <For each={Object.values(VideoSortingOptions)}>
                        {(item) => <>
                            <option>
                                {item.toString()}
                            </option>
                        </>}
                    </For>
                </select>
                <label for="descending">Descending?</label>
                <input type="checkbox" id="descending" checked={props.query.descending}
                       onChange={() => props.setQuery(p => ({...p, descending: !p.descending}))}/>
                <button type="submit">Apply</button>
                {JSON.stringify(props.query)}
            </form>
        </>
    );
}

export default VideoSearchForm;