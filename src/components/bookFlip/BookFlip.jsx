import React, { lazy, useEffect, useMemo, useState } from 'react'
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const ErrorBoundary = lazy(() => import('../../ErrorBoundary'))

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const PagePDF = React.memo(React.forwardRef((props, ref) => {
    if (!props.number) return null;
    return (
        <div className="overflow-hidden" ref={ref} 
        style={{ width: props?.width, height: props?.height }}>
            <Page 
                pageNumber={props?.number} 
                width={props?.width} 
                height={props?.height} 
                className={`z-0`} 
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={
                <div className="bg-gray-100 animate-pulse flex justify-center items-center" style={{
                    width: props.width, 
                    height: props.height
                }}>
                    <div className="">
                        Loading...
                    </div>
                </div>}
                />
        </div>
    )
}))

export default function BookFlip({ path, options }) {
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [bookSize, setBookSize] = useState({ width: options?.minWidth, height: options?.minHeight });
    
    const documentOptions = useMemo(() => {
        return {
            cMapUrl: '/cmaps/',
            cMapPacked: true
        }
    }, [])
    
    const onFlip = (e) => {
        setCurrentPage(e.data);
    };

    if (!path) return (
        <div className="w-screen h-screen flex justify-center items-center">
            <span className="loading loading-bars loading-xl scale-200"></span>
        </div>
    );

    return (
        <ErrorBoundary>
            <Document
                file={path}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                options={documentOptions}
                className="flex justify-center items-center overflow-hidden py-20 shadow-2xl"
            >
                {numPages > 0 && (
                    <HTMLFlipBook 
                        width={bookSize.width} 
                        height={bookSize.height}
                        onFlip={onFlip}
                        size='fixed'
                        disableFlipByClick={false}
                    >
                        {Array.from(new Array(numPages), (_, i) => {
                            const isVisible = Math.abs(i - currentPage) <= 2;

                            return (
                                <div key={`page-${i+1}`} data-density={i === 0 || i === numPages - 1 ? "hard" : "soft"}>
                                    {isVisible ? (
                                        <PagePDF 
                                            number={i + 1} 
                                            width={bookSize.width}
                                            height={bookSize.height}
                                        />
                                    ) : (
                                        <div style={{ width: bookSize.width, height: bookSize.height }} className="bg-gray-50" />
                                    )}
                                </div>
                            );
                        })}
                    </HTMLFlipBook>
                )}
            </Document>
        </ErrorBoundary>
    );
}
