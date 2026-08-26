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

    const fetchOverdueData = async () => {
        setLoading(true);
        try {
        // 1. Dapatkan tanggal & jam hari ini dengan format ISO string bersih untuk PocketBase
        const todayStr = new Date().toISOString().substring(0, 19).replace('T', ' ');

        // 2. Filter dasar: Status masih dipinjam DAN tanggal jatuh tempo sudah lewat dari hari ini
        let filterQueries = [
            `status = "borrowed"`,
            `due_date < "${todayStr}"`
        ];

        // Filter berdasarkan tipe buku (Asumsi ada kolom 'type' di tabel books dengan nilai 'academic'/'nonacademic')
        if (bookType !== 'all') {
            filterQueries.push(`book_id.bookType = "${bookType}"`);
        }

        // Filter pencarian teks
        if (searchQuery) {
            filterQueries.push(`(loan_id.borrower.name ~ "${searchQuery}" || book_id.title ~ "${searchQuery}")`);
        }

        // 3. Tarik data dari PocketBase
        const records = await pb.collection('loan_details').getFullList({
            filter: filterQueries.join(' && '),
            sort: 'due_date', // Urutkan dari yang paling lama terlambat
            expand: 'loan_id.borrower,book_id,fines_via_loan_detail'
        });

        // 4. Format data untuk UI Tabel
        const formatted = records.map((detail) => {
            const loan = detail.expand?.loan_id;
            const book = detail.expand?.book_id;
            
            // Hitung jumlah hari keterlambatan secara dinamis
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
            fineEstimate: `Rp ${(daysOverdue * 2000).toLocaleString('id-ID')}` // Contoh denda otomatis Rp 2.000/hari
            };
        });

        setReports(formatted);
        } catch (error) {
        console.error("Gagal memuat laporan keterlambatan:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { fetchOverdueData(); }, [bookType, searchQuery]);

    return (
        <div className="p-6 min-h-screen">
        <div className="mb-6">
            <h1 className="text-2xl font-bold">Laporan Keterlambatan Buku</h1>
            <p className="text-sm text-gray-500">Daftar buku yang melanggar batas tanggal pengembalian perpustakaan.</p>
        </div>

        <OverdueFilters 
            bookType={bookType} setBookType={setBookType}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        />

        <OverdueTable reports={reports} loading={loading} />
        </div>
    );
}