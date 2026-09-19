import React, { lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactQuill from 'react-quill-new'; // sesuaikan dengan library Anda
import 'react-quill-new/dist/quill.bubble.css'; 
import { ArrowBigLeft } from 'lucide-react'; // sesuaikan dengan icon Anda
import { pb } from '@/utils/pocketbase';

const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: article, isLoading, error, refetch } = useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            // Mengambil data detail artikel dari PocketBase berdasarkan ID
            return await pb.collection('articles').getOne(id);
        },
        enabled: !!id, 
    });

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loading variant="full" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-3xl w-full">
                    <Error 
                        message={error ? "Gagal memuat detail artikel." : "Artikel tidak ditemukan atau telah dihapus."} 
                        refetch={refetch} 
                        variant="full" 
                    />
                    <div className="text-center mt-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-primary btn-sm text-white px-6"
                        >
                            Kembali ke Halaman Sebelumnya
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = article.image 
        ? pb.files.getURL(article, article.image)
        : 'https://placehold.co';

    const formattedDate = new Date(article.created).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl shadow-sm border border-base-300 overflow-hidden">
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
                <div className="w-full aspect-[2/1] relative bg-base-300">
                    <img 
                        src={imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 sm:p-8 w-full overflow-hidden">
                    <div className="max-w-none mx-auto border-0">
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
