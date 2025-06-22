import { createResource, For, Show } from 'solid-js';
import { settingsApi } from '@/services/settingsApi';
import { createForm } from '@tanstack/solid-form';
import CookieFileListItem from '@/pages/settings/CookieFileListItem';
import {
    limitedFileNameRegex,
    validateYouTubeCookieFileName,
    youTubeCookieFileNameMaxLength,
} from '@/pages/settings/validationUtils';
import FieldErrors from '@/components/FieldErrors';

const YouTubeCookieSettings = () => {
    const [cookieFiles, { refetch }] = createResource(async () => {
        const response = await settingsApi.getYouTubeCookieFiles();
        return response.data;
    });

    const form = createForm(() => ({
        defaultValues: {
            fileName: null as string | null,
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
                                validateYouTubeCookieFileName(value);
                            },
                        }}
                        children={(field) => (
                            <div>
                                <label>Filename (optional):</label>
                                <input
                                    type="text"
                                    name={field().name}
                                    placeholder="cookies.txt"
                                    value={field().state.value ?? ''}
                                    onChange={(e) =>
                                        field().handleChange(
                                            e.currentTarget.value,
                                        )
                                    }
                                    pattern={limitedFileNameRegex.source}
                                    maxLength={youTubeCookieFileNameMaxLength}
                                />
                                <FieldErrors field={field()} />
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
                                <FieldErrors field={field()} />
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
                            {(cookieFile) => (
                                <CookieFileListItem
                                    cookieFile={cookieFile}
                                    refetch={async () => await refetch()} />
                            )}
                        </For>
                    </ul>
                )}
            </Show>
        </>
    );
};

export default YouTubeCookieSettings;
