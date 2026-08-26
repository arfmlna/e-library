import React from 'react';

export default function OverdueFilters({ bookType, setBookType, searchQuery, setSearchQuery }) {
  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end text-gray-800">
      
      {/* SELECT TYPE BOOK */}
      <div className="flex flex-col gap-1 w-full sm:w-48">
        <label className="text-xs font-semibold">Tipe Koleksi Buku</label>
        <select 
          value={bookType} 
          onChange={(e) => setBookType(e.target.value)} 
          className="select w-full text-sm focus:outline-none"
        >
          <option value="all" className="">Semua Tipe Buku</option>
          <option value="academic" className="font-medium">📚 Buku Akademik</option>
          <option value="nonacademic" className="font-medium">🎨 Buku Non-Akademik</option>
        </select>
      </div>

      {/* PENCARIAN */}
      <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
        <label className="text-xs font-semibold">Cari Pelanggar</label>
        <input 
          type="text" 
          placeholder="Cari nama siswa atau judul buku terlambat..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="input input-bordered w-full text-sm focus:outline-none" 
        />
      </div>

    </div>
  );
}
