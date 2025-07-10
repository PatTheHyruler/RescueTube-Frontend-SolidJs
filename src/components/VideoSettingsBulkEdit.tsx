import type { VideoArchivalSettingsDtoV1, VideoSearchFilterDtoV1 } from '@/apiModels';
import { Roles } from '@/auth/Roles';
import { videosApi } from '@/services/videosApi';
import { createForm } from '@tanstack/solid-form';
import { requireAuth } from '@/auth/RequireAuth';
import { Show } from 'solid-js';
import { getNextIndeterminateBooleanState } from '@/utils';
import { useToast } from 'solid-notifications';

interface Props {
    filter: VideoSearchFilterDtoV1 | null;
    videoIds: string[];
    selectAll: boolean;
    onClose?: () => void;
}

const defaultValues: Partial<VideoArchivalSettingsDtoV1> = {
    shouldRegularlyFetchVideoData: undefined,
};

const VideoSettingsBulkEdit = (props: Props) => {
    const { notify } = useToast();

    const form = createForm(() => ({
        defaultValues,
        onSubmit: async ({ value }) => {
            const response = await videosApi.bulkUpdateVideoArchivalSettings({
                filter: props.filter,
                videoIds: props.videoIds,
                selectAll: props.selectAll,
                settings: value,
            });
            props.onClose?.();
            notify(`Updated archival settings for ${response.data} video(s)`);
        },
    }));

    const isSubmitting = form.useStore((state) => state.isSubmitting);
    const isDisabled = () => isSubmitting();

    return (
        <div class="card" style={{ 'width': 'fit-content' }}>
            <div class="card-body">
                <h6 class="card-title">Video Archival Settings</h6>
                <form class="d-flex flex-column gap-3" onSubmit={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await form.handleSubmit();
                }}>
                    <fieldset style={{ display: 'contents' }} disabled={isDisabled()}>
                        <form.Field name="shouldRegularlyFetchVideoData" children={(field) => (
                            <div class="form-check">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    id="shouldRegularlyFetchVideoData"
                                    name={field().name}
                                    /* @ts-expect-error TODO Figure out a way to declare indeterminate as a valid attribute */
                                    indeterminate={field().state.value === undefined}
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={() => {
                                        field().handleChange(getNextIndeterminateBooleanState(field().state.value));
                                    }}
                                />
                                <label class="form-check-label" for="shouldRegularlyFetchVideoData">
                                    Regularly fetch video data?
                                </label>
                            </div>
                        )} />
                    </fieldset>
                    <div class="d-inline-flex gap-1">
                        <Show when={props.onClose}>
                            {onClose => (
                                <button type="button" class="btn btn-secondary" onClick={() => onClose()()}>
                                    Close
                                </button>
                            )}
                        </Show>
                        <button type="submit" class="btn btn-primary align-self-start" disabled={isDisabled()}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default requireAuth(VideoSettingsBulkEdit, { roles: Roles.AdminRoles });
