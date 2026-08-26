"use client"
import React, { lazy, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { saveBookToOffline } from '@/constants/globals'
import useOnlineStatus from '@/constants/useOnlineStatus'
import { pb } from '@/utils/pocketbase'

const ListBook = lazy(() => import('@/components/ui/CardBook/ListBook'))
const GridBook = lazy(() => import('@/components/ui/CardBook/GridBook'))
const PaginationBook = lazy(() => import('@/components/ui/CardBook/PaginationBook'))
const NotFoundBooks = lazy(() => import('@/components/ui/CardBook/NotFoundBooks'))
const DialogInformation = lazy(() => import('@/components/ui/CardBook/DialogInformation'))
const BookPoster = lazy(() => import('@/components/ui/CardBook/Poster'))
const Layout = lazy(() => import('@/components/ui/layout'))

const myId = pb?.authStore?.record?.id

const PopupInformation = ({ data, clickId, setClickId }) => {
    const isOnline = useOnlineStatus()
    return(
        <DialogInformation 
            title={"Informasi"}
            subTitle={"Informasi Meta Data Konten yang Tersedia"}
            content={
                <tbody>
                    <tr>
                        <td>Judul</td>
                        <td>{ data.title }</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td className='flex flex-row flex-wrap gap-1'>
                            { data?.expand?.category 
                            ? data?.expand?.category?.map((data) => (
                                <div className="" 
                                    key={data?.id}>
                                    <NavLink 
                                        to={`/category/${data?.name}`} className='btn btn-neutral btn-xs mb-1'
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
                        <td>{ data.author ? data.author : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Pengupload</td>
                        <td>
                            { data.expand?.uploader?.name ? 
                            data.expand?.uploader?.name : 
                            'Unknow'}
                        </td>
                    </tr>
                </tbody>
            }
            download={
                isOnline && (
                    <button className="btn btn-sm"
                        onClick={() => saveBookToOffline(data, myId)}
                    >
                        Download
                    </button>
                )
            }
            clickId={clickId} 
            setClickId={setClickId} 
            redirect={'online'} 
            data={data} 
        />
    )
}

const Poster = ({data, height, width}) => {
    const posterUrl = useMemo(() => {
        const isPoster = data.poster ? data?.poster : data?.pdfFile
        const poster = pb.files.getURL(data, isPoster)
        return poster;
    }, [data.poster, data?.pdfFile, data.collectionId, data.id])

    return (
        <BookPoster 
            data={data} 
            posterUrl={posterUrl} 
            height={height} 
            widht={width}
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
    
    return (
        <Layout 
        title={title}
        searchItem={searchItem}
        handleChange={handleChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        books={books}>
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
                                />
                            }
                            poster={
                                <Poster
                                data={data}
                                width={320}
                                height={384}
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