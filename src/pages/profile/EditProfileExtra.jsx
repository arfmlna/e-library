import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowBigLeftDash, Save, UserCog } from 'lucide-react';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import { fetchUserProfile, saveUserProfile } from '@/utils/userProfile';
import { pb } from '@/utils/pocketbase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditProfileExtra() {
    const queryClient = useQueryClient();
    const userId = pb.authStore.record?.id;
    const quillRef = useRef(null);
    const navigate = useNavigate()

    const [address, setAddress] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [bio, setBio] = useState('');
    const [charCount, setCharCount] = useState(0);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['userProfileExtra', userId],
        queryFn: () => fetchUserProfile(userId),
        enabled: !!userId,
    });

    const loadProfileToForm = (profileData) => {
        if (profileData) {
            setAddress(profileData.address || '');
            setBirthDate(profileData.birth_date ? profileData.birth_date.split(' ')[0] : '');
            
            const initialBio = profileData.bio || '';
            setBio(initialBio);
            
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = initialBio;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            setCharCount(plainText.length);
        }
    };

    useEffect(() => {
        loadProfileToForm(profile);
    }, [profile]);

    const mutation = useMutation({
        mutationFn: saveUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfileExtra', userId] });
            Swal.fire({
                icon: 'success',
                text: 'Profil tambahan berhasil diperbarui!'
            })
            navigate(-1); 
        },
        onError: (err) => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                text: 'Gagal menyimpan data.'
            })
        }
    });

    const handleBioChange = (content, delta, source, editor) => {
        const textLength = editor.getText().trim().length;

        if (textLength <= 255) {
            setBio(content);
            setCharCount(textLength);
        } else {
            const quill = quillRef.current.getEditor();
            quill.deleteText(255, textLength);
        }
    };

    const handleCancelAndBack = () => {
        loadProfileToForm(profile);  
        navigate(-1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userId) return;

        mutation.mutate({
            userId,
            recordId: profile?.id,
            profileData: {
                address,
                birth_date: birthDate,
                bio
            }
        });
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
        );
    }

    return (
        <div className="card w-full max-w-xl bg-base-100 shadow-xl border border-base-300 mx-auto my-6">
            <div className="card-body p-6">
                <div className="flex items-center gap-2 border-b border-base-300 pb-4 mb-4">
                    <UserCog size={20} className="text-primary" />
                        <h2 className="text-lg font-bold tracking-wide uppercase">Informasi Tambahan</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text font-semibold opacity-70">Alamat Lengkap</span>
                        </label>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Masukkan alamat Anda" 
                            className="input input-bordered w-full input-md bg-base-200/50 focus:input-primary" 
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text font-semibold opacity-70">Tanggal Lahir</span>
                        </label>
                        <input 
                            type="date" 
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="input input-bordered w-full input-md bg-base-200/50 focus:input-primary" 
                        />
                    </div>

                    <div className="form-control w-full">
                        <div className="flex justify-between items-center py-1">
                            <label className="label p-0">
                                <span className="label-text font-semibold opacity-70">Bio / Catatan Singkat</span>
                            </label>
                            <span className={`text-xs font-mono font-medium ${charCount >= 250 ? 'text-error' : 'opacity-50'}`}>
                                {charCount} / 255
                            </span>
                        </div>
                        
                        <div className="bg-base-200/40 rounded-lg overflow-hidden border border-base-300 focus-within:border-primary transition-all duration-200">
                            <ReactQuill 
                                ref={quillRef}
                                theme="snow"
                                value={bio}
                                onChange={handleBioChange}
                                modules={modules}
                                placeholder="Tulis bio singkat Anda disini..."
                                className="prose dark:prose-invert max-w-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="card-actions justify-between mt-6">
                        <button 
                        type='button' 
                        onClick={handleCancelAndBack}
                        disabled={mutation.isPending}
                        className='btn btn-neutral btn-sm' 
                        >
                            <ArrowBigLeftDash size={20} />
                            Back
                        </button>
                        <button 
                            type="submit" 
                            disabled={mutation.isPending}
                            className="btn btn-primary btn-sm px-5 text-white"
                        >
                            {mutation.isPending ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <>
                                    <Save size={15} />
                                    Simpan Profil
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
