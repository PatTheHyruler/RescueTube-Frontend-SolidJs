import { createResource, For, Show } from 'solid-js';
import { settingsApi } from '@/services/settingsApi';
import { createForm } from '@tanstack/solid-form';

const YouTubeCookieSettings = () => {
    const [cookieFiles, { refetch }] = createResource(async () => {
        const response = await settingsApi.getYouTubeCookieFiles();
        return response.data;
    });

    const form = createForm<{
        fileName: string | null;
        content: string;
    }>(() => ({
        defaultValues: {
            fileName: null,
            content: '',
        },
        onSubmit: async ({ value: { fileName, content } }) => {
            await settingsApi.createYouTubeCookieFile({
                fileName: fileName?.trim() || null,
                content: content,
            });
            await refetch();
        },
    }));

    const isSubmitting = form.useStore((state) => state.isSubmitting);

    return (
        <>
            <h3>YouTube cookie files</h3>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await form.handleSubmit();
                }}
            >
                <fieldset
                    style={{ display: 'contents' }}
                    disabled={isSubmitting()}
                >
                    <form.Field
                        name="fileName"
                        validators={{
                            onSubmit: ({ value }) => {
                                if (!value) return undefined;
                                if (value.length > 30) {
                                    return 'Filename must be less than 30 characters long.';
                                }
                                if (!/^[a-zA-Z0-9_\-.]+$/.test(value)) {
                                    return 'Filename can only contain letters, numbers, underscores, hyphens, and dots.';
                                }
                                return undefined;
                            },
                        }}
                        children={(field) => (
                            <div>
                                <label>Filename (optional):</label>
                                <input
                                    type="text"
                                    name={field().name}
                                    placeholder="cookies.txt"
                                    value={field().state.value}
                                    onChange={(e) =>
                                        field().handleChange(
                                            e.currentTarget.value,
                                        )
                                    }
                                />
                                {!field().state.meta.isValid ? (
                                    <em role="alert" class="text-danger">
                                        {field().state.meta.errors.join(', ')}
                                    </em>
                                ) : null}
                            </div>
                        )}
                    />
                    <form.Field
                        name="content"
                        validators={{
                            onSubmit: ({ value }) =>
                                value.trim().length === 0
                                    ? 'Content is required'
                                    : undefined,
                        }}
                        children={(field) => (
                            <div>
                                <label>Cookie file content:</label>
                                <textarea
                                    style={{ resize: 'both' }}
                                    name={field().name}
                                    value={field().state.value}
                                    onChange={(e) =>
                                        field().handleChange(
                                            e.currentTarget.value,
                                        )
                                    }
                                />
                                {!field().state.meta.isValid ? (
                                    <em role="alert" class="text-danger">
                                        {field().state.meta.errors.join(', ')}
                                    </em>
                                ) : null}
                            </div>
                        )}
                    />
                    <button type="submit">Submit</button>
                </fieldset>
            </form>
            <Show when={cookieFiles()}>
                {(cookieFiles) => (
                    <ul>
                        <For each={cookieFiles()}>
                            {(cookieFile) => <li>{cookieFile.fileName}</li>}
                        </For>
                    </ul>
                )}
            </Show>
        </>
    );
};

export default YouTubeCookieSettings;
