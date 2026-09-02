"use client"
import React, { lazy, useState } from 'react'

const PopupInformation = lazy(() => import('@/components/book/PopupInformation'))
const Poster = lazy(() => import('@/components/book/Poster'))
const ListBook = lazy(() => import('@/components/ui/CardBook/ListBook'))
const GridBook = lazy(() => import('@/components/ui/CardBook/GridBook'))
const PaginationBook = lazy(() => import('@/components/ui/CardBook/PaginationBook'))
const NotFoundBooks = lazy(() => import('@/components/ui/CardBook/NotFoundBooks'))
const Layout = lazy(() => import('@/components/ui/layout'))

export default function LayoutBook({
    title, 
    books, 
    refreshData, 
    searchItem, 
    setSearchItem, 
    page, 
    setPage, 
}) {
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