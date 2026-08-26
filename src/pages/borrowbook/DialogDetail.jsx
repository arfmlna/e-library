import { Dialog, DialogBackdrop, DialogPanel } from '@/components/animate-ui/primitives/headless/dialog'
import { Info, UserRoundPen, X } from 'lucide-react'
import anonim from '/anonim.jpg'
import { dateOnlyFormatted, formatDate, timeAgo, timeFormatted } from '@/constants/dateFormat'
import { Fragment, useEffect, useState } from 'react'
import { pb } from '@/utils/pocketbase'
import { idrFormatted } from '@/constants/IDRFormat'

const CountDown = ({ tglPengembalian, tglPeminjaman }) => {
    const [sisaWaktu, setSisaWaktu] = useState({
        hari: 0,
        jam: 0,
        menit: 0,
        detik: 0,
        selesai: false
    });

    useEffect(() => {
        const hitungSisaWaktu = () => {
        const sekarang = new Date()
        const overDate = tglPengembalian

        if (isNaN(overDate.getTime()) || isNaN(new Date(tglPeminjaman).getTime())) return;

        const selisihMilidetik = overDate.getTime() - sekarang.getTime();

        if (selisihMilidetik <= 0) {
            setSisaWaktu({ hari: 0, jam: 0, menit: 0, detik: 0, selesai: true });
            return;
        }

        const totalDetik = Math.floor(selisihMilidetik / 1000);

        setSisaWaktu({
            hari: Math.floor(totalDetik / (24 * 3600)),
            jam: Math.floor((totalDetik % (24 * 3600)) / 3600),
            menit: Math.floor((totalDetik % 3600) / 60),
            detik: totalDetik % 60,
            selesai: false
        })
    };

        hitungSisaWaktu();
        const intervalId = setInterval(hitungSisaWaktu, 1000);

        return () => clearInterval(intervalId);
    }, [tglPengembalian]);

    const hitungDendaDinamis = () => {
        const pinjam = new Date(tglPeminjaman);
        const sekarang = new Date();
        
        if (isNaN(pinjam.getTime())) return 0;

        const dendaPerminggu = 10000;
        
        const selisihMilidetik = sekarang.getTime() - pinjam.getTime();
        if (selisihMilidetik <= 0) return 0;

        const jmlHariPeminjaman = selisihMilidetik / (1000 * 60 * 60 * 24); 
        const jmlDenda = Math.trunc(jmlHariPeminjaman / 7);
        
        return jmlDenda * dendaPerminggu;
    };

    const denda = hitungDendaDinamis();

    return(
        <Fragment>
            <tr>
                <td>Tenggat Waktu</td>
                <td>: { sisaWaktu.selesai ? (
                    <span className="text-red-500 font-bold">Time Out</span>
                ) : (
                    <span className="countdown font-mono text-base gap-1">
                        <span style={{"--value":sisaWaktu?.hari}} aria-live="polite" aria-label={sisaWaktu?.hari}>10</span>D
                        <span style={{"--value":sisaWaktu?.jam}} aria-live="polite" aria-label={sisaWaktu?.jam}>24</span>H
                        <span style={{"--value":sisaWaktu?.menit}} aria-live="polite" aria-label={sisaWaktu?.menit}>59</span>M
                        <span style={{"--value":sisaWaktu?.detik}} aria-live="polite" aria-label={sisaWaktu?.detik}>59</span>S
                    </span>
                ) }
                </td>
            </tr>
            <tr>
                <td>Denda</td>
                <td>: <span className={denda > 0 ? "text-amber-400 font-bold" : ""}>{idrFormatted(denda)}</span></td>
            </tr>
        </Fragment>
    )
}

export default function DialogDetail({ open, onClose, detail, setOpenEdit }){
    let peminjaman = new Date(detail?.tglPeminjaman)

    let Pengembalian = new Date(peminjaman)
    if (!isNaN(peminjaman.getTime())) {
        Pengembalian.setDate(peminjaman.getDate() + 7);
    }

    const posterUrl = pb.files.getURL(detail.expand.buku, detail.expand.buku.poster)

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
                        { detail?.expand?.buku?.poster ? (
                            <img
                            className='w-full object-cover'
                            src={posterUrl}
                            alt={detail?.expand?.buku?.title} />
                        ) : (
                            <img
                            className='w-full object-cover'
                            src={anonim}
                            alt={detail?.expand?.buku?.title} />
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
                                    <td>: {detail?.expand?.peminjam?.name} 
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{detail?.peminjam}</p>
                                                    <p>{detail?.expand?.peminjam?.email}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Judul Buku</td>
                                    <td className='capitalize'>: {detail?.expand?.buku?.title} 
                                        <div className="tooltip ml-2">
                                            <div className="tooltip-content">
                                                <div className="">
                                                    <p>{detail?.buku}</p>
                                                </div>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Petugas</td>
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
                                    <td>Email Petugas</td>
                                    <td>: {detail?.expand?.petugas?.email}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal Peminjaman</td>
                                    <td>: {dateOnlyFormatted(detail?.tglPeminjaman)}
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
                                <CountDown 
                                    tglPengembalian={Pengembalian} 
                                    tglPeminjaman={detail?.tglPeminjaman}
                                />
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
