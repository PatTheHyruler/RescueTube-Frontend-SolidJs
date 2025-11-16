import { jobsApi } from '@/services/jobsApi';
import { createForm } from '@tanstack/solid-form';
import { createResource, Index, Show } from 'solid-js';
import type { JobSettingsDtoV1 } from '@/apiModels';

interface JobSettingsFormData {
    jobSettings: JobSettingsDtoV1[];
}

const JobSettings = () => {
    const [jobSettings, { refetch }] = createResource(async () => {
        const response = await jobsApi.getJobSettings();
        return response.data;
    });

    const initialValues: () => JobSettingsFormData = () => ({
        jobSettings: jobSettings() ?? [],
    });

    const form = createForm(() => ({
        defaultValues: initialValues(),
    }));

    function isUnchangedJobSettingsValue(fieldMeta: typeof form.state.fieldMeta, jobSettingsIndex: number): boolean {
        return Object.entries(fieldMeta)
            .filter(([fieldName]) => fieldName.startsWith(`jobSettings[${jobSettingsIndex}]`))
            .some(([, fieldMeta]) => !fieldMeta.isDefaultValue);
    }

    const isSubmitting = form.useStore((state) => state.isSubmitting);

    return (
        <>
            <h3>Job settings</h3>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await form.handleSubmit();
                }}
                style={{
                    display: 'grid',
                    'grid-template-columns': 'repeat(4, 1fr)',
                    'grid-column-gap': '10px',
                    'grid-row-gap': '10px',
                }}
            >
                <fieldset style={{ display: 'contents' }} disabled={isSubmitting()}>
                    <form.Field
                        name="jobSettings"
                        mode="array"
                        children={(arrayField) => (
                            <Index
                                each={arrayField().state.value}
                                children={(jobSetting, i) => (
                                    <div>
                                        <div>
                                            <strong>{jobSetting().jobId}</strong>
                                            <Show when={jobSetting().isArchivalJob}>&nbsp;(Archival job)</Show>
                                            <Show
                                                when={form.useStore((state) =>
                                                    isUnchangedJobSettingsValue(state.fieldMeta, i)
                                                )()}
                                            >
                                                <button onClick={() => form.resetField(`jobSettings[${i}]`)}>
                                                    Reset
                                                </button>
                                            </Show>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <form.Field
                                                name={`jobSettings[${i}].isEnabled`}
                                                children={(field) => (
                                                    <label>
                                                        Is enabled:&nbsp;
                                                        <input
                                                            type="checkbox"
                                                            checked={field().state.value}
                                                            onChange={(e) => {
                                                                field().handleChange(e.target.checked);
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            />
                                            <form.Field
                                                name={`jobSettings[${i}].cron`}
                                                children={(field) => (
                                                    <label>
                                                        Cron:&nbsp;
                                                        <input
                                                            type="text"
                                                            value={field().state.value}
                                                            onChange={(e) => {
                                                                field().handleChange(e.target.value);
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            />
                                        </div>
                                        <Show when={jobSetting().dataFetchJobSettings}>
                                            <div>
                                                <form.Field
                                                    name={`jobSettings[${i}].dataFetchJobSettings.successCutoffOffset`}
                                                    children={(field) => (
                                                        <label>
                                                            Success cutoff offset:&nbsp;
                                                            <input
                                                                type="text"
                                                                value={field().state.value ?? ''}
                                                                onChange={(e) => {
                                                                    field().handleChange(e.target.value);
                                                                }}
                                                            />
                                                        </label>
                                                    )}
                                                />
                                                <form.Field
                                                    name={`jobSettings[${i}].dataFetchJobSettings.successCutoffOffset`}
                                                    children={(field) => (
                                                        <label>
                                                            Failure cutoff offset:&nbsp;
                                                            <input
                                                                type="text"
                                                                value={field().state.value ?? ''}
                                                                onChange={(e) => {
                                                                    field().handleChange(e.target.value);
                                                                }}
                                                            />
                                                        </label>
                                                    )}
                                                />
                                            </div>
                                        </Show>
                                    </div>
                                )}
                            />
                        )}
                    />
                </fieldset>
            </form>
        </>
    );
};

export default JobSettings;
