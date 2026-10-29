import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// Import Komponen Anak yang sudah dibuat
import AdminHeader from './AdminHeader';
import UserVerificationCard from './UserVerificationCard';
import ImagePreviewModal from './ImagePreviewModal';
import { pb } from '@/utils/pocketbase';

export default function AdminVerificationPage() {
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: pendingUsers, isLoading } = useQuery({
        queryKey: ['adminPendingUsers'],
        queryFn: async () => {
            const records = await pb.collection('users').getFullList({
                filter: 'status = "process"',
                sort: '-updated',
                expand: 'verification_via_users', 
            });

            return records.map(user => {
                const verifData = user.expand?.verification_via_users;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    verifId: verifData?.id || null,
                    users_type: verifData?.users_type || 'student',
                    no_identity: verifData?.no_identity || '',
                    proof_identity: verifData?.proof_identity || null,
                    verifRecord: verifData || null 
                };
            });
        }
    });

    const processMutation = useMutation({
        mutationFn: async ({ userId, verifId, status, reason = '' }) => {
            if (status === 'verified') {
                return await pb.collection('users').update(userId, {
                    status: 'verified',
                });
            } 
            
            if (status === 'rejected') {
                return await Promise.all([
                    pb.collection('users').update(userId, {
                        status: 'rejected' 
                    }),
                    pb.collection('verification').update(verifId, {
                        message: reason 
                    })
                ]);
            }
        },
        onSuccess: (data, variables) => {
            Swal.fire({
                icon: 'success',
                title: variables.status === 'verified' ? 'Berhasil Diverifikasi!' : 'Pengajuan Ditolak',
                text: variables.status === 'verified' 
                    ? 'Akun pengguna telah aktif dan diverifikasi.' 
                    : 'Alasan penolakan telah disimpan di berkas verifikasi.',
                timer: 2000,
                showConfirmButton: false
            });
            
            // Segarkan antrean admin
            queryClient.invalidateQueries(['adminPendingUsers']);
        },
        onError: (err) => {
            if (import.meta.env.DEV) {       
                console.error(err.originalError);
            }
            Swal.fire({ 
                icon: 'error', 
                title: 'Gagal Memproses', 
                text: err.message || 'Terjadi kesalahan sistem.' 
            });
        }
    });

    const handleApproveOrPreview = (user, isTriggerPreview) => {
        if (isTriggerPreview) {
            setSelectedUser(user);
            setIsModalOpen(true);
        } else {
            Swal.fire({
                title: 'Verifikasi Akun?',
                text: `Setujui verifikasi untuk ${user.name}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Setujui!'
            }).then((result) => {
                if (result.isConfirmed) {
                    processMutation.mutate({ userId: user.id, status: 'verified' });
                }
            });
        }
    };

    const handleReject = (userId, verifId, reason) => {
        processMutation.mutate({ 
            userId, 
            verifId,
            status: 'rejected', 
            reason 
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 text-base-content">
            <AdminHeader totalPending={pendingUsers?.length || 0} />
            <div className="max-w-6xl mx-auto">
                {pendingUsers?.length === 0 ? (
                    <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center shadow">
                        <h3 className="text-xl font-bold">🎉 Antrean Kosong</h3>
                        <p className="text-sm opacity-60 mt-1">Tidak ada data pengguna baru saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingUsers?.map((user) => (
                            <UserVerificationCard 
                                key={user.id}
                                user={user}
                                fileUrl={pb.files.getURL(user.verifRecord, user.proof_identity)}
                                onApprove={handleApproveOrPreview}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                )}
            </div>
            {selectedUser && (
                <ImagePreviewModal 
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedUser(null); }}
                    userName={selectedUser.name}
                    fileUrl={pb.files.getURL(selectedUser, selectedUser.proof_identity)}
                />
            )}
        </div>
    );
}
