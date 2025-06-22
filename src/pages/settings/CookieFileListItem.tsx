import type { CookieFileInfoDtoV1 } from '@/apiModels';
import { createForm } from '@tanstack/solid-form';
import { settingsApi } from '@/services/settingsApi';
import { createSignal, Match, Switch } from 'solid-js';
import {
    limitedFileNameRegex,
    validateYouTubeCookieFileName,
    youTubeCookieFileNameMaxLength,
} from '@/pages/settings/validationUtils';
import FieldErrors from '@/components/FieldErrors';

interface Props {
    cookieFile: CookieFileInfoDtoV1;
    refetch: () => Promise<unknown>;
}

const CookieFileListItem = (props: Props) => {
    const cookieFile = props.cookieFile;

    const deleteCookieFile = async () => {
        await settingsApi.deleteYouTubeCookieFile(cookieFile.fileName);
        await props.refetch();
    };

    const [isRenaming, setIsRenaming] = createSignal(false);

    const form = createForm(() => ({
        defaultValues: {
            newFileName: '',
        },
        onSubmit: async ({ value: { newFileName } }) => {
            await settingsApi.renameYouTubeCookieFile({
                oldFileName: cookieFile.fileName,
                newFileName,
            });
            await props.refetch();
        },
    }));

    return (
        <li>
            {cookieFile.fileName}
            <button onClick={deleteCookieFile}>Delete</button>
            <Switch>
                <Match when={!isRenaming()}>
                    <button type="button" onClick={() => setIsRenaming(true)}>Rename</button>
                </Match>
                <Match when={isRenaming()}>
                    <button
                        type="reset"
                        onClick={() => {
                            form.reset();
                            setIsRenaming(false);
                        }}
                    >
                        Cancel rename
                    </button>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            await form.handleSubmit();
                            setIsRenaming(false);
                        }}
                    >
                        <form.Field
                            name="newFileName"
                            validators={{
                                onSubmit: ({ value }) => {
                                    return validateYouTubeCookieFileName(value);
                                },
                            }}
                            children={(field) => (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Insert new filename"
                                        name={field().name}
                                        value={field().state.value}
                                        onChange={(e) =>
                                            field().handleChange(
                                                e.currentTarget.value,
                                            )
                                        }
                                        pattern={limitedFileNameRegex.source}
                                        maxlength={youTubeCookieFileNameMaxLength}
                                    />
                                    <FieldErrors field={field()} />
                                </div>
                            )}
                        />
                        <button type="submit">Confirm rename</button>
                    </form>
                </Match>
            </Switch>
        </li>
    );
};

export default CookieFileListItem;
