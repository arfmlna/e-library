import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import React from 'react'

export default function ZoomReader({
    zoom,
    setZoom
}) {
    return (
        <div className="fixed top-3 z-10 w-fit flex justify-center items-center gap-2 bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-lg pointer-events-auto">
            <button 
                onClick={() => setZoom(zoom - 0.1)} 
                className="btn btn-xs rounded-lg transition-all"
                title="Zoom Out"
                disabled={zoom < 0.2}
            >
                <ZoomOut size={16} />
            </button>
            <span className="text-xs font-mono text-zinc-300 min-w-[45px] text-center">
                {Math.round(zoom * 100)}%
            </span>
            <button 
                onClick={() => setZoom(zoom + 0.1)} 
                className="btn btn-xs rounded-lg transition-all"
                title="Zoom In"
                disabled={zoom > 1.9}
            >
                <ZoomIn size={16} />
            </button>
            <div className="w-[1px] h-4 bg-zinc-700 mx-1"></div>
            <button 
                onClick={() => setZoom(1)} 
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all"
                title="Reset Zoom"
            >
                <RotateCcw size={16} />
            </button>
        </div>
    )
}
