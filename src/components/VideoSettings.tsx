import type { VideoArchivalSettingsDtoV1 } from '@/apiModels';
import { useAuthContext } from '@/auth/AuthContext';
import { Roles } from '@/auth/Roles';
import { videosApi } from '@/services/videosApi';
import { createForm } from '@tanstack/solid-form';
import { createEffect, createResource } from 'solid-js';

interface Props {
    videoId: string;
}

const defaultValues: VideoArchivalSettingsDtoV1 = {
    shouldRegularlyFetchVideoData: true,
    downloadPriority: 0,
};

const VideoSettings = (props: Props) => {
    const videoId = props.videoId;

    const [archivalSettings, { refetch: refetchArchivalSettings }] = createResource(async () => {
        if (!videoId) {
            throw new Error('No videoId provided');       
        }
        const response = await videosApi.getVideoArchivalSettings(videoId);
        return response.data;
    });

    const form = createForm(() => ({
        defaultValues,
        onSubmit: async ({ value }) => {
            await videosApi.upsertVideoArchivalSettings({
                videoId, settings: value,
            });
            await refetchArchivalSettings();
        },
    }));

    createEffect(() => {
        const archivalSettingsValue = archivalSettings();
        if (archivalSettingsValue) {
            form.reset(archivalSettingsValue);
        }
    });

    const { authState } = useAuthContext();
    const isAllowedToEdit = () => authState.userDetails?.user.roles.some(r => Roles.AdminRoles.some(ar => ar === r.name)) ?? false;

    const isSubmitting = form.useStore((state) => state.isSubmitting);
    const isDisabled = () => archivalSettings.loading || isSubmitting() || !isAllowedToEdit();

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
                                    id={field().name}
                                    name={field().name}
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={(e) => field().handleChange(e.target.checked)}
                                />
                                <label class="form-check-label" for={field().name}>
                                    Regularly fetch video data?
                                </label>
                            </div>
                        )} />
                        <form.Field name="downloadPriority" children={(field) => (
                            <div>
                                <label for={field().name}>Download priority:</label>
                                <input
                                    type="number"
                                    id={field().name}
                                    name={field().name}
                                    value={field().state.value ?? ''}
                                    onBlur={field().handleBlur}
                                    style={{ width: '8ch' }}
                                    onChange={(e) => {
                                        const intValue = parseInt(e.target.value);
                                        if (isNaN(intValue)) {
                                            return;
                                        }
                                        field().handleChange(intValue);
                                    }}
                                />
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

export default VideoSettings;
