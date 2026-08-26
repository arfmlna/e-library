import { pb } from "./pocketbase";

export const fetchRecommendedDigitalBooks = async () => {
    const books = await pb.collection('books').getFullList({
        filter: 'bookType = "digital"',
        expand: 'uploader,category,supplier'
    });

    const reads = await pb.collection('history_reads').getFullList();

    const recommendedBooks = books.map(book => {
        const totalReads = reads.filter(r => r.book === book.id).length;

        const recommendationScore = (totalReads * 2);

        return {
            ...book,
            totalReads,
            recommendationScore
        };
    });

    return recommendedBooks
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 9);
};

export const fetchLatestDigitalBooks = async () => {
    const books = await pb.collection('books').getFullList({
        filter: 'bookType = "digital"',
        expand: 'uploader,category,supplier',
        sort: '-created' 
    });

    const reads = await pb.collection('history_reads').getFullList();

    const latestBooks = books.map(book => {
        const totalReads = reads.filter(r => r.book === book.id).length;

        const recommendationScore = (totalReads * 2);

        return {
            ...book,
            totalReads,
            recommendationScore
        };
    });

    return latestBooks
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 9);
};
