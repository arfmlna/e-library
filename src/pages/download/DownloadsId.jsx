import { getOfflineBookById } from '@/constants/globals'
import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { lazy } from 'react'
import { useParams } from 'react-router-dom'

const BookFlip = lazy(() => import('@/components/bookFlip/BookFlip'))
const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

export default function DownloadsId() {
    const { downloadId } = useParams()
    const userId = pb.authStore.record.id
    
    const width = 500

    const config = {
        minWidth: width,
        minHeight: width * 1.414,
        drawShadow: true,
        size: 'stretch',
        flipTime: 1000,
        usePortrait: false,
        startIndex: 1,
        autoSize: true,
        maxShadowOpacity: 2,
        showCover: true,
        mobileScrollSupport: true,
        swipeDistance: 30,
        clickEventForward: true,
        useMouseEvent: true,
        renderOnlyPageLengthChange: true
    }

    const { data: offlineBook, isLoading, refetch, error } = useQuery({
        queryKey: ['offlineBook', downloadId],
        queryFn: async () => {
            const res = await getOfflineBookById(downloadId, userId)
            return res
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    const pdfUrl = offlineBook?.pdfUrl


    return (
        <div className='w-full h-full flex flex-col'>
            <div className="min-h-screen">
                { isLoading ? (
                        <div className="max-w-2xl mx-auto flex items-center h-screen">
                            <Loading />
                        </div>
                    ) : error ? (
                    <div className="max-w-2xl mx-auto flex items-center h-screen">
                        <Error refetch={refetch} variant='card' />
                    </div>
                ) : 
                    !pdfUrl ? (
                        <div className="max-w-2xl mx-auto flex items-center h-screen">
                            <NotFound />
                        </div>
                    ) : (
                        <BookFlip path={pdfUrl} options={config} />
                    )
                }
            </div>
        </div>
    )
}
