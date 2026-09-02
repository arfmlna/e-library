import { logs } from '@/constants/logs';
import { pb } from '@/utils/pocketbase';
import React, { useState } from 'react';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 👈 1. Import SweetAlert2

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleManualSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Konfirmasi password tidak cocok.',
                confirmButtonColor: '#3085d6'
            });
            setLoading(false);
            return;
        }

        Swal.showLoading();

        try {
        const res = await pb.collection('users').create({
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            name: formData.name,
            role: "users",
            status: 'unverified'
        });

        await pb.collection('users').authWithPassword(formData.email, formData.password);

        logs(res.record.id, 'register', 'password')
        
        // 👈 Alert Sukses jika pendaftaran berhasil
        Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: 'Akun Anda telah dibuat. Mengalihkan ke halaman verifikasi...',
            timer: 2000,
            showConfirmButton: false
        });

        setTimeout(() => {
            window.location.href = "/"
        }, 2000);

        } catch (err) {
            console.log(err.originalError)
            // Menangkap pesan error dari PocketBase
            const errorData = err.data?.data;
            let msg = err.message || 'Gagal mendaftar.';
            
            if (errorData) {
                msg = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${value.message}`)
                .join(', ');
            }

            // 👈 Alert Error dari server
            Swal.fire({
                icon: 'error',
                title: 'Registrasi Gagal',
                text: msg,
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        Swal.showLoading();

        try {
            const authData = await pb.collection('users').authWithOAuth2({ 
                provider: 'google',
                createData: {
                    role: 'users',
                    status: 'unverified'
                }
            });

            logs(authData.record.id, 'register', 'google')

            Swal.fire({
                icon: 'success',
                title: 'Masuk dengan Google Sukses!',
                text: 'Mengalihkan ke halaman verifikasi...',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                window.location.href = "/"
            }, 2000);

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'OAuth Gagal',
                text: err.message || 'Gagal masuk dengan Google.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <button 
                onClick={() => navigate('/home')} 
                className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                <FaArrowLeft size={16} /> {/* Ganti dengan icon panah Anda (misal Lucide / React Icons) */}
                <span>Kembali</span>
            </button>
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-md">
                
                <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Mulai Akun Baru</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <button onClick={() => navigate('/sign-in')} className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-0 cursor-pointer">
                    Masuk di sini
                    </button>
                </p>
                </div>

                <div>
                <button
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <FaGoogle size={24} className='text-blue-500' />
                    Daftar dengan Google
                </button>
                </div>

                <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <span className="relative bg-white px-3 text-xs uppercase text-gray-400">atau email</span>
                </div>

                <form className="space-y-4" onSubmit={handleManualSignUp}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="John Doe" autoComplete='name' />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="nama@email.com" autoComplete='email' />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Minimal 8 karakter" autoComplete='new-password' />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <input type="password" name="passwordConfirm" required value={formData.passwordConfirm} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Ulangi password" autoComplete='new-password' />
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                    {loading ? 'Memproses...' : 'Buat Akun'}
                </button>
                </form>

            </div>
        </div>
    );
}
