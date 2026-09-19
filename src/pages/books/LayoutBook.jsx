"use client"
import React, { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'

const PopupInformation = lazy(() => import('@/components/book/PopupInformation'))
const Poster = lazy(() => import('@/components/book/Poster'))
const GridBook = lazy(() => import('@/components/ui/CardBook/GridBook'))
const ListBook = lazy(() => import('@/components/ui/CardBook/ListBook'))
const PaginationBook = lazy(() => import('@/components/ui/CardBook/PaginationBook'))
const NotFoundBooks = lazy(() => import('@/components/ui/CardBook/NotFoundBooks'))
const Layout = lazy(() => import('@/components/ui/layout'))
const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))

export default function LayoutBook({
    title, 
    subTitle,
    books, 
    refreshData, 
    searchItem, 
    setSearchItem, 
    page, 
    setPage, 
    setCategory, 
    selectedType, 
    setSelectedType,
    isLoading,
    error
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
            { isLoading ? <Loading variant='card' count={5} /> : error ? <Error refetch={refreshData} variant='full' /> : 
                books?.items?.length === 0 ? (
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
                                    width={240}
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
                )
            }
        </Layout>
    )
}