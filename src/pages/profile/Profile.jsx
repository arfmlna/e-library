import { pb } from '@/utils/pocketbase'
import React, { useEffect, useState } from 'react'
import avatarNA from '/anonim.jpg'
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { ArrowBigLeftDash, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { dateOnlyFormatted } from '@/constants/dateFormat';
import { validateFileSize } from '@/constants/validationFileSize';
import { getSettings } from '@/utils/settings';

export default function Profile() {
    const [image, setImage] = useState(null)
    const [settings, setSettings] = useState(null);
    
    const myData = pb.authStore.record
    const avatar = pb.files.getURL(myData, myData.avatar)
    const navigate = useNavigate()
    
    useEffect(() => {
        getSettings().then(setSettings);
    }, []);

    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            try {
                return await pb.collection('user_profiles').getFirstListItem(`user = "${myData.id}"`);
            } catch (error) {
                if (error.status === 404) return null; 
                throw error;
            }
        },
        enabled: !!myData?.id, 
    })
    
    const { mutate: updateAvatar, isPending } = useMutation({
        mutationFn: (newImage) => pb.collection('users').update(myData.id, { avatar: newImage }),
        onSuccess: () => {
            Swal.fire({ icon: 'success', title: 'Berhasil diubah!', timer: 1500, showConfirmButton: false });
        },
        onError: (error) => {
            Swal.fire({ icon: 'error', title: 'Gagal!', text: error.message });
        }
    });

    useEffect(() => {
        if (isPending) {
            Swal.fire({
                title: 'Sedang mengunggah...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });
        }
    }, [isPending]);

    useEffect(() => {
        if (image) {
            const validation = validateFileSize(image, settings?.max_upload_size); 
            if (validation.isValid) {
                updateAvatar(image);
            } else {
                setImage(null)
                Swal.fire({
                    icon: 'error',
                    text: validation.error
                })
            }
        }
    }, [image, updateAvatar, settings?.max_upload_size]);

    return (
        <div className="w-full pt-5 md:pt-10 flex flex-col justify-center items-center px-4 min-h-full">
            <div className="card w-full max-w-3xl bg-base-100 shadow-xl border border-base-300 mb-10 relative">
                <div className="card-body p-6 md:p-8">
                    <div className="flex justify-between items-center border-b border-base-300 pb-4 mb-6 pl-10 md:pl-5">
                        <h2 className="text-xl font-bold tracking-wide uppercase">
                            Profile
                        </h2>
                        <div className="badge badge-outline badge-sm font-bold uppercase tracking-wider">
                            { myData?.role || "User" }
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="avatar">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 shadow-inner">
                                <label htmlFor="profileImage" className="cursor-pointer">
                                    <img 
                                        className="object-cover w-full h-full rounded-2xl" 
                                        src={avatar ? avatar : avatarNA} 
                                        alt={myData?.name || "Profile"} 
                                    />
                                </label>
                                <input type="file" name="profileImage" id="profileImage" className='hidden'
                                onChange={(e) => setImage(e.target.files[0])}
                                />
                                </div>
                            </div>
                            <span className='mt-1.5'>max size : {settings?.max_upload_size}mb</span>
                            <label htmlFor="profileImage">
                                <span className="btn btn-xs btn-outline rounded-md mt-1">
                                    Ubah Foto
                                </span>
                            </label>
                        </div>
                        <div className="md:col-span-2 space-y-3 bg-base-200/40 p-4 rounded-xl border border-base-200">
                            <div className="grid grid-cols-3 md:grid-cols-4 items-center py-1.5 border-b border-base-300/40 last:border-0">
                                <span className="text-sm font-semibold opacity-60 col-span-1">Nama</span>
                                <span className="text-sm font-medium col-span-2 md:col-span-3 text-base-content">
                                : {myData?.name || "-"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 items-center py-1.5 border-b border-base-300/40 last:border-0">
                                <span className="text-sm font-semibold opacity-60 col-span-1">Email</span>
                                <span className="text-sm font-medium col-span-2 md:col-span-3 text-base-content break-all">
                                : {myData?.email || "-"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 items-center py-1.5 border-b border-base-300/40 last:border-0">
                                <span className="text-sm font-semibold opacity-60 col-span-1">Alamat</span>
                                <span className="text-sm font-medium col-span-2 md:col-span-3 text-base-content">
                                : {profile?.address || "-"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 items-center py-1.5 border-b border-base-300/40 last:border-0">
                                <span className="text-sm font-semibold opacity-60 col-span-1">Lahir</span>
                                <span className="text-sm font-medium col-span-2 md:col-span-3 text-base-content">
                                : { dateOnlyFormatted(profile?.birth_date) || "-"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 items-center py-1.5 border-b border-base-300/40 last:border-0">
                                <span className="text-sm font-semibold opacity-60 col-span-1">Bio</span>
                                <span className="text-sm font-medium col-span-2 md:col-span-3 text-base-content flex gap-1">
                                    <span>:</span>
                                    {profile?.bio ? (
                                        <span 
                                            className="inline prose dark:prose-invert max-w-none text-sm font-medium" 
                                            dangerouslySetInnerHTML={{ __html: profile.bio }} 
                                        />
                                    ) : (
                                        <span>-</span>
                                    )}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 items-center py-1.5 last:border-0">
                                <span className="text-sm font-semibold opacity-60 col-span-1">Status</span>
                                <div className="col-span-2 md:col-span-3 flex items-center gap-1 text-sm font-medium">
                                <span>:</span>
                                <div className="badge badge-outline badge-sm font-semibold">
                                    {
                                        // Ditambahkan optional chaining (?.) agar tidak crash saat data loading
                                        myData?.role === 'edmin' ? "Administator" : 
                                        myData?.role === "petugas" ? "Pustakawan" : 
                                        "Murid"
                                    }
                                </div>
                                </div>
                            </div>
                        <div className="flex justify-between mt-10">
                            <button className='btn btn-outline btn-sm'
                            onClick={() => navigate(-1)}>
                                <ArrowBigLeftDash size={20}/>
                                Back
                            </button>
                            <NavLink className='btn btn-outline btn-sm' to={'/edit-profile'}>
                                Edit Profile
                            </NavLink>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
