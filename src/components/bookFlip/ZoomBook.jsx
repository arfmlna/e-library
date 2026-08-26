import React from 'react'

// export default function ZoomBook({ zoom, setZoom }) {
//     const handleZoomIn = () => setZoom(prev => Math.min(2.0, prev + 0.05));
//     const handleZoomOut = () => setZoom(prev => Math.max(0.6, prev - 0.05));
//     const handleZoomReset = () => setZoom(1.0);
//     return (
//         <div className="sm:flex flex-col gap-1 pt-4 w-full">
//             <label className="text-xs font-bold">Ukuran Tampilan (Zoom)</label>
//             <div className="flex items-center justify-between p-2 rounded-lg btn">
//                 <button 
//                     type="button" 
//                     onClick={handleZoomOut} 
//                     disabled={zoom <= 0.6} 
//                     className="btn btn-xs btn-secondary w-8">
//                         -
//                 </button>
//                 <span className="text-xs font-bold">{Math.round(zoom * 100)}%</span>
//                 <button 
//                     type="button" 
//                     onClick={handleZoomIn} 
//                     disabled={zoom >= 1.6} 
//                     className="btn btn-xs btn-primary w-8">
//                         +
//                 </button>
//                 <button 
//                     type="button" 
//                     onClick={handleZoomReset} 
//                     className="btn btn-xs btn-error">
//                         Reset
//                 </button>
//             </div>
//         </div>
//     )
// }

export default function ZoomBook({
    zoom,
    setZoom
}) {

    const handleZoomIn = () => {
        setZoom(prev => Math.min(2.0, Number((prev + 0.05).toFixed(2))));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(0.6, Number((prev - 0.05).toFixed(2))));
    };

    const handleZoomReset = () => {
        setZoom(1);
    };

    return (
        <div className="sm:flex flex-col gap-1 pt-4 w-full">
            <label className="text-xs font-bold">
                Ukuran Tampilan (Zoom)
            </label>
            <div className="flex items-center justify-between p-2 rounded-lg btn">
                <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.6}
                className="btn btn-xs btn-secondary w-8"
                >
                    -
                </button>
                <span className="text-xs font-bold">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                className="btn btn-xs btn-primary w-8"
                >
                    +
                </button>
                <button
                type="button"
                onClick={handleZoomReset}
                className="btn btn-xs btn-error"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
