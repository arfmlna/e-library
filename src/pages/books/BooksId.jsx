import React, { lazy, Suspense } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { pb } from '../../utils/pocketbase'
import { useQuery } from '@tanstack/react-query';

const BookFlip = lazy(() => import('../../components/bookFlip/BookFlip')) 

export default function BooksId() {
    const { bookId } = useParams()
    const location = useLocation()

    const bookData = location.state?.bookData;
    const bookState = pb.files.getURL(bookData, bookData.pdfFile)

    const width = 500
    const config = {
        minWidth: 320,
        minHeight: 450,
        width: width,
        height: width * 1.414,
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

    const { data: getBook } = useQuery({
        queryKey: ['book', bookId],
        queryFn: async () => {
            const data = pb.collection('books').getOne(`${bookId}`)
            const pdfUrl = pb.files.getURL(data, data?.pdfFile)
            return {
                ...data,
                pdfUrl: pdfUrl
            }
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false, 
    });

    const book = bookState ? bookState : getBook?.pdfUrl

    return (
        <div className='w-full h-full flex flex-col'>
            <Suspense fallback={
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <p className='text-center font-bold text-4xl'>Loading...</p>
                </div>
            }>
                <div className="min-h-screen">
                    <BookFlip path={book} options={config} />
                </div>
            </Suspense>
        </div>
    )
}
