import {CommentDtoV1} from "../apiModels";
import {DateTimeDisplay} from "./DateTimeDisplay";
import {For, Show} from "solid-js";
import {isLikelyDeleted, lastFetch, lastSuccessfulFetch} from "../utils";
import AuthorSummary from "./AuthorSummary";

interface IProps {
    comment: CommentDtoV1,
}

const VideoComment = (props: IProps) => {
    return (
        <div class="border border-3 p-2 rounded-2">
            <div>
                <AuthorSummary author={props.comment.author} />
                <div><DateTimeDisplay value={props.comment.createdAt}/></div>
                <Show when={isLikelyDeleted(props.comment)}>
                    <div class="text-danger">
                        Likely deleted,
                        last successful fetch: <DateTimeDisplay value={lastSuccessfulFetch(props.comment)}/>
                        latest attempt: <DateTimeDisplay value={lastFetch(props.comment)}/>
                    </div>
                </Show>
                <div class="border border-1 rounded-2 p-2" style={{"white-space": 'pre-wrap'}}>
                    {props.comment.content}
                </div>
            </div>
            <Show when={props.comment.conversationReplies?.length}>
                <details>
                    <summary>Replies</summary>
                    <For each={props.comment.conversationReplies}>
                        {reply => (
                            <VideoComment comment={reply}/>
                        )}
                    </For>
                </details>
            </Show>
        </div>
    );
}

export default VideoComment;