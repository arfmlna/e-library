import { pb } from '@/utils/pocketbase';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate()
    
    const checkStrength = (pass) => {
        let score = 0;
        if (!pass) return { score, text: "Belum diisi", color: "bg-base-300", textColor: "text-base-content/40" };

        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) {
            return { score: 1, text: "Lemah ❌", color: "bg-error", textColor: "text-error" };
        } else if (score <= 3) {
            return { score: 2, text: "Sedang ⚠️", color: "bg-warning", textColor: "text-warning" };
        } else {
            return { score: 3, text: "Sangat Kuat 🔥", color: "bg-success", textColor: "text-success" };
        }
    };

    const { currentPassword, password, confirmPassword } = formData;
    const strength = checkStrength(password);
    const isMatch = password === confirmPassword;
    const isFormInvalid = strength.score < 2 || !isMatch || !currentPassword.trim();

    const mutation = useMutation({
        mutationFn: async (data) => {
            const currentUser = pb.authStore.record;
            if (!currentUser) {
                throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
            }

            const userIdentifier = currentUser.email || currentUser.username;

            const updateData = {
                oldPassword: data.currentPassword,
                password: data.password,
                passwordConfirm: data.confirmPassword,
            };
            const updateRecord = await pb.collection('users').update(currentUser.id, updateData);
            
            await pb.collection('users').authWithPassword(userIdentifier, data.password);
            
            return updateRecord
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Kata sandi akun e-library Anda telah diperbarui.',
                confirmButtonColor: '#570df8',
                timer: 3000,
                timerProgressBar: true
            });
            
            setFormData({ currentPassword: '', password: '', confirmPassword: '' });
            navigate('/setting')
        },
        onError: (error) => {
            const errorMessage = error?.response?.message || error.message || "Gagal memperbarui kata sandi.";
            
            Swal.fire({
                icon: 'error',
                title: 'Gagal Mengubah Sandi',
                text: errorMessage,
                confirmButtonColor: '#ef4444'
            });
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isFormInvalid) return;
    
        mutation.mutate(formData);
    }

    return (
        <div className="w-full flex flex-col justify-center items-center px-4 min-[50vh] mt-5 md:mt-0">
        <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 mb-10">
            <div className="card-body p-6 md:p-8">
            <div className="flex items-center gap-3 border-b border-base-300 pb-4 mb-6">
                <div className="p-2 bg-primary/10 text-primary dark:text-white dark:bg-gray-700 rounded-lg">
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                </div>
                <div>
                <h2 className="text-lg font-bold tracking-wide">Ubah Kata Sandi</h2>
                <p className="text-xs text-base-content/60">Amankan akun e-library Anda secara berkala.</p>
                </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-semibold text-sm">Kata Sandi Saat Ini</span>
                </label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Masukkan kata sandi lama" 
                    className="input input-bordered w-full focus:input-primary transition-all duration-200"
                    value={currentPassword}
                    onChange={handleChange}
                    name="currentPassword"
                    autoComplete='current-password'
                    required
                />
                </div>
                <div className="divider my-1 opacity-50"></div>
                <div className="form-control w-full">
                    <label className="label py-1">
                        <span className="label-text font-semibold text-sm">Kata Sandi Baru</span>
                    </label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Minimal 8 karakter, kombinasi huruf & angka" 
                        className="input input-bordered w-full focus:input-primary transition-all duration-200"
                        value={password}
                        onChange={handleChange}
                        name="password"
                        autoComplete='new-password'
                        required
                    />
                    <div className="flex gap-1 mt-2 px-1">
                        <div className={`h-1.5 w-1/3 rounded-full transition-all duration-300 ${password ? strength.color : 'bg-base-300'}`}></div>
                        <div className={`h-1.5 w-1/3 rounded-full transition-all duration-300 ${password && strength.score >= 2 ? strength.color : 'bg-base-300'}`}></div>
                        <div className={`h-1.5 w-1/3 rounded-full transition-all duration-300 ${password && strength.score === 3 ? strength.color : 'bg-base-300'}`}></div>
                    </div>
                    <label className="label py-0.5">
                        <span className={`text-xs font-bold transition-all duration-300 ${strength.textColor}`}>
                        Kekuatan Sandi: {strength.text}
                        </span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label py-1">
                        <span className="label-text font-semibold text-sm">Konfirmasi Kata Sandi Baru</span>
                    </label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Ulangi kata sandi baru" 
                        className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${
                            confirmPassword && !isMatch ? 'input-error' : ''
                        }`}
                        value={confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                        autoComplete='new-password'
                        required
                    />
                    {confirmPassword && !isMatch && (
                        <label className="label py-0.5 mt-1">
                        <span className="text-xs text-error font-medium">❌ Kata sandi tidak cocok!</span>
                        </label>
                    )}
                </div>
                <div className="form-control pt-1">
                <label className="label cursor-pointer justify-start gap-3 p-0">
                    <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary checkbox-sm rounded" 
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    />
                    <span className="label-text text-sm select-none">Tampilkan kata sandi</span>
                </label>
                </div>
                <div className="card-actions flex flex-col sm:flex-row gap-2 pt-4 border-t border-base-300 mt-6">
                <button 
                type="button" 
                className="btn btn-ghost btn-sm sm:btn-md flex-1 order-2 sm:order-1"
                onClick={() => navigate(-1)}
                disabled={mutation.isPending}>
                    Batal
                </button>
                <button 
                type="submit" 
                className="btn btn-primary btn-sm sm:btn-md flex-1 order-1 sm:order-2"
                disabled={isFormInvalid || mutation.isPending}>
                    {mutation.isPending ? <span className="loading loading-spinner loading-sm"></span> : "Perbarui Sandi"}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
}
