import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { UserRoundPen, X } from 'lucide-react'
import anonim from '/anonim.jpg'
import { formatDate, timeAgo } from '@/constants/globals'
import { Link } from 'react-router-dom'

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
                <div className="card shadow-sm relative overflow-hidden">
                    <figure className='absolute -z-10'>
                        { detail?.poster ? (
                            <img
                            className='w-full object-cover'
                            src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${detail.collectionId}/${detail.id}/${detail?.poster}`}
                            alt={detail?.title} />
                        ) : (
                            <img
                            className='w-full object-cover'
                            src={anonim}
                            alt={detail?.title} />
                        ) }
                    </figure>
                    <div className="absolute inset-0 bg-black/50 rounded-md"></div>
                    <div className="card-body text-white drop-shadow-md shadow-white">
                        <h2 className="card-title">{detail?.title}</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td className='capitalize'>: {detail?.id}</td>
                                </tr>
                                <tr>
                                    <td>Title</td>
                                    <td className='capitalize'>: {detail?.title}</td>
                                </tr>
                                <tr>
                                    <td>Author</td>
                                    <td className='capitalize'>: {detail?.author ? detail?.author : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>File</td>
                                    <td className='capitalize'>: 
                                        {detail?.pdfFile ? (<Link className='btn btn-neutral btn-xs ml-1' target='_blank' to={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${detail.collectionId}/${detail.id}/${detail?.pdfFile}`}>book</Link>) : ' N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Uploader</td>
                                    <td className='capitalize'>: { detail?.expand?.uploader?.name ? detail?.expand?.uploader?.name : 'N/A' }</td>
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    <td className='capitalize'>: { detail?.expand?.category 
                                        ? detail?.expand?.category?.map((detail) => (
                                            <span className='' key={detail?.id}>{detail?.name}, </span>
                                        )) 
                                        : 'N/A' }</td>
                                </tr>
                                <tr>
                                    <td>Publish Date</td>
                                    <td>
                                        : { detail?.publishDate ? formatDate(detail?.publishDate) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        : { detail?.publishDate ? timeAgo(detail?.publishDate) : '-'}
                                    </td>
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
