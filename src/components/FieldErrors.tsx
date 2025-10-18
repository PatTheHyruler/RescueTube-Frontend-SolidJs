import type { FieldApi } from '@tanstack/solid-form';
import { Show } from 'solid-js';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
}

const FieldErrors = (props: Props) => {
    return (
        <Show when={!props.field.state.meta.isValid}>
            <em role="alert" class="text-danger">
                {props.field.state.meta.errors.join(', ')}
            </em>
        </Show>
    );
};

export default FieldErrors;
