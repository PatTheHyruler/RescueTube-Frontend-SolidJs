import { type DateOrStringNullable, getDateTime } from '@/utils';
import type { DateTime } from 'luxon';
import { Show } from 'solid-js';

interface IProps {
    value?: DateOrStringNullable;
    customDisplay?: (dateTime: DateTime | null) => string | null | undefined;
}

export const DateTimeDisplay = (props: IProps) => {
    return (
        <Show when={getDateTime(props.value)} children={dateTime => (
            <time dateTime={dateTime().toISO() ?? undefined} title={dateTime().toISO() ?? undefined}>
                {props.customDisplay ? props.customDisplay(dateTime()) : dateTime().toFormat('yyyy-MM-dd')}
            </time>
        )} />
    );
};
