export default function ListBook({data, hoverId, setHoverId, setClickId, popupInformation, poster}) {
    return (
        <div key={data?.id} onClick={() => setClickId({
                id: data.id,
                status: true
            })}>
            {popupInformation}
            <div className="p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-center hover:border-slate-300 transition">
                <div className="w-20 overflow-hidden rounded-md ring-1 ring-black">
                    {poster}
                </div>
                <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white 
                                ${  data?.bookType === 'digital' ? 'bg-cyan-600' : 
                                    data?.bookType === 'academic' ? 'bg-green-500' : 
                                    'bg-amber-600'}`}>
                            {data?.bookType}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <div className="flex flex-row gap-0.5 md:gap-1 overflow-x-scroll p-1 md:overflow-hidden">
                                { data?.expand?.category
                                ? data?.expand?.category?.map((data) => (
                                    <div className="" key={data?.id}>
                                        <button className='btn btn-neutral btn-xs mb-1'>{data?.name}</button>
                                    </div>
                                )) 
                                : 'N/A' }
                            </div>
                        </div>
                        <h3 className="font-semibold text-base truncate">{data?.title}</h3>
                        <p className="text-xs">{data?.author}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-shrink-0 self-end md:self-center">
                    {data?.bookType === 'physical' && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Stok: <b>{data?.stock}</b></span>
                    )}
                    <button className={`px-4 py-2 rounded-lg text-xs font-medium transition 
                        ${  data?.bookType === 'digital' ? 'bg-cyan-600 hover:bg-cyan-800 text-white' : 
                            data?.bookType === 'academic' ? 'bg-green-500 hover:bg-green-700 text-white' : 
                            'bg-amber-600 hover:bg-amber-800 text-white'}`}>
                        Lihat detail
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
