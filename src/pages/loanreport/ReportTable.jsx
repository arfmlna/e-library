
export default function ReportTable({ reports, loading }) {
    if (loading) return <div className="bg-white p-10 rounded-xl text-center shadow-sm text-gray-500">Memuat data dari database...</div>;
    if (reports.length === 0) return <div className="bg-white p-10 rounded-xl text-center shadow-sm text-gray-500">Tidak ada data laporan.</div>;

    return (
        <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-300 dark:bg-gray-800 text-black dark:text-white text-xs uppercase font-semibold border-b border-gray-200">
                <th className="p-4">ID Transaksi</th>
                <th className="p-4">Nama Peminjam</th>
                <th className="p-4">Judul Buku</th>
                <th className="p-4">Tgl Pinjam</th>
                <th className="p-4">Batas Kembali</th>
                <th className="p-4">Tgl Kembali</th>
                <th className="p-4">Denda</th>
                <th className="p-4 text-center">Status</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
                {reports.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-4 font-mono font-medium">{row.id}</td>
                    <td className="p-4 font-medium">{row.memberName}</td>
                    <td className="p-4 max-w-xs truncate">{row.bookTitle}</td>
                    <td className="p-4">{row.loanDate}</td>
                    <td className="p-4">{row.dueDate}</td>
                    <td className="p-4">{row.returnDate}</td>
                    <td className="p-4">
                    {row.fine !== '-' ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        row.fineStatus === 'paid' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                        }`}>
                        {row.fine} ({row.fineStatus === 'paid' ? 'Lunas' : 'Belum Bayar'})
                        </span>
                    ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                        {row.status === 'returned' ? 'Selesai' : 'Dipinjam'}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
