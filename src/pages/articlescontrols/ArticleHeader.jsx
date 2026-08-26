import React from 'react';

export default function ArticleHeader({ onAddClick }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Kontrol Artikel & Berita</h1>
            <p className="text-sm opacity-70">
            Kelola seluruh publikasi artikel sekolah mulai dari prestasi, teknologi, sastra, hingga informasi umum.
            </p>
        </div>
        <button
            onClick={onAddClick}
            className="btn btn-primary text-white shadow-md gap-2"
        >
            Tulis Artikel Baru
        </button>
        </div>
    );
}
