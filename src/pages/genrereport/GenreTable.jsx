import React from 'react';

export default function GenreTable({ genres, loading }) {
    if (loading) return <div className="p-10 rounded-xl text-center shadow-sm">Menganalisis minat kategori buku...</div>;
    if (genres.length === 0) return <div className="p-10 rounded-xl text-center shadow-sm">Belum ada riwayat peminjaman buku untuk dianalisis.</div>;

    // Hitung total semua peminjaman sebagai dasar pembagian persentase
    const totalAllLoans = genres.reduce((sum, item) => sum + item.totalBorrowed, 0);

    return (
        <div className="rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-300 dark:bg-gray-800 text-xs uppercase font-semibold border-b">
                    <th className="p-4 w-24 text-center">Peringkat</th>
                    <th className="p-4 w-1/4">Nama Kategori / Genre</th>
                    <th className="p-4">Visualisasi Tren Minat Baca</th>
                    <th className="p-4 text-center w-40">Total Dipinjam</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {genres.map((row, index) => {
                const rank = index + 1;
                const percentage = totalAllLoans > 0 
                    ? Math.round((row.totalBorrowed / totalAllLoans) * 100) 
                    : 0;

                return (
                    <tr key={index} className="hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                    <td className="p-4 text-center font-bold">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                        rank === 1 ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        rank === 2 ? 'bg-indigo-100 text-indigo-800' :
                        rank === 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        #{rank}
                        </span>
                    </td>
                    
                    {/* NAMA GENRE */}
                    <td className="p-4 font-semibold capitalize">
                        📁 {row.name}
                    </td>
                    
                    {/* PROGRESS BAR INDIKATOR TREN */}
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                        <progress 
                            className={`progress w-full ${
                            rank === 1 ? 'progress-purple' : 'progress-primary'
                            }`} 
                            value={percentage} 
                            max="100"
                        ></progress>
                        <span className="text-xs font-bold w-10 text-right">{percentage}%</span>
                        </div>
                    </td>
                    
                    {/* JUMLAH PINJAM */}
                    <td className="p-4 text-center font-bold">
                        {row.totalBorrowed} <span className="text-xs font-normal">buku</span>
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
