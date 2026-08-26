import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import GenreTable from './GenreTable';
import { pb } from '@/utils/pocketbase';

export default function GenreReport() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGenreStatistics = async () => {
        setLoading(true);
        try {
        const records = await pb.collection('loan_details').getFullList({
            expand: 'book_id.category'
        });
        const genreCountMap = records.reduce((acc, current) => {
            const book = current.expand?.book_id;
            const categoryRecords = book?.expand?.category; 
            if (categoryRecords && Array.isArray(categoryRecords)) {
                categoryRecords.forEach((cat) => {
                    if (!cat.name) return;
                    const genreName = cat.name.trim();
                    if (!acc[genreName]) {
                        acc[genreName] = {
                        name: genreName,
                        totalBorrowed: 0
                        };
                    }
                    acc[genreName].totalBorrowed += 1;
                    });
            } else if (categoryRecords && !Array.isArray(categoryRecords)) {
                // Antispasasi jika di database tidak sengaja terbaca sebagai single object
                const genreName = categoryRecords.name?.trim();
                if (genreName) {
                if (!acc[genreName]) acc[genreName] = { name: genreName, totalBorrowed: 0 };
                acc[genreName].totalBorrowed += 1;
                }
            }

            return acc;
        }, {});

        const sortedGenres = Object.values(genreCountMap).sort(
            (a, b) => b.totalBorrowed - a.totalBorrowed
        );

        setGenres(sortedGenres);


        // 3. Ubah objek map menjadi Array dan urutkan dari yang terbesar (Favorit)
        } catch (error) {
        console.error("Gagal menghitung statistik genre favorit:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenreStatistics();
    }, []);

    return (
        <div className="p-6 min-h-screen">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold">Laporan Kategori & Genre Favorit</h1>
            <p className="text-sm">Analisis minat baca anggota berdasarkan kategori atau genre buku yang sering dipinjam.</p>
            </div>
            <button 
            onClick={fetchGenreStatistics}
            className="btn btn-outline btn-sm"
            >
                🔄 Refresh Data
            </button>
        </div>

        {/* TABEL DATA STATISTIK */}
        <GenreTable genres={genres} loading={loading} />
        </div>
    );
}
