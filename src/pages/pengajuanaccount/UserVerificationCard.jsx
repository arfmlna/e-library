import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

export default function UserVerificationCard({ user, fileUrl, onApprove, onReject }) {
    const [rejectReason, setRejectReason] = useState('');

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!rejectReason.trim()) return;
        onReject(user.id, user.verifId, rejectReason);
        setRejectReason('');
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-primary/40">
            
            {/* Informasi User */}
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl hidden sm:block 
                    ${user.users_type === 'teacher' ? 
                    'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                    {user?.users_type === 'teacher' ? 
                    <FaChalkboardTeacher size={24} /> : <FaUserGraduate size={24} />}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg leading-tight">{user.name || 'No Name'}</h3>
                        <span className={`badge badge-sm font-semibold capitalize ${user.users_type === 'teacher' ? 'badge-success' : 'badge-info'}`}>
                            {user.users_type}
                        </span>
                    </div>
                    <p className="text-xs opacity-60 font-mono">{user.email}</p>
                    <div className="text-sm pt-1">
                        <span className="opacity-70">{user.users_type === 'student' ? 'NIS: ' : 'NIP/NUPTK: '}</span>
                        <span className="font-mono font-bold bg-base-200 px-2 py-0.5 rounded text-xs">{user.no_identity}</span>
                    </div>
                </div>
            </div>

            {/* Berkas & Tombol Aksi */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 justify-end">
                {/* Thumbnail Preview */}
                {user.proof_identity && (
                    <div className="avatar relative group">
                        <div className="w-12 h-12 rounded-xl border border-base-300 relative overflow-hidden">
                            <img src={fileUrl} alt="Bukti Identitas" className="object-cover w-full h-full" />
                            {/* Overlay Klik Preview yang melebar ke parent */}
                            <button 
                                onClick={() => onApprove(user.verifRecord, true)} // Gunakan flag true untuk trigger modal preview di parent
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                type="button"
                            >
                                <FaEye size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Tombol Setuju */}
                <button 
                    onClick={() => onApprove(user, false)} 
                    className="btn btn-success btn-sm font-bold text-white shadow-sm flex-1 sm:flex-initial"
                >
                    <FaCheck /> Setujui
                </button>

                {/* Dropdown Tolak */}
                <div className="dropdown dropdown-end flex-1 sm:flex-initial">
                    <button tabIndex={0} className="btn btn-error btn-outline btn-sm font-bold w-full">
                        <FaTimes /> Tolak
                    </button>
                    <div tabIndex={0} className="dropdown-content z-50 card card-compact bg-base-100 w-72 p-4 shadow-2xl border border-base-300 mt-2">
                        <form onSubmit={handleRejectSubmit} className="space-y-3">
                            <h4 className="font-bold text-sm text-error">Alasan Penolakan:</h4>
                            <textarea 
                                className="textarea textarea-bordered w-full text-xs font-medium focus:textarea-error" 
                                placeholder="Contoh: Foto kartu pelajar buram..."
                                rows="3"
                                required
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <button type="submit" className="btn btn-error btn-sm w-full font-bold text-white">
                                Kirim Penolakan
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
