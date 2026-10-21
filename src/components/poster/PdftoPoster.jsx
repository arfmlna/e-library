import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

// eslint-disable-next-line no-unused-vars
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
        <div className="absolute inset-0 bg-base-200 flex flex-col items-center justify-center gap-3 w-full h-full z-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
            {isRendering && loadingElement}
            <Document 
                file={pdfFile} 
                loading={loadingElement}
                options={pdfOptions}
                className="w-full h-full flex items-center justify-center"
            >
                <Page 
                    pageNumber={targetPage} 
                    renderMode="svg"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    /* Hapus props width dan height absolut di sini agar tidak terkunci */
                    className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover" 
                    /* Selector [&>svg] di atas memastikan elemen SVG yang di-render oleh react-pdf merentang penuh secara proporsional */
                    onRenderSuccess={() => setIsRendering(false)} 
                    loading={null}
                    canvasBackground="white"
                    devicePixelRatio={2} /* Menaikkan ratio agar visual tetap tajam saat membesar */
                />
            </Document>
        </div>
    );
}
