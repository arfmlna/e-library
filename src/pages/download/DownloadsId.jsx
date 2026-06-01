import BookFlip from '@/components/bookFlip/BookFlip'
import { getOfflineBookById } from '@/constants/globals'
import { useQuery } from '@tanstack/react-query'
import React, { Suspense, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function DownloadsId() {
    const { downloadId } = useParams()
    const navigate = useNavigate()

    const width = 450

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

    const { data: offlineBook, isLoading } = useQuery({
        queryKey: ['offlineBook', downloadId],
        queryFn: async () => {
            const res = await getOfflineBookById(downloadId)
            return res
        }
    })

    const pdfUrl = useMemo(() => {
        if (offlineBook?.pdfBlob instanceof Blob) {
            return URL.createObjectURL(offlineBook.pdfBlob);
        }
        return null;
    }, [offlineBook]);

    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    if (isLoading) (
        <div className='w-full h-full flex flex-col justify-center'>
            <Suspense fallback={
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <p className='text-center font-bold text-4xl'>Loading...</p>
                </div>
            }>
                <div>Memuat...</div>
            </Suspense>
        </div>
    );
    
    if (!pdfUrl) (
        <div className='w-full h-full flex flex-col justify-center'>
            <Suspense fallback={
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <p className='text-center font-bold text-4xl'>Loading...</p>
                </div>
            }>
                <div>File tidak ditemukan atau format salah.</div>
            </Suspense>
        </div>
    );


    return (
        <div className='w-full h-full flex flex-col justify-center'>
            <Suspense fallback={
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <p className='text-center font-bold text-4xl'>Loading...</p>
                </div>
            }>
                <BookFlip path={pdfUrl} options={config} />
            </Suspense>
        </div>
    )
}
