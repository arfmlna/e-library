import ErrorBoundary from '@/ErrorBoundary'
import { pb } from '@/utils/pocketbase'
import { ArrowBigLeftDash, Minus, Plus } from 'lucide-react'
import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Reader() {
    const [book, setBook] = useState({
        info: null,
        file: []
    })
    const [zoom, setZoom] = useState(160)
    
    const { bookId } = useParams()
    const navigate = useNavigate()

    async function getBookId(id) {
        const book = await pb.collection('books').getOne(`${id}`)
        setBook({
            info: book,
            file: `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${book.collectionId}/${book.id}/${book.pdfFile}`
        })
    }

    useEffect(() => {
        getBookId(bookId)
    }, [])
    return (
        <div>
            <div className='w-full h-full flex flex-col justify-center'>
                <div className="fixed bottom-10 left-10 z-10">
                    <button className='btn btn-neutral dark:btn-primary'
                    onClick={() => navigate('/books')}>
                        <ArrowBigLeftDash size={15} />
                    </button>
                </div>
                <ErrorBoundary>
                    <Suspense fallback={
                        <div className='min-h-screen w-full flex justify-center items-center'>
                            <p className='text-center font-bold text-4xl'>Loading...</p>
                        </div>
                    }>
                        <iframe src={`${book.file}#toolbar=1&navpanes=1&scrollbar=1&view=Fit&zoom=${zoom}`} 
                            title={book?.info?.title}
                            className='w-screen h-screen'
                            frameBorder="0">
                                <p>Browser Anda tidak mendukung tampilan PDF. 
                                    <a href={book.file} className="text-blue-500 underline"> Klik di sini untuk unduh.</a>
                                </p>
                        </iframe>
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    )
}
