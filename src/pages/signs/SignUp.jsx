import { logs } from '@/constants/logs';
import { pb } from '@/utils/pocketbase';
import React, { useRef, useState } from 'react';
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
    const popupRef = useRef(null);
    const popupCheckRef = useRef(null);
    const cancelledRef = useRef(false);

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
                status: 'unverified',
            });

            const authData = await pb.collection('users').authWithPassword(formData.email, formData.password);

            logs(
                authData.record.id, 
                authData.meta?.isNew ? 'register' : 'login', 
                'google'
            );
            
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
            if (import.meta.env.DEV) {       
                console.log(err.originalError)
            }
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
        cancelledRef.current = false;

        Swal.fire({
            title: 'Menghubungkan ke Google...',
            text: 'Silakan pilih akun Google Anda.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const authPromise = pb.collection('users').authWithOAuth2({
                provider: 'google',
                createData: {
                    role: 'users',
                    status: 'unverified'
                },
                urlCallback: (rawUrl) => {
                    const url = new URL(rawUrl);
                    url.searchParams.set('prompt', 'select_account');

                    const width = 600, height = 700;
                    const left = window.screenX + (window.outerWidth - width) / 2;
                    const top = window.screenY + (window.outerHeight - height) / 2;

                    popupRef.current = window.open(
                        url.toString(),
                        'GoogleLogin',
                        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                    );

                    if (!popupRef.current) throw new Error('popup_blocked');

                    
                    popupCheckRef.current = setInterval(() => {
                        if (popupRef.current?.closed) {
                            clearInterval(popupCheckRef.current);
                            popupCheckRef.current = null;

                            setTimeout(() => {
                                if (!pb.authStore.isValid) {
                                    cancelledRef.current = true;
                                    Swal.close();

                                    Swal.fire({
                                        title: 'Login Dibatalkan',
                                        text: 'Anda menutup pemilihan akun Google.',
                                        icon: 'info',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            }, 1500);
                        }
                    }, 500);
                }
            });

            const authData = await authPromise;

            clearInterval(popupCheckRef.current);
            popupCheckRef.current = null;

            if (authData?.token) {
                cancelledRef.current = false;
                logs(
                    authData.record.id, 
                    authData.meta?.isNew ? 'register' : 'login', 
                    'google'
                );
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
                return;
            }

            if (cancelledRef.current) return;
        } catch (error) {
            clearInterval(popupCheckRef.current);
            popupCheckRef.current = null;

            if (cancelledRef.current) return;

            const message = String(error.message || '').toLowerCase();
            const cancelled = error.isAbort || message.includes('cancel') || message.includes('closed');

            Swal.fire({
                title: cancelled ? 'Login Dibatalkan' : 'Error',
                text: cancelled
                    ? 'Anda membatalkan login Google.'
                    : message.includes('popup_blocked')
                        ? 'Popup diblokir browser. Izinkan popup untuk situs ini.'
                        : 'Login Account Gagal ❌',
                icon: cancelled ? 'info' : 'error',
                confirmButtonText: 'OK'
            });
            if (import.meta.env.DEV) {       
                console.error(error);
            }
        } finally {
            clearInterval(popupCheckRef.current);
            popupCheckRef.current = null;
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
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black" placeholder="John Doe" autoComplete='name' />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black" placeholder="nama@email.com" autoComplete='email' />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black" placeholder="Minimal 8 karakter" autoComplete='new-password' />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <input type="password" name="passwordConfirm" required value={formData.passwordConfirm} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black" placeholder="Ulangi password" autoComplete='new-password' />
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                    {loading ? 'Memproses...' : 'Buat Akun'}
                </button>
                </form>

            </div>
        </div>
    );
}
