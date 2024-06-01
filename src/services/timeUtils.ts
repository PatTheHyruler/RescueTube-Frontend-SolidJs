interface DurationFormat {
    zeroPad?: boolean,
    includeUnnecessary?: boolean,
}

export const secondsToDurationString = (totalSeconds: number, format?: DurationFormat) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    let hourString = hours.toString();
    let minuteString = minutes.toString();
    let secondString = seconds.toString();

    if (format?.zeroPad ?? true) {
        hourString = hourString.padStart(2, '0');
        minuteString = minuteString.padStart(2, '0');
        secondString = secondString.padStart(2, '0');
    }

    let components = [];
    if (hours > 0 || format?.includeUnnecessary) {
        components.push(hourString);
    }
    components.push(minuteString);
    components.push(secondString);

    return components.join(':');
}