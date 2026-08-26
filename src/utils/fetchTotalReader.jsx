import { pb } from "./pocketbase";

export const fetchTotalReaders = async (bookId) => {
    if (!bookId) return 0;
    const result = await pb.collection('history_reads').getList(1, 1, {
        filter: `book = "${bookId}"`,
        fields: 'id',
    });
    return result.totalItems;
};

export const recordReadingHistory = async ({ bookId, userId }) => {
     if (!userId || !bookId) return null;

    const existingRecord = await pb.collection('history_reads').getList(1, 1, {
        filter: `user = "${userId}" && book = "${bookId}"`
    });

    if (existingRecord.totalItems === 0) {
        return await pb.collection('history_reads').create({
            user: userId,
            book: bookId
        });
    }
    
    return null;
};