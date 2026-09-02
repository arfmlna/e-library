import React from 'react';
import { FaKey, FaShieldAlt } from 'react-icons/fa';

export default function PasswordResetForm({
    inputToken, setInputToken,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    onSubmit, loading
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-success/10 text-success flex items-center justify-center rounded-xl mb-2">
                    <FaKey size={20} />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Setel Ulang Sandi</h1>
                <p className="text-xs opacity-70 mt-1">Lengkapi kolom token beserta sandi baru akun Anda.</p>
            </div>

            {/* Input Masukkan Token */}
            <div className="fieldset p-0">
                <label className="fieldset-legend font-bold text-secondary flex items-center gap-1">
                    <FaShieldAlt size={12} /> Masukkan Token Anda
                </label>
                <input 
                    type="text" 
                    required 
                    maxLength={6} 
                    value={inputToken} 
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="Contoh: 593104" 
                    className="input input-bordered w-full font-mono text-center tracking-widest text-lg font-bold mt-1 border-secondary focus:input-secondary"
                />
            </div>

            <div className="fieldset p-0">
                <label className="fieldset-legend font-semibold text-base-content/80">Kata Sandi Baru</label>
                <input 
                    type="password" 
                    required 
                    minLength={8} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter" 
                    className="input input-bordered w-full text-sm mt-1 focus:input-primary"
                />
            </div>

            <div className="fieldset p-0">
                <label className="fieldset-legend font-semibold text-base-content/80">Ulangi Kata Sandi Baru</label>
                <input 
                    type="password" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi text sandi" 
                    className="input input-bordered w-full text-sm mt-1 focus:input-primary"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-success text-white w-full font-bold shadow-md mt-2"
            >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Ubah & Perbarui Sandi'}
            </button>
        </form>
    );
}
