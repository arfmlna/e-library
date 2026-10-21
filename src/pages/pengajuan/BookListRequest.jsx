import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import RequestTableRow from './RequestTableRow';
import EmptyState from './EmptyState';
import { pb } from '@/utils/pocketbase';
import { RefreshCcw } from 'lucide-react';

export default function BookListRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const authId = pb.authStore.record.id

    const fetchPendingRequests = async () => {
        setLoading(true);
        try {
            const records = await pb.collection('borrows').getFullList({
                filter: 'status = "pending"',
                sort: '-created',
                expand: 'book_id,user_id', 
            });
            setRequests(records);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Gagal memuat pengajuan:", error);
            }
            Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data dari server.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleAction = async (item, user, book, newStatus) => {
        const isApprove = newStatus === 'approved';
        const result = await Swal.fire({
            title: 'Konfirmasi Aksi',
            text: `Apakah Anda yakin ingin ${isApprove ? 'menerima' : 'menolak'} pengajuan buku "${book?.title}" dari "${user?.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: isApprove ? '#22c55e' : '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: isApprove ? 'Ya, Terima' : 'Ya, Tolak',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        Swal.fire({ title: 'Memproses...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        try {
            if (isApprove) {
                let currentStock = 0;
                const isDigital = book?.bookType?.toLowerCase() === "digital";

                if (!isDigital) {
                    const currentBook = await pb.collection('books').getOne(book.id);
                    currentStock = currentBook.stock ?? 0;
                    if (currentStock <= 0) {
                        throw new Error(`Stok untuk buku "${book.title}" sudah habis.`);
                    }
                }

                const dataLoans = {
                    borrower: user?.id,
                    staff: authId,
                    loan_date: item?.borrow_date ? new Date(item.borrow_date) : new Date(),
                    status: 'borrowed',
                };

                const loanRecord = await pb.collection('loans').create(dataLoans);

                const dueDateObj = new Date();
                dueDateObj.setDate(dueDateObj.getDate() + 7);

                const dataLoanDetails = {
                    loan_id: loanRecord.id,
                    book_id: book?.id,
                    due_date: item?.return_date ? new Date(item.return_date) : dueDateObj,
                    staff: authId,
                    status: 'borrowed'
                };

                const databasePromises = [
                    pb.collection('loan_details').create(dataLoanDetails),
                    
                    pb.collection('borrows').update(item.id, {
                        status: newStatus,
                        borrow_date: new Date()
                    })
                ];

                if (!isDigital) {
                    databasePromises.push(
                        pb.collection('books').update(book.id, {
                            stock: currentStock - 1
                        })
                    );
                }

                try {
                    await Promise.all(databasePromises);
                } catch (parallelError) {
                    if (import.meta.env.DEV) {
                        console.warn("Terjadi eror transaksi paralel, melakukan penghapusan log...");
                    }
                    await pb.collection('loans').delete(loanRecord.id).catch(e => {
                        if (import.meta.env.DEV) {
                            console.error("Gagal rollback:", e)
                        }
                    });
                    throw parallelError; // Lempar eror ke penanganan utama
                }
                
            } else {
                await pb.collection('borrows').update(item.id, {
                    status: newStatus
                });
            }

            Swal.fire({ icon: 'success', title: 'Selesai!', timer: 1200, showConfirmButton: false });
            
            if (typeof fetchPendingRequests === 'function') {
                fetchPendingRequests();
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Error Detail (Bad Request 400):", error);
            }
            // Tampilkan pesan eror asli dari PocketBase agar tahu field mana yang bermasalah
            const errorMsg = error?.data?.message || error.message;
            Swal.fire({ icon: 'error', title: 'Gagal Memproses', text: `Terjadi kesalahan: ${errorMsg}` });
        }
    };

    return (
        <div className="p-6 mx-auto bg-base-100 min-h-screen transition-all">
            {/* Atasan / Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 dark:border-base-300 pb-5">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Halaman List Persetujuan
                    </h1>
                    <p className="text-sm text-base-content/70 dark:text-neutral-content/80 mt-1">
                        Persetujuan sirkulasi peminjaman buku offline secara real-time.
                    </p>
                </div>
                <button onClick={fetchPendingRequests} className="btn btn-outline btn-sm sm:btn-md" disabled={loading}>
                    <RefreshCcw size={20} /> 
                    Refresh Data
                </button>
            </div>

            {/* Area Data / Loader */}
            <div className="mt-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20 flex-col gap-3">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-sm text-base-content/60">Memasok data...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto w-full rounded-xl border border-base-200 dark:border-base-300 shadow-sm">
                        <table className="table table-zebra w-full bg-base-100 dark:bg-base-200">
                            <thead className="bg-base-200 dark:bg-base-300 text-base-content">
                                <tr>
                                    <th>Peminjam</th>
                                    <th>Buku</th>
                                    <th className="hidden md:table-cell">Mulai Pinjam</th>
                                    <th className="hidden md:table-cell">Batas Kembali</th>
                                    <th>Catatan</th>
                                    <th className="text-center">Tindakan Petugas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((item) => (
                                    <RequestTableRow 
                                        key={item.id} 
                                        item={item} 
                                        onAction={handleAction} 
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}