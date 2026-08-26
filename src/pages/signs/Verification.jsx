import { pb } from '@/utils/pocketbase';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 👈 Import SweetAlert2

export default function Verification() {
    const navigate = useNavigate();
    const [roleType, setRoleType] = useState('siswa'); 
    const [nomorInduk, setNomorInduk] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Tampilkan loading spinner saat memproses penyimpanan data
        Swal.showLoading();

        try {
        const currentUser = pb.authStore.record; // PocketBase v0.20+ menggunakan record
        if (!currentUser) {
            throw new Error('Sesi masuk tidak ditemukan. Silakan login kembali.');
        }

        // Update data user di PocketBase (Mengisi nomor induk & memverifikasi akun)
        await pb.collection('users').update(currentUser.id, {
            nomor_induk: nomorInduk,
            verified: true  // Mengubah field bawaan 'verified' menjadi true sesuai logika router Anda
        });

        // Segarkan token auth store agar data lokal membaca status terbaru
        await pb.collection('users').authRefresh();

        // 👈 Tampilkan alert sukses menggunakan SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Verifikasi Berhasil!',
            text: 'Data Anda telah disimpan. Membuka halaman utama...',
            timer: 2000,
            showConfirmButton: false
        });

        setTimeout(() => {
            navigate('/'); // Logika router Anda akan otomatis mengarahkan ke halaman tujuan sesuai role
        }, 2000);

        } catch (err) {
        // 👈 Tampilkan alert error jika proses gagal
        Swal.fire({
            icon: 'error',
            title: 'Verifikasi Gagal',
            text: err.message || 'Gagal melakukan verifikasi data.',
            confirmButtonColor: '#d33'
        });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-md border border-gray-100">
            
            <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Verifikasi Identitas</h2>
            <p className="mt-2 text-sm text-gray-600">
                Lengkapi data diri Anda sebelum mengakses halaman utama.
            </p>
            </div>

            <form className="space-y-5" onSubmit={handleVerify}>
            {/* Pilihan Tipe Identitas */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saya mendaftar sebagai:</label>
                <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setRoleType('siswa')}
                    className={`py-3 text-sm font-semibold rounded-lg border text-center transition-all ${
                    roleType === 'siswa'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    🎓 Siswa
                </button>
                <button
                    type="button"
                    onClick={() => setRoleType('guru')}
                    className={`py-3 text-sm font-semibold rounded-lg border text-center transition-all ${
                    roleType === 'guru'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    👨‍🏫 Guru
                </button>
                </div>
            </div>

            {/* Input Nomor Induk */}
            <div>
                <label htmlFor="nomor_induk" className="block text-sm font-medium text-gray-700">
                {roleType === 'siswa' ? 'NIS' : 'NIP'}
                </label>
                <input
                id="nomor_induk"
                type="text"
                required
                value={nomorInduk}
                onChange={(e) => setNomorInduk(e.target.value)}
                min={roleType === 'siswa' ? 10 : 18}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder={roleType === 'siswa' ? 'Contoh: 222310123' : 'Contoh: 19850312...'}
                />
            </div>

            {/* Tombol Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
                {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            </button>
            </form>

        </div>
        </div>
    );
}
