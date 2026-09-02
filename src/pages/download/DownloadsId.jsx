import { getOfflineBookById } from '@/constants/globals'
import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { lazy } from 'react'
import { useParams } from 'react-router-dom'

const BookFlip = lazy(() => import('@/components/bookFlip/BookFlip'))

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

    const { data: offlineBook } = useQuery({
        queryKey: ['offlineBook', downloadId],
        queryFn: async () => {
            const res = await getOfflineBookById(downloadId, userId)
            return res
        },
        // staleTime: Infinity,
        refetchOnWindowFocus: false, 
    })

    const pdfUrl = offlineBook?.pdfUrl


    return (
        <div className='w-full h-full flex flex-col'>
            <div className="min-h-screen">
                <BookFlip path={pdfUrl} options={config} />
            </div>
        </div>
    )
}
