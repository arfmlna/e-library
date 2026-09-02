import React, { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'; 
import SideBarControls from './SideBarControls';
import { documentOptions, handleResizeBook } from './UtilsBook';
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

    const [dimensions, setDimensions] = useState(() => {
        if (typeof window !== 'undefined') {
            const widthWin = window.innerWidth;
            const heightWin = window.innerHeight;

            if (widthWin < 768) {
                const targetHeight = heightWin * 0.85;
                return {
                    width: Math.min(
                        targetHeight / 1.414,
                        widthWin - 32
                    ),
                    height: targetHeight
                };
            }

            const maxAvailableHeight = heightWin - 120;
            const availableWidth = widthWin - 320 - 64;
            const maxAvailableWidth = availableWidth / 2;

            let finalHeight = maxAvailableHeight;
            let finalWidth = finalHeight / 1.414;

            if (finalWidth > maxAvailableWidth) {
                finalWidth = maxAvailableWidth;
                finalHeight = finalWidth * 1.414;
            }

            return {
                width: finalWidth,
                height: finalHeight
            };
        }

        return {
            width: 450,
            height: 636
        };
    });

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
        const handleResize = () => {
            handleResizeBook(
                setIsMobile,
                setDimensions,
                isSidebarOpen
            );
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSidebarOpen]);

    const flipBookSettings = useMemo(() => {
        if (isMobile) {
            return {
                size: "fixed",
                usePortrait: true,
                width: Math.round(dimensions.width),
                height: Math.round(dimensions.height),
                minWidth: Math.round(dimensions.width),
                maxWidth: Math.round(dimensions.width),
                minHeight: Math.round(dimensions.height),
                maxHeight: Math.round(dimensions.height)
            };
        }

        return {
            size: "fixed",
            usePortrait: false,
            width: Math.round(dimensions.width),
            height: Math.round(dimensions.height),
            minWidth: Math.round(dimensions.width),
            maxWidth: Math.round(dimensions.width),
            minHeight: Math.round(dimensions.height),
            maxHeight: Math.round(dimensions.height)
        };

    }, [
        isMobile,
        dimensions.width,
        dimensions.height
    ]);

    if (!path) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <span className="loading loading-bars loading-xl scale-200"></span>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="flex flex-col md:flex-row min-w-screen min-h-screen relative overflow-hidden bg-slate-300 dark:bg-gray-950/10">
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
                className={`hidden md:flex fixed z-50 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300
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
                    className="md:hidden fixed z-50 bottom-6 left-6 bg-blue-600 text-white p-2 rounded-full shadow-2xl active:scale-95 transition-all">
                        <Menu size={24} />
                    </button>
                )}

                <div className={`flex-1 w-full h-screen overflow-hidden flex justify-center items-center box-border transition-all duration-300`}>
                    <div className={`flex justify-center items-center duration-300 ${ isMobile ? isSidebarOpen ? 'translate-y-0' : 'translate-y-20' : 'translate-y-0' }`}>
                        <PageNavigationHint showArrow={showArrow} currentPage={currentPage} numPages={numPages} isMobile={isMobile} />
                        <Document
                        file={path}
                        renderMode="canvas"
                        onLoadSuccess={(pdf) => {
                            setNumPages(pdf.numPages);
                            setPdfDocument(pdf);
                            setCurrentPage(0);
                            textCacheRef.current.clear();
                        }}
                        options={documentOptions}
                        className="flex justify-center items-center"
                        >
                            {numPages > 0 && (
                                <div className="flex justify-center items-center transition-transform duration-300">
                                    <div
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'center center',
                                        width: isMobile ? dimensions.width : dimensions.width * 2,
                                        height: dimensions.height
                                    }}
                                    className="flex justify-center items-center shrink-0"
                                    >
                                        <HTMLFlipBook
                                        ref={flipBookRef}
                                        className="shrink-0"
                                        size={flipBookSettings.size}
                                        usePortrait={flipBookSettings.usePortrait}
                                        width={flipBookSettings.width}
                                        height={flipBookSettings.height}
                                        minWidth={flipBookSettings.minWidth}
                                        maxWidth={flipBookSettings.maxWidth}
                                        minHeight={flipBookSettings.minHeight}
                                        maxHeight={flipBookSettings.maxHeight}
                                        onFlip={onFlip}
                                        disableFlipByClick={false}
                                        mobileScrollSupport={true}
                                        flippingTime={240}
                                        maxShadowOpacity={0}
                                        showCover={false}
                                        drawShadow={false}
                                        startPage={currentPage}
                                        autoSize={true}
                                        swipeDistance={0}
                                        showPageCorners={true}
                                        >
                                            {Array.from({ length: numPages }, (_, i) => {
                                                    const isTargetPage = searchResults[currentResultIndex]?.pageIndex === i;
                                                    const isVisible = Math.abs(i - currentPage) <= 1 || isTargetPage;
                                                    return (
                                                        <PagePDF
                                                        key={`page-${i + 1}`}
                                                        number={i + 1}
                                                        width={Math.round(dimensions.width)}
                                                        searchQuery={isTargetPage ? searchQuery : ''}
                                                        hasSearchQuery={searchResults.length > 0}
                                                        isTargetPage={isTargetPage}
                                                        isVisible={isVisible}
                                                        />
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

