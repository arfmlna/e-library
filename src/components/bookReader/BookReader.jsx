import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { documentOptions } from '../bookFlip/UtilsBook'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()

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
    const [pageRatio, setPageRatio] = useState(1.414);
    const [isMobile, setIsMobile] = useState(false);

    const dynamicScale = Math.max(0.5, isMobile ? zoom - 0.4 : zoom);
    const pageHeight = pageWidth * pageRatio;
    const pageStep = pageHeight * dynamicScale;

    const memoizedRegex = useMemo(() => {
        if (!searchQuery?.trim()) return null;
        const escaped = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(${escaped})`, 'gi');
    }, [searchQuery]);

    const textRenderer = useCallback((item) => {
        if (!memoizedRegex || !item?.str) return item?.str || '';
        return item.str.replace(
            memoizedRegex,
            match => `<mark class="bg-yellow-400 text-black m-0 p-0">${match}</mark>`
        );
    }, [memoizedRegex]);

    const onDocumentLoadSuccess = useCallback(async (pdf) => {
        setNumPages(pdf.numPages);
        setIsReady(false);
        pageRefs.current = Array(pdf.numPages).fill(null);
        setVisibleRange({ start: 1, end: Math.min(4, pdf.numPages) });

        try {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1 });
            setPageRatio(viewport.height / viewport.width);
            page.cleanup();
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Gagal membaca ukuran halaman PDF:', error);
            }
        } finally {
            setIsReady(true);
        }
    }, [setNumPages, setIsReady, setVisibleRange, pageRefs]);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container || !numPages || !isReady || !pageStep) return;

        let frame = 0;

        const updateVisiblePages = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (isNavigatingRef.current) return;

                const first = Math.max(
                    1,
                    Math.min(numPages, Math.floor(container.scrollTop / pageStep) + 1)
                );
                const count = Math.ceil(container.clientHeight / pageStep);
                const buffer = 2;
                const start = Math.max(1, first - buffer);
                const end = Math.min(numPages, first + count + buffer);

                setVisibleRange(prev =>
                    prev.start === start && prev.end === end
                        ? prev
                        : { start, end }
                );
            });
        };

        container.addEventListener('scroll', updateVisiblePages, { passive: true });
        updateVisiblePages();

        return () => {
            container.removeEventListener('scroll', updateVisiblePages);
            cancelAnimationFrame(frame);
        };
    }, [
        numPages, isReady, pageStep, scrollContainerRef,
        isNavigatingRef, setVisibleRange
    ]);

    const noDataElement = (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-2 text-base-content/50">
            <p className="text-sm font-medium">Dokumen PDF belum tersedia.</p>
        </div>
    );

    const loadingElement = (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-base-300">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm font-semibold text-base-content/70">
                Sedang memuat dokumen PDF...
            </p>
        </div>
    );

    const errorElement = (
        <div className="flex h-screen w-full items-center justify-center text-sm text-error">
            Gagal memuat dokumen PDF.
        </div>
    );

    const start = Math.max(1, visibleRange.start);
    const end = Math.min(numPages || 0, visibleRange.end);
    const topSpace = (start - 1) * pageStep;
    const bottomSpace = Math.max(0, numPages - end) * pageStep;

    return (
        <div
            ref={scrollContainerRef}
            className="relative h-screen w-full overflow-y-auto bg-base-300"
        >
            <Document
                file={getBook?.pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                options={documentOptions}
                className="flex min-h-full w-full flex-col items-center"
                loading={loadingElement}
                noData={noDataElement}
                error={errorElement}
            >
                <div style={{ height: topSpace, flexShrink: 0 }} />

                {Array.from(
                    { length: Math.max(0, end - start + 1) },
                    (_, index) => {
                        const pageNum = start + index;

                        return (
                            <div
                                key={pageNum}
                                ref={el => { pageRefs.current[pageNum - 1] = el; }}
                                data-page-number={pageNum}
                                style={{
                                    minHeight: pageStep,
                                    width: '100%',
                                    flexShrink: 0
                                }}
                                className="relative flex justify-center overflow-hidden"
                            >
                                <Page
                                    renderMode="canvas"
                                    pageNumber={pageNum}
                                    scale={dynamicScale}
                                    _className="m-0 p-0"
                                    renderAnnotationLayer={false}
                                    renderTextLayer={Boolean(searchQuery)}
                                    customTextRenderer={textRenderer}
                                    loading={
                                        <div
                                            style={{
                                                width: pageWidth,
                                                height: pageStep
                                            }}
                                            className="bg-base-200"
                                        />
                                    }
                                />
                            </div>
                        );
                    }
                )}

                <div style={{ height: bottomSpace, flexShrink: 0 }} />
            </Document>
        </div>
    );
}