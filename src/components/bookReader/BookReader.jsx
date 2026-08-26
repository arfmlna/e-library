import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf';
import { documentOptions } from '../bookFlip/UtilsBook';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
)?.toString();

export default function BookReader({
    getBook,
    numPages,
    setNumPages,
    pageRefs,
    setIsReady,
    pageWidth,
    zoom,
    searchQuery,
    scrollContainerRef,
    isReady,
    isNavigatingRef,
    visibleRange,
    setVisibleRange
}) {
    const [pageHeight, setPageHeight] = useState(
        pageWidth * 1.414
    )

    const textRenderer = useCallback((textItem) => {
            if (!searchQuery) return textItem.str;
            
            const escapedQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'gi');
            
            return textItem.str.replace(regex, (match) => `<mark class="bg-yellow-400 text-black px-0.5 rounded-sm">${match}</mark>`);
        },[searchQuery]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        pageRefs.current = pageRefs.current.slice(0, numPages);
        setVisibleRange({
            start: 1,
            end: Math.min(
                6,
                numPages
            )
        })
        setTimeout(() => {
            setIsReady(true);
        }, 300);
    }

    useEffect(() => {
        if (!getBook?.pdfUrl) return

        let cancelled = false

        async function getPageSize() {
            try {
                const loadingTask =
                    pdfjs.getDocument(getBook.pdfUrl)

                const pdf = await loadingTask.promise

                if (cancelled) {
                    await pdf.destroy()
                    return
                }

                const page = await pdf.getPage(1)

                const viewport = page.getViewport({
                    scale: 1
                })

                const ratio = viewport.height / viewport.width

                if (!cancelled) {
                    setPageHeight(
                        pageWidth *
                        ratio
                    )
                }

                page.cleanup()
                await pdf.destroy()
            } catch (error) {
                console.error('Gagal mengambil ukuran halaman PDF:', error)
            }
        }

        getPageSize()

        return () => {
            cancelled = true
        }
    }, [getBook?.pdfUrl, pageWidth])

    useEffect(() => {
        const container = scrollContainerRef?.current;

        if (!container || !numPages || !isReady) {
            return;
        }

        let ticking = false;

        const updateVisiblePages = () => {
            if (isNavigatingRef.current) return; 

            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const scrollTop = container.scrollTop;
                const viewportHeight = container.clientHeight;

                if (viewportHeight === 0) {
                    ticking = false;
                    return;
                }

                const currentZoom = zoom || 1;
                const currentHeight = pageHeight || (pageWidth * 1.414) || 800;
                const estimatedPageHeight = (currentHeight * currentZoom) + 24;

                if (estimatedPageHeight <= 24) {
                    ticking = false;
                    return;
                }

                let firstVisiblePage = Math.floor(scrollTop / estimatedPageHeight) + 1;
                const visiblePageCount = Math.ceil(viewportHeight / estimatedPageHeight);
                const buffer = 3;

                if (scrollTop < 50) {
                    firstVisiblePage = 1;
                }

                if (firstVisiblePage > numPages) firstVisiblePage = numPages;
                if (firstVisiblePage < 1) firstVisiblePage = 1;

                const start = Math.max(1, firstVisiblePage - buffer);
                const end = Math.min(numPages, firstVisiblePage + visiblePageCount + buffer);

                setVisibleRange(previous => {
                    if (previous.start === start && previous.end === end) {
                        return previous;
                    }
                    if (scrollTop < 100 && end === numPages && numPages > 6) {
                        return previous; 
                    }
                    return { start, end };
                });

                ticking = false;
            });
        };

        container.addEventListener('scroll', updateVisiblePages, { passive: true });
        
        const initTimeout = setTimeout(() => {
            updateVisiblePages();
        }, 100);

        return () => {
            container.removeEventListener('scroll', updateVisiblePages);
            clearTimeout(initTimeout);
        };
    }, [numPages, isReady, pageHeight, zoom, scrollContainerRef, pageWidth]);

    const memoizedDocumentOptions = useMemo(() => {
        return documentOptions; 
    }, []);

    return (
        <div className="relative h-screen overflow-y-auto scroll-smooth" ref={scrollContainerRef}>
            <div className="inline-block min-w-full text-center">
                <div className="flex justify-center w-full">
                    <Document
                        file={getBook?.pdfUrl}
                        renderMode="canvas"
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={memoizedDocumentOptions}
                        loading={
                            <div className="h-screen w-screen flex justify-center items-center">
                                Sedang memuat file...
                            </div>
                        } 
                        error={
                            <div className="h-screen w-screen flex justify-center items-center text-red-500 font-semibold">
                                Gagal memuat file!
                            </div>
                        }
                        className={'shadow-xl'}
                    >
                        {numPages && Array.from({length: numPages}, (_, i) => {
                            const pageNum = i + 1;
                            const shouldRender = pageNum >= visibleRange.start && pageNum <= visibleRange.end

                            const currentZoom = zoom || 1;
                            const estimatedHeight = pageWidth * 1.414; 
                            const staticHeight = Math.floor(estimatedHeight * currentZoom);
                            return (
                                <div 
                                    key={pageNum} 
                                    ref={(el) => (pageRefs.current[i] = el)}
                                    data-page-number={pageNum}
                                    className='w-full flex justify-center shadow-2xl'
                                    style={{ 
                                        // height: `${staticHeight * zoom}px`,
                                        // maxHeight: `${staticHeight * zoom}px`,
                                        minHeight: shouldRender ? 'auto' : `${pageHeight * zoom}px`,
                                        // marginBottom: '24px' 
                                     }}
                                >
                                    { shouldRender ? (
                                        <Page
                                            pageNumber={pageNum}
                                            // width={(pageWidth) * zoom}
                                            scale={zoom}
                                            _className="!m-0 !p-0"
                                            renderAnnotationLayer={false}
                                            renderTextLayer={true}
                                            customTextRenderer={textRenderer} 
                                        />
                                    ) : (
                                        <div className="w-full" 
                                        style={{ height: pageHeight * zoom }} />
                                    ) }
                                </div>
                            );
                        })}
                    </Document>
                </div>
            </div>
        </div>
    )
}
