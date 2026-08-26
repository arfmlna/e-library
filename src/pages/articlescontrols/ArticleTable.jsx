import { pb } from '@/utils/pocketbase';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArticleTable({ data, loading, onEdit, onDelete }) {
    const navigate = useNavigate()
    if (loading) return <div className="text-center p-12 bg-base-100 border border-base-300 rounded-xl"><span className="loading loading-spinner text-primary"></span></div>;
    if (data.length === 0) return <div className="text-center p-12 bg-base-100 border border-base-300 rounded-xl opacity-60">📭 Belum ada artikel.</div>;

    return (
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="table w-full text-left">
            <thead>
                <tr className="bg-base-300 text-base-content opacity-80">
                <th className="px-6 py-4">Gambar</th>
                <th className="px-6 py-4">Judul</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Penulis (Author)</th>
                <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-base-300">
                {data.map((article) => {
                // Mendapatkan URL Gambar Resmi dari PocketBase
                const imageUrl = article.image 
                    ? pb.files.getURL(article, article.image, { thumb: '100x100' })
                    : 'https://placehold.co/100x100';

                return (
                    <tr key={article.id} 
                    className="hover:bg-base-200 transition-colors" 
                    onClick={() => navigate(`/detail-article/${article?.id}`)}>
                        <td className="px-6 py-3">
                            <img src={imageUrl} alt={article.title} className="w-12 h-12 object-cover rounded-lg border border-base-300" />
                        </td>
                        <td className="px-6 py-4 font-medium max-w-xs truncate">{article.title}</td>
                        <td className="px-6 py-4 capitalize"><span className="badge badge-ghost font-semibold">{article.category}</span></td>
                        <td className="px-6 py-4 opacity-80">{article.author}</td>
                        <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                            <button onClick={() => onEdit(article)} className="btn btn-warning btn-xs text-white">Edit</button>
                            <button onClick={() => onDelete(article.id)} className="btn btn-error btn-xs text-white">Hapus</button>
                        </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        </div>
    );
}
