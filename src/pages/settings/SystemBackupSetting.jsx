import { pb } from '@/utils/pocketbase';
import React from 'react';
import Swal from 'sweetalert2';

export default function SystemBackupSetting({ autoBackup, backupSchedule, onChange }) {
    const handleManualBackup = async () => {
        Swal.fire({ 
            title: 'Membackup...', 
            html: `Sistem sedang mencadangkan database ke PocketBase backup store...`,
            allowOutsideClick: false, 
            didOpen: () => Swal.showLoading() 
        });
        try {
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '_');
            const backupName = `backup_${dateStr}.zip`;

            return await pb.backups.create(backupName);
        } catch (error) {
            if (import.meta.env.DEV) {       
                console.error("Gagal melakukan backup via PocketBase SDK:", error);
            }
            throw error;
        }
    };

    return (
        <div className="card bg-base-200/50 shadow-sm">
            <div className="card-body p-5">
                <h2 className="card-title text-sm font-bold uppercase tracking-wider">Pencadangan Sistem</h2>
                <p className="text-xs text-base-content/60">Amankan database katalog buku dan data pengguna secara berkala.</p>
                <div className="form-control mt-2">
                <label className="label cursor-pointer p-0 py-1">
                    <span className="label-text text-sm">Backup Otomatis</span>
                    <input type="checkbox" name="auto_backup" className="toggle toggle-xs toggle-success" checked={autoBackup} onChange={onChange} />
                </label>
                </div>
                <select name="backup_schedule" className="select select-bordered select-xs w-full mt-1" value={backupSchedule} onChange={onChange}>
                <option value="Setiap Minggu (Hari Minggu)">Setiap Minggu (Hari Minggu)</option>
                <option value="Setiap Bulan">Setiap Bulan</option>
                </select>
                <button type="button" onClick={handleManualBackup} className="btn btn-outline btn-xs btn-neutral w-full mt-3">
                    Cadangkan Manual Sekarang
                </button>
            </div>
        </div>
    );
}
