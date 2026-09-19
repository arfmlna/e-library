import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound({ 
    title = 'Halaman Tidak Ditemukan', 
    message = 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.', 
    variant = 'full',
    customAction
}) {
    const navigate = useNavigate();
    const isList = variant === 'list';
    const isCard = variant === 'card';

    return (
        <div 
            className={`
                flex flex-col items-center justify-center 
                bg-slate-50 dark:bg-gray-900/40 
                text-slate-600 dark:text-gray-400 
                rounded-lg p-6 text-center 
                border border-slate-100 dark:border-gray-800 
                w-full transition-all
                ${isList ? 'py-6' : isCard ? 'min-h-[180px]' : 'min-h-[400px] col-span-full'}
            `}
        >
            <div className={`font-mono font-black text-slate-400 dark:text-gray-600 select-none ${isList ? 'text-2xl' : 'text-6xl tracking-wider animate-pulse'}`}>
                404
            </div>
            <h3 className={`font-bold text-slate-800 dark:text-gray-200 mt-3 ${isList ? 'text-xs' : 'text-lg sm:text-xl'}`}>
                {title}
            </h3>
            <p className={`font-medium mt-1 max-w-sm opacity-80 ${isList ? 'text-[11px] leading-tight' : 'text-sm'}`}>
                {message}
            </p>
            {!isList && (
                <div className="flex gap-3 mt-6">
                    {customAction ? (
                        customAction
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate(-1)} 
                                className="px-4 py-1.5 text-xs font-semibold rounded border border-slate-300 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 transition-all active:scale-95"
                            >
                                Kembali
                            </button>
                            <button 
                                onClick={() => navigate('/')} 
                                className="px-4 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
                            >
                                Beranda
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
