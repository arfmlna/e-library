import React from 'react';

export default function ArticleFilterBar({ search, onSearchChange, category, onCategoryChange }) {
    return (
        <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 flex flex-col md:flex-row gap-4">
        <input
            type="text"
            placeholder="🔍 Cari judul atau penulis..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input input-bordered w-full md:flex-1 text-sm bg-base-100"
        />
        <select 
            value={category} 
            onChange={(e) => onCategoryChange(e.target.value)}
            className="select select-bordered w-full md:w-52 text-sm bg-base-100"
        >
            <option value="">Semua Kategori</option>
            <option value="prestasi">🏆 Prestasi</option>
            <option value="teknologi">💻 Teknologi</option>
            <option value="sastra">✍️ Sastra</option>
            <option value="informasi">📢 Informasi</option>
        </select>
        </div>
    );
}