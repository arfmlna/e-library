import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import ReportStats from './ReportStats';
import ReportFilters from './ReportFilters';
import ReportTable from './ReportTable';
import { pb } from '@/utils/pocketbase';

export default function LoanReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [bookType, setBookType] = useState('all')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [userType, setUserType] = useState('all')

    const fetchReportData = async () => {
        setLoading(true);
        try {
            let filterQueries = [];
            if (statusFilter !== 'all') filterQueries.push(`status = "${statusFilter}"`);
            if (bookType !== 'all') filterQueries.push(`book_id.bookType = "${bookType}"`)
            if (startDate) filterQueries.push(`loan_id.loan_date >= "${startDate} 00:00:00"`);
            if (endDate) filterQueries.push(`loan_id.loan_date <= "${endDate} 23:59:59"`);
            if (searchQuery) filterQueries.push(`(loan_id.borrower.name ~ "${searchQuery}" || book_id.title ~ "${searchQuery}")`);
            if (userType !== 'all')  filterQueries.push(`loan_id.borrower.verification_via_users.users_type = "${userType}"`);

            const records = await pb.collection('loan_details').getFullList({
                filter: filterQueries.join(' && '),
                sort: '-created',
                expand: 'loan_id.borrower.verification_via_users,book_id,fines_via_loan_detail'
            });

            const formatted = records.map((detail) => {
                const loan = detail.expand?.loan_id;
                const fineRecord = detail.expand?.fines_via_loan_detail?.[0];
                const currentUsersType = loan?.expand?.borrower?.expand?.verification_via_users?.users_type || 'student';

                return {
                    id: detail.id,
                    memberName: loan?.expand?.borrower?.name || 'Umum',
                    bookTitle: detail.expand?.book_id?.title || 'Buku Terhapus',
                    loanDate: loan?.loan_date?.substring(0, 10) || '-',
                    dueDate: detail.due_date?.substring(0, 10) || '-',
                    returnDate: detail.return_date?.substring(0, 10) || '-',
                    status: detail.status,
                    fine: fineRecord ? `Rp ${fineRecord.amount.toLocaleString('id-ID')}` : '-',
                    fineStatus: fineRecord?.status || '-',
                    usersType: currentUsersType
                };
            });
            setReports(formatted);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Gagal memuat laporan:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (reports.length === 0) {
            alert("Tidak ada data laporan untuk diekspor!");
            return;
        }

        // 1. Tentukan Header Tabel
        let excelRows = [
            ["ID Transaksi", "Nama Peminjam", "Judul Buku", "Tanggal Pinjam", "Batas Kembali", "Tanggal Kembali", "Denda", "Status"]
        ];

        // 2. Masukkan data laporan
        reports.forEach(row => {
            excelRows.push([
            row.id,
            row.memberName,
            // Hilangkan tanda koma/titik koma di dalam judul buku agar kolom tidak berantakan
            row.bookTitle.replace(/[;,]/g, ' '), 
            row.loanDate,
            row.dueDate,
            row.returnDate,
            row.fine,
            row.status === 'returned' ? 'Selesai' : 'Dipinjam'
            ]);
        });

        // 3. Gabungkan data dengan pemisah TITIK KOMA (;)
        const csvContent = excelRows.map(row => row.join(";")).join("\n");

        // 4. TRIK UTAMA: Tambahkan "sep=;" di baris paling atas agar Excel otomatis memisahkan kolom
        const finalContent = "sep=;\n" + csvContent;

        // 5. Buat Blob dengan format CSV
        const blob = new Blob(["\ufeff" + finalContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 6. Jalankan proses unduh otomatis (.csv bisa langsung dibuka rapi di Excel)
        const link = document.createElement("a");
        const bookTypeText = bookType  === 'academic' ? 'Akademik' : bookType === 'nonAcademic' ? 'Non Akademik' : ''
        const bookStatus = statusFilter === 'borrowed' ? 'Peminjaman' : statusFilter === 'returned' ? 'Pengembalian' : ''
        link.href = url;
        link.setAttribute("download", `Laporan_${bookStatus}_Perpustakaan_Buku_${bookTypeText}_${new Date().toISOString().substring(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => { 
        fetchReportData(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, bookType, startDate, endDate, searchQuery, userType]);



    return (
        <div className="p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-2xl font-bold">Laporan Perpustakaan</h1>
            <p className="text-sm">Sinkronisasi data tabel loans, loan_details, dan fines.</p>
            </div>
            <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
                onClick={exportToExcel} 
            >
                📊 Export ke Excel (.xls)
            </button>
        </div>

        <ReportStats reports={reports} />
        
        <ReportFilters 
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            bookType={bookType} setBookType={setBookType}  
            userType={userType} setUserType={setUserType}
        />

        <ReportTable reports={reports} loading={loading} />
        </div>
  );
}