interface IProps {
    value?: string | Date | null,
}

export const DateTimeDisplay = ({value}: IProps) => {
    let dateValue: Date | null = null;
    if (value instanceof Date) {
        dateValue = value;
    } else if (typeof value === 'string' && value) {
        dateValue = new Date(value);
    }

    return (
        <span title={dateValue?.toLocaleString('swe')}>
            {dateValue?.toLocaleDateString('swe')}
        </span>
    );
}