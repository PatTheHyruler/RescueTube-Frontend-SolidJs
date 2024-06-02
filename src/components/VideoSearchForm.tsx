import {PaginationResult, VideoSearchDtoV1, VideoSortingOptions} from "../apiModels";
import {For, Setter} from "solid-js";
import PaginationComponent from "./PaginationComponent";
import {useOnPaginationQueryUpdate} from "../utils/pagination";

interface IProps {
    query: VideoSearchDtoV1,
    setQuery: Setter<VideoSearchDtoV1>,
    paginationResult?: PaginationResult | null,
    onSubmit: (() => Promise<void>) | (() => void),
}

const VideoSearchForm = (props: IProps) => {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        return props.onSubmit();
    }

    const onPaginationQueryUpdate = useOnPaginationQueryUpdate(props.setQuery);

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
            </form>
            <PaginationComponent
                paginationQuery={props.query}
                paginationResult={props.paginationResult}
                onUpdate={onPaginationQueryUpdate}
                onSubmit={props.onSubmit}
            />
        </>
    );
}

export default VideoSearchForm;