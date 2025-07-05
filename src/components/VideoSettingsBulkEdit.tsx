import type { VideoArchivalSettingsDtoV1 } from '@/apiModels';
import { Roles } from '@/auth/Roles';
import { videosApi } from '@/services/videosApi';
import { createForm } from '@tanstack/solid-form';
import { requireAuth } from '@/auth/RequireAuth';

interface Props {
    videoIds: string[];
    selectAll: boolean;
}

const defaultValues: Partial<VideoArchivalSettingsDtoV1> = {
    shouldRegularlyFetchVideoData: false,
};

const VideoSettingsBulkEdit = (props: Props) => {
    const form = createForm(() => ({
        defaultValues,
        onSubmit: async ({ value }) => {
            await videosApi.bulkUpdateVideoArchivalSettings({
                videoIds: props.videoIds,
                selectAll: props.selectAll,
                settings: value,
            });
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
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={(e) => field().handleChange(e.target.checked)}
                                />
                                <label class="form-check-label" for="shouldRegularlyFetchVideoData">
                                    Regularly fetch video data?
                                </label>
                            </div>
                        )} />
                        <button type="submit" class="btn btn-primary align-self-start">
                            Save
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default requireAuth(VideoSettingsBulkEdit, { roles: Roles.AdminRoles });
