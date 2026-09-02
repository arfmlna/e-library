import React from 'react';
import { FaUserCheck } from 'react-icons/fa';

export default function TokenRequestForm({ 
    email, setEmail, 
    nomorInduk, setNomorInduk, 
    attempts, onSubmit, loading 
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-2">
                    <FaUserCheck size={22} />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Minta Token Pemulihan</h1>
                <p className="text-xs opacity-70 mt-1">Verifikasi identitas sekolah Anda untuk membuat token keamanan instan.</p>
                {attempts > 0 && (
                    <div className="badge badge-error badge-sm gap-1 mt-2 font-semibold">
                        ⚠️ Percobaan Salah: {attempts}/3
                    </div>
                )}
            </div>

            <div className="fieldset p-0">
                <label className="fieldset-legend font-semibold text-base-content/80">Alamat Email Terdaftar</label>
                <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={attempts >= 3}
                    placeholder="nama@email.com" 
                    className="input input-bordered w-full text-sm mt-1 focus:input-primary"
                />
            </div>

            <div className="fieldset p-0">
                <label className="fieldset-legend font-semibold text-base-content/80">Nomor Induk (NIS / NIP)</label>
                <input 
                    type="text" 
                    required 
                    value={nomorInduk} 
                    onChange={(e) => setNomorInduk(e.target.value)} 
                    disabled={attempts >= 3}
                    placeholder="Masukkan nomor identitas Anda" 
                    className="input input-bordered w-full text-sm mt-1 focus:input-primary"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading || attempts >= 3} 
                className="btn btn-primary w-full font-bold shadow-md mt-2"
            >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Dapatkan Token Pemulihan'}
            </button>
        </form>
    );
}
