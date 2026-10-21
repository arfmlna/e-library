import React, { useState, useEffect } from 'react';
import TopBooksTable from './TopBooksTable';
import { pb } from '@/utils/pocketbase';

export default function TopBooksReport() {
    const [topBooks, setTopBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limitFilter, setLimitFilter] = useState(5); // Default menampilkan Top 5

    useEffect(() => {
        const fetchTopBorrowedBooks = async () => {
            setLoading(true);
            try {
                const records = await pb.collection('loan_details').getFullList({
                    expand: 'book_id'
                });

                const bookCountMap = records.reduce((acc, current) => {
                    const book = current.expand?.book_id;
                    if (!book) return acc;

                    if (!acc[book.id]) {
                    acc[book.id] = {
                        id: book.id,
                        title: book.title,
                        type: book.type === 'academic' ? 'Akademik' : 'Non-Akademik',
                        borrowCount: 0
                    };
                    }
                    acc[book.id].borrowCount += 1;
                    return acc;
                }, {});

                const sortedBooks = Object.values(bookCountMap)
                    .sort((a, b) => b.borrowCount - a.borrowCount)
                    .slice(0, parseInt(limitFilter, 10));

                setTopBooks(sortedBooks);
            } catch (error) {
                if (import.meta.env.DEV) {       
                    console.error("Gagal menghitung statistik buku terpopuler:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTopBorrowedBooks();
    }, [limitFilter]);

    return (
        <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-2xl font-bold">Laporan Buku Terpopuler (Top Borrowed)</h1>
            <p className="text-sm">Analisis statistik buku yang paling sering dipinjam oleh anggota.</p>
            </div>

            {/* FILTER LIMIT */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold">Tampilkan:</label>
                <select 
                    value={limitFilter} 
                    onChange={(e) => setLimitFilter(e.target.value)} 
                    className="select select-bordered select-sm [color-scheme:light]"
                >
                    <option value="5">Top 5 Buku</option>
                    <option value="10">Top 10 Buku</option>
                    <option value="20">Top 20 Buku</option>
                </select>
            </div>
        </div>

        {/* TABEL DATA */}
        <TopBooksTable books={topBooks} loading={loading} />
        </div>
    );
}