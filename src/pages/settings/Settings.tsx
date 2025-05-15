import { createResource, Index, Match, Switch } from 'solid-js';
import { settingsApi } from '../../services/settingsApi';
import DataSizeInput from '../../components/DataSizeInput';
import { SettingTypes } from '../../apiModels';
import { createForm } from '@tanstack/solid-form';


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
        <div>
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
                                    <Switch fallback={'Unknown setting type'}>
                                        <Match when={(() => {
                                            const s = setting();
                                            return s['$type'] === SettingTypes.DataSizeBytes && s;
                                        })()} children={setting => (
                                            <DataSizeInput valueBytes={setting().value}
                                                           defaultValueBytes={setting().definition.defaultValue}
                                                           onChange={v => form.setFieldValue(`settings[${i}].value`, v)} />
                                        )}/>
                                        <Match when={(() => {
                                            const s = setting();
                                            return s['$type'] === SettingTypes.Bool && s;
                                        })()} children={setting => (
                                            <input type="checkbox"
                                                   checked={setting().value ?? setting().definition.defaultValue ?? undefined}
                                                   onChange={e => form.setFieldValue(`settings[${i}].value`, e.currentTarget.checked)}
                                            />
                                        )}/>
                                        <Match when={(() => {
                                            const s = setting();
                                            return s['$type'] === SettingTypes.String && s;
                                        })()} children={setting => (
                                            <input value={setting().value ?? ''}
                                                   placeholder={setting().definition.defaultValue ?? undefined}
                                                   onChange={e => form.setFieldValue(`settings[${i}].value`, e.currentTarget.value ? e.currentTarget.value : null)}
                                            />
                                        )}/>
                                        <Match when={(() => {
                                            const s = setting();
                                            return s['$type'] === SettingTypes.Long && s;
                                        })()} children={setting => (
                                            <input type="number"
                                                   step={1}
                                                   placeholder={setting().definition.defaultValue?.toString() ?? undefined}
                                                   value={setting().value ?? undefined}
                                                   onChange={e => form.setFieldValue(`settings[${i}].value`, parseInt(e.currentTarget.value))}
                                            />
                                        )}/>
                                    </Switch>
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
        </div>
    );
};

export default Settings;