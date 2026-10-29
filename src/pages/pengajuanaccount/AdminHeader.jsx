import React from 'react';
import { FaUserShield } from 'react-icons/fa';

export default function AdminHeader({ totalPending }) {
    return (
        <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-2xl shadow border border-base-300">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 text-primary rounded-xl">
                    <FaUserShield size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Panel Verifikasi Admin</h1>
                    <p className="text-xs opacity-75">Tinjau berkas identifikasi guru dan siswa yang masuk.</p>
                </div>
            </div>
            <div className="stats shadow bg-secondary/10">
                <div className="stat py-2 px-4">
                    <div className="stat-title text-xs">Menunggu Antrean</div>
                    <div className="stat-value text-2xl text-warning">{totalPending}</div>
                </div>
            </div>
        </div>
    );
}
