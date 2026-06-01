"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CursorProvider, Cursor, CursorFollow } from '@/components/animate-ui/components/animate/cursor'
import { MousePointer2, X } from 'lucide-react'
import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { saveBookToOffline } from '@/constants/globals'
import useOnlineStatus from '@/constants/useOnlineStatus'
import SearchData from '@/components/search/Search'

const PointerDescription = ({hoverId, data}) => {
    return (
        <>
            {
                hoverId === data.id && (
                    <CursorProvider global={false}>
                            <Cursor>
                                <MousePointer2 size={25} fill='#000000'  color='#000000' />
                            </Cursor>
                            <CursorFollow 
                                key={data.id}
                                side={'top'}
                                sideOffset={15}
                                align={'center'}
                                alignOffset={5}
                            >
                                <div className="p-2 text-sm rounded-sm bg-black/40 text-white shadow-md shadow-blue-600">
                                    <div>
                                        {data.title}
                                    </div>
                                    <div>
                                        {data.author}
                                    </div>
                                </div>
                            </CursorFollow>
                    </CursorProvider>
                )
            }
        </>
    )
}

const DialogInformation = ({clickId, setClickId, redirect, DownloadElement=null, data}) => {
    return (
        <>
            { clickId.id === data.id && (
                <Dialog open={clickId.status} onClose={() => setClickId({
                    id: null,
                    status: false
                })}>
                    <DialogBackdrop className="fixed inset-0 z-50 bg-black/80" />
                    <DialogPanel
                    className="sm:max-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 border bg-background p-6"
                    >
                    <DialogHeader>
                        <DialogTitle className="text-lg">Informasi</DialogTitle>
                        <DialogDescription className="text-sm">
                            Informasi Meta Data Konten yang Tersedia
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 text-sm text-muted-foreground">
                        <div className="overflow-x-auto">
                            <table className='table table-sm'>
                                <tbody>
                                    <tr>
                                        <td>Judul</td>
                                        <td>{ data.title }</td>
                                    </tr>
                                    <tr>
                                        <td>Penulis</td>
                                        <td>{ data.Author ? data.Author : 'N/A' }</td>
                                    </tr>
                                    <tr>
                                        <td>Pengupload</td>
                                        <td>{ data.expand?.uploader?.name ? data.expand?.uploader?.name : 'Unknow' }</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    { (data?.pdfFile || data?.pdfBlob) && (
                        <DialogFooter>
                            <div className="grid grid-cols-3 gap-4">
                                <NavLink to={`${redirect}/${data.id}`} className="bg-primary text-primary-foreground px-4 py-2 text-sm text-center">
                                    Flip Book
                                </NavLink>
                                <NavLink to={`/reader/${data.id}`} className="bg-primary text-primary-foreground px-4 py-2 text-sm text-center">
                                    Reader
                                </NavLink>
                                { DownloadElement }
                            </div>
                        </DialogFooter>
                    ) }

                    <DialogClose className="absolute top-4 right-4">
                        <X className="size-4" />
                        <span className="sr-only" onClick={() => setClickId({
                            id: null,
                            status: false
                        })}>Close</span>
                    </DialogClose>
                    </DialogPanel>
                </Dialog>
            ) }
        </>
    )
}

const Poster = ({data}) => {
    const [posterUrl, setPosterUrl] = useState('');

    useEffect(() => {
        // Jika data poster merupakan objek Blob (Mode Offline)
        if (data.poster instanceof Blob) {
            const objectUrl = URL.createObjectURL(data.poster);
            setPosterUrl(objectUrl);

            // CLEANUP: Otomatis menghapus URL saat data berubah atau komponen unmount
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }

        // Jika data poster merupakan string nama file (Mode Online / PocketBase)
        const remoteUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${data.collectionId}/${data.id}/${data.poster}`;
        setPosterUrl(remoteUrl);

        // Tidak memerlukan cleanup jika menggunakan URL biasa dari server
        return undefined;
    }, [data.poster, data.collectionId, data.id]);

    return (
        <>
            <div className="card ring-2 ring-black shadow-md shadow-blue-700 w-60 h-96 group-hover/tapGallery:scale-105 hover:transition hover:duration-300 hover:ease-in-out bg-cover"
            style={{backgroundImage: posterUrl ? `url(${posterUrl})` : 'none'}}>
            </div>
        </>
    )
}

const SearchBook = ({searchItem, setSearchItem}) => {
    return (
        <label className="input mt-3 mb-7">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
                >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" className="grow" placeholder="Search" onChange={(e) => setSearchItem(e.target.value)} value={searchItem} />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
        </label>
    )
}

export default function LayoutBook({title, books, refreshData, searchItem, setSearchItem, page, setPage, searchTerm}) {
    const [hoverId, setHoverId] = useState(null)
    const [clickId, setClickId] = useState({
        id: null,
        status: false
    })

    const isOnline = useOnlineStatus()

    const handleChange = (result) => {
        setSearchItem(result)
    }

    useEffect(() => {
        setPage(1)
    }, [searchTerm])
    
    return (
        <div className='w-full min-h-screen select-none pt-28 px-20'>
            <h1 className='text-4xl font-bold mb-1 text-center capitalize'>
                {title}
            </h1>
            <div className="flex justify-end">
                <SearchData searchItem={searchItem} setSearchItem={handleChange} />
            </div>
            {books?.items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg className="w-16 h-16 opacity-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-xl font-semibold">Buku "{searchItem}" tidak ditemukan</p>
                    <p className="text-sm">Coba kata kunci lain atau periksa ejaan Anda.</p>
                </div>
            ) : (
                <div className='pb-20'>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 justify-center pb-5">
                        { books?.items?.map((data) => {
                            return (
                                <div key={data.id}>
                                    <PointerDescription hoverId={hoverId} data={data}  />
                                    <DialogInformation clickId={clickId} setClickId={setClickId} redirect={isOnline ? '/books' : '/downloads'} 
                                    DownloadElement={
                                        isOnline && (
                                            <button className="bg-primary text-primary-foreground px-4 py-2 text-sm text-center"
                                                onClick={() => saveBookToOffline(data)}
                                            >
                                                Download
                                            </button>
                                        )
                                    } data={data} />
                                    <div 
                                    className="transform-3d group/tapGallery z-0 hover:z-20 transition-all ease-in-out duration-300"
                                    onMouseEnter={() => setHoverId(data.id)}
                                    onMouseLeave={() => setHoverId(null)}
                                    onClick={() => setClickId({
                                        id: data.id,
                                        status: true
                                    })}>
                                        <Poster data={data}/>
                                    </div>
                                </div>
                            )
                        }) }
                    </div>
                    <div className="flex flex-col items-center gap-2 my-4">
                        <div className="join">
                            <button 
                            className="join-item btn btn-sm"
                            disabled={books?.page <= 1}
                            onClick={() => {
                                setPage(books?.page - 1)
                                refreshData()
                            }}
                            >
                            « Prev
                            </button>
                            
                            <button className="join-item btn btn-sm no-animation">
                            Halaman {books?.page} dari {books?.totalPages}
                            </button>
                            
                            <button 
                            className="join-item btn btn-sm"
                            disabled={books?.page >= books?.totalPages}
                            onClick={() => {
                                setPage(books?.page + 1)
                                refreshData()
                            }}
                            >
                            Next »
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}