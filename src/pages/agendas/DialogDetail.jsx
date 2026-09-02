import { Dialog, DialogBackdrop, DialogPanel } from '@/components/animate-ui/primitives/headless/dialog'
import { UserRoundPen, X } from 'lucide-react'
import { formatDate, timeAgo } from '@/constants/dateFormat'

export default function DialogDetail({ open, onClose, detail, setOpenEdit }){
    const colorMap = {
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-gray-800'
    };
    const theme = localStorage.getItem('theme')
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
                <div className={`relative w-full aspect-video ${colorMap[detail?.theme]} overflow-hidden`}>
                    {detail?.title && (
                        <div className="flex justify-center items-center h-full">
                            <h1 className='text-4xl uppercase'>{detail?.title}</h1>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-base-100 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col gap-4 -mt-4 relative z-10 bg-base-100 rounded-t-xl">
                    <div>
                    <h2 className="text-xl font-bold tracking-tight text-base-content break-words capitalize">{detail?.title}</h2>
                    <p className="text-xs text-base-content/60 mt-0.5">Detail data supplier</p>
                    </div>
                    <div className="flex flex-col gap-3 text-sm border-t border-base-200 pt-4">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium">Title</span>
                        <span className="capitalize font-semibold">{detail?.title}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium">Event Date</span>
                        <span className="capitalize font-semibold">{detail?.eventDate && formatDate(detail?.eventDate)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium">Location</span>
                        <span className="capitalize font-semibold">{detail?.location}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4 border-t border-base-200/50 pt-2 mt-1">
                        <span className="text-base-content/60 font-medium">Created</span>
                        <div className="text-right flex flex-col">
                        <span>{detail?.created ? formatDate(detail?.created) : '-'}</span>
                        <span className="text-xs text-base-content/50 mt-0.5">
                            {detail?.created ? timeAgo(detail?.created) : ''}
                        </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-base-content/60 font-medium">Updated</span>
                        <div className="text-right flex flex-col">
                        <span>{detail?.updated ? formatDate(detail?.updated) : '-'}</span>
                        <span className="text-xs text-base-content/50 mt-0.5">
                            {detail?.updated ? timeAgo(detail?.updated) : ''}
                        </span>
                        </div>
                    </div>

                    </div>
                    <div className="card-actions justify-end mt-4 border-t border-base-200 pt-4">
                    <button 
                        type="button"
                        className="btn btn-primary btn-sm md:btn-md gap-2" 
                        onClick={() => setOpenEdit((prev) => ({
                        ...prev,
                        status: true,
                        data: detail
                        }))}
                    >
                        <UserRoundPen size={18} />
                        <span>Edit Kategori</span>
                    </button>
                    </div>
                </div>

                </div>
            </DialogPanel>
        </Dialog>

    )
}
