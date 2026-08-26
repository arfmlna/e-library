import React from 'react';

export default function LoanTableList({ loans, formatDate }) {
    if (loans.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-base-300 dark:border-neutral-focus rounded-xl">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-base-content/60">Tidak ada riwayat peminjaman aktif atau lampau.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-base-200 dark:border-base-100 rounded-xl">
            <table className="table table-zebra w-full bg-base-200/50 dark:bg-base-300/50">
                <thead className="bg-base-300 dark:bg-base-100 text-xs">
                    <tr>
                        <th>Judul Buku</th>
                        <th>Tanggal Pinjam</th>
                        <th>Batas Kembali</th>
                        <th>Status Buku</th>
                    </tr>
                </thead>
                <tbody className='text-xs'>
                    {loans.map((item) => {
                        const book = item.expand?.book_id;
                        const loanHeader = item.expand?.loan_id;
                        
                        return (
                            <tr key={item.id} className="hover:bg-base-200 dark:hover:bg-neutral-focus/40">
                                <td className="font-bold max-w-xs truncate">
                                    {book?.title || 'Buku Tidak Diketahui'}
                                </td>
                                <td>{formatDate(loanHeader?.loan_date)}</td>
                                <td className="text-warning font-medium">{formatDate(item.due_date)}</td>
                                <td>
                                    {item.status === 'borrowed' && <span className="badge badge-info text-white font-medium text-xs">📖 Sedang Dipinjam</span>}
                                    {item.status === 'returned' && <span className="badge badge-ghost opacity-60 font-medium text-xs">✔ Sudah Kembali</span>}
                                    {item.status === 'overdue' && <span className="badge badge-error text-white font-bold text-xs animate-pulse">🚨 Terlambat</span>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
