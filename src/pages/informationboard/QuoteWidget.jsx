import React, { useState } from 'react';

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

export default function QuoteWidget({ showLiterature, setShowLiterature }) {
    // Lazy initialization: langsung acak kutipan utama saat component dibuat pertama kali
    const [mainQuote] = useState(() => {
        const randomized = [...DATA_QUOTES].sort(() => Math.random() - 0.5);
        return randomized[0];
    });

    return (
        <div 
            className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-green-400 dark:to-cyan-300 
            rounded-lg shadow shadow-black dark:shadow-white 
            p-5 flex flex-col justify-between min-h-[180px] cursor-pointer hover:opacity-95 transition-opacity" 
            onClick={() => setShowLiterature(!showLiterature)}
        >
            <div>
                <span className="text-xs uppercase bg-white/20 dark:bg-gray-800 px-2 py-0.5 rounded-full tracking-wider text-white dark:text-slate-900 font-semibold">
                    Kutipan Hari Ini
                </span>
                <p className="text-sm italic mt-3 font-light text-white dark:text-slate-900">
                    "{mainQuote.q}"
                </p>
            </div>
            <p className="text-right text-xs font-semibold mt-4 text-purple-200 dark:text-slate-800">
                - {mainQuote.a}
            </p>
        </div>
    );
}
