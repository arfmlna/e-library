import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Dialog, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog';
import { pb } from '@/utils/pocketbase';
import { X } from 'lucide-react';

export default function BorrowRequestModal({ isOpen, book, userId, onClose, onSuccess }) {
    const [borrowDate, setBorrowDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = localStorage.getItem('theme')

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Silakan login terlebih dahulu.' });
            return;
        }

        if (new Date(returnDate) < new Date(borrowDate)) {
            Swal.fire({ icon: 'warning', title: 'Tanggal Tidak Valid', text: 'Tanggal pengembalian harus setelah tanggal peminjaman.' });
            return;
        }

        setLoading(true);
        Swal.fire({
            title: 'Mengirim Pengajuan...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const data = {
                book_id: book.id,
                user_id: userId,
                borrow_date: new Date(borrowDate).toISOString(),
                return_date: new Date(returnDate).toISOString(),
                status: 'pending',
                notes: notes
            };

            await pb.collection('borrows').create(data);

            Swal.fire({ 
                icon: 'success', 
                title: 'Pengajuan Terkirim!', 
                text: 'Mohon tunggu persetujuan admin.',
                timer: 2000, 
                showConfirmButton: false 
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal mengajukan peminjaman:", error);
            Swal.fire({ icon: 'error', title: 'Gagal', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[999]">
            {/* Backdrop / Overlay gelap latar belakang */}
            <div className="fixed inset-0 bg-white/50 dark:bg-black/50" aria-hidden="true" />

            {/* Container Pembungkus posisi Modal */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel data-theme={theme} className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-base-200 dark:border-neutral-focus text-base-content transition-all">
                    
                    {/* Tombol X Pojok Kanan Atas */}
                    <button 
                        type="button" 
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/70 hover:text-base-content"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                    {/* Judul Modal */}
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Pengajuan Peminjaman Buku
                    </DialogTitle>
                    
                    <p className="py-2 text-sm text-base-content/70 dark:text-neutral-content/80 mt-1">
                        Anda mengajukan peminjaman untuk buku: <br />
                        <span className="font-semibold text-base-content dark:text-white text-base">“{book?.title}”</span>
                    </p>

                    {/* Form Pengajuan */}
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {/* Tanggal Mulai Pinjam */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-sm font-medium text-base-content/80 dark:text-neutral-content/90">
                                    Tanggal Mulai Pinjam
                                </span>
                            </label>
                            <input 
                                type="datetime-local" 
                                className="input input-sm w-full bg-base-200 dark:bg-base-300 dark:text-white text-base-content" 
                                required
                                min={todayStr}
                                value={borrowDate}
                                onChange={(e) => setBorrowDate(e.target.value)}
                            />
                        </div>

                        {/* Tanggal Batas Pengembalian */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-sm font-medium text-base-content/80 dark:text-neutral-content/90">
                                    Tanggal Batas Pengembalian
                                </span>
                            </label>
                            <input 
                                type="datetime-local" 
                                className="input input-sm w-full bg-base-200 dark:bg-base-300 dark:text-white text-base-content" 
                                required
                                min={borrowDate || todayStr} 
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                        </div>

                        {/* Catatan / Keperluan */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-sm font-medium text-base-content/80 dark:text-neutral-content/90">
                                    Catatan / Keperluan (Opsional)
                                </span>
                            </label>
                            <textarea 
                                className="textarea textarea-sm h-20 w-full resize-none bg-base-200 dark:bg-base-300 dark:text-white text-base-content" 
                                placeholder="Contoh: Untuk referensi tugas harian..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        {/* Tombol Aksi Akhir */}
                        <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-base-200 dark:border-base-300">
                            <button 
                                type="button" 
                                className="btn btn-ghost text-base-content/80 dark:text-neutral-content/90" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-6 text-white"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Kirim Pengajuan'}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
