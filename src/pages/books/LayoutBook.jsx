"use client"
import React, { lazy, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { formatDate } from '@/constants/dateFormat'
import { saveBookToOffline } from '@/constants/globals'
import useOnlineStatus from '@/constants/useOnlineStatus'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import { Download } from 'lucide-react'

const GridBook = lazy(() => import('@/components/ui/CardBook/GridBook'))
const ListBook = lazy(() => import('@/components/ui/CardBook/ListBook'))
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
                        <td>Kode</td>
                        <td className='capitalize'>{ data?.kode_buku }</td>
                    </tr>
                    <tr>
                        <td>Judul</td>
                        <td className='capitalize'>{ data?.title }</td>
                    </tr>
                    <tr>
                        <td>Tipe Buku</td>
                        <td className='capitalize'>{ data?.bookType }</td>
                    </tr>
                    <tr>
                        <td>Publisher</td>
                        <td className='capitalize'>{ data?.expand?.supplier?.supplier }</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td className='flex flex-row flex-wrap gap-1'>
                            { data?.expand?.category 
                            ? data?.expand?.category?.map((data) => (
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
                            { data?.expand?.uploader?.name ? 
                            data?.expand?.uploader?.name : 
                            'Unknow'}
                        </td>
                    </tr>
                    <tr>
                        <td>Tanggal Upload</td>
                        <td className='capitalize'>
                            { data?.publishDate ? formatDate(data?.publishDate) : 'Unknow'}
                        </td>
                    </tr>
                    { data?.bookType !== 'digital' && (
                        <tr>
                            <td>Stock</td>
                            <td className='capitalize'>
                                { data?.stock ? 
                                data?.stock : 
                                'N/A'}
                            </td>
                        </tr>
                    ) }
                </tbody>
            }
            download={
                isOnline && (
                    <button className="btn btn-sm"
                        onClick={() => saveBookToOffline(data, myId)}
                    >
                        <Download size={15} />
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
        const posterUrl = pb.files.getURL(data, isPoster)
        return posterUrl;
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

export default function LayoutBook({
    title, 
    subTitle,
    books, 
    refreshData, 
    searchItem, 
    setSearchItem, 
    page, 
    setPage, 
    searchTerm, 
    category, 
    setCategory, 
    selectedType, 
    setSelectedType
}) {
    const [hoverId, setHoverId] = useState(null)
    const [viewMode, setViewMode] = useState("grid")
    const [clickId, setClickId] = useState({
        id: null,
        status: false
    })

    const { data: categoryList } = useQuery({
        queryKey: ["category"],
        queryFn: () => pb.collection('category').getFullList({
            fields: "id,name",
            requestKey: null,
        }),
        initialData: []
    })

    const handleChange = (result) => {
        setSearchItem(result)
        if (page !== 1) {
            setPage(1)
        }
    }

    const handleBookType = (value) => {
        setSelectedType(value)
    }
    
    return (
        <Layout 
        title={title}
        subtitle={subTitle}
        searchItem={searchItem}
        handleChange={handleChange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categoryList={categoryList}
        setCategory={setCategory}
        books={books}
        handleBookType={handleBookType}
        >
            
            {books?.items?.length === 0 ? (
                <NotFoundBooks searchItem={searchItem} />
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
                                height={240}
                                width={324}
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
                    ) }
                    { page !== false && (
                        <PaginationBook 
                        books={books} 
                        setPage={setPage} 
                        refreshData={refreshData} 
                        />
                    ) }
                </div>
            )}
        </Layout>
    )
}