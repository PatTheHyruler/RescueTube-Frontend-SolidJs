import type { SubmissionDtoV1 } from '@/apiModels';
import SubmissionEntityLink from '@/components/Submissions/SubmissionEntityLink';
import { createSignal, For, Show } from 'solid-js';
import { DateTimeDisplay } from '@/components/DateTimeDisplay';
import { submissionsApi } from '@/services/submissionsApi';

interface IProps {
    submission: SubmissionDtoV1;
    allowManualHandling: boolean;
    refreshResults: () => void;
}

const SubmissionListRow = (props: IProps) => {
    const [isManuallyHandling, setIsManuallyHandling] = createSignal(false);

    const disableManualHandling = () => isManuallyHandling() || props.submission.completedAt !== null;

    return (
        <>
            <tr>
                <td>
                    <SubmissionEntityLink submission={props.submission} /> from{' '}
                    <Show
                        when={props.submission.url}
                        children={(url) => <a href={url()}>{props.submission.platform}</a>}
                        fallback={props.submission.platform}
                    />
                </td>
                <td>
                    <span>
                        Added by '{props.submission.addedBy.userName}' on{' '}
                        <DateTimeDisplay value={props.submission.addedAt} />
                    </span>
                </td>
                <td>
                    <Show
                        when={props.submission.completedAt}
                        children={(completedAt) => (
                            <span>
                                Completed on <DateTimeDisplay value={completedAt()} />
                            </span>
                        )}
                        fallback={'Not completed'}
                    />
                </td>
                <Show when={props.allowManualHandling}>
                    <td>
                        <button
                            onClick={async () => {
                                if (disableManualHandling()) {
                                    return;
                                }

                                setIsManuallyHandling(true);
                                try {
                                    await submissionsApi.handleSubmission(props.submission.id);
                                } finally {
                                    setIsManuallyHandling(false);
                                    props.refreshResults();
                                }
                            }}
                            disabled={disableManualHandling()}
                        >
                            Handle
                        </button>
                    </td>
                </Show>
            </tr>
            <Show when={props.submission.failures.length > 0}>
                <tr>
                    <td colspan={3} class="pt-0">
                        <details>
                            <summary>{props.submission.failures.length} failure(s)</summary>
                            <ul>
                                <For each={props.submission.failures}>
                                    {(failure) => (
                                        <li>
                                            <span class="d-inline-flex gap-2">
                                                <DateTimeDisplay
                                                    value={failure.occurredAt}
                                                    customDisplay={(d) => d?.toFormat('yyyy-MM-dd HH:mm')}
                                                />
                                                <span class="text-danger">{failure.reason}</span>
                                            </span>
                                        </li>
                                    )}
                                </For>
                            </ul>
                        </details>
                    </td>
                </tr>
            </Show>
        </>
    );
};

export default SubmissionListRow;