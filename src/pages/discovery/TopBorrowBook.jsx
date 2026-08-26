import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Layers } from 'lucide-react';
import { fetchTopBorrowedBooks } from '@/utils/getTopsBook';
import { pb } from '@/utils/pocketbase';

export default function TopBorrowedBooks() {
    const [limitFilter, setLimitFilter] = useState(5);

    const { data: topBooks = [], isLoading, error } = useQuery({
        queryKey: ['topBorrowedBooks', limitFilter],
        queryFn: () => fetchTopBorrowedBooks(limitFilter),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 gap-2">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <span className="text-xs opacity-60">Menghitung buku terpopuler...</span>
            </div>
        );
    }

    if (error) return <div className="text-error text-center p-5 text-sm">Gagal memuat data statistik.</div>;

    const getCoverUrl = (bookId, collectionId, filename) => {
        if (!filename) return "https://placehold.co";
        return `${pb.baseURL}/api/files/${collectionId}/${bookId}/${filename}`;
    };

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Styling badge peringkat 1, 2, 3
    const getRankBadge = (index) => {
        const i = index + 1
        if (index === 0) return <div className="badge badge-warning pb-6 pt-3 gap-0.5 font-bold text-xs">🥇 {getOrdinal(i)}</div>;
        if (index === 1) return <div className="badge badge-neutral pb-6 pt-3 gap-0.5 font-bold text-xs bg-slate-300 text-slate-800 border-none">🥈 {getOrdinal(i)}</div>;
        if (index === 2) return <div className="badge badge-accent pb-6 pt-3 gap-0.5 font-bold text-xs bg-amber-600 text-white border-none">🥉 {getOrdinal(i)}</div>;
        return <div className="badge badge-ghost font-semibold text-xs text-base-content/60">{getOrdinal(i)}</div>;
    };

    return (
        <div className="mx-3 md:mx-0 flex justify-center">
            <div className="card w-full max-w-7xl bg-base-100 shadow-xl border border-base-300 mx-auto my-6">
                <div className="card-body p-5 md:p-6">
                    {/* Header dengan Dropdown Filter Limit */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-base-300 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-warning animate-bounce" size={22} />
                            <h2 className="text-lg font-bold tracking-wide uppercase">Top Buku Terlaris</h2>
                        </div>
                        
                        {/* Dropdown Filter DaisyUI */}
                        <select 
                            className="select select-bordered select-xs font-semibold focus:select-primary"
                            value={limitFilter}
                            onChange={(e) => setLimitFilter(Number(e.target.value))}
                        >
                            <option value={5}>Tampilkan 5</option>
                            <option value={10}>Tampilkan 10</option>
                            <option value={20}>Tampilkan 20</option>
                        </select>
                    </div>

                    {topBooks.length === 0 ? (
                        <div className="text-center py-8 text-sm opacity-60">Belum ada riwayat peminjaman buku.</div>
                    ) : (
                        /* Tabel Daftar Top Buku */
                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra w-full align-middle">
                                <thead>
                                    <tr>
                                        <th className="w-16 text-center">Rank</th>
                                        <th>Buku</th>
                                        <th className="text-center w-32">Total Dipinjam</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topBooks.map((book, index) => (
                                        <tr key={book.id} className="hover:bg-base-200/50 transition-colors">
                                            {/* Kolom Peringkat */}
                                            <td className="text-center">
                                                {getRankBadge(index)}
                                            </td>
                                            
                                            {/* Kolom Detail Buku */}
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-11 h-14 bg-base-300 shadow-sm">
                                                            <img 
                                                                src={getCoverUrl(book.id, book.collectionId, book.cover)} 
                                                                alt={book.title} 
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm max-w-[200px] sm:max-w-xs truncate">
                                                            {book.title}
                                                        </div>
                                                        <div className="text-[11px] opacity-50 flex items-center gap-1 mt-0.5">
                                                            <Layers size={10} /> {book.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Kolom Total Peminjaman */}
                                            <td className="text-center font-mono font-bold text-sm">
                                                <span className="px-2.5 py-1 rounded-md bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                                                    {book.readersCount} Kali
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
