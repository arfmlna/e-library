import React, { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'; 
import SideBarControls from './SideBarControls';
import { documentOptions, flipBookSettings, handleResizeBook } from './UtilsBook';
import PageNavigationHint from './PageClickNavigation';

const PagePDF = lazy(() => import('./PagePDF'))
const ErrorBoundary = lazy(() => import('../../ErrorBoundary'))

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
)?.toString();

export default function BookFlip({ path }) {
    const flipBookRef = useRef(null);
    const textCacheRef = useRef(new Map());

    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(-1);
    const [inputPage, setInputPage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [showArrow, setShowArrow] = useState(true)
    const [pageRatio, setPageRatio] = useState(1.414);
    const [dimensions, setDimensions] = useState({ width: 450, height: 636 });
    const readerAreaRef = useRef(null);

    const onFlip = useCallback((e) => {
        const pageIndex = e?.data;
        setCurrentPage((prev) => {
            if (prev === pageIndex) {
                return prev;
            }
            return pageIndex;
        });
    }, []);

    
    useEffect(() => {
        const container = readerAreaRef.current;
        if (!container) return;

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            const mobile = window.innerWidth < 768;

            setIsMobile(mobile);

            const availableWidth = Math.max(0, width - (mobile ? 16 : 32));
            const availableHeight = Math.max(0, height - 32);
            const pageWidth = Math.min(
                mobile ? availableWidth : availableWidth / 2,
                availableHeight / pageRatio
            );

            const next = {
                width: Math.floor(pageWidth),
                height: Math.floor(pageWidth * pageRatio)
            };

            setDimensions(prev =>
                prev.width === next.width && prev.height === next.height
                    ? prev
                    : next
            );
        };

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();

        return () => observer.disconnect();
    }, [pageRatio, isSidebarOpen]);

    const fbs = useMemo(
        () => flipBookSettings(dimensions, isMobile),
        [dimensions.width, dimensions.height, isMobile]
    );

    if (!path) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <span className="loading loading-bars loading-xl scale-200"></span>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="relative flex h-dvh w-screen overflow-hidden">
                <SideBarControls
                flipBookRef={flipBookRef}
                pdfDocument={pdfDocument}
                currentPage={currentPage}
                currentResultIndex={currentResultIndex}
                setCurrentResultIndex={setCurrentResultIndex}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                inputPage={inputPage}
                setInputPage={setInputPage}
                numPages={numPages}
                zoom={zoom}
                setZoom={setZoom}
                textCacheRef={textCacheRef}
                showArrow={showArrow}
                setShowArrow={setShowArrow}
                />
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`hidden md:flex fixed z-50 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 border border-black dark:border-white p-2 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300
                ${isSidebarOpen
                    ? 'left-[calc(280px+1.5rem)]'
                    : 'left-1'
                }`}
                >
                    { isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} /> }
                </button>
                {!isSidebarOpen && (
                    <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden fixed z-50 bottom-6 left-6 border p-2 rounded-full shadow-2xl active:scale-95 transition-all">
                        <Menu size={24} />
                    </button>
                )}

                <div 
                ref={readerAreaRef}
                className="relative flex flex-1 min-w-0 h-dvh items-center justify-center overflow-hidden">
                    <div className={`flex justify-center items-center duration-300 
                        ${ isMobile ? isSidebarOpen ? '-translate-y-20' : 'translate-y-0' : 'translate-y-0' }`}>
                        <PageNavigationHint showArrow={showArrow} currentPage={currentPage} numPages={numPages} isMobile={isMobile} />
                        <Document
                        file={path}
                        renderMode="canvas"
                        onLoadSuccess={async (pdf) => {
                            setNumPages(pdf.numPages);
                            setPdfDocument(pdf);
                            setCurrentPage(0);
                            textCacheRef.current.clear();

                            const page = await pdf.getPage(1);
                            const viewport = page.getViewport({ scale: 1 });

                            setPageRatio(viewport.height / viewport.width);
                        }}
                        options={documentOptions}
                        className="flex justify-center items-center"
                        >
                            {numPages > 0 && (
                                <div className="flex justify-center items-center transition-transform duration-300">
                                    <div
                                    className="flex shrink-0 items-start justify-center"
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'center center',
                                        width: dimensions.width * (isMobile ? 1 : 2),
                                        height: dimensions.height
                                    }}
                                    >
                                        <HTMLFlipBook
                                        ref={flipBookRef}
                                        className="shrink-0"
                                        size={fbs.size}
                                        usePortrait={fbs.usePortrait}
                                        width={fbs.width}
                                        height={fbs.height}
                                        minWidth={fbs.width}
                                        maxWidth={fbs.width}
                                        minHeight={fbs.height}
                                        maxHeight={fbs.height}
                                        onFlip={onFlip}
                                        flippingTime={240}
                                        maxShadowOpacity={0}
                                        showCover={false}
                                        drawShadow={false}
                                        startPage={currentPage}
                                        autoSize={false}
                                        mobileScrollSupport={true}
                                        disableFlipByClick={false}
                                        swipeDistance={20}
                                        showPageCorners={!isMobile}
                                        >
                                            {Array.from({ length: numPages }, (_, i) => {
                                                    const isTargetPage = searchResults[currentResultIndex]?.pageIndex === i;
                                                    return (
                                                        <div className="shadow-2xl" key={`page-${i + 1}`}>
                                                            <PagePDF
                                                            key={`page-${i + 1}`}
                                                            number={i + 1}
                                                            width={Math.round(dimensions.width)}
                                                            height={Math.round(dimensions.height)}
                                                            searchQuery={isTargetPage ? searchQuery : ''}
                                                            hasSearchQuery={searchResults.length > 0}
                                                            isTargetPage={isTargetPage}
                                                            isVisible={Math.abs(i - currentPage) <= 1 || isTargetPage}
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </HTMLFlipBook>
                                    </div>
                                </div>
                            )}
                        </Document>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

