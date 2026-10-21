import React, { lazy, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, Medal } from 'lucide-react';
import { fetchTopBorrowedBooks } from '@/utils/getTopsBook';

const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))
const Poster = lazy(() => import('@/components/book/Poster'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

export default function TopBorrowedBooks() {
    const [limitFilter, setLimitFilter] = useState(5);

    const { data: topBooks = [], isLoading, refetch, error } = useQuery({
        queryKey: ['topBorrowedBooks', limitFilter],
        queryFn: () => fetchTopBorrowedBooks(limitFilter),
    });

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
            <div className="w-full max-w-7xl bg-base-100 mx-auto my-6">
                <div className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-base-300 pb-4 mb-5">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 dark:bg-slate-600 text-primary dark:text-slate-800 rounded-lg">
                                <Medal className="text-black animate-pulse" size={22} />
                            </div>
                            <h2 className="text-lg font-bold tracking-wide uppercase">Top Buku Terlaris</h2>
                        </div>
                        <select 
                            className="select select-bordered select-sm font-semibold focus:select-primary"
                            value={limitFilter}
                            onChange={(e) => setLimitFilter(Number(e.target.value))}
                        >
                            <option value={5}>Tampilkan 5</option>
                            <option value={10}>Tampilkan 10</option>
                            <option value={20}>Tampilkan 20</option>
                        </select>
                    </div>
                    { isLoading ? <Loading variant='list' count={7} /> : error ? <Error refetch={refetch} variant='card' /> : 
                        topBooks.length === 0 ? (
                            <NotFound
                            message='Belum ada riwayat peminjaman buku.'
                            />
                        ) : (
                            <div className="overflow-x-auto w-full shadow-xl">
                                <table className="table table-zebra w-full align-middle">
                                    <thead>
                                        <tr>
                                            <th className="w-16 text-center">Rank</th>
                                            <th>Buku</th>
                                            <th className="text-center w-32 hidden md:block">Total Dipinjam</th>
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
                                                                <Poster
                                                                data={book}
                                                                width={50}
                                                                height={50}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col gap-0.5'>
                                                            <div className="font-bold text-sm max-w-[150px] sm:max-w-xs truncate md:overflow-visible">
                                                                {book.title}
                                                            </div>
                                                            <div className="text-[11px] opacity-50 flex items-center gap-1 mt-0.5">
                                                                <Layers size={10} /> {book.type}
                                                            </div>
                                                            <span className="block md:hidden w-fit text-[9px] px-1.5 py-1 mt-0.5 rounded-md bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                                                                {book.readersCount} Orang
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="text-center font-mono font-bold text-sm hidden md:block">
                                                    <span className="px-2.5 py-1 rounded-md bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                                                        {book.readersCount} Kali
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
