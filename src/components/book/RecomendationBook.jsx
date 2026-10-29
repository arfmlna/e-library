import React, { lazy, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchRecommendedDigitalBooks } from '@/utils/fetchRecommendedDigitalBooks';

const NotFound = lazy(() => import('../ui/NotFound'))
const PopupInformation = lazy(() => import('./PopupInformation'))
const Poster = lazy(() => import('./Poster'))
const Loading = lazy(() => import('../ui/Loading'))
const Error = lazy(() => import('../ui/Error'))

export default function RecommendedDigitalBooks() {
    const [clickId, setClickId] = useState({
        id: null,
        status: false
    })
    const carouselRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const { data: recommendations = [], isLoading, refetch, error } = useQuery({
        queryKey: ['digitalRecommendations'],
        queryFn: fetchRecommendedDigitalBooks,
        staleTime: 1000 * 60 * 10,
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
            checkScrollPosition();
        }
        return () => carousel?.removeEventListener('scroll', checkScrollPosition);
    }, [recommendations]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { clientWidth } = carouselRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 my-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg">
                        <Sparkles size={20} className="animate-accordion-down" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Rekomendasi Untukmu</h2>
                        <p className="text-xs opacity-60">Buku digital pilihan terbaik berdasarkan popularitas</p>
                    </div>
                </div>
            </div>

            { isLoading ? <Loading variant='card' count={4} /> : error ? <Error refetch={refetch} /> : 
                recommendations.length === 0 ? (
                    <NotFound
                    message='Belum ada rekomendasi tersedia.'
                    />
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
                )
            }

        </div>
    );
}