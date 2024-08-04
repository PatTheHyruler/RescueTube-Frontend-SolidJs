import { type DateOrStringNullable, getDate } from '../utils';

interface IProps {
    value?: DateOrStringNullable;
}

export const DateTimeDisplay = (props: IProps) => {
    const dateValue = getDate(props.value);

    return (
        <span title={dateValue?.toLocaleString('swe')}>
            {dateValue?.toLocaleDateString('swe')}
        </span>
    );
};
