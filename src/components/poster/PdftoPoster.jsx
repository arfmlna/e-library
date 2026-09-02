import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PdfToPoster({ pdfFile, targetPage = 1, height = 384, width }) {
    const [isRendering, setIsRendering] = useState(true);

    const pdfOptions = useMemo(() => ({
        cMapUrl: 'cmaps/',
        cMapPacked: true,
        disableAutoFetch: true,
        disableStream: false,
        rangeChunkSize: 524288,
        standardFontDataUrl: `${window.location.origin}/standard_fonts/`,
        verbosity: 0,
        pdfBug: false 
    }), []);

    const loadingElement = (
        <div className="absolute inset-0 bg-base-200 flex flex-col items-center justify-center gap-3"
            style={{ 
                width: `${width}px`, height: `${height}px` 
            }} 
        >
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
         <div className="relative overflow-hidden" style={{ 
                height: `${height}px`,
                width: `${width}px`
            }}>
            {isRendering && loadingElement}
            <Document 
                file={pdfFile} 
                loading={loadingElement}
                options={pdfOptions}
                >
                <Page 
                    pageNumber={targetPage} 
                    renderMode='svg'
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={1}
                    width={width}
                    height={height}
                    className="w-full h-full object-cover object-center"
                    onRenderSuccess={() => setIsRendering(false)} 
                    loading={null}
                    canvasBackground='white'
                    devicePixelRatio={1}
                />
            </Document>
        </div>
    );
}
