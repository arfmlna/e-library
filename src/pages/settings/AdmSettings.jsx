import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CirculationForm from './CirculationForm';
import CloudStorageInfo from './CloudStorageInfo';
import SystemBackupSetting from './SystemBackupSetting';
import { fetchLibrarySettings, updateLibrarySettings } from '@/utils/fetchLibrarySetting';
import UsersSettings from './UsersSettings';
import Swal from 'sweetalert2';
import AccessSettings from './AccessSettings';

export default function AdmSettings() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('sirkulasi'); // state penanganan ganti tab aktif

    const [formData, setFormData] = useState({
        max_borrow: 3,
        borrow_duration: 7,
        penalty_fee: 1000,
        fee_damage: 15000,
        fee_lost: 50000,
        extend_limit: 2,
        allow_offline_download: true,
        auto_lock_account: true,
        max_upload_size: '20',
        auto_backup: true,
        backup_schedule: 'sunday'
    });

    const { data: serverSettings, isLoading } = useQuery({
        queryKey: ['librarySettings'],
        queryFn: fetchLibrarySettings,
    });

    useEffect(() => {
        if (serverSettings) {
        setFormData({
            max_borrow: serverSettings.max_borrow,
            borrow_duration: serverSettings.borrow_duration,
            penalty_fee: serverSettings.penalty_fee,
            fee_damage: serverSettings.fee_damage,
            fee_lost: serverSettings.fee_lost,
            extend_limit: serverSettings.extend_limit,
            allow_offline_download: serverSettings.allow_offline_download,
            auto_lock_account: serverSettings.auto_lock_account,
            max_upload_size: serverSettings.max_upload_size,
            auto_backup: serverSettings.auto_backup,
            backup_schedule: serverSettings.backup_schedule,
        });
        }
    }, [serverSettings]);

    const mutation = useMutation({
        mutationFn: updateLibrarySettings,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['librarySettings'] });
        Swal.fire({
            icon: 'success',
            title: 'Settings',
            text: 'Konfigurasi panel admin berhasil diperbarui!'
        })
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'settings',
                text: 'Terjadi kesalahan, gagal memperbarui konfigurasi.'
            })
        }
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!serverSettings?.id) return alert("Data belum siap atau tidak ditemukan.");
        mutation.mutate({ id: serverSettings.id, data: formData });
    };

    if (isLoading) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-base-100 text-base-content">
            <div className="mb-6">
                <h1 className="text-2xl font-black">⚙️ Pengaturan Panel Admin</h1>
                <p className="text-sm text-base-content/60">Kelola operasional perpustakaan digital, aturan sirkulasi, dan integrasi data.</p>
            </div>

            {/* Kontrol Navigasi Tab DaisyUI */}
            <div role="tablist" className="tabs tabs-boxed mb-6 bg-base-200">
                <button type="button" onClick={() => setActiveTab('umum')} className={`tab ${activeTab === 'umum' ? 'tab-active' : ''}`}>Umum & Profil</button>
                <button type="button" onClick={() => setActiveTab('sirkulasi')} className={`tab ${activeTab === 'sirkulasi' ? 'tab-active' : ''}`}>Aturan Sirkulasi</button>
                <button type="button" onClick={() => setActiveTab('hak_akses')} className={`tab ${activeTab === 'hak_akses' ? 'tab-active' : ''}`}>Hak Akses & Pengguna</button>
                <button type="button" onClick={() => setActiveTab('sistem')} className={`tab ${activeTab === 'sistem' ? 'tab-active' : ''}`}>Sistem</button>
            </div>

            <form onSubmit={handleSave}>
                {/* Menyembunyikan/menampilkan form secara dinamis berdasarkan tab yang dipilih admin */}
                {activeTab === 'sirkulasi' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <CirculationForm formData={formData} onChange={handleInputChange} />
                        <div className="my-6"></div>
                        <AccessSettings formData={formData} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-6">
                        <CloudStorageInfo value={formData.max_upload_size} onChange={handleInputChange} />
                        <SystemBackupSetting autoBackup={formData.auto_backup} backupSchedule={formData.backup_schedule} onChange={handleInputChange} />
                    </div>
                </div>
                )}

                {activeTab === 'umum' && (
                    <UsersSettings />
                )}
                {activeTab === 'hak_akses' && (
                    <AccessSettings formData={formData} onChange={handleInputChange} />
                )}
                {activeTab === 'sistem' && (
                    <div className="grid grid-cols-2 gap-6">
                        <CloudStorageInfo value={formData.max_upload_size} onChange={handleInputChange} />
                        <SystemBackupSetting autoBackup={formData.auto_backup} backupSchedule={formData.backup_schedule} onChange={handleInputChange} />
                    </div>
                )}
                
                {/* Tombol Aksi Simpan Global */}
                {(activeTab !== 'umum') && (
                <div className="flex justify-end mt-4">
                    <button type="submit" disabled={mutation.isPending} className="btn btn-primary px-8">
                    {mutation.isPending ? "Menyimpan..." : "Simpan Semua Konfigurasi"}
                    </button>
                </div>
                )}
            </form>
        </div>
    );
}
