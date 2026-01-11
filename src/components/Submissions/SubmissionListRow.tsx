import type { SubmissionDtoV1 } from '@/apiModels';
import SubmissionEntityLink from '@/components/Submissions/SubmissionEntityLink';
import { For, Show } from 'solid-js';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';

interface IProps {
    submission: SubmissionDtoV1;
}

const SubmissionListRow = (props: IProps) => {
    return (
        <div>
            <div class="d-inline-flex gap-1">
                <SubmissionEntityLink submission={props.submission} /> from{' '}
                <Show
                    when={props.submission.url}
                    children={(url) => <a href={url()}>{props.submission.platform}</a>}
                    fallback={props.submission.platform}
                />
                <Show when={props.submission.completedAt}>
                    <span>
                        Completed on <DateTimeDisplay value={props.submission.completedAt} />
                    </span>
                </Show>
                <span>
                    Added by '{props.submission.addedBy.userName}' on <DateTimeDisplay value={props.submission.addedAt} />
                </span>
            </div>
            <Show when={props.submission.failures.length > 0}>
                <details>
                    <summary>{props.submission.failures.length} failure(s)</summary>
                    <ul>
                        <For each={props.submission.failures}>
                            {(failure) => (
                                <li class="d-inline-flex gap-2">
                                    <DateTimeDisplay value={failure.occurredAt} customDisplay={(d) => d?.toFormat('yyyy-MM-dd HH:mm')} />
                                    <span class="text-danger">{failure.reason}</span>
                                </li>
                            )}
                        </For>
                    </ul>
                </details>
            </Show>
        </div>
    );
};

export default SubmissionListRow;