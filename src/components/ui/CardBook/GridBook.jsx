import { useLocalStorage } from '@/constants/useLocalStorage'
import { fetchTotalReaders } from '@/utils/fetchTotalReader'
import { useQuery } from '@tanstack/react-query'
import { Tag } from 'lucide-react'
import { lazy } from 'react'

const PointerDescription = lazy(() => import('@/components/ui/CardBook/PointerDescription'))

export default function GridBook({data, hoverId, setHoverId, setClickId, popupInformation, poster}) {
    const [showPointerListBook] = useLocalStorage('showPLB', true)

    const { data: totalReaders = 0, isLoading: isCountLoading } = useQuery({
        queryKey: ['totalReaders', data?.id],
        queryFn: () => fetchTotalReaders(data?.id),
        enabled: !!data?.id,
    });

    return (
        <div key={data?.id} className="relative group/card">
            {showPointerListBook && (
                <PointerDescription hoverId={hoverId} data={data} />
            )}

            <div className="h-full rounded-2xl bg-base-100 border border-base-content/10 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                
                <div className="relative bg-base-300 overflow-hidden">
                    <div className="absolute top-2 left-2 z-10">
                        <span className={`badge badge-sm font-bold uppercase tracking-wider text-[9px] shadow-sm text-white px-2.5 py-3 border-none
                        ${data?.bookType === 'digital' ? 'bg-cyan-600' : data?.bookType === 'academic' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                        {data?.bookType}
                        </span>
                    </div>
                    
                    { data?.bookType === 'digital' && (
                        <div className="absolute top-2 right-2 z-10">
                            <span className={`badge badge-sm font-bold uppercase tracking-wider text-[9px] shadow-sm text-white bg-gray-600 px-2.5 py-3 border-none`}>
                                {isCountLoading ? (
                                <span className="loading loading-dots loading-sm block"></span>
                                ) : (
                                <>
                                    {totalReaders} orang
                                </>
                                )}
                            </span>
                        </div>
                    ) }

                    {popupInformation}

                    <div 
                        className="w-full h-fit cursor-pointer overflow-hidden z-0 hover:z-20 group/tapGallery transition-all duration-300"
                        onMouseEnter={() => setHoverId(data.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onClick={() => setClickId({ id: data.id, status: true })}
                    >
                        <div className="w-full h-fit transition-transform duration-500 ease-out group-hover/card:scale-105">
                            {poster}
                        </div>
                    </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-base-100 text-base-content">
                <div className="flex-1 flex flex-col gap-2">
                    
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                        {(data?.expand?.category || data?.category)?.map((cat) => (
                            <span
                                key={cat?.id} 
                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md capitalize transition-colors duration-200 bg-slate-300 dark:bg-white text-black"
                            >
                                <Tag size={10} className="shrink-0" /> 
                                {cat?.name}
                            </span>
                        )) || (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-base-content/40 bg-base-200 px-2 py-1 rounded-md">
                            N/A
                            </span>
                        )}
                    </div>

                    {/* JUDUL DAN PENULIS */}
                    <div className="space-y-0.5">
                    <h3 className="font-bold line-clamp-2 text-sm leading-snug text-base-content group-hover/card:text-cyan-500 transition-colors duration-200 capitalize">
                        {data?.title}
                    </h3>
                    <p className="text-xs text-base-content/60 font-medium truncate capitalize">
                        by {data?.author || "Unknown Author"}
                    </p>
                    </div>
                </div>

                { data.bookType !== 'digital' && (
                    <div className="pt-2 border-t border-base-content/10 flex items-center justify-between mt-auto">
                        {data?.stock > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                            Tersedia: {data?.stock}
                        </span>
                        ) : (
                        <span className="text-[11px] font-semibold text-error bg-error/10 px-2.5 py-0.5 rounded-full">
                            Habis
                        </span>
                        )}
                    </div>
                ) }
                </div>
            </div>
        </div>

    )
}
