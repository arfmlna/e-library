import { formatDate } from '@/constants/dateFormat';
import React from 'react';

export default function RequestTableRow({ item, onAction }) {
    const userDetails = item.expand?.user_id;
    const bookDetails = item.expand?.book_id;

    return (
        <tr className="hover:bg-base-200/50 dark:hover:bg-neutral-focus/30 border-b border-base-200 dark:border-base-300">
            {/* Info Peminjam */}
            <td>
                <div className="font-bold">{userDetails?.name || 'User Tanpa Nama'}</div>
                <div className="text-xs opacity-60">{userDetails?.email}</div>
            </td>
            {/* Info Buku */}
            <td>
                <div className="font-semibold max-w-xs truncate">
                    {bookDetails?.title || 'Buku Tidak Diketahui'}
                </div>
                <div className="text-xs opacity-60">Kode: {bookDetails?.kode_buku || '-'}</div>
            </td>
            {/* Rencana Tanggal Pinjam */}
            <td className="hidden md:table-cell font-medium text-xs">
                {item?.borrow_date ? formatDate(item?.borrow_date) : 'N/A'}
            </td>
            {/* Batas Pengembalian */}
            <td className="hidden md:table-cell font-medium text-xs text-warning">
                {item?.return_date ? formatDate(item?.return_date) : 'N/A'}
            </td>
            {/* Catatan */}
            <td className="max-w-xs truncate text-sm italic text-base-content/80">
                {item?.notes || <span className="opacity-40">Tidak ada catatan</span>}
            </td>
            {/* Tombol Aksi */}
            <td>
                <div className="flex items-center justify-center gap-2">
                    <button 
                        onClick={() => onAction(item, userDetails, bookDetails, 'rejected')}
                        className="btn btn-error btn-xs sm:btn-sm text-white"
                    >
                        Tolak
                    </button>
                    <button 
                        onClick={() => onAction(item, userDetails, bookDetails, 'approved')}
                        className="btn btn-success btn-xs sm:btn-sm text-white"
                    >
                        Terima
                    </button>
                </div>
            </td>
        </tr>
    );
}