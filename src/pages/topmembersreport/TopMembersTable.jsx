import React from 'react';

export default function TopMembersTable({ members, loading }) {
    if (loading) return <div className="flex items-center justify-center p-10 text-lg md:text-2xl h-[70vh] rounded-xl text-center shadow-sm">Mengkalkulasi skor keaktifan siswa...</div>;
    if (members.length === 0) return <div className="flex items-center justify-center p-10 text-lg md:text-2xl h-[70vh] rounded-xl text-center shadow-sm">Tidak ada aktivitas peminjaman buku pada bulan ini.</div>;

    return (
        <div className="rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-300 dark:bg-gray-800 text-xs uppercase font-semibold border-b">
                    <th className="p-4 w-24 text-center">Peringkat</th>
                    <th className="p-4">Nomor Induk / NIS</th>
                    <th className="p-4">Nama Lengkap Siswa</th>
                    <th className="p-4">Kontak / Email</th>
                    <th className="p-4 text-center">Frekuensi Baca</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {members.map((row, index) => {
                const rank = index + 1;
                return (
                    <tr key={row.id} className={`hover:bg-slate-200 dark:hover:bg-gray-700 transition`}>
                    {/* KOLOM BADGE JUARA */}
                    <td className="p-4 text-center font-bold">
                        {rank === 1 ? (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full border border-yellow-300">
                            👑 Juara 1
                        </span>
                        ) : (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                            Siswa #{rank}
                        </span>
                        )}
                    </td>
                        <td className="p-4 font-mono">{row.id}</td>
                        <td className="p-4 font-semibold">{row.name}</td>
                        <td className="p-4">{row.email}</td>
                        <td className="p-4 text-center font-bold">
                            {row.totalBorrow} <span className="text-xs font-normal text-gray-400">Buku</span>
                        </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        </div>
    );
}
