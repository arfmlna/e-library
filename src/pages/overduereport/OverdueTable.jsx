import React from 'react';

export default function OverdueTable({ reports, loading }) {
  if (loading) return <div className="p-10 rounded-xl text-center shadow-sm text-gray-500">Memeriksa database keterlambatan...</div>;
  if (reports.length === 0) return <div className="p-10 rounded-xl text-center shadow-sm text-gray-500">Aman! Tidak ada buku yang terlambat untuk tipe ini.</div>;

  return (
    <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-300 dark:bg-gray-800 text-black dark:text-white text-xs uppercase font-semibold border-b border-gray-200">
              <th className="p-4">ID Detail</th>
              <th className="p-4">Nama Anggota</th>
              <th className="p-4">Judul Buku</th>
              <th className="p-4">Tipe Buku</th>
              <th className="p-4">Batas Kembali</th>
              <th className="p-4 text-center">Durasi Lewat</th>
              <th className="p-4">Estimasi Denda</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reports.map((row, index) => (
              <tr key={index} className="hover:bg-slate-200/40 dark:hover:bg-gray-900/40 transition">
                <td className="p-4 font-mono font-medium text-black dark:text-white">{row.id}</td>
                <td className="p-4 font-medium text-black dark:text-white">{row.memberName}</td>
                <td className="p-4 max-w-xs truncate text-black dark:text-white">{row.bookTitle}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    row.bookType === 'Akademik' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {row.bookType}
                  </span>
                </td>
                <td className="p-4 font-medium">{row.dueDate}</td>
                <td className="p-4 text-center">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    Telat {row.daysOverdue} Hari
                  </span>
                </td>
                <td className="p-4 font-semibold text-black dark:text-white">{row.fineEstimate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
