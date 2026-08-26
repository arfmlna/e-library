export default function ReportStats({ reports }) {
    const total = reports.length;
    const borrowed = reports.filter(r => r.status === 'borrowed').length;
    const returned = reports.filter(r => r.status === 'returned').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium">Total Transaksi</p>
            <p className="text-2xl font-bold mt-1">{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-orange-500">
            <p className="text-sm font-medium">Sedang Dipinjam</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{borrowed} <span className="text-xs font-normal text-gray-400">buku</span></p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-sm font-medium">Sudah Kembali</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{returned} <span className="text-xs font-normal text-gray-400">buku</span></p>
        </div>
        </div>
    );
}
