import React from 'react';

export default function TopBooksTable({ books, loading }) {
    if (loading) return <div className="p-10 rounded-xl text-center shadow-sm">Menganalisis tren pembaca...</div>;
    if (books.length === 0) return <div className="p-10 rounded-xl text-center shadow-sm">Belum ada transaksi peminjaman buku tercatat.</div>;

    return (
        <div className="rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-xs uppercase font-semibold border-b bg-slate-300 dark:bg-gray-800">
                    <th className="p-4 w-20 text-center">Peringkat</th>
                    <th className="p-4">ID Buku</th>
                    <th className="p-4">Judul Koleksi Buku</th>
                    <th className="p-4">Kategori / Tipe</th>
                    <th className="p-4 text-center">Total Dipinjam</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
                {books.map((row, index) => {
                const rank = index + 1;
                return (
                    <tr key={row.id} className="hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                    {/* KOLOM PERINGKAT DENGAN BADGE KHUSUS */}
                    <td className="p-4 text-center font-bold">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                        rank === 2 ? 'bg-slate-200 text-slate-800' :
                        rank === 3 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        #{rank}
                        </span>
                    </td>
                    <td className="p-4 font-mono text-xs">{row.id}</td>
                    <td className="p-4 font-semibold">{row.title}</td>
                    <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        row.type === 'Akademik' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                        {row.type}
                        </span>
                    </td>
                    {/* SKOR TOTAL PEMINJAMAN */}
                    <td className="p-4 text-center font-bold">
                        {row.borrowCount} <span className="text-xs font-normal">kali</span>
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
