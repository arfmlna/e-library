import React from 'react';

export default function Error({ message = 'Terjadi kesalahan sistem', refetch, variant = 'full' }) {
    const isList = variant === 'list';
    const isCard = variant === 'card';

    return (
        <div 
            className={`
                flex flex-col items-center justify-center 
                bg-red-50 dark:bg-red-950/10 
                text-red-600 dark:text-red-400 
                rounded-lg p-5 text-center 
                border border-red-100 dark:border-red-900/30 
                w-full transition-all
                ${isList ? 'py-6' : isCard ? 'min-h-[65vh]' : 'min-h-[45vh] col-span-full'}
            `}
        >
            <span className={isList ? 'text-xl' : 'text-3xl animate-bounce'}>⚠️</span>
            <p className={`font-medium mt-2 max-w-md ${isList ? 'text-xs' : 'text-sm'}`}>
                {message}
            </p>
            {refetch && (
                <button 
                    onClick={() => refetch()} 
                    className={`
                        mt-3 bg-red-600 hover:bg-red-700 
                        dark:bg-red-700 dark:hover:bg-red-600 
                        text-white font-semibold rounded 
                        shadow-sm shadow-red-200 dark:shadow-none
                        transition-all active:scale-95
                        ${isList ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'}
                    `}
                >
                    Coba Lagi
                </button>
            )}
        </div>
    );
}
