import React from 'react';

export default function EmptyState() {
    return (
        <div className="text-center py-16 border-2 border-dashed border-base-300 dark:border-neutral-focus rounded-2xl bg-base-50/50 dark:bg-base-200/20">
            <p className="text-5xl mb-2">🎉</p>
            <h3 className="font-semibold text-lg text-base-content">Tidak Ada Pengajuan Baru</h3>
            <p className="text-sm text-base-content/60">Semua permohonan peminjaman saat ini telah selesai ditinjau.</p>
        </div>
    );
}