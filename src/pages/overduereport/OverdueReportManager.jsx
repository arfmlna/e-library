import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import OverdueFilters from './OverdueFilters';
import OverdueTable from './OverdueTable';
import { pb } from '@/utils/pocketbase';

export default function OverdueReportManager() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookType, setBookType] = useState('all'); // all, academic, nonacademic
    const [searchQuery, setSearchQuery] = useState('');
    const [userType, setUserType] = useState('all')

    useEffect(() => { 
        const fetchOverdueData = async () => {
            setLoading(true);
            try {
                const todayStr = new Date().toISOString().substring(0, 19).replace('T', ' ');

                let filterQueries = [
                    `status = "borrowed"`,
                    `due_date < "${todayStr}"`
                ];

                if (bookType !== 'all') filterQueries.push(`book_id.bookType = "${bookType}"`);
                if (searchQuery) filterQueries.push(`(loan_id.borrower.name ~ "${searchQuery}" || book_id.title ~ "${searchQuery}")`);
                if (userType !== 'all')  filterQueries.push(`loan_id.borrower.verification_via_users.users_type = "${userType}"`);

                const records = await pb.collection('loan_details').getFullList({
                    filter: filterQueries.join(' && '),
                    sort: 'due_date', // Urutkan dari yang paling lama terlambat
                    expand: 'loan_id.borrower.verification_via_users,book_id,fines_via_loan_detail'
                });

                const formatted = records.map((detail) => {
                    const loan = detail.expand?.loan_id;
                    const book = detail.expand?.book_id;
                    const currentUsersType = loan?.expand?.borrower?.expand?.verification_via_users?.users_type || 'student';
                    
                    const diffTime = Math.abs(new Date() - new Date(detail.due_date));
                    const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return {
                    id: detail.id,
                        memberName: loan?.expand?.borrower?.name || 'Umum',
                        bookTitle: book?.title || 'Buku Terhapus',
                        bookType: book?.type === 'academic' ? 'Akademik' : 'Non-Akademik',
                        loanDate: loan?.loan_date?.substring(0, 10) || '-',
                        dueDate: detail.due_date?.substring(0, 10) || '-',
                        daysOverdue: daysOverdue,
                        fineEstimate: `Rp ${(daysOverdue * 2000).toLocaleString('id-ID')}`,
                        usersType: currentUsersType
                    };
                });

                setReports(formatted);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error("Gagal memuat laporan keterlambatan:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchOverdueData(); 
    }, [bookType, searchQuery, userType]);

    return (
        <div className="p-6 min-h-screen">
        <div className="mb-6">
            <h1 className="text-2xl font-bold">Laporan Keterlambatan Buku</h1>
            <p className="text-sm text-gray-500">Daftar buku yang melanggar batas tanggal pengembalian perpustakaan.</p>
        </div>

        <OverdueFilters 
            bookType={bookType} setBookType={setBookType}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            userType={userType} setUserType={setUserType}
        />

        <OverdueTable reports={reports} loading={loading} />
        </div>
    );
}