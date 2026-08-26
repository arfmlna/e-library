import React from 'react';

export default function ReportFilters({ 
    statusFilter, 
    setStatusFilter, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    searchQuery, 
    setSearchQuery,
    bookType,
    setBookType
}) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1 w-full sm:w-fit md:w-fit">
                <label className="text-xs font-semibold">Status Buku</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option className='bg-white dark:bg-gray-800 text-black dark:text-white' value="all">Semua Status</option>
                    <option className='bg-white dark:bg-gray-800 text-black dark:text-white' value="borrowed">Sedang Dipinjam</option>
                    <option className='bg-white dark:bg-gray-800 text-black dark:text-white' value="returned">Sudah Kembali</option>
                </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-fit md:w-fit">
                <label className="text-xs font-semibold">Tipe Buku</label>
                <select value={bookType} onChange={(e) => setBookType(e.target.value)} className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option className='bg-white dark:bg-gray-800 text-black dark:text-white' value="all">Semua</option>
                    <option className='bg-white dark:bg-gray-800 text-black dark:text-white' value="academic">Academic</option>
                    <option className='bg-white dark:bg-gray-800 text-black dark:text-white' value="nonAcademic">Non Academic</option>
                </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-fit md:w-fit">
                <label className="text-xs font-semibold">Tanggal Mulai</label>
                <input type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="border border-gray-300 rounded-lg p-2 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-fit md:w-fit">
                <label className="text-xs font-semibold">Tanggal Selesai</label>
                <input type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                <label className="text-xs font-semibold">Pencarian Cepat</label>
                <input type="text" 
                placeholder="Cari nama anggota atau judul buku..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
    );
}
