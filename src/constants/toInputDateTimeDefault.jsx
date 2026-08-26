export const toInputDateTimeDefault = (pocketBaseDateString) => {
    if (!pocketBaseDateString) return '';
    const d = new Date(pocketBaseDateString);
    const userOffset = d.getTimezoneOffset() * 60000; 
    const localTime = new Date(d.getTime() - userOffset);
    return localTime.toISOString().slice(0, 16);
};