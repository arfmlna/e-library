import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { pb } from '@/utils/pocketbase';
import ArticleFilterBar from './ArticleFilterBar';
import ArticleTable from './ArticleTable';
import ArticleModal from './ArticleModal';
import ArticleHeader from './ArticleHeader';

export default function ArticlesControls() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const fetchArticles = async () => {
        setLoading(true);
        try {
        const records = await pb.collection('articles').getFullList({ sort: '-created' });
        setArticles(records);
        } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat artikel.' });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleOpenModal = (articleItem = null) => {
        setSelectedArticle(articleItem);
        document.getElementById('article_modal').showModal();
    };

    const handleCloseModal = () => {
        setSelectedArticle(null);
        document.getElementById('article_modal').close();
    };

    const handleDelete = async (id) => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const result = await Swal.fire({
        title: 'Hapus Artikel?',
        text: "Data dan gambar artikel akan dihapus permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        background: isDark ? '#1d232a' : '#ffffff',
        color: isDark ? '#a6adbb' : '#1f2937'
        });

        if (result.isConfirmed) {
        try {
            await pb.collection('articles').delete(id);
            Swal.fire({ icon: 'success', title: 'Terhapus!', background: isDark ? '#1d232a' : '#ffffff', color: isDark ? '#a6adbb' : '#1f2937' });
            fetchArticles();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus artikel.' });
        }
        }
    };

    const filteredArticles = articles.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 min-h-screen space-y-6 rounded-2xl">
        <ArticleHeader onAddClick={() => handleOpenModal(null)} />
        <ArticleFilterBar 
            search={searchTerm} onSearchChange={setSearchTerm}
            category={selectedCategory} onCategoryChange={setSelectedCategory}
        />
        <ArticleTable 
            data={filteredArticles} loading={loading} 
            onEdit={handleOpenModal} onDelete={handleDelete} 
        />
        <ArticleModal 
            articleItem={selectedArticle} onSuccess={fetchArticles} onClose={handleCloseModal} 
        />
        </div>
    );
}