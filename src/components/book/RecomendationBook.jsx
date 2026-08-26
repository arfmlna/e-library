import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Star, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { pb } from '@/utils/pocketbase';
import { fetchRecommendedDigitalBooks } from '@/utils/fetchRecommendedDigitalBooks';
import PopupInformation from './PopupInformation';
import Poster from './Poster';

export default function RecommendedDigitalBooks() {
    const [clickId, setClickId] = useState({
        id: null,
        status: false
    })
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const { data: recommendations = [], isLoading, error } = useQuery({
        queryKey: ['digitalRecommendations'],
        queryFn: fetchRecommendedDigitalBooks,
        staleTime: 1000 * 60 * 10, // Data di-cache selama 10 menit
    });

    const checkScrollPosition = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 5); // Tampilkan jika sudah bergeser ke kanan sedikit
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5); // Tampilkan jika belum mentok kanan
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', checkScrollPosition);
            // Cek posisi awal saat data selesai dimuat
            checkScrollPosition();
        }
        return () => carousel?.removeEventListener('scroll', checkScrollPosition);
    }, [recommendations]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { clientWidth } = carouselRef.current;
            // Geser sejauh lebar kontainer dikurangi sedikit padding agar kartu tidak terpotong ekstrem
            const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 w-full">
                        <div className="skeleton h-60 w-full rounded-xl"></div>
                        <div className="skeleton h-4 w-28"></div>
                        <div className="skeleton h-3 w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) return <div className="text-error text-center text-sm p-4">Gagal memuat rekomendasi.</div>;

    const getCoverUrl = (bookId, collectionId, filename) => {
        if (!filename) return "https://placehold.co";
        return `${pb.baseURL}/api/files/${collectionId}/${bookId}/${filename}`;
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 my-8">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 dark:bg-slate-600 text-primary dark:text-slate-800 rounded-lg">
                        <Sparkles size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Rekomendasi Untukmu</h2>
                        <p className="text-xs opacity-60">Buku digital pilihan terbaik berdasarkan popularitas</p>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            {recommendations.length === 0 ? (
                <div className="text-center py-6 text-sm opacity-50">Belum ada rekomendasi tersedia.</div>
            ) : (
                <div className="relative w-full">
                    {showLeftArrow && (
                        <button 
                            type="button"
                            onClick={() => scroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-sm bg-base-100/90 shadow-md border border-base-300 hover:bg-base-100 flex transition-opacity duration-300"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}

                    {showRightArrow && (
                        <button 
                            type="button"
                            onClick={() => scroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-sm bg-base-100/90 shadow-md border border-base-300 hover:bg-base-100 flex transition-opacity duration-300"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    )}
                    <div ref={carouselRef} className="carousel carousel-center w-full space-x-4 p-2 bg-neutral/5 rounded-2xl custom-scrollbar-horizontal">
                        {recommendations.map((book) => (
                            <div 
                                key={book.id} 
                                className="carousel-item card card-compact w-60 bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                                onClick={() => setClickId({ id: book.id, status: true })} // Memicu dialog detail saat kartu diklik
                            >
                                <PopupInformation clickId={clickId} setClickId={setClickId} data={book} />
                                {/* Badge Pilihan */}
                                <div className="absolute top-2 right-2 z-10">
                                    <span className="badge badge-primary font-bold text-[10px] uppercase tracking-wider px-2 shadow-sm">
                                        Best Choice
                                    </span>
                                </div>

                                {/* Book Cover Image */}
                                <figure className="relative overflow-hidden bg-base-200 rounded-t-xl">
                                    <Poster data={book} width={240} height={240} />
                                </figure>

                                {/* Card Body */}
                                <div className="card-body p-3 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm line-clamp-2 text-base-content group-hover:text-cyan-400 transition-colors min-h-[40px]">
                                            {book.title}
                                        </h3>
                                        <p className="text-[11px] opacity-60 truncate mt-0.5">
                                            {book.author || "Penulis Anonim"}
                                        </p>
                                    </div>

                                    {/* Metadata / Stats Grid */}
                                    <div className="flex items-center justify-between border-t border-base-200 pt-2.5 mt-2 text-[11px] font-medium opacity-80">
                                        {/* Indikator Jumlah Pembaca */}
                                        <div className="flex items-center gap-1 opacity-70">
                                            <Users size={12} />
                                            <span>{book.totalReads} dibaca</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}