import { pb } from "@/utils/pocketbase";
import { History } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export const fetchReadHistoryDigitalBooks = async (userId) => {
    if (!userId) return [];

    const userReads = await pb.collection('history_reads').getFullList({ 
        filter: `user.id = "${userId}"` 
    });

    if (userReads.length === 0) return [];

    const readBookIds = [...new Set(userReads.map(r => r.book))];

    const bookFilterQueries = readBookIds.map(id => `id = "${id}"`).join(' || ');
    const combinedFilter = `bookType = "digital" && (${bookFilterQueries})`;

    const books = await pb.collection('books').getFullList({
        filter: combinedFilter,
        expand: 'uploader,category,supplier'
    });

    const recommendedBooks = books.map(book => {
        const totalReads = userReads.filter(r => r.book === book.id).length;
        const recommendationScore = (totalReads * 2);

        return {
            ...book,
            totalReads,
            recommendationScore
        };
    });

    return recommendedBooks.sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 9);
};

export default function ReadsHistory() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = pb.authStore.record?.id;

    useEffect(() => {
        const loadData = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const data = await fetchReadHistoryDigitalBooks(userId);
                setReports(data);
            } catch (error) {
                console.error("Gagal memuat riwayat baca:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    // Kalkulasi statistik dari data yang berhasil dimuat
    const totalBukuUnik = reports.length;
    const totalSeluruhMembaca = reports.reduce((acc, curr) => acc + (curr.totalReads || 0), 0);

    if (loading) {
        return (
            <div className="p-8 text-center font-medium animate-pulse opacity-70">
                Memuat riwayat membaca digital...
            </div>
        );
    }

    return (
        <div className="max-w-7xl w-full mx-auto p-4 md:p-6 ">
            <div className="flex flex-row gap-3 h-full items-center my-3">
                <div className="p-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg">
                    <History className="animate-accordion-down" size={20} />
                </div>
                <div className="">
                    <h2 className="text-lg font-bold tracking-wide uppercase">Riwayat Membaca</h2>
                    <p className="text-xs opacity-60">Daftar buku digital yang paling sering Anda baca.</p>
                </div>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 p-4 rounded-xl">
                        <p className="text-xs uppercase font-medium opacity-75">Koleksi Buku</p>
                        <p className="text-2xl font-semibold mt-1">{totalBukuUnik} Judul</p>
                    </div>
                    <div className="border-2 p-4 rounded-xl">
                        <p className="text-xs uppercase font-medium opacity-75">Total Dibaca</p>
                        <p className="text-2xl font-semibold mt-1">{totalSeluruhMembaca} Kali</p>
                    </div>
                </div>

                {/* Kontainer Daftar Riwayat */}
                <div className="overflow-x-auto border-2 rounded-xl">
                    <table className="min-w-full divide-y text-sm">
                        <thead>
                            <tr className="text-left font-medium border-b-2">
                                <th className="p-4">Judul Buku Digital</th>
                                <th className="p-4 text-center">Baca</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 font-medium opacity-70">
                                        Anda belum memiliki riwayat membaca buku digital.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((book, index) => (
                                    <tr key={book.id || index} className="transition-opacity">
                                        {/* Kolom Informasi Buku */}
                                        <td className="p-4">
                                            <div className="font-semibold">{book.title}</div>
                                            <div className="text-xs opacity-75 mt-0.5">Oleh: {book.author || 'Anonim'}</div>
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            <div className="flex gap-2 justify-center items-center">
                                                {/* Tombol Flipbook - Efek Hover Halus */}
                                                <NavLink 
                                                    to={`/flipbook/online/${book.id}`} 
                                                    state={{ bookData: book }} 
                                                    className="px-2 py-1 border-2 border-black dark:border-white rounded-sm hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Flipbook
                                                </NavLink>
                                                
                                                <NavLink 
                                                    to={`/reader/online/${book.id}`} 
                                                    state={{ bookData: book }}
                                                    className="px-2 py-1 border-2 border-black dark:border-white rounded-sm hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Reader
                                                </NavLink>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}