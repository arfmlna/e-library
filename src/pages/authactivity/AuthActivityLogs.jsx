import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, LogIn, UserPlus, Monitor } from 'lucide-react';
import { fetchAuthLogs } from '@/utils/fetchAuthLogs';

export default function AuthActivityLogs() {
    const { data: logs = [], isLoading, error } = useQuery({
        queryKey: ['authLogs'],
        queryFn: fetchAuthLogs,
        refetchInterval: 1000 * 20, // Refresh otomatis setiap 20 detik
    });

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
               date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Fungsi ekstraksi ringkas nama browser dari user agent string
    const parseDevice = (userAgent) => {
            if (!userAgent) return "Unknown Device";
            if (userAgent.includes("Android")) return "Android HP";
            if (userAgent.includes("iPhone")) return "iPhone";
            if (userAgent.includes("Windows")) return "Windows PC";
            if (userAgent.includes("Macintosh")) return "MacBook";
        return "Linux/Other";
    };

    if (isLoading) return (
        <div className="w-full h-[90vh] flex items-center justify-center text-center p-10">
            <span className="loading loading-spinner text-primary"></span>
        </div>
    );
    
    if (error) return (
        <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="text-error text-center p-5 text-sm">Gagal memuat log pelacakan.</div>
        </div>
    );

    return (
        <div className="w-full flex justify-center px-10">
            <div className="w-full my-6">
                <div className="card-body p-5 md:p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-base-300 pb-4 mb-4">
                        <div className="p-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg">
                            <ShieldCheck className="animate-accordion-down" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-wide uppercase">Tracking Akses Pengguna</h2>
                            <p className="text-xs opacity-60">Riwayat autentikasi login & registrasi member secara real-time</p>
                        </div>
                    </div>

                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-sm opacity-60">Belum ada aktivitas akses terdeteksi.</div>
                    ) : (
                        /* Tabel Tracking */
                        <div className="overflow-x-auto w-full">
                            <table className="table table-sm md:table-md table-zebra w-full align-middle whitespace-nowrap">
                                <thead>
                                    <tr className="bg-base-200/60">
                                        <th>Waktu Akses</th>
                                        <th>Nama Pengguna</th>
                                        <th>Aktivitas</th>
                                        <th>Method</th>
                                        <th>IP Address</th>
                                        <th>Perangkat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-base-200/40 transition-colors">
                                            {/* Kolom Waktu */}
                                            <td className="text-xs font-mono opacity-70">
                                                {formatDateTime(log.created)}
                                            </td>
                                            
                                            {/* Kolom Detail Pengguna */}
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-base-content">{log.expand?.user?.name || "User Terhapus"}</span>
                                                    <span className="text-[11px] opacity-50 font-mono">{log.expand?.user?.email || "-"}</span>
                                                </div>
                                            </td>

                                            {/* Kolom Aksi (Badge Login/Register) */}
                                            <td>
                                                {log.action === 'login' ? (
                                                    <span className="badge badge-success badge-sm gap-1 py-2.5 font-bold text-white text-[11px]">
                                                        <LogIn size={11} /> Masuk
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-info badge-sm gap-1 py-2.5 font-bold text-white text-[11px]">
                                                        <UserPlus size={11} /> Daftar Baru
                                                    </span>
                                                )}
                                            </td>

                                            <td className="text-xs opacity-80">
                                                <span className="inline-flex items-center gap-1 bg-base-200 px-2 py-1 rounded text-[11px] font-medium">
                                                    {log.method}
                                                </span>
                                            </td>

                                            <td className="text-xs opacity-80">
                                                <span className="inline-flex items-center gap-1 bg-base-200 px-2 py-1 rounded text-[11px] font-medium">
                                                    {log.ip_address}
                                                </span>
                                            </td>

                                            {/* Kolom Perangkat */}
                                            <td className="text-xs opacity-80">
                                                <span className="inline-flex items-center gap-1 bg-base-200 px-2 py-1 rounded text-[11px] font-medium">
                                                    <Monitor size={11} className="opacity-50" />
                                                    {parseDevice(log.user_agent)}
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
