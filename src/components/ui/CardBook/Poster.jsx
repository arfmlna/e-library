import { lazy } from 'react'

const PdfToPoster = lazy(() => import('@/components/poster/PdftoPoster'))

export default function BookPoster({data, posterUrl, height, widht}) {
    if ( (data?.poster || data?.pdfBlob) && !posterUrl ) {
        return (
            <div className="card rounded-none ring-2 ring-black shadow-md shadow-blue-700 w-full h-96 bg-base-200 flex justify-center items-center">
                <span>Memuat pratinjau...</span>
            </div>
        );
    }
    return (
        <>
            { data?.poster ? (
                <div className={`card rounded-none w-full group-hover/tapGallery:scale-105 hover:transition hover:duration-300 hover:ease-in-out will-change-transform bg-cover bg-center`}
                style={{
                    height: `${height}px`,
                    backgroundImage: `url(${posterUrl})`
                }}>
                </div>
            ) : data?.pdfFile || data?.pdfBlob ? (
                <div className="card rounded-none w-full group-hover/tapGallery:scale-105 hover:transition hover:duration-300 hover:ease-in-out will-change-transform bg-cover relative overflow-hidden bg-base-200"
                style={{
                    height: `${height}px`,
                    width: `${widht}px`
                }}>
                    <div className="w-full h-full overflow-hidden">
                        <PdfToPoster pdfFile={posterUrl} height={height} width={widht} />
                    </div>
                </div>
            ) : (
                <div className="card rounded-none w-full group-hover/tapGallery:scale-105 hover:transition hover:duration-300 hover:ease-in-out will-change-transform bg-cover overflow-hidden"
                style={{
                    height: `${height}px`,
                }}
                >
                    <div className="flex flex-row justify-center items-center h-full bg-white dark:bg-black text-black dark:text-white">
                        <h1 className='text-8xl'>N/A</h1>
                    </div>
                </div>
            ) }
        </>
    )
}
