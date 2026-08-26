import { pb } from "./pocketbase";

export const fetchTopDigitalBooks = async () => {
    const logs = await pb.collection('history_reads').getFullList({
        filter: 'book.bookType = "digital"',
        expand: 'book',
        fields: 'expand.book.id,expand.book.collectionId,expand.book.title,expand.book.poster' 
    });

    const countMap = {};
    logs.forEach(log => {
        const bookData = log.expand?.book;
        if (!bookData) return;

        if (!countMap[bookData.id]) {
            countMap[bookData.id] = {
                id: bookData.id,
                collectionId: bookData.collectionId,
                title: bookData.title,
                cover: bookData.poster,
                readersCount: 0
            };
        }
        countMap[bookData.id].readersCount += 1;
    });

    return Object.values(countMap)
        .sort((a, b) => b.readersCount - a.readersCount)
        .slice(0, 5);
};

export const fetchTopBorrowedBooks = async (limit = 5) => {
    try {
        const records = await pb.collection('loan_details').getFullList({
            // Expand ke book_id untuk mengambil detail data buku (termasuk field cover)
            expand: 'book_id',
            fields: 'expand.book_id.id,expand.book_id.collectionId,expand.book_id.title,expand.book_id.poster,expand.book_id.bookType'
        });

        const bookCountMap = records.reduce((acc, current) => {
            const book = current.expand?.book_id;
            if (!book) return acc;

            if (!acc[book.id]) {
                acc[book.id] = {
                    id: book.id,
                    collectionId: book.collectionId,
                    title: book.title,
                    cover: book.poster, // Ditambahkan agar bisa merender gambar seperti e-book
                    type: book.bookType === 'academic' ? 'Akademik' : 'Non-Akademik',
                    readersCount: 0 // Diubah dari borrowCount menjadi readersCount agar propertinya sama dengan top book digital
                };
            }
            acc[book.id].readersCount += 1;
            return acc;
        }, {});

        // Urutkan dari yang paling banyak dipinjam dan potong sesuai limit
        return Object.values(bookCountMap)
            .sort((a, b) => b.readersCount - a.readersCount)
            .slice(0, limit);
            
    } catch (error) {
        console.error("Gagal menghitung statistik buku terpopuler:", error);
        throw error;
    }
};

export const fetchTopUsers = async (limit = 5) => {
    try {
        // 1. Tarik semua log membaca dari history_reads beserta data usernya
        const readLogs = await pb.collection('history_reads').getFullList({
            expand: 'user',
            fields: 'expand.user.id,expand.user.name,expand.user.avatar,expand.user.role'
        });

        // 2. Hitung keaktifan tiap user menggunakan reduce
        const userActivityMap = readLogs.reduce((acc, current) => {
            const user = current.expand?.user;
            if (!user) return acc;

            if (!acc[user.id]) {
                acc[user.id] = {
                    id: user.id,
                    name: user.name || "N/A",
                    avatar: user.avatar,
                    role: user.role === 'edmin' ? 'Admin' : user.role === 'petugas' ? 'Pustakawan' : 'Murid',
                    activityCount: 0
                };
            }
            // Tambahkan +1 poin aktivitas setiap kali user tercatat membaca buku
            acc[user.id].activityCount += 1;
            return acc;
        }, {});

        // 3. Ubah objek map menjadi Array, urutkan dari poin tertinggi, lalu potong sesuai limit
        return Object.values(userActivityMap)
            .sort((a, b) => b.activityCount - a.activityCount)
            .slice(0, limit);
            
    } catch (error) {
        console.error("Gagal memuat data pengguna teraktif:", error);
        throw error;
    }
};