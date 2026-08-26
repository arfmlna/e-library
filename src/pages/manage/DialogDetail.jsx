import { Dialog, DialogBackdrop, DialogPanel } from '@/components/animate-ui/primitives/headless/dialog'
import { UserRound, UserRoundPen, X } from 'lucide-react'
import { formatDate, timeAgo } from '@/constants/dateFormat'
import { pb } from '@/utils/pocketbase'

export default function DialogDetail({ open, onClose, detail, setOpenEdit }){
    const theme = localStorage.getItem('theme')
    const avatarUrl = pb.files.getURL(detail, detail.avatar)
    return (
        <Dialog open={open} onClose={onClose} data-theme={theme}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
            <DialogPanel className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-200 shadow-2xl sm:w-full overflow-hidden">
                <div className="w-full bg-base-100 text-base-content relative">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute right-3 top-3 z-50 rounded-md p-1.5 bg-black/40 text-white hover:bg-black/60 focus:outline-none shadow-md backdrop-blur-xs"
                >
                    <X size={18} />
                </button>
                <div className="card bg-base-100 rounded-none">
                    {/* Area Foto Profil / Avatar */}
                    <figure className="relative overflow-hidden aspect-video bg-[#a9a9a9]">
                    {detail?.avatar ? (
                        <img
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        src={avatarUrl}
                        alt={detail?.name} 
                        />
                    ) : (
                        <div className="bg-[#a9a9a9] flex justify-center">
                            <UserRound size={250} />
                        </div>
                    )}
                    </figure>
                    <div className="card-body p-6 gap-4">
                    <div>
                        <h2 className="card-title text-xl font-bold tracking-tight text-base-content">{detail?.name}</h2>
                        <p className="text-xs text-base-content/60 capitalize mt-0.5">{detail?.role || 'No Role'}</p>
                    </div>
                    <div className="flex flex-col gap-3 text-sm border-t border-base-200 pt-4">
                        <div className="flex justify-between items-start gap-4">
                        <span className="text-base-content/60 font-medium min-w-[80px]">Email</span>
                        <span className="text-right break-all">{detail?.email}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium">Status</span>
                        {detail?.emailVisibility ? (
                            <span className="badge badge-success badge-sm text-xs font-semibold px-2 py-2 text-white">Terverifikasi</span>
                        ) : (
                            <span className="badge badge-error badge-sm text-xs font-semibold px-2 py-2 text-white">Belum Verifikasi</span>
                        )}
                        </div>
                        <div className="flex justify-between items-center gap-4">
                        <span className="text-base-content/60 font-medium">Position</span>
                        <span className="capitalize font-semibold">{detail?.role}</span>
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
                        onClick={(e) => setOpenEdit((prev) => ({
                            ...prev,
                            status: true,
                            data: detail
                        }))}
                        >
                        <UserRoundPen size={18} />
                        <span>Edit Profil</span>
                        </button>
                    </div>
                    </div>
                </div>

                </div>
            </DialogPanel>
        </Dialog>
    )
}
