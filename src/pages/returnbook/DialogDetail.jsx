import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { Info, UserRoundPen, X } from 'lucide-react'
import anonim from '/anonim.jpg'
import { dateOnlyFormatted, formatDate, timeAgo, timeFormatted } from '@/constants/dateFormat'
import { Fragment, useEffect, useState } from 'react'
import { pb } from '@/utils/pocketbase'
import { idrFormatted } from '@/constants/IDRFormat'

export default function DialogDetail({ open, onClose, detail, setOpenEdit }){
    let peminjaman = new Date(detail?.expand?.peminjam?.tglPeminjaman)
    let Pengembalian = new Date(detail?.tglPengembalian)
    const posterUrl = pb.files.getURL(detail.expand.peminjam.expand.buku, detail.expand.peminjam.expand.buku.poster)

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
                        { detail.expand?.peminjam?.expand?.buku?.poster ? (
                            <img
                            className='w-full object-cover'
                            src={posterUrl}
                            alt={detail?.expand?.peminjam?.expand?.buku?.title} />
                        ) : (
                            <img
                            className='w-full object-cover'
                            src={anonim}
                            alt={detail?.expand?.peminjam?.expand?.buku?.title} />
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
                                    <td>Peminjam</td>
                                    <td>: {detail?.expand?.peminjam?.expand?.peminjam?.name} 
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{detail?.peminjam}</p>
                                                    <p>{detail?.expand?.peminjam?.expand?.peminjam?.email}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Judul Buku</td>
                                    <td className='capitalize'>: {detail?.expand?.peminjam?.expand?.buku?.title} 
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{detail?.expand?.peminjam?.buku}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Petugas Peminjaman</td>
                                    <td>: {detail?.expand?.peminjam?.expand?.petugas?.name}
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{detail?.expand?.peminjam?.petugas}</p>
                                                    <p>{detail?.expand?.peminjam?.expand?.petugas?.email}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Petugas Pengambalian</td>
                                    <td>: {detail?.expand?.petugas?.name}
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{detail?.petugas}</p>
                                                    <p>{detail?.expand?.petugas?.email}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tanggal Peminjaman</td>
                                    <td>: {dateOnlyFormatted(detail?.expand?.peminjam?.tglPeminjaman)}
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{dateOnlyFormatted(peminjaman)}</p>
                                                    <p>{timeFormatted(peminjaman)}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tanggal Peminjaman</td>
                                    <td>: {dateOnlyFormatted(detail?.tglPengembalian)}
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{dateOnlyFormatted(Pengembalian)}</p>
                                                    <p>{timeFormatted(Pengembalian)}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Denda</td>
                                    <td>: {idrFormatted(detail?.denda)}</td>
                                </tr>
                                <tr>
                                    <td>Catatan</td>
                                    <td>: {detail?.catatan}</td>
                                </tr>
                                <tr>
                                    <td>Created</td>
                                    <td>
                                        : { detail?.created ? formatDate(detail?.created) : '-'}
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{ detail?.created ? timeAgo(detail?.created) : '-'}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Updated</td>
                                    <td>
                                        : { detail?.updated ? formatDate(detail?.updated) : '-'}
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{ detail?.updated ? timeAgo(detail?.updated) : '-'}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
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
