import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import TokenRequestForm from './TokenRequestForm';
import PasswordResetForm from './PasswordResetForm';
import { pb } from '@/utils/pocketbase';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // States Data
    const [email, setEmail] = useState('');
    const [nomorInduk, setNomorInduk] = useState('');
    const [generatedToken, setGeneratedToken] = useState('');
    const [inputToken, setInputToken] = useState('');
    const [userId, setUserId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        const savedAttempts = localStorage.getItem('reset_attempts');
        if (savedAttempts) {
            setAttempts(parseInt(savedAttempts, 10));
        }
    }, []);

    const incrementAttempts = () => {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        localStorage.setItem('reset_attempts', nextAttempts.toString());
        return nextAttempts;
    };

    const handleGetTokenSubmit = async (e) => {
        e.preventDefault();

        if (attempts >= 3) {
            Swal.fire({
                icon: 'error',
                title: 'Akses Diblokir',
                text: 'Anda telah salah melakukan percobaan sebanyak 3 kali. Silakan hubungi Admin sekolah.',
                confirmButtonColor: '#d33'
            });
            return;
        }


        setLoading(true);
        Swal.showLoading();

        try {
            const userRecord = await pb.collection('check_email').getFirstListItem("", {
                query: {
                    email: email.trim()
                }
            })
            
            if (!userRecord) {
                throw new Error("Data tidak cocok.");
            }

            const verifRecord = await pb.collection('verification').getFirstListItem(`users = "${userRecord.id}"`);

            if (verifRecord.no_identity !== nomorInduk) {
                throw new Error("Nomor induk tidak cocok.");
            }

            const secureToken = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedToken(secureToken);
            setUserId(userRecord.id);

            await Swal.fire({
                icon: 'success',
                title: 'Identitas Diverifikasi!',
                html: `<p class="text-sm">Berikut adalah token keamanan reset Anda:</p>
                        <b class="text-3xl text-primary font-mono tracking-widest block my-3 bg-gray-200 py-2 rounded">${secureToken}</b>
                        <p class="text-xs text-error font-semibold">Catat token ini. Jangan berikan kepada siapapun!</p>`,
                confirmButtonText: 'Lanjutkan ke Reset Sandi',
                confirmButtonColor: '#3085d6'
            }); 

            setStep(2);

        } catch (err) {
            if (import.meta.env.DEV) {       
                console.error(err.originalError);
            }
            const currentFailCount = incrementAttempts();
            Swal.fire({
                icon: 'error',
                title: 'Verifikasi Gagal',
                text: `Data tidak cocok. Sisa percobaan Anda: ${3 - currentFailCount} kali.`,
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetWithTokenSubmit = async (e) => {
        e.preventDefault();

        if (attempts >= 3) {
            Swal.fire({ icon: 'error', title: 'Diblokir', text: 'Akses Anda terkunci.' });
            return;
        }

        if (inputToken !== generatedToken) {
            const currentFailCount = incrementAttempts();
            Swal.fire({
                icon: 'error',
                title: 'Token Salah!',
                text: `Token keamanan tidak sesuai. Sisa percobaan Anda: ${3 - currentFailCount} kali.`,
                confirmButtonColor: '#d33'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: 'Konfirmasi password baru tidak cocok.' });
            return;
        }

        setLoading(true);
        Swal.showLoading();

        try {
            await pb.collection('users').update(userId, {
                password: newPassword,
                passwordConfirm: confirmPassword
            });

            // Bersihkan batasan limit percobaan karena sudah sukses masuk
            localStorage.removeItem('reset_attempts');

            await Swal.fire({
                icon: 'success',
                title: 'Sukses Ubah Sandi!',
                text: 'Kata sandi akun Anda berhasil diperbarui. Silakan masuk kembali.',
                confirmButtonColor: '#3085d6'
            });

            navigate('/sign-in');

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Sistem',
                text: err.message || 'Gagal mengubah kata sandi.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-12 text-base-content relative">
            
            {/* Tombol Navigasi Kembali */}
            <button 
                onClick={() => step === 2 ? setStep(1) : navigate('/sign-in')} 
                className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
                <FaArrowLeft size={16} />
                <span>{step === 2 ? 'Kembali' : 'Batal'}</span>
            </button>

            {/* Container Box Wrapper */}
            <div className="card bg-base-100 shadow-xl border border-base-300 w-full max-w-md p-6 md:p-8 rounded-2xl">
                {step === 1 ? (
                    <TokenRequestForm 
                        email={email} setEmail={setEmail}
                        nomorInduk={nomorInduk} setNomorInduk={setNomorInduk}
                        attempts={attempts} loading={loading}
                        onSubmit={handleGetTokenSubmit}
                    />
                ) : (
                    <PasswordResetForm 
                        inputToken={inputToken} setInputToken={setInputToken}
                        newPassword={newPassword} setNewPassword={setNewPassword}
                        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                        loading={loading} onSubmit={handleResetWithTokenSubmit}
                    />
                )}
            </div>
        </div>
    );
}
