import { createResource } from 'solid-js';
import { authorsApi } from '@/services/authorsApi';
import { createForm } from '@tanstack/solid-form';

interface Props {
    authorId: string;
}

const AuthorSettings = (props: Props) => {
    const authorId = props.authorId;

    const [archivalSettings, { refetch: refetchArchivalSettings }] = createResource(async () => {
        if (!authorId) {
            throw new Error('No authorId provided');
        }
        const response = await authorsApi.getAuthorArchivalSettings(authorId);
        return response.data;
    });

    const form = createForm(() => ({
        defaultValues: {
            isEnabledForArchival: archivalSettings()?.isEnabledForArchival ?? false,
            archiveVideos: archivalSettings()?.archiveVideos ?? false,
            archiveClips: archivalSettings()?.archiveClips ?? false,
            archivePlaylists: archivalSettings()?.archivePlaylists ?? false,
        },
        onSubmit: async ({ value: { isEnabledForArchival, archiveVideos, archivePlaylists, archiveClips } }) => {
            await authorsApi.upsertAuthorArchivalSettings({
                authorId, settings: {
                    isEnabledForArchival,
                    archiveVideos,
                    archivePlaylists,
                    archiveClips,
                },
            });
            await refetchArchivalSettings();
        },
    }));

    const isSubmitting = form.useStore((state) => state.isSubmitting);
    const isDisabled = () => archivalSettings.loading || isSubmitting();

    return (
        <div class="card" style={{ 'width': 'fit-content' }}>
            <div class="card-body">
                <h6 class="card-title">Author Archival Settings</h6>
                <form class="d-flex flex-column gap-3"
                      onSubmit={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          await form.handleSubmit();
                      }}
                >
                    <fieldset style={{ display: 'contents' }} disabled={isDisabled()}>
                        <form.Field name="isEnabledForArchival" children={(field) => (
                            <div class="form-check">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    id="isEnabledForArchival"
                                    name={field().name}
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={(e) => field().handleChange(e.target.checked)}
                                />
                                <label class="form-check-label" for="isEnabledForArchival">
                                    Enable archival
                                </label>
                            </div>
                        )} />
                        <form.Field name="archiveVideos" children={(field) => (
                            <div class="form-check">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    id="archiveVideos"
                                    name={field().name}
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={(e) => field().handleChange(e.target.checked)}
                                />
                                <label class="form-check-label" for="archiveVideos">
                                    Archive videos
                                </label>
                            </div>
                        )} />
                        <form.Field name="archiveClips" children={(field) => (
                            <div class="form-check">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    id="archiveClips"
                                    name={field().name}
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={(e) => field().handleChange(e.target.checked)}
                                />
                                <label class="form-check-label" for="archiveClips">
                                    Archive clips
                                </label>
                            </div>
                        )} />
                        <form.Field name="archivePlaylists" children={(field) => (
                            <div class="form-check">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    id="archivePlaylists"
                                    name={field().name}
                                    checked={field().state.value}
                                    onBlur={field().handleBlur}
                                    onChange={(e) => field().handleChange(e.target.checked)}
                                />
                                <label class="form-check-label" for="archivePlaylists">
                                    Archive playlists
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

export default AuthorSettings;
