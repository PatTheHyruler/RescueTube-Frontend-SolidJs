import { type DateOrStringNullable, getDateTime } from '@/utils';
import type { DateTime } from 'luxon';

interface IProps {
    value?: DateOrStringNullable;
    customDisplay?: (dateTime: DateTime | null) => string | null | undefined;
}

export const DateTimeDisplay = (props: IProps) => {
    const dateTime = getDateTime(props.value);

    return (
        <time dateTime={dateTime?.toISO() ?? undefined} title={dateTime?.toISO() ?? undefined}>
            {props.customDisplay ? props.customDisplay(dateTime) : dateTime?.toFormat('yyyy-MM-dd')}
        </time>
    );
};
