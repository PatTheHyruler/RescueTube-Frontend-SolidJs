import {Accessor, createSignal, For, Match, Show, Switch} from "solid-js";
import {submissionsApi} from "../services/submissionsApi";
import {LinkSubmissionResponseDtoV1} from "../apiModels";
import {ErrorResponseDto, isErrorResponseDto} from "../apiModels/error";
import {DateTimeDisplay} from "./DateTimeDisplay";
import {isAxiosError} from "axios";
import SubmissionSuccess from "./SubmissionSuccess";

interface SubmissionState {
    status: 'error' | 'success' | 'pending' | 'cancelling' | 'cancelled',
    url: string,
    startedAt: Date,
    cancel?: () => void,
    value?: LinkSubmissionResponseDtoV1 | ErrorResponseDto,
}

const SubmissionForm = () => {
    const [url, setUrl] = createSignal("");
    const [submissions, setSubmissions] = createSignal<Accessor<SubmissionState>[]>([]);
    const [inputValidationErrors, setInputValidationErrors] = createSignal<string[]>([]);

    const onSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        const submittingUrl = url();

        const validationErrors = [];
        try {
            new URL(submittingUrl);
        } catch (e) {
            validationErrors.push('Invalid URL');
        }
        setInputValidationErrors(validationErrors);
        if (validationErrors.length > 0) {
            return;
        }

        const [submission, setSubmission] = createSignal<SubmissionState>({
            status: 'pending',
            url: submittingUrl,
            startedAt: new Date(),
        });

        setSubmissions(r => [...r, submission]);

        try {
            const controller = new AbortController();
            setSubmission(v => ({
                ...v, cancel: () => {
                    controller.abort();
                    setSubmission(v => ({...v, status: 'cancelling'}));
                }
            }));

            const response = await submissionsApi.submitLink({
                url: submittingUrl,
            }, {signal: controller.signal});

            setSubmission(v => ({
                ...v,
                status: 'success',
                value: response.data,
                cancel: undefined,
            }));
        } catch (e) {
            if (isAxiosError(e) && e.code === 'ERR_CANCELED') {
                setSubmission(v => ({
                    ...v,
                    status: 'cancelled',
                    cancel: undefined,
                }));
                return;
            }

            console.error(e);
            setSubmission(v => ({
                ...v,
                status: 'error',
                value: isErrorResponseDto(e) ? e : undefined,
                cancel: undefined,
            }));
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit} class="text-center">
                <input value={url()} onInput={e => setUrl(e.currentTarget.value)}/>
                <button type="submit" class="btn btn-primary" style={{"margin-left": '4px'}}>Submit</button>
                <Show when={inputValidationErrors().length > 0}>
                    <div class="text-danger">
                        <For each={inputValidationErrors()}>
                            {item => (
                                <div>{item}</div>
                            )}
                        </For>
                    </div>
                </Show>
            </form>
            <div>
                <For each={submissions()}>
                    {(item) => (
                        <div class="m-3">
                            <Switch>
                                <Match when={item().status === 'success'}>
                                    <SubmissionSuccess response={item().value as LinkSubmissionResponseDtoV1} />
                                </Match>
                                <Match when={item().status === 'pending'}>
                                    <div class="text-warning">
                                        Submitting URL '{item().url}', initiated <DateTimeDisplay
                                        value={item().startedAt}/>
                                    </div>
                                    <Show when={item().cancel}>
                                        <button onClick={item().cancel}>
                                            Cancel
                                        </button>
                                    </Show>
                                </Match>
                                <Match when={item().status === 'error'}>
                                    <div class="text-danger">
                                        {item().value
                                            ? JSON.stringify(item().value)
                                            : `An error occurred submitting '${item().url}'`}
                                    </div>
                                </Match>
                                <Match when={item().status === 'cancelling'}>
                                    <div class="text-warning">
                                        Cancelling submission for '{item().url}'
                                    </div>
                                </Match>
                                <Match when={item().status === 'cancelled'}>
                                    <div class="text-muted">
                                        Cancelled submission for '{item().url}'
                                    </div>
                                </Match>
                            </Switch>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}

export default SubmissionForm;