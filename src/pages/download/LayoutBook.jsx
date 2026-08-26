"use client"
import React, { lazy, useEffect, useState } from 'react'
import { removeBookFromOffline } from '@/constants/globals'
import { formatDate } from '@/constants/dateFormat'
import { pb } from '@/utils/pocketbase'
import { NavLink } from 'react-router-dom'

const GridBook = lazy(() => import('@/components/ui/CardBook/GridBook'))
const ListBook = lazy(() => import('@/components/ui/CardBook/ListBook'))
const PaginationBook = lazy(() => import('@/components/ui/CardBook/PaginationBook'))
const DialogInformation = lazy(() => import('@/components/ui/CardBook/DialogInformation'))
const BookPoster = lazy(() => import('@/components/ui/CardBook/Poster'))
const NotFoundBooks = lazy(() => import('@/components/ui/CardBook/NotFoundBooks'))
const Layout = lazy(() => import('@/components/ui/layout'))
const myId = pb?.authStore?.record?.id

const PopupInformation = ({ data, clickId, setClickId, handleRemove }) => {
    return(
        <DialogInformation
            title={"Informasi"}
            subTitle={"Informasi Meta Data Konten yang Tersedia"}
            content={
                // <tbody>
                //     <tr>
                //         <td>Judul</td>
                //         <td>{ data.title }</td>
                //     </tr>
                //     <tr>
                //         <td>Category</td>
                //         <td className='flex flex-row flex-wrap gap-1'>
                //             { data?.category 
                //             ? data?.category?.map((data) => (
                //                 <div className="" 
                //                     key={data?.id}>
                //                     <NavLink 
                //                         to={`/category/${data?.name}`} className='btn btn-neutral btn-xs mb-1'
                //                     >
                //                         {data?.name}
                //                     </NavLink>
                //                 </div>
                //             )) 
                //             : 'N/A' }
                //         </td>
                //     </tr>
                //     <tr>
                //         <td>Penulis</td>
                //         <td>{ data.author ? data.author : 'N/A' }</td>
                //     </tr>
                //     <tr>
                //         <td>Pengupload</td>
                //         <td>
                //             { data.uploader ? 
                //             data.uploader : 
                //             'Unknow'}
                //         </td>
                //     </tr>
                // </tbody>
            
                <tbody>
                    <tr>
                        <td>Kode</td>
                        <td className='capitalize'>{ data?.kode ? data?.kode : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Judul</td>
                        <td className='capitalize'>{ data?.title ? data?.title : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Tipe Buku</td>
                        <td className='capitalize'>{ data?.bookType ? data?.bookType : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Publisher</td>
                        <td className='capitalize'>{ data?.publisher ? data?.publisher : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td className='flex flex-row flex-wrap gap-1'>
                            { data?.category 
                            ? data?.category?.map((data) => (
                                <div className="" 
                                    key={data?.id}>
                                    <NavLink 
                                        to={`/category/${data?.name}`} className='btn btn-neutral btn-xs mb-1 capitalize'
                                    >
                                        {data?.name}
                                    </NavLink>
                                </div>
                            )) 
                            : 'N/A' }
                        </td>
                    </tr>
                    <tr>
                        <td>Penulis</td>
                        <td className='capitalize'>{ data.author ? data.author : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Pengupload</td>
                        <td className='capitalize'>
                            { data?.uploader ? 
                            data?.uploader : 
                            'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Tanggal Upload</td>
                        <td className='capitalize'>
                            { data?.publishDate ? formatDate(data?.publishDate) : 'N/A'}
                        </td>
                    </tr>
                </tbody>
            }
            download={
                <button className="btn btn-sm"
                    onClick={() => handleRemove(data?.id, myId)}
                >
                    Remove
                </button>
            }
            clickId={clickId} 
            setClickId={setClickId} 
            redirect={'offline'} 
            data={data} 
        />
    )
}

const Poster = ({data, width, height}) => {
    const [posterUrl, setPosterUrl] = useState(null);

    useEffect(() => {
        const blobFileUrl = data?.posterUrl || data?.pdfUrl || null;
        setPosterUrl(blobFileUrl);
    }, [data?.posterUrl, data?.pdfUrl]);

    return (
        <BookPoster
            data={data}
            posterUrl={posterUrl}
            widht={width}
            height={height}
        />
    )
}

export default function LayoutBook({title, books, refreshData, searchItem, setSearchItem, page, setPage, searchTerm}) {
    const [hoverId, setHoverId] = useState(null)
    const [viewMode, setViewMode] = useState("grid")
    const [clickId, setClickId] = useState({
        id: null,
        status: false
    })

    const handleChange = (result) => {
        setSearchItem(result)
        if (page !== 1) {
            setPage(1)
        }
    }

    const handleRemoveBookOffline = async (bookId, userId) => {
        const success = await removeBookFromOffline(bookId, userId);
        
        if (success) {
            refreshData(); 
        }
    };

    return (
        <Layout 
        title={title}
        subtitle={"Kelola dan pinjam buku fisik maupun digital dalam satu tempat."}
        searchItem={searchItem}
        handleChange={handleChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        books={books}
        >
            {books?.items?.length === 0 ? (
                <NotFoundBooks 
                    searchItem={searchItem} 
                />
            ) : (
                <div className=''>
                    { viewMode === 'grid' ? (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-center">
                        { books?.items?.map((data) => (
                            <GridBook
                            key={data?.id}
                            data={data}
                            setClickId={setClickId}
                            hoverId={hoverId}
                            setHoverId={setHoverId}
                            popupInformation={
                                <PopupInformation
                                data={data}
                                clickId={clickId}
                                setClickId={setClickId}
                                handleRemove={handleRemoveBookOffline}
                                />
                            }
                            poster={
                                <Poster
                                data={data}
                                width={324}
                                height={240}
                                />
                            }
                            />
                        ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                        {books?.items?.map((data) => (
                            <ListBook
                            key={data?.id}
                            data={data}
                            setClickId={setClickId}
                            hoverId={hoverId}
                            setHoverId={setHoverId}
                            popupInformation={
                                <PopupInformation
                                data={data}
                                clickId={clickId}
                                setClickId={setClickId}
                                handleRemove={handleRemoveBookOffline}
                                />
                            }
                            poster={
                                <Poster
                                data={data}
                                height={100}
                                />
                            }
                            />
                        ))}
                        </div>
                    )}
                    <PaginationBook
                        books={books}
                        setPage={setPage}
                        refreshData={refreshData}
                    />
                </div>
            )}
        </Layout>
    )
}