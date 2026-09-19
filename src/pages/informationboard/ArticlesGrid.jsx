import React, { lazy, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { pb } from '@/utils/pocketbase';
import { formatDate } from '@/constants/dateFormat';

const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

const DATA_QUOTES = [
    { q: "Sukses bukanlah kunci kebahagiaan. Kebahagiaanlah kunci kesuksesan.", a: "Albert Schweitzer" },
    { q: "Satu-satunya cara untuk melakukan pekerjaan hebat adalah mencintai apa yang Anda lakukan.", a: "Steve Jobs" },
    { q: "Jangan biarkan hari kemarin menyita terlalu banyak hari ini.", a: "Will Rogers" },
    { q: "Kesempatan tidak terjadi begitu saja. Anda yang harus menciptakannya.", a: "Chris Grosser" },
    { q: "Masa depan adalah milik mereka yang percaya pada keindahan impian mereka.", a: "Eleanor Roosevelt" },
    { q: "Mulailah dari mana Anda berada. Gunakan apa yang Anda miliki.", a: "Arthur Ashe" },
    { q: "Hambatan tidak bisa menghentikan Anda. Jika Anda menemui tembok, jangan berbalik.", a: "Michael Jordan" },
    { q: "Satu-satunya batasan untuk realisasi hari esok adalah keraguan kita hari ini.", a: "Franklin D. Roosevelt" },
    { q: "Kunci sukses adalah memfokuskan pikiran sadar kita pada hal-hal yang kita inginkan.", a: "Brian Tracy" },
];

export default function ArticlesGrid({ showLiterature }) {
    const { data: articles, isLoading, error, refetch } = useQuery({
        queryKey: ['articles'],
        queryFn: () => pb.collection('articles').getList(1, 6, { sort: "-created" })
    });

    // Menggunakan useMemo agar pengacakan sidebar quotes konsisten per render halaman
    const sidebarQuotes = useMemo(() => {
        return [...DATA_QUOTES].sort(() => Math.random() - 0.5).slice(1);
    }, []);

    return (
        <>
            { isLoading ? <Loading variant='card' count={2} /> : error ? <Error refetch={refetch} variant='card' /> : 
                articles.totalItems === 0 ? (
                    <NotFound
                    title='Data Tidak Tersedia'
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles?.items?.map((article) => {
                            const image = pb.files.getURL(article, article.image);
                            return (
                                <Link to={`/detail-article/${article?.id}`} key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow shadow-gray-800 dark:shadow-white overflow-hidden flex flex-col hover:scale-[1.01] transition-all">
                                    {article.image ? (
                                        <img src={image} alt={article.title} className="h-48 w-full object-cover" />
                                    ) : (
                                        <div className="h-48 w-full bg-slate-200 text-black dark:bg-slate-700 dark:text-white flex justify-center items-center">
                                            <h1 className='text-2xl font-bold uppercase'>Image Not Found</h1>
                                        </div>
                                    )}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${article.categoryColor}`}>
                                                {article.category}
                                            </span>
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2 hover:text-blue-600 transition-colors">
                                                {article.title}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.content }}></p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>Oleh: {article.author}</span>
                                            <span>{formatDate(article.created)}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Kartu Khusus: Sastra & Puisi */}
                        {showLiterature && sidebarQuotes.map((item, i) => (
                            <div key={i} className="bg-amber-50/40 dark:bg-gray-800/90 border border-amber-100 rounded-lg shadow shadow-black dark:shadow-white overflow-hidden flex flex-col p-5 animate-fade-in">
                                <div className="text-center italic my-auto">
                                    <span className="text-xs font-semibold text-amber-700 dark:text-cyan-300 not-italic uppercase tracking-wider block mb-2">Sastra & Puisi</span>
                                    <p className="text-gray-700 dark:text-slate-100 font-serif">{item.q}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                                    <span>Oleh: {item.a}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) 
            }
        </>
    );
}
