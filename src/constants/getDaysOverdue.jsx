export const getDaysOverdue = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    if (today > dueDate) {
        const diffTime = today - dueDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    return 0;
};