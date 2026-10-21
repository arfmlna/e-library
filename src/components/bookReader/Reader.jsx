import ErrorBoundary from '@/ErrorBoundary'
import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { pdfjs } from 'react-pdf'
import { useParams } from 'react-router-dom'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { documentOptions } from '../bookFlip/UtilsBook'

const ToolsReader = lazy(() => import('./ToolsReader'))
const BookReader = lazy(() => import('./BookReader'))
const LayoutReader = lazy(() => import('./LayoutReader'))
const Loading = lazy(() => import('@/components/ui/Loading'))
const Error = lazy(() => import('@/components/ui/Error'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()

export default function Reader() {
    const [zoom, setZoom] = useState(1)
    const [numPages, setNumPages] = useState(null)
    const [pageWidth, setPageWidth] = useState(() => window.innerWidth > 768 ? 720 : window.innerWidth)
    const [currentPage, setCurrentPage] = useState(1)
    const [isReady, setIsReady] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [pageTexts, setPageTexts] = useState([])
    const [showTools, setShowTools] = useState(true)
    const [visibleRange, setVisibleRange] = useState({ start: 1, end: 5 })

    const pageRefs = useRef([])
    const scrollContainerRef = useRef(null)
    const isNavigatingRef = useRef(false)

    const bookSizeDefault = Number(localStorage.getItem('book-text-size') || 100) / 100
    const { id } = useParams()

    const { data: getBook, refetch, isLoading, error } = useQuery({
        queryKey: ['book', id],
        queryFn: async () => {
            const data = await pb.collection('books').getOne(id)
            return { ...data, pdfUrl: pb.files.getURL(data, data.pdfFile) }
        },
        enabled: !!id
    })

    useEffect(() => {
        const handleResize = () => setPageWidth(window.innerWidth > 768 ? 720 : window.innerWidth)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    
    useEffect(() => {
        setNumPages(null)
        setCurrentPage(1)
        setIsReady(false)
        setSearchQuery('')
        setPageTexts([])
        setVisibleRange({ start: 1, end: 5 })
        pageRefs.current = []
        isNavigatingRef.current = false
    }, [id])
    
    useEffect(() => {
        if (!getBook?.pdfUrl) return

        let cancelled = false
        let pdf = null
        const loadingTask = pdfjs.getDocument({
            url: getBook.pdfUrl,
            ...documentOptions
        })

        const loadPdfText = async () => {
            try {
                pdf = await loadingTask.promise
                const texts = new Array(pdf.numPages).fill('')

                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    if (cancelled) return
                    
                    const page = await pdf.getPage(pageNumber)
                    const content = await page.getTextContent()

                    if (cancelled) {
                        page.cleanup()
                        return
                    }

                    const items = content.items.filter(item => typeof item.str === 'string')
                    texts[pageNumber - 1] = items.map(item => item.str).join(' ')
                    page.cleanup()
                }

                if (!cancelled) setPageTexts(texts)
            } catch (error) {
                if (!cancelled && import.meta.env.DEV) console.error('Gagal membaca teks PDF:', error)
            } finally {
                if (pdf && !cancelled) await pdf.destroy()
            }
        }

        setPageTexts([])
        loadPdfText()

        return () => {
            cancelled = true
            loadingTask.destroy().catch(() => {})
        }
    }, [getBook?.pdfUrl])

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container || !numPages || !isReady) return

        let ticking = false
        let frameId

        const handleScroll = () => {
            if (ticking || isNavigatingRef.current) return
            ticking = true

            frameId = requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect()
                const targetPosition = rect.top + container.clientHeight * 0.3
                let closestPage = currentPage
                let closestDistance = Infinity

                pageRefs.current.forEach((element, index) => {
                    if (!element) return

                    const pageRect = element.getBoundingClientRect()
                    const distance = Math.abs(pageRect.top + pageRect.height / 2 - targetPosition)

                    if (distance < closestDistance) {
                        closestDistance = distance
                        closestPage = index + 1
                    }
                })

                setCurrentPage(prev => prev === closestPage ? prev : closestPage)
                ticking = false
            })
        }

        container.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => {
            container.removeEventListener('scroll', handleScroll)
            cancelAnimationFrame(frameId)
        }
    }, [numPages, isReady, currentPage])

    return (
        <>
            {isLoading ? (
                <div className="max-w-2xl mx-auto flex items-center h-screen">
                    <Loading />
                </div>
            ) : error ? (
                <div className="max-w-2xl mx-auto flex items-center h-screen">
                    <Error refetch={refetch} variant="card" />
                </div>
            ) : !getBook ? (
                <div className="max-w-2xl mx-auto flex items-center h-screen">
                    <NotFound />
                </div>
            ) : (
                <LayoutReader
                    currentPage={currentPage}
                    numPages={numPages}
                    showTools={showTools}
                    setShowTools={setShowTools}
                >
                    {showTools && (
                        <ToolsReader
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            numPages={numPages}
                            pageRefs={pageRefs}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            zoom={zoom}
                            setZoom={setZoom}
                            isReady={isReady}
                            scrollContainerRef={scrollContainerRef}
                            pageTexts={pageTexts}
                            isNavigatingRef={isNavigatingRef}
                            setVisibleRange={setVisibleRange}
                        />
                    )}

                    <ErrorBoundary>
                        <Suspense
                            fallback={
                                <div className="h-screen w-full flex flex-col justify-center items-center bg-zinc-950">
                                    <p className="text-center font-bold text-2xl text-zinc-400 animate-pulse">
                                        Memuat Pembaca...
                                    </p>
                                </div>
                            }
                        >
                            <BookReader
                                getBook={getBook}
                                numPages={numPages}
                                pageRefs={pageRefs}
                                pageWidth={pageWidth}
                                searchQuery={searchQuery}
                                setIsReady={setIsReady}
                                setNumPages={setNumPages}
                                zoom={zoom * bookSizeDefault}
                                scrollContainerRef={scrollContainerRef}
                                isReady={isReady}
                                isNavigatingRef={isNavigatingRef}
                                visibleRange={visibleRange}
                                setVisibleRange={setVisibleRange}
                            />
                        </Suspense>
                    </ErrorBoundary>
                </LayoutReader>
            )}
        </>
    )
}