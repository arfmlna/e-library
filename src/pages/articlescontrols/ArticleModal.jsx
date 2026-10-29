import { validateFileSize } from '@/constants/validationFileSize';
import { pb } from '@/utils/pocketbase';
import { getSettings } from '@/utils/settings';
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new'; // 👈 Pustaka Editor
import 'react-quill-new/dist/quill.snow.css'; // Gaya Editor
import Swal from 'sweetalert2';

export default function ArticleModal({ articleItem, onSuccess, onClose }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('prestasi');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        getSettings().then(setSettings);
    }, []);

    useEffect(() => {
        if (articleItem) {
            setTitle(articleItem.title || '');
            setCategory(articleItem.category || 'prestasi');
            setAuthor(articleItem.author || '');
            setContent(articleItem.content || '');
            setImageFile(null);
            setImagePreview(articleItem.image ? pb.files.getURL(articleItem, articleItem.image) : '');
        } else {
            setTitle(''); setCategory('prestasi'); setAuthor(''); setContent(''); setImageFile(null); setImagePreview('');
        }
    }, [articleItem]);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }], 
            ['bold', 'italic', 'underline', 'strike'],        
            [{ 'color': [] }, { 'background': [] }],          
            [{ 'script': 'sub' }, { 'script': 'super' }],      
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }, { 'align': [] }],        
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],                       
            ['clean']                                         
        ],
    };

    const quillFormats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script', 'list', 'indent',
        'direction', 'align',
        'blockquote', 'code-block',
        'link', 'image', 'video'
    ];


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validation = validateFileSize(file, settings?.max_upload_size); 
        if (file && validation.isValid) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Preview lokal sementara
        } else {
            setImageFile(null);
            setImagePreview(null);
            const modalContainer = e.target.closest('.modal') || document.body;
            Swal.fire({
                icon: 'error',
                title: 'Gagal Mengunggah',
                text: validation.error || 'Ukuran file terlalu besar.',
                target: modalContainer, // Menghindari penumpukan container internal
                didOpen: () => {
                    Swal.getContainer().style.zIndex = '999999'; // Memaksa tampil di paling depan
                }
            });
            e.target.value = ''; 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        Swal.showLoading();

        // 👈 Kunci Utama: Gunakan FormData jika tabel memuat tipe data File/Gambar
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('author', author);
        formData.append('content', content); // Menyimpan format HTML String murni dari Rich Editor
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (articleItem?.id) {
                await pb.collection('articles').update(articleItem.id, formData);
            } else {
                await pb.collection('articles').create(formData);
            }
            onSuccess();
            onClose();
            Swal.fire({ icon: 'success', title: 'Berhasil Disimpan!', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="article_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 text-base-content max-w-3xl border border-base-300">
            <h3 className="font-bold text-lg mb-4">{articleItem ? 'Edit Artikel' : 'Buat Artikel Baru'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                <label className="label text-xs font-semibold opacity-70">Judul Artikel</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered text-sm bg-base-100 w-full" placeholder="Ketik judul..." />
                </div>
                <div className="form-control">
                <label className="label text-xs font-semibold opacity-70">Penulis (Author)</label>
                <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} className="input input-bordered text-sm bg-base-100 w-full" placeholder="Nama penulis..." />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label text-xs font-semibold opacity-70">Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="select select-bordered text-sm bg-base-100 w-full">
                        <option value="prestasi">Prestasi</option>
                        <option value="teknologi">Teknologi</option>
                        <option value="sastra">Sastra</option>
                        <option value="informasi">Informasi</option>
                    </select>
                </div>

                <div className="form-control flex gap-3 flex-col">
                    <label className="label text-xs font-semibold opacity-70">Gambar Sampul</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered text-sm w-full bg-base-100" />
                    {imagePreview && (
                        <div className="ring ring-primary ring-offset-base-100 ring-offset-2 rounded-lg">
                        <div className="w-full h-1/2">
                            <img src={imagePreview} alt="Preview" className="object-cover rounded-lg" />
                        </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 👈 Implementasi Rich Text Editor */}
            <div className="form-control">
                <label className="label text-xs font-semibold opacity-70">Konten / Isi Artikel</label>
                <div className="[&_.ql-container]:rounded-b-sm [&_.ql-toolbar]:rounded-t-sm">
                    <ReactQuill 
                    theme="snow" 
                    modules={quillModules}
                    formats={quillFormats}
                    value={content} 
                    onChange={setContent} 
                    placeholder="Tulis cerita menarik Anda di sini..." 
                    className="overflow-hidden rounded-sm dark:[&_.ql-formats]:invert dark:[&_.ql-editor.ql-blank::before]:!text-black dark:[&_.ql-editor.ql-blank::before]:!text-white [&_.ql-editor.ql-blank::before]:!opacity-100 [&_.ql-editor.ql-blank::before]:!not-italic"
                    />
                </div>
            </div>

            <div className="modal-action">
                <button type="button" onClick={onClose} disabled={loading} className="btn btn-ghost">Batal</button>
                <button type="submit" disabled={loading} className="btn btn-primary text-white px-6">Simpan</button>
            </div>
            </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    );
}
