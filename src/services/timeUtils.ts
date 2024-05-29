export const secondsToDurationString = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    const hourString = hours.toString().padStart(2, '0');
    const minuteString = minutes.toString().padStart(2, '0');
    const secondString = seconds.toString().padStart(2, '0');

    return `${hourString}:${minuteString}:${secondString}`;
}