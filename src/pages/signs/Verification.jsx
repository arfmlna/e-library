import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UserStatusHeader from './UserStatusHeader';
import RoleSelector from './RoleSelector';
import ActionButtons from './ActionButtons';
import { pb } from '@/utils/pocketbase';
import { validateFileSize } from '@/constants/validationFileSize';
import { getSettings } from '@/utils/settings';

export default function Verification() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [roleType, setRoleType] = useState('student');
    const [nomorInduk, setNomorInduk] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [settings, setSettings] = useState(null);
    
    const userId = pb.authStore.record.id
    
    useEffect(() => {
        getSettings().then(setSettings);
    }, []);

    const { data: infoVerif, refetch } = useQuery({
        queryKey: ['infoVerif', userId],
        queryFn: async () => {
            try {
                const [userRes, verifRes] = await Promise.all([
                    pb.collection('users').getOne(userId, {
                        fields: 'status'
                    }),
                    pb.collection('verification').getFirstListItem(`users = "${userId}"`, {
                        fields: 'no_identity,users_type,proof_identity'
                    }).catch(() => null)
                ]);

                return {
                    status: userRes?.status || 'unverified',
                    no_identity: verifRes?.no_identity || '',
                    users_type: verifRes?.users_type || 'student',
                    proof_identity: verifRes?.proof_identity || null,
                };

            } catch (error) {
                if (import.meta.env.DEV) {       
                    console.error("Gagal mengambil data infoVerif:", error);
                }
                throw error;
            }
        },
        enabled: !!userId,
    });

    useEffect(() => {
        if (infoVerif) {
            if (infoVerif.users_type) setRoleType(infoVerif.users_type.toLowerCase());
            if (infoVerif.no_identity) setNomorInduk(infoVerif.no_identity);
        }
    }, [infoVerif]);

    const isAlreadySubmitted = !!infoVerif?.no_identity;

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        Swal.showLoading();

        try {
            const verifFormData = new FormData();
            verifFormData.append('users_type', roleType);
            verifFormData.append('no_identity', nomorInduk);
            verifFormData.append('users', userId); 

            if (documentFile) {
                verifFormData.append('proof_identity', documentFile);
            }

            let verifRecord;
            try {
                verifRecord = await pb.collection('verification').getFirstListItem(`users = "${userId}"`);
            } catch {
                verifRecord = null;
            }

            await Promise.all([
                pb.collection('users').update(userId, {
                    status: 'process'
                }),

                verifRecord 
                    ? pb.collection('verification').update(verifRecord.id, verifFormData)
                    : pb.collection('verification').create(verifFormData)
            ]);

            Swal.fire({
                icon: 'success',
                title: 'Data Terkirim!',
                text: 'Pengajuan Anda sukses dikirim dan siap ditinjau admin.',
                timer: 2000,
                showConfirmButton: false
            });

            queryClient.invalidateQueries(['infoVerif', userId]);

        } catch (err) {
            if (import.meta.env.DEV) {       
                console.error("Detail Error:", err.originalError || err);
            }
            
            const errorData = err.data?.data;
            let errorMsg = err.message || 'Terjadi gangguan sistem.';
            if (errorData) {
                errorMsg = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${value.message}`)
                    .join(', ');
            }

            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: errorMsg,
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshStatus = async () => {
        Swal.fire({ 
            title: 'Memperbarui Status...', 
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading() 
        });

        try {
            await pb.collection('users').authRefresh();

            await refetch();

            Swal.fire({
                icon: 'success',
                title: 'Status Diperbarui',
                text: 'Data akun Anda telah disinkronkan dengan server.',
                timer: 1500,
                showConfirmButton: false
            });

            window.location.href = '/'

        } catch (err) {
            if (import.meta.env.DEV) {       
                console.error("Gagal refresh session:", err);
            }
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui',
                text: err.message || 'Sesi Anda mungkin telah berakhir. Silakan login ulang.',
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleLogoutAccount = () => {
        pb.authStore.clear();
        window.location.reload();
    };

    const handleFile = (e) => {
        const file = e.target.files[0]
        const validation = validateFileSize(file, settings?.max_upload_size); 
        if (validation.isValid) {
            setDocumentFile(e.target.files[0])
        } else {
            setDocumentFile(null)
            Swal.fire({
                icon: 'error',
                text: validation.error
            })
        }
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-12 text-base-content transition-colors duration-300 relative">
            <div className="w-full max-w-md bg-base-100 p-6 md:p-8 rounded-2xl shadow-xl border border-base-300 space-y-6">
                
                {/* 1. Komponen Sub-Header Status */}
                <UserStatusHeader infoVerif={infoVerif} isAlreadySubmitted={isAlreadySubmitted} />

                <form className="space-y-5" onSubmit={handleVerify}>
                    
                    {/* 2. Komponen Seleksi Peran */}
                    <RoleSelector roleType={roleType} setRoleType={setRoleType} />

                    {/* 3. Input Text Nomor Induk */}
                    <div className="fieldset p-0">
                        <label htmlFor="nomor_induk" className="fieldset-legend font-semibold text-base-content/80 select-none">
                            {roleType === 'student' ? 'NIS (Nomor Induk Siswa)' : 'NIP (Nomor Induk Pegawai)'}
                        </label>
                        <input
                            id="nomor_induk"
                            type="text"
                            required
                            value={nomorInduk}
                            onChange={(e) => setNomorInduk(e.target.value)}
                            minLength={roleType === 'student' ? 10 : 18}
                            className="mt-1 input input-bordered w-full focus:input-primary text-sm font-medium tracking-wide shadow-sm"
                            placeholder={roleType === 'student' ? 'Contoh: 222310123' : 'Contoh: 19850312...'}
                        />
                    </div>

                    {/* 4. Input File Bukti Identitas */}
                    <div className="fieldset p-0">
                        <label htmlFor="bukti_identitas" className="fieldset-legend font-semibold text-base-content/80 select-none">
                            {roleType === 'student' ? 'Foto Kartu Pelajar (Bukti Identitas)' : 'Foto SK Pengangkatan / Kartu Guru'}
                        </label>
                        <input
                            id="bukti_identitas"
                            type="file"
                            accept="image/*"
                            required={!isAlreadySubmitted}
                            onChange={handleFile}
                            className="file-input file-input-bordered file-input-primary w-full mt-1 text-sm shadow-sm"
                        />
                        <span className="fieldset-label opacity-60 mt-1 text-[11px]">
                            {isAlreadySubmitted 
                                ? "Kosongkan jika tidak ingin mengubah dokumen bukti identitas yang sudah diunggah." 
                                : "Format wajib: PNG, JPG, JPEG (Maks. 5MB)"}
                        </span>
                    </div>

                    {/* 5. Tombol Submit Utama */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn w-full font-bold shadow-md disabled:opacity-50 text-white tracking-wide ${
                                isAlreadySubmitted ? 'btn-secondary' : 'btn-primary'
                            }`}
                        >
                            {loading ? (
                                <><span className="loading loading-spinner loading-xs"></span> Memproses...</>
                            ) : isAlreadySubmitted ? (
                                'Perbarui Data Verifikasi'
                            ) : (
                                'Simpan & Lanjutkan'
                            )}
                        </button>
                    </div>

                    {/* 6. Komponen Tombol Utilitas Bawah */}
                    <ActionButtons onRefresh={handleRefreshStatus} onLogout={handleLogoutAccount} />
                    
                </form>
            </div>
        </div>
    );
}
