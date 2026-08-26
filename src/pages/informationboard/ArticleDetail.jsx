import { pb } from '@/utils/pocketbase';
import { ArrowBigLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css'; 

export default function ArticleDetail() {
    const { id } = useParams(); // Mengambil ID dari URL browser
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticleDetail = async () => {
        try {
            const record = await pb.collection('articles').getOne(id);
            setArticle(record);
        } catch (err) {
            console.error('Gagal memuat artikel:', err);
        } finally {
            setLoading(false);
        }
        };

        if (id) fetchArticleDetail();
    }, [id]);

    if (loading) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-base-content">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-sm opacity-70">Memuat artikel lengkap...</p>
        </div>
        );
    }

    if (!article) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-2">⚠️ Artikel Tidak Ditemukan</h2>
            <p className="text-sm opacity-70 mb-6">Artikel mungkin telah dihapus atau tautan yang Anda tuju salah.</p>
            <button onClick={() => navigate(-1)} className="btn btn-primary btn-sm text-white">Kembali</button>
            </div>
        </div>
        );
    }

    // Mendapatkan URL gambar asli dari PocketBase
    const imageUrl = article.image 
        ? pb.files.getURL(article, article.image)
        : 'https://placehold.co';

    // Format tanggal terbit
    const formattedDate = new Date(article.created).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl shadow-sm border border-base-300 overflow-hidden">
                
                {/* Tombol Kembali & Kategori */}
                <div className="p-6 pb-0 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn btn-sm btn-outline gap-2 pl-1"
                >
                    <ArrowBigLeft size={24} /> Kembali
                </button>
                <span className="badge badge-outline font-semibold uppercase text-xs tracking-wider px-3 py-2">
                    {article.category}
                </span>
                </div>

                {/* Area Judul dan Meta Data */}
                <div className="p-6 pt-4 border-b border-base-300">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                    {article.title}
                </h1>
                
                <div className="flex items-center gap-3 text-sm opacity-80">
                    <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8 flex justify-center items-center">
                        <span className="text-xs uppercase">{article.author?.slice(0, 2)}</span>
                    </div>
                    </div>
                    <div>
                    <p className="font-semibold">{article.author}</p>
                    <p className="text-xs opacity-60">{formattedDate}</p>
                    </div>
                </div>
                </div>

                {/* Gambar Sampul Besar */}
                <div className="w-full aspect-[2/1] relative bg-base-300">
                <img 
                    src={imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                />
                </div>

                {/* Konten Utama Artikel (Rich Text HTML) */}
                <div className="p-4 sm:p-8 w-full overflow-hidden">
                    <div className="max-w-none mx-auto border-0">
                        
                        {/* 2. Ganti tag <article> Anda dengan ini */}
                        <ReactQuill
                        value={article.content}
                        readOnly={true}
                        theme="bubble"
                        className="
                            prose prose-lg sm:prose-xl 
                            dark:prose-invert 
                            max-w-none 
                            w-full
                            text-base-content
                            prose-p:text-base-content/90
                            prose-p:leading-relaxed
                            prose-headings:text-base-content
                            prose-headings:font-bold"
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}
