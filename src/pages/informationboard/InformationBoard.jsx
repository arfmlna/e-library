import { formatDate } from '@/constants/dateFormat';
import { pb } from '@/utils/pocketbase';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Informationboard() {
    const [mainQuote, setMainQuote] = useState([]);
    const [sidebarQuotes, setSidebarQuotes] = useState([]);
    const [showLiterature, setLiterature] = useState(false)

    const { data: information } = useQuery({
        queryKey: ['information'],
        queryFn: async () => {
            const today = new Date();

            const [articles, agendas] = await Promise.all([
                pb.collection('articles').getList(1, 6, {
                    sort: "-created"
                }),
                pb.collection('agendas').getList(1, 4, {
                    sort: 'eventDate',
                    filter: pb.filter('eventDate >= {:now}', { now: new Date() }) 
                })
            ])

            const latestAgendas = agendas.items || [];

            const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
            firstDay.setHours(0, 0, 0, 0);

            const lastDay = new Date(firstDay);
            lastDay.setDate(lastDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);

            const agendaThisWeek = latestAgendas.find(agenda => {
                const agendaDate = new Date(agenda.created); 
                return agendaDate >= firstDay && agendaDate <= lastDay;
            }) || null;


            return  {
                articles: articles,
                agendas: agendas,
                agendasThisWeek: agendaThisWeek
            }
        }
    })

    const colorMap = {
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-gray-800'
    };

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

    const shuffleQuotes = () => {
        const randomized = [...DATA_QUOTES].sort(() => Math.random() - 0.5);
        setMainQuote([randomized[0]]);  
        setSidebarQuotes(randomized.slice(1));
    };

    useEffect(() => {
        shuffleQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
            {/* Kolom Kiri: Pengumuman & Grid Kartu Mading (3 Kolom di Layar Lebar) */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Banner Pengumuman Penting */}
                { information?.agendasThisWeek && (
                    <div className="bg-yellow-50 dark:bg-gray-800 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📢</span>
                            <div>
                            <h3 className="font-bold text-yellow-800 dark:text-slate-200 text-sm md:text-base">Pengumuman Penting Pekan Ini</h3>
                            <p className="text-yellow-700 dark:text-slate-300 text-xs md:text-sm">{information?.agendasThisWeek?.title} akan dimulai tanggal {formatDate(information?.agendasThisWeek?.eventDate)}.</p>
                            </div>
                        </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded hidden md:block self-center font-medium">Latest</span>
                    </div>
                )}

                {/* Grid Kartu Konten */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {information?.articles?.items?.map((article) => {
                    const image = pb.files.getURL(article, article.image)
                    return (
                        <Link to={`/detail-article/${article?.id}`} key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow shadow-gray-800 dark:shadow-white overflow-hidden flex flex-col">
                            { article.image ? (
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
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2 hover:text-blue-600 cursor-pointer transition-colors">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3"dangerouslySetInnerHTML={{
                                    __html: article.content
                                }}></p>
                                </div>
                                <div className="    mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Oleh: {article.author}</span>
                                <span>{formatDate(article.created)}</span>
                                </div>
                            </div>
                        </Link>
                    )})
                }

                {/* Kartu Khusus: Sastra & Puisi */}
                { showLiterature && sidebarQuotes.map((items, i) => (
                    <div key={i} className="bg-amber-50/40 dark:bg-gray-800/90 border border-amber-100 rounded-lg shadow shadow-black dark:shadow-white overflow-hidden flex flex-col p-5">
                        <div className="text-center italic my-auto">
                        <span className="text-xs font-semibold text-amber-700 dark:text-cyan-300 not-italic uppercase tracking-wider block mb-2">Sastra & Puisi</span>
                        <p className="text-gray-700 dark:text-slate-100 font-serif">
                            {items.q}
                        </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 text-slate-300">
                        <span>Oleh: {items?.a}</span>
                        </div>
                    </div>
                )) }
                </div>
            </div>

            {/* Kolom Kanan: Sidebar Informasi (1 Kolom di Layar Lebar) */}
            <div className="space-y-6">
                
                {/* Widget Agenda */}
                <div className="rounded-lg shadow shadow-black dark:shadow-white p-4">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg border-b pb-2 mb-3 flex items-center">
                        <span className="mr-2">📅</span> Agenda Mendatang
                    </h3>
                    <ul className="space-y-3">
                        {information?.agendas?.items?.map((agenda) => {
                            const dateObj = new Date(agenda?.eventDate);
                            const day = dateObj.getDate(); 
                            const month = dateObj.toLocaleDateString('id-ID', { month: 'short' }); 
                            const time = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                            const currentClass = colorMap[agenda.theme] 
                            return (
                                <li key={agenda.id} className="flex space-x-3 items-start">
                                    <div className={`p-2 rounded text-center min-w-[45px] ${currentClass}`}>
                                        <span className="block font-bold text-sm">{day}</span>
                                        <span className="block text-[10px] uppercase">{month}</span>
                                    </div>
                                    <div>
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{agenda.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{agenda?.location} {time}</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Widget Pojok Kutipan */}
                { mainQuote.map((items, i) => (
                    <div key={i} 
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-green-400 dark:to-cyan-300 
                    rounded-lg shadow shadow-black dark:shadow-white 
                    p-5 flex flex-col justify-between min-h-[180px] cursor-pointer" 
                    onClick={() => setLiterature(!showLiterature)}>
                        <div>
                            <span className="text-xs uppercase bg-white/20 dark:bg-gray-800 px-2 py-0.5 rounded-full tracking-wider">Kutipan Hari Ini</span>
                            <p className="text-sm italic mt-3 font-light text-black">{items.q}</p>
                        </div>
                        <p className="text-right text-xs font-semibold mt-4 text-purple-200 dark:text-black">- {items.a}</p>
                    </div>
                )) }

            </div>
        </div>
    )
}
