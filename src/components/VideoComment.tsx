import {type CommentDtoV1} from "../apiModels";
import {DateTimeDisplay} from "./DateTimeDisplay";
import {For, Show} from "solid-js";
import {isLikelyDeleted} from "../utils";
import AuthorSummary from "./AuthorSummary";

interface IProps {
    comment: CommentDtoV1,
    depth?: number,
}

const VideoComment = (props: IProps) => {
    const depth = () => Math.max(props.depth ?? 0, 0);

    return (
        <div class="border border-3 p-2 rounded-2" style={{"margin-left": `${depth() * 40}px`}}>
            <div>
                <AuthorSummary author={props.comment.author}/>
                <div><DateTimeDisplay value={props.comment.createdAt}/></div>
                <Show when={isLikelyDeleted(props.comment)}>
                    <div class="text-danger">
                        Likely deleted,
                        last successful fetch: <DateTimeDisplay value={props.comment.lastSuccessfulFetch}/>
                        last unsuccessful fetch: <DateTimeDisplay value={props.comment.lastUnsuccessfulFetch}/>
                    </div>
                </Show>
                <div class="border border-1 rounded-2 p-2" style={{"white-space": 'pre-wrap'}}>
                    {props.comment.content}
                </div>
            </div>
            <Show when={props.comment.conversationReplies?.length}>
                <details>
                    <summary>Replies ({props.comment.conversationReplies?.length})</summary>
                    <For each={props.comment.conversationReplies}>
                        {reply => (
                            <VideoComment comment={reply} depth={depth() + 1}/>
                        )}
                    </For>
                </details>
            </Show>
        </div>
    );
}

export default VideoComment;