import { BookOpen, Hourglass, SquareCheckBig, X } from 'lucide-react';
import React from 'react';

export default function RequestCardList({ requests, formatDate }) {
    if (requests.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-base-300 dark:border-neutral-focus rounded-xl">
                <p className="text-4xl mb-2">📥</p>
                <p className="text-base-content/60">Belum ada pengajuan peminjaman buku.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {requests.map((item) => {
                const book = item.expand?.book_id;
                return (
                    <div key={item.id} className="card bg-base-200 dark:bg-base-300 shadow-sm border border-base-300 dark:border-base-100">
                        <div className="card-body p-4 flex-row gap-4 items-center">
                            <div className="w-12 h-16 bg-slate-200 dark:bg-gray-800 rounded flex items-center justify-center text-2xl shadow-inner shrink-0">
                                <BookOpen />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base truncate">{book?.title || 'Buku Tidak Diketahui'}</h3>
                                <p className="text-xs text-base-content/60">Diajukan: {formatDate(item.created)}</p>
                                <p className="text-xs mt-1 text-base-content/80">
                                    Rencana: <span className="font-medium">{formatDate(item.borrow_date)}</span> s/d <span className="font-medium">{formatDate(item.return_date)}</span>
                                </p>
                            </div>
                            <div className="shrink-0">
                                {item.status === 'pending' && <span className="badge badge-warning gap-1 py-3 px-3 font-semibold text-xs">
                                    <Hourglass size={12} />
                                    Pending
                                </span>}
                                {item.status === 'approved' && <span className="badge badge-success text-white gap-1 py-3 px-3 font-semibold text-xs">
                                    <SquareCheckBig size={12} /> 
                                    Diterima
                                </span>}
                                {item.status === 'rejected' && <span className="badge badge-error text-white gap-1 py-3 px-3 font-semibold text-xs">
                                    <X size={12} />
                                    Ditolak
                                </span>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
