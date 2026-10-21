import React, { useEffect, useState } from 'react';
import TabNavigation from './TabNavigation';
import RequestCardList from './RequestCardList';
import LoanTableList from './LoanTableList';
import { pb } from '@/utils/pocketbase';

export default function UserBorrowHistory() {
    const [activeTab, setActiveTab] = useState('pengajuan'); // 'pengajuan' atau 'riwayat'
    const [borrowRequests, setBorrowRequests] = useState([]);
    const [loanHistory, setLoanHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = pb.authStore.record.id

    useEffect(() => {
        const fetchBorrowRequests = async () => {
            if (!userId) return;
            try {
                const records = await pb.collection('borrows').getFullList({
                    filter: `user_id = "${userId}"`,
                    sort: '-created',
                    expand: 'book_id',
                });
                setBorrowRequests(records);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error("Gagal memuat data pengajuan:", error);
                }
            }
        };

        const fetchLoanHistory = async () => {
            if (!userId) return;
            try {
                const records = await pb.collection('loan_details').getFullList({
                    filter: `loan_id.borrower = "${userId}"`,
                    sort: '-created',
                    expand: 'loan_id,book_id',
                });
                setLoanHistory(records);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error("Gagal memuat riwayat peminjaman:", error);
                }
            }
        };
        
        const loadData = async () => {
            setLoading(true);
            if (activeTab === 'pengajuan') {
                await fetchBorrowRequests();
            } else {
                await fetchLoanHistory();
            }
            setLoading(false);
        };
        loadData();
    }, [activeTab, userId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto bg-base-100 dark:bg-gray-800 text-base-content min-h-screen transition-all  rounded-none md:rounded-2xl shadow-sm border border-base-200 dark:border-neutral-focus">
            
            {/* Header section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    📚 Aktivitas Buku Saya
                </h1>
                <p className="text-sm text-base-content/70 dark:text-neutral-content/80 mt-1">
                    Pantau status pengajuan peminjaman baru dan lihat daftar buku yang sedang atau telah Anda pinjam.
                </p>
            </div>

            {/* Navigasi Tab */}
            <TabNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                countRequests={borrowRequests.length}
                countLoans={loanHistory.length}
            />

            {/* Area Data & Loading Handler */}
            <div className="mt-4">
                {loading ? (
                    <div className="flex justify-center items-center py-20 flex-col gap-3">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-sm text-base-content/60">Sinkronisasi data...</p>
                    </div>
                ) : activeTab === 'pengajuan' ? (
                    <RequestCardList requests={borrowRequests} formatDate={formatDate} />
                ) : (
                    <LoanTableList loans={loanHistory} formatDate={formatDate} />
                )}
            </div>
        </div>
    );
}
