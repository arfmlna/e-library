import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import React from 'react'

export default function ZoomReader({
    zoom,
    setZoom
}) {
    return (
        <div className="fixed top-3 z-10 w-fit flex justify-center items-center gap-2 bg-white/80 backdrop-blur-md p-1 rounded-xl border-2 border-black shadow-lg pointer-events-auto">
            <button
                onClick={() => setZoom(prev => Math.max(0.2, prev - 0.1))}
                className="p-1.5 rounded-lg border-2 border-black text-black hover:bg-gray-400 transition-all"
                title="Zoom Out"
                disabled={zoom <= 0.2}
            >
                <ZoomOut size={16} />
            </button>

            <span className="text-xs font-mono text-black min-w-[45px] text-center">
                {Math.round(zoom * 100)}%
            </span>

            <button
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="p-1.5 rounded-lg border-2 border-black text-black hover:bg-gray-400 transition-all"
                title="Zoom In"
                disabled={zoom >= 2}
            >
                <ZoomIn size={16} />
            </button>

            <div className="w-[1px] h-4 bg-zinc-700 mx-1" />

            <button
                onClick={() => setZoom(1)}
                className="p-1.5 rounded-lg border-2 border-black text-black hover:bg-gray-400 transition-all"
                title="Reset Zoom"
            >
                <RotateCcw size={16} />
            </button>
        </div>
    )
}