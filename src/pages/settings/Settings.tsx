import { createResource, Index, Match, Switch } from 'solid-js';
import { settingsApi } from '@/services/settingsApi';
import DataSizeInput from '@/components/DataSizeInput';
import { SettingTypes } from '@/apiModels';
import { createForm } from '@tanstack/solid-form';
import YouTubeCookieSettings from '@/pages/settings/YouTubeCookieSettings';
import JobSettings from '@/pages/settings/JobSettings';


const Settings = () => {
    const [settingsResource] = createResource(async () => {
        const response = await settingsApi.getSettings();
        return response.data;
    });

    const form = createForm(() => ({
        defaultValues: {
            settings: settingsResource() ?? [],
        },
        onSubmit: async ({ value }) => {
            await settingsApi.upsertSettings(value.settings);
        },
    }));

    return (
        <div class="center-container">
            <h2>Settings</h2>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await form.handleSubmit();
            }}>
            <fieldset disabled={settingsResource.loading}>
                <table><tbody>
                    <form.Field name="settings" mode="array" children={(field) => (
                        <Index each={field().state.value} children={(setting, i) => (
                            <tr>
                                <td>
                                    {setting().definition.key}
                                </td>
                                <td>
                                    <form.Field name={`settings[${i}].value`} children={subField => (
                                        <Switch fallback={'Unknown setting type'}>
                                            <Match when={(() => {
                                                const s = setting();
                                                return s['$type'] === SettingTypes.DataSizeBytes && s;
                                            })()} children={setting => (
                                                <DataSizeInput name={subField().name}
                                                               valueBytes={setting().value}
                                                               defaultValueBytes={setting().definition.defaultValue}
                                                               onChange={v => subField().setValue(v)} />
                                            )}/>
                                            <Match when={(() => {
                                                const s = setting();
                                                return s['$type'] === SettingTypes.Bool && s;
                                            })()} children={setting => (
                                                <input name={subField().name}
                                                       type="checkbox"
                                                       checked={setting().value ?? setting().definition.defaultValue ?? undefined}
                                                       onChange={e => subField().setValue(e.currentTarget.checked)}
                                                />
                                            )}/>
                                            <Match when={(() => {
                                                const s = setting();
                                                return s['$type'] === SettingTypes.String && s;
                                            })()} children={setting => (
                                                <input name={subField().name}
                                                       value={setting().value ?? ''}
                                                       placeholder={setting().definition.defaultValue ?? undefined}
                                                       onChange={e => subField().setValue(e.currentTarget.value ? e.currentTarget.value : null)}
                                                />
                                            )}/>
                                            <Match when={(() => {
                                                const s = setting();
                                                return s['$type'] === SettingTypes.Long && s;
                                            })()} children={setting => (
                                                <input type="number"
                                                       name={subField().name}
                                                       step={1}
                                                       placeholder={setting().definition.defaultValue?.toString() ?? undefined}
                                                       value={setting().value ?? undefined}
                                                       onChange={e => subField().setValue(parseInt(e.currentTarget.value))}
                                                />
                                            )}/>
                                        </Switch>
                                    )}/>
                                </td>
                            </tr>
                        )}/>
                    )}/>
                </tbody></table>
                <button type="submit" class="btn btn-primary">
                    Save
                </button>
                </fieldset>
            </form>
            <YouTubeCookieSettings />
            <JobSettings />
        </div>
    );
};

export default Settings;