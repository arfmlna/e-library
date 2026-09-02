import ErrorBoundary from '@/ErrorBoundary'
import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { pdfjs } from 'react-pdf'
import { useParams } from 'react-router-dom'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getOfflineBookById } from '@/constants/globals'

const ToolsReader = lazy(() => import('./ToolsReader'))
const BookReader = lazy(() => import('./BookReader'))
const LayoutReader = lazy(() => import('./LayoutReader'))

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
)?.toString();

export default function ReaderDownload() {
    const [zoom, setZoom] = useState(1)
    const [numPages, setNumPages] = useState(null);
    const [pageWidth, setPageWidth] = useState(window.innerWidth)
    const [currentPage, setCurrentPage] = useState(1);
    const [isReady, setIsReady] = useState(false); 
    const [searchQuery, setSearchQuery] = useState("");
    const [pageTexts, setPageTexts] = useState([])
    const [showTools, setShowTools] = useState(true)
    const [visibleRange, setVisibleRange] = useState({
        start: 1,
        end: 5
    })
    
    const pageRefs = useRef([]);
    const scrollContainerRef = useRef(null);
    const isNavigatingRef = useRef(false)
    const bookSizeDefault = Number(localStorage.getItem('book-text-size') / 100)
    const userId = pb.authStore.record.id

    const { id } = useParams()

    const { data: getBook } = useQuery({
            queryKey: ['offlineBook', id, userId],
            queryFn: async () => {
                const res = await getOfflineBookById(id, userId)
                return {
                    ...res,
                    pdfUrl: res?.pdfUrl
                }
            },
    })

    useEffect(() => {
        function handleResize() {
            const dynamicWidth = window.innerWidth > 768 ? 720 : window.innerWidth;
            setPageWidth(dynamicWidth);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setNumPages(null)
        setCurrentPage(1)
        setIsReady(false)
        setSearchQuery('')
        setPageTexts([])

        pageRefs.current = []
    }, [id])

    useEffect(() => {
        if (!getBook?.pdfUrl) return

        let cancelled = false
        let loadingTask = null

        async function loadPdfText() {
            try {
                loadingTask = pdfjs.getDocument(getBook.pdfUrl)

                const pdf = await loadingTask.promise

                if (cancelled) {
                    await pdf.destroy()
                    return
                }

                const texts = new Array(pdf.numPages)

                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    if (cancelled) break

                    const page = await pdf.getPage(pageNumber)
                    const textContent = await page.getTextContent()

                    texts[pageNumber - 1] = textContent.items
                        .map(item => item.str)
                        .join(' ')

                    page.cleanup()
                }

                if (!cancelled) {
                    setPageTexts(texts)
                }

                await pdf.destroy()
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        'Gagal membaca teks PDF:',
                        error
                    )
                }
            }
        }

        loadPdfText()

        return () => {
            cancelled = true

            if (loadingTask) {
                loadingTask.destroy()
            }
        }
    }, [getBook?.pdfUrl])


    useEffect(() => {
        const container = scrollContainerRef.current

        if (!container || !numPages || !isReady) {
            return
        }

        let ticking = false

        const handleScroll = () => {
            if (ticking) return

            ticking = true

            requestAnimationFrame(() => {
                const containerRect = container.getBoundingClientRect()

                const targetPosition = containerRect.top + container.clientHeight * 0.3

                let closestPage = 1
                let closestDistance = Infinity

                pageRefs.current.forEach((element, index) => {
                    if (!element) return

                    const rect = element.getBoundingClientRect()

                    const pageCenter = rect.top + rect.height / 2

                    const distance = Math.abs( pageCenter - targetPosition)

                    if (distance < closestDistance) {
                        closestDistance = distance
                        closestPage = index + 1
                    }
                })

                if (closestPage >= 1 && closestPage <= numPages) {
                    setCurrentPage(closestPage)
                }

                ticking = false
            })
        }

        container.addEventListener('scroll', handleScroll, { passive: true })

        handleScroll()

        return () => { 
            container.removeEventListener('scroll', handleScroll)
        }
    }, [numPages, isReady, currentPage])

    useEffect(() => {
        if (!isNavigatingRef.current) return

        const timeout = setTimeout(() => {
            isNavigatingRef.current = false
        }, 700)

        return () => clearTimeout(timeout)
    }, [currentPage])

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
    }, [])

    return (
        <LayoutReader
        currentPage={currentPage}
        numPages={numPages}
        showTools={showTools}
        setShowTools={setShowTools}>
            { showTools && (
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
            ) }
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="h-screen w-full flex flex-col justify-center items-center bg-zinc-950">
                        <p className="text-center font-bold text-2xl text-zinc-400 animate-pulse">Memuat Pembaca...</p>
                    </div>
                }>
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
                    onPageChange={handlePageChange}
                    isReady={isReady}
                    isNavigatingRef={isNavigatingRef}
                    visibleRange={visibleRange}
                    setVisibleRange={setVisibleRange}
                    />
                </Suspense>
            </ErrorBoundary>
        </LayoutReader>
    )
}