import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { Book, UserRoundPen, X } from 'lucide-react'
import { formatDate, timeAgo } from '@/constants/dateFormat'
import { Link } from 'react-router-dom'
import { pb } from '@/utils/pocketbase'

export default function DialogDetail({ open, onClose, detail, setOpenEdit, role }){
    const theme = localStorage.getItem('theme')
    const poster = pb.files.getURL(detail, detail.poster)
    const file = pb.files.getURL(detail, detail.pdfFile)
    return (
        <Dialog data-theme={theme} open={open} onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
            <DialogPanel className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-200 shadow-2xl sm:w-full overflow-hidden bg-base-100">
                <div className="w-full bg-base-100 text-base-content relative flex flex-col">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute right-3 top-3 z-50 rounded-md p-1.5 bg-black/40 text-white hover:bg-black/60 focus:outline-none shadow-md"
                >
                    <X size={18} />
                </button>
                <div className="relative w-full aspect-video bg-base-300 overflow-hidden">
                    { detail?.poster ? 
                        detail?.pdfFile ? (
                            <a href={`/reader/online/${detail?.id}`} target='_blank'>
                                <img
                                    className="w-full h-full object-cover"
                                    src={poster}
                                    alt={detail?.title} 
                                />
                            </a>
                        ) : (
                            <img
                                className="w-full h-full object-cover"
                                src={poster}
                                alt={detail?.title} 
                            />
                    ) : (
                        <div className="bg-[#a9a9a9] flex justify-center">
                            <Book size={250} />
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-base-100 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col gap-4 -mt-4 relative z-10 bg-base-100 rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-base-content break-words">{detail?.title}</h2>
                        <p className="text-xs font-medium mt-0.5 capitalize">by {detail?.author ? detail?.author : 'N/A'}</p>
                        <p className="text-xs font-medium mt-1 capitalize">
                            supplier : {detail?.expand?.supplier?.supplier ? detail?.expand?.supplier?.supplier : 'N/A'}
                        </p>
                        <div className="flex gap-3 items-center">
                            <button className='btn btn-primary btn-xs mt-1 capitalize'>{detail?.bookType === 'nonAcademic' ? 'non academic' : detail?.bookType }</button>
                            {detail?.expand?.category ? (
                                detail?.expand?.category?.map((cat) => (
                                <span className="btn btn-info btn-xs mt-1 text-xs font-medium capitalize" key={cat?.id}>
                                    {cat?.name}
                                </span>
                                ))
                            ) : (
                                <span className="text-base-content/40 italic text-xs">N/A</span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm border-t border-base-200 pt-4">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium text-xs">ID Buku</span>
                        <span className="text-right font-mono text-xs opacity-70 break-all">{detail?.kode_buku ? detail?.kode_buku : 'unknow'}</span>
                    </div>
                    { detail?.pdfFile && (
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-base-content/60 font-medium">File Digital</span>
                            { 
                            detail?.pdfFile ? 
                                role === 'edmin' 
                                ? ( 
                                    <a className='btn btn-neutral btn-xs' target='_blank' href={file}>
                                        <span>📖 Read Book</span>
                                    </a> 
                                ) : (
                                    <a className='btn btn-neutral btn-xs' target='_blank' href={`/reader/online/${detail?.id}`}>
                                        <span>📖 Read Book</span>
                                    </a> )
                            : ('N/A')
                            }
                        </div>
                    ) }
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium">Uploader</span>
                        <span className="capitalize font-medium">{detail?.expand?.uploader?.name ? detail?.expand?.uploader?.name : 'N/A'}</span>
                    </div>
                    { detail?.stock > 0 && (
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-base-content/60 font-medium">Stock</span>
                            <span className="capitalize font-medium text-xs">{detail?.stock}</span>
                        </div>
                    ) }
                    <div className="flex justify-between items-start gap-4 border-t border-base-200/50 pt-1 mt-1">
                        <span className="text-base-content/60 font-medium">Publish Date</span>
                        <div className="text-right flex flex-col">
                        <span className='text-xs'>{detail?.publishDate ? formatDate(detail?.publishDate) : '-'}</span>
                        <span className="text-[10px] text-base-content/50 mt-0.5">
                            {detail?.publishDate ? timeAgo(detail?.publishDate) : ''}
                        </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-base-content/60 font-medium">Created</span>
                        <div className="text-right flex flex-col">
                        <span className='text-xs'>{detail?.created ? formatDate(detail?.created) : '-'}</span>
                        <span className="text-[10px] text-base-content/50 mt-0.5">
                            {detail?.created ? timeAgo(detail?.created) : ''}
                        </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-base-content/60 font-medium">Updated</span>
                        <div className="text-right flex flex-col">
                        <span className='text-xs'>{detail?.updated ? formatDate(detail?.updated) : '-'}</span>
                        <span className="text-[10px] text-base-content/50 mt-0.5">
                            {detail?.updated ? timeAgo(detail?.updated) : ''}
                        </span>
                        </div>
                    </div>

                    </div>
                    { role === 'edmin' && (
                        <div className="card-actions justify-end mt-4 border-t border-base-200 pt-4">
                            <button 
                                type="button"
                                className="btn btn-primary btn-sm md:btn-md gap-2" 
                                onClick={(e) => setOpenEdit((prev) => ({
                                ...prev,
                                status: true,
                                data: detail
                                }))}
                            >
                                <UserRoundPen size={18} />
                                <span>Edit Buku</span>
                            </button>
                        </div>
                    )}
                </div>

                </div>
            </DialogPanel>
        </Dialog>

    )
}
