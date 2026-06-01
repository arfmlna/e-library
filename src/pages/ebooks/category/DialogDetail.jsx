import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { UserRoundPen, X } from 'lucide-react'
import anonim from '/anonim.jpg'
import { formatDate, timeAgo } from '@/constants/globals'

export default function DialogDetail({ open, onClose, detail, setOpenEdit }){
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/80"/>
            <DialogPanel
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] max-w-md sm:w-full bg-background border rounded-lg shadow-lg"
            >
                <div className="float-end absolute z-51 right-3 top-3" onClick={onClose}>
                    <X size={20} />
                </div>
                <div className="card shadow-sm">
                    <figure>
                        { detail?.latest_poster ? (
                            <img
                            className='w-full object-cover aspect-video'
                            src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${detail?.latest_book_collection_id}/${detail?.latest_book_id}/${detail?.latest_poster}`}
                            alt={detail?.name} />
                        ) : (
                            <img
                            className='w-full object-cover aspect-video'
                            src={anonim}
                            alt={detail?.name} />
                        ) }
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{detail?.name}</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td className='capitalize'>: {detail?.name}</td>
                                </tr>
                                <tr>
                                    <td>total buku</td>
                                    <td className='capitalize'>: {detail?.total_books}</td>
                                </tr>
                                <tr>
                                    <td>Created</td>
                                    <td>
                                        : { detail?.created ? formatDate(detail?.created) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        : { detail?.created ? timeAgo(detail?.created) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Updated</td>
                                    <td>
                                        : { detail?.updated ? formatDate(detail?.updated) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        : { detail?.updated ? timeAgo(detail?.updated) : '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="card-actions justify-end">
                        <button className="btn-xs md:btn-md btn btn-primary" onClick={(e) => setOpenEdit((prev) => ({
                            ...prev,
                            status: true,
                            data: detail
                        }))}>
                            <UserRoundPen />
                        </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    )
}
