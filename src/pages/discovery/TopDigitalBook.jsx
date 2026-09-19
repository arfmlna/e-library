import React, { lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, BookOpen, Flame } from 'lucide-react';
import { fetchTopDigitalBooks } from '@/utils/getTopsBook';

const NotFound = lazy(() => import('@/components/ui/NotFound'))
const Poster = lazy(() => import('@/components/book/Poster'))
const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))

export default function TopDigitalBooks() {
    const { data: topBooks = [], isLoading, refetch, error } = useQuery({
        queryKey: ['topDigitalBooks'],
        queryFn: fetchTopDigitalBooks,
        staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit untuk menghemat request
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
            <div className="w-full max-w-7xl bg-base-100 my-6">
                <div className="p-5 md:p-6">
                    <div className="flex justify-between items-center pb-4 mb-5">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 dark:bg-slate-600 text-primary dark:text-slate-800 rounded-lg">
                                <Trophy className="text-black animate-pulse" size={22} />
                            </div>
                            <h2 className="text-lg font-bold tracking-wide uppercase">Top 5 Buku Digital</h2>
                        </div>
                        <div className="badge badge-secondary gap-1 badge-sm font-semibold py-2">
                            <Flame size={12} /> Terpopuler
                        </div>
                    </div>

                    { isLoading ? <Loading variant='list' count={7} /> : error ? <Error refetch={refetch} variant='card' /> : 
                        topBooks.length === 0 ? (
                            <NotFound
                            message='Belum ada riwayat aktivitas membaca.'
                            />
                        ) : (
                            /* Tabel Daftar Top 5 */
                            <div className="overflow-x-auto w-full shadow-xl">
                                <table className="table table-zebra w-full align-middle">
                                    <thead>
                                        <tr>
                                            <th className="w-16 text-center">Rank</th>
                                            <th>Buku</th>
                                            <th className="text-center w-28">Total Pembaca</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topBooks.map((book, index) => (
                                            <tr key={book.id} className="hover:bg-base-200/50 transition-colors">
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
                                                        <div>
                                                            <div className="font-bold text-sm max-w-[200px] sm:max-w-xs truncate">
                                                                {book.title}
                                                            </div>
                                                            <div className="text-[11px] opacity-50 flex items-center gap-1 mt-0.5">
                                                                <BookOpen size={10} /> E-Book Digital
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Kolom Total Pembaca */}
                                                <td className="text-center font-mono font-bold text-sm">
                                                    <span className="px-2.5 py-1 rounded-md bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                                                        {book.readersCount} Orang
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                        )}
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