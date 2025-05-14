import { createResource, For, Match, Suspense, Switch } from 'solid-js';
import { settingsApi } from '../../services/settingsApi';
import DataSizeInput from '../../components/DataSizeInput';
import { SettingTypes } from '../../apiModels';


const Settings = () => {
    const [settingsResource] = createResource(async () => {
        const response = await settingsApi.getSettings();
        return response.data;
    });

    return (
        <div>
            <h2>Settings</h2>
            <Suspense>
                <table>
                    <tbody>
                        <For each={settingsResource() ?? []}>
                            {setting => (
                                <tr>
                                    <td>
                                        {setting.definition.key}
                                    </td>
                                    <td>
                                        <Switch fallback={'Unknown setting type'}>
                                            <Match when={setting['$type'] === SettingTypes.DataSizeBytes && setting} children={setting => (
                                                <DataSizeInput valueBytes={setting().value ?? setting().definition.defaultValue} onChange={v => setting().value = v} />
                                            )}/>
                                            <Match when={setting['$type'] === SettingTypes.Bool && setting} children={setting => (
                                                <input type="checkbox"
                                                       checked={setting().value ?? setting().definition.defaultValue ?? undefined}
                                                       onChange={e => setting().value = e.currentTarget.checked}
                                                />
                                            )}/>
                                            <Match when={setting['$type'] === SettingTypes.String && setting} children={setting => (
                                                <input value={setting().value ?? setting().definition.defaultValue ?? ''}
                                                       onChange={e => setting().value = e.currentTarget.value ? e.currentTarget.value : null}
                                                />
                                            )}/>
                                            <Match when={setting['$type'] === SettingTypes.Long && setting} children={setting => (
                                                <input type="number"
                                                       step={1}
                                                       value={setting().value ?? setting().definition.defaultValue ?? undefined}
                                                       onChange={e => setting().value = parseInt(e.currentTarget.value)}
                                                />
                                            )}/>
                                        </Switch>
                                    </td>
                                    <td>
                                        <button class="btn btn-primary" onclick={async () => settingsApi.upsertSetting(setting)}>
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </Suspense>
        </div>
    );
};

export default Settings;