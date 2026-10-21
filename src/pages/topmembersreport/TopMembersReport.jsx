import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import TopMembersTable from './TopMembersTable';
import { pb } from '@/utils/pocketbase';

export default function TopMembersReport() {
    const [topMembers, setTopMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk filter bulan (Format bawaan input month HTML: "YYYY-MM")
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

    const fetchActiveMembers = async () => {
        setLoading(true);
        try {
            // 1. Tentukan batas awal dan akhir bulan yang dipilih untuk filter database
            const startFilter = `${selectedMonth}-01 00:00:00`;
            const endFilter = `${selectedMonth}-31 23:59:59`;

            // 2. Tarik data dari loan_details yang terjadi pada bulan tersebut
            const records = await pb.collection('loan_details').getFullList({
                filter: `loan_id.loan_date >= "${startFilter}" && loan_id.loan_date <= "${endFilter}"`,
                expand: 'loan_id.borrower'
            });

            // 3. Hitung skor akumulasi peminjaman tiap anggota menggunakan Reduce
            const memberCountMap = records.reduce((acc, current) => {
                const loan = current.expand?.loan_id;
                const borrower = loan?.expand?.borrower;
                
                if (!borrower) return acc; // Lewati jika data siswa sudah dihapus/kosong

                if (!acc[borrower.id]) {
                acc[borrower.id] = {
                    id: borrower.id,
                    name: borrower.name,
                    identityNumber: borrower.identity_number || borrower.nis || '-', // Menyesuaikan kolom nomor induk/NIS
                    email: borrower.email || '-',
                    totalBorrow: 0
                };
                }
                acc[borrower.id].totalBorrow += 1;
                return acc;
            }, {});

            // 4. Ubah objek map menjadi Array, lalu urutkan dari skor tertinggi
            const sortedMembers = Object.values(memberCountMap)
                .sort((a, b) => b.totalBorrow - a.totalBorrow)
                .slice(0, 10); // Ambil peringkat Top 10 Besar siswa teraktif

            setTopMembers(sortedMembers);
        } catch (error) {
            if (import.meta.env.DEV) {       
                console.error("Gagal menghitung statistik siswa teraktif:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth]);

    return (
        <div className="p-6 min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-2xl font-bold">🏆 Laporan Anggota Paling Aktif (Top Reader)</h1>
            <p className="text-sm">Daftar siswa pembaca terbaik untuk acuan pemberian penghargaan berkala.</p>
            </div>

            {/* INPUT BULAN DAISYUI */}
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold">Periode Bulan:</label>
                <input 
                    type="month" 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="input input-bordered input-sm"
                />
            </div>
        </div>

        {/* TABEL DATA */}
        <TopMembersTable members={topMembers} loading={loading} />
        </div>
    );
}