import {secondsToDurationString} from "../services/timeUtils";

interface IProps {
    durationSeconds: number;
}

export const DurationDisplay = ({durationSeconds}: IProps) => {
    return (
        <span>
            {secondsToDurationString(durationSeconds)}
        </span>
    );
}