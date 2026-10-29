import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

export default function DirectPageReader({
    goToPage,
    currentPage,
    numPages
}) {
    const handleNextPage = () => {
        if (currentPage < numPages) goToPage(currentPage + 1)
    }

    const handlePrevPage = () => {
        if (currentPage > 1) goToPage(currentPage - 1)
    }

    return (
        <div className="fixed bottom-3 w-fit flex justify-center items-center gap-3 z-10 bg-white/80 backdrop-blur-md p-1 rounded-lg border-2 border-black shadow-2xl">
            <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 rounded-lg bg-white text-black hover:bg-gray-400 disabled:opacity-30 disabled:hover:bg-gray-500 transition-all border-2 border-black"
            >
                <ChevronLeft size={16} />
            </button>

            <span className="text-black font-medium text-xs px-2 tracking-wide">
                {currentPage} / {numPages}
            </span>

            <button
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                className="p-1 rounded-lg bg-white text-black hover:bg-gray-400 disabled:opacity-30 disabled:hover:bg-gray-500 transition-all border-2 border-black"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    )
}