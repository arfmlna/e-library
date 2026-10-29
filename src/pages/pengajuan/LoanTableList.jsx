import { Handshake, TimerOff, UndoDot } from 'lucide-react';
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

    const isOverdue = (dueDate) => {
        return new Date() > new Date(dueDate);
    };

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
                                <td>{formatDate(item.due_date)}</td>
                                <td>
                                    {item.status === 'borrowed' && (
                                        <>
                                            {/* Jika dipinjam dan BELUM terlambat */}
                                            {!isOverdue(item.due_date) && (
                                                <span className="badge badge-info text-white font-medium text-xs">
                                                    <Handshake size={12} /> Sedang Dipinjam
                                                </span>
                                            )}
                                            {/* Jika dipinjam dan SUDAH terlambat */}
                                            {isOverdue(item.due_date) && (
                                                <span className="badge badge-error text-white font-bold text-xs">
                                                    <TimerOff size={12} /> Belum dikembalikan Terlambat
                                                </span>
                                            )}
                                        </>
                                    )}

                                    {item.status === 'returned' && (
                                        <>
                                            {/* Jika dikembalikan TEPAT WAKTU (tanggal kembali <= tanggal tenggat) */}
                                            {new Date(item.return_date) <= new Date(item.due_date) ? (
                                                <span className="badge badge-ghost opacity-60 font-medium text-xs">
                                                    <UndoDot size={12} /> Sudah Kembali
                                                </span>
                                            ) : (
                                                /* Jika dikembalikan TERLAMBAT (tanggal kembali > tanggal tenggat) */
                                                <span className="badge badge-warning text-white font-bold text-xs">
                                                    <TimerOff size={12} /> Dikembalikan Terlambat
                                                </span>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
