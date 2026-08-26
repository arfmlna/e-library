export const toPocketBaseDate = (localDateTimeString) => {
    if (!localDateTimeString) return '';
    return new Date(localDateTimeString).toISOString();
};