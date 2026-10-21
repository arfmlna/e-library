import React from 'react';

export default function Loading({ variant = 'full', count = 2 }) {
    if (variant === 'card') {
        return (
            <>
                <div 
                    className="col-span-full hidden md:grid gap-6 w-full"
                    style={{
                        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`
                    }}
                >
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 space-y-4 animate-pulse">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-span-full grid md:hidden gap-6 w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 space-y-4 animate-pulse">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (variant === 'list') {
        return (
            <div className="flex flex-col space-y-4 w-full animate-pulse">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex space-x-3 items-start w-full">
                        <div className="h-10 w-[45px] min-w-[45px] bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>

                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-[200px] w-full flex flex-col justify-center items-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
    );
}
