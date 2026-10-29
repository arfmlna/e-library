import React, { lazy, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, User, Flame } from 'lucide-react';
import { fetchTopUsers } from '@/utils/getTopsBook';
import { pb } from '@/utils/pocketbase';

const Error = lazy(() => import('@/components/ui/Error'))
const Loading = lazy(() => import('@/components/ui/Loading'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

export default function TopUsersList() {
    const [limitFilter, setLimitFilter] = useState(5);

    // Mengambil data menggunakan TanStack Query
    const { data: topUsers = [], isLoading, refetch, error } = useQuery({
        queryKey: ['topUsers', limitFilter],
        queryFn: () => fetchTopUsers(limitFilter),
        staleTime: 1000 * 60 * 5, // Cache selama 5 menit
    });

    const getAvatarUrl = (userId, filename) => {
        if (!filename) return `https://dicebear.com{userId}`;
        return `${pb.baseURL}/api/files/_pb_users_auth_/${userId}/${filename}`;
    };

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

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
                            <div className="p-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg">
                                <Award className="animate-accordion-down" size={20} />
                            </div>
                            <div className="">
                                <h2 className="text-lg font-bold tracking-wide uppercase">Top Pembaca Teraktif</h2>
                                <p className="text-xs opacity-60">Pembaca yang sangat aktif membaca buku digital</p>
                            </div>
                        </div>
                        <select 
                            className="select select-bordered select-sm font-semibold focus:select-primary"
                            value={limitFilter}
                            onChange={(e) => setLimitFilter(Number(e.target.value))}
                        >
                            <option value={5}>Tampilkan 5</option>
                            <option value={10}>Tampilkan 10</option>
                            <option value={25}>Tampilkan 25</option>
                        </select>
                    </div>
                    { isLoading ? <Loading variant='list' count={7} /> : error ? <Error refetch={refetch} variant='card' /> : 
                        topUsers.length === 0 ? (
                            <NotFound
                            message='Belum ada riwayat aktivitas pengguna.'
                            />
                        ) : (
                            <div className="overflow-x-auto w-full shadow-xl">
                                <table className="table table-zebra w-full align-middle">
                                    <thead>
                                        <tr>
                                            <th className="w-16 text-center">Rank</th>
                                            <th>Pengguna</th>
                                            <th className="text-center hidden md:table-cell">Total Aktivitas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topUsers.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-base-200/50 transition-colors">
                                                {/* Kolom Peringkat */}
                                                <td className="text-center">
                                                    {getRankBadge(index)}
                                                </td>
                                                
                                                {/* Kolom Detail Pengguna (Avatar, Nama, Role/Status) */}
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="w-10 h-10 rounded-full ring ring-primary/20 ring-offset-base-100 ring-offset-1 shadow-sm">
                                                                <img 
                                                                    src={getAvatarUrl(user.id, user.avatar)} 
                                                                    alt={user.name} 
                                                                    className="object-cover rounded-full"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col gap-0.5'>
                                                            <div className="font-bold text-sm max-w-[150px] sm:max-w-xs truncate md:overflow-visible">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-[11px] opacity-50 flex items-center gap-1 mt-0.5">
                                                                <User size={10} /> {user.role}
                                                            </div>
                                                            <span className="inline-flex md:hidden w-fit text-[9px]  px-1.5 py-1 rounded-md items-center gap-1 bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                                                                <Flame size={12} className="text-orange-500" />
                                                                {user.activityCount} <span className="font-normal">Poin</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Kolom Skor Aktivitas */}
                                                <td className="text-center font-mono font-bold text-sm hidden md:table-cell">
                                                    <span className="px-2.5 py-1 rounded-md inline-flex items-center gap-1 bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                                                        <Flame size={12} className="text-orange-500" />
                                                        {user.activityCount} <span className="text-[11px] font-normal">Poin</span>
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
