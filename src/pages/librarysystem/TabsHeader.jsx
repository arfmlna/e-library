import React from 'react';
import { BookOpen, CornerUpLeft } from 'lucide-react';

export default function TabsHeader({ activeTab, setActiveTab }) {
  return (
    <div className="px-6 pt-6 border-b border-slate-300 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        {/* <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <BookOpen className="w-6 h-6" />
        </div> */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sistem Perpus Mandiri</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">Manajemen Sirkulasi Buku Digital</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('borrow')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all ${
            activeTab === 'borrow' 
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 border-t border-x border-slate-300 dark:border-gray-700' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Peminjaman Buku
        </button>
        <button
          onClick={() => setActiveTab('return')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all ${
            activeTab === 'return' 
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 border-t border-x border-slate-300 dark:border-gray-700' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-gray-700'
          }`}
        >
          <CornerUpLeft className="w-4 h-4" /> Pengembalian Buku
        </button>
      </div>
    </div>
  );
}
