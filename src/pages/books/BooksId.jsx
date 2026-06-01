import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { pb } from '../../utils/pocketbase'
import { useQuery } from '@tanstack/react-query';

const BookFlip = lazy(() => import('../../components/bookFlip/BookFlip')) 

export default function BooksId() {
    const { bookId } = useParams()

    const { data: book, isLoading } = useQuery({
        queryKey: ['book', bookId],
        queryFn: async () => await pb.collection('books').getOne(`${bookId}`, { requestKey: null }),
        enabled: !!bookId,
    });


    const width = 400

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

    if (isLoading) {
        return <div>Sedang memuat data buku...</div>;
    }

    return (
        <div className='w-full h-full flex flex-col justify-center'>
            <Suspense fallback={
                <div className='min-h-screen w-full flex justify-center items-center'>
                    <p className='text-center font-bold text-4xl'>Loading...</p>
                </div>
            }>
                <BookFlip path={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${book.collectionId}/${book.id}/${book.pdfFile}`} options={config} />
            </Suspense>
        </div>
    )
}
