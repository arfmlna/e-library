import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, User, Flame } from 'lucide-react';
import { fetchTopUsers } from '@/utils/getTopsBook';
import { pb } from '@/utils/pocketbase';

export default function TopUsersList() {
    const [limitFilter, setLimitFilter] = useState(5);

    // Mengambil data menggunakan TanStack Query
    const { data: topUsers = [], isLoading, error } = useQuery({
        queryKey: ['topUsers', limitFilter],
        queryFn: () => fetchTopUsers(limitFilter),
        staleTime: 1000 * 60 * 5, // Cache selama 5 menit
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 gap-2 bg-base-100 border border-base-300 rounded-xl shadow-xl max-w-2xl mx-auto">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <span className="text-xs opacity-60">Menghitung peringkat pengguna teraktif...</span>
            </div>
        );
    }

    if (error) return <div className="text-error text-center p-5 text-sm">Gagal memuat data peringkat pengguna.</div>;

    // Fungsi pembantu untuk mendapatkan URL avatar user dari PocketBase
    const getAvatarUrl = (userId, filename) => {
        if (!filename) return `https://dicebear.com{userId}`; // fallback pakai generator avatar inisial nama
        return `${pb.baseURL}/api/files/_pb_users_auth_/${userId}/${filename}`;
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
                    {/* Header dengan Dropdown Filter */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-base-300 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Award className="text-warning animate-pulse" size={22} />
                            <h2 className="text-lg font-bold tracking-wide uppercase">Top Pembaca Teraktif</h2>
                        </div>
                        
                        <select 
                            className="select select-bordered select-xs font-semibold focus:select-primary"
                            value={limitFilter}
                            onChange={(e) => setLimitFilter(Number(e.target.value))}
                        >
                            <option value={5}>Tampilkan 5</option>
                            <option value={10}>Tampilkan 10</option>
                            <option value={25}>Tampilkan 25</option>
                        </select>
                    </div>

                    {topUsers.length === 0 ? (
                        <div className="text-center py-8 text-sm opacity-60">Belum ada riwayat aktivitas pengguna.</div>
                    ) : (
                        /* Tabel Daftar Top Users */
                        <div className="overflow-x-auto w-full">
                            <table className="table table-zebra w-full align-middle">
                                <thead>
                                    <tr>
                                        <th className="w-16 text-center">Rank</th>
                                        <th>Pengguna</th>
                                        <th className="text-center w-36">Total Aktivitas</th>
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
                                                    <div>
                                                        <div className="font-bold text-sm max-w-[180px] sm:max-w-xs truncate">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-[11px] opacity-50 flex items-center gap-1 mt-0.5">
                                                            <User size={10} /> {user.role}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Kolom Skor Aktivitas */}
                                            <td className="text-center font-mono font-bold text-sm">
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
                    )}
                </div>
            </div>
        </div>
    );
}
