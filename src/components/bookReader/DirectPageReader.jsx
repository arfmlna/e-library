import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

export default function DirectPageReader({
    goToPage,
    currentPage,
    numPages
}) {
    const handleNextPage = () => {
        if (currentPage < numPages) {
            goToPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };
    return (
        <div className="fixed bottom-3 w-fit flex justify-center items-center gap-3 z-10 bg-zinc-900/80 backdrop-blur-md p-1 rounded-2xl border border-zinc-800 shadow-2xl">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="btn btn-xs rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 transition-all border border-zinc-700/50"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-zinc-300 font-medium text-xs px-2 tracking-wide">
                {currentPage} / {numPages}
            </span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === numPages}
                className="btn btn-xs rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 transition-all border border-zinc-700/50"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    )
}
