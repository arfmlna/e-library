import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PageNavigationHint({ 
    currentPage,
    numPages,
    isMobile,
    showArrow
}) {
    const canGoPrevious = currentPage > 1
    const canGoNext = currentPage < numPages - (isMobile ? 1 : 2)

    if (!canGoPrevious && !canGoNext) {
        return null
    }

    return (
        showArrow && (
            <div className="pointer-events-none fixed inset-0 z-20">
                { canGoPrevious && (
                    <div className="absolute left-[1%] top-1/3 md:top-1/2 -translate-y-1/2 flex items-center animate-page-hint-left">
                        <ChevronLeft
                        size={34}
                        strokeWidth={2.5}
                        className="drop-shadow-lg text-black"
                        />
                    </div>
                )}
                { canGoNext && (
                    <div className="absolute right-[1%] top-1/3 md:top-1/2 -translate-y-1/2 flex items-center animate-page-hint-right">
                        <ChevronRight
                        size={34}
                        strokeWidth={2.5}
                        className="drop-shadow-lg text-black"
                        />
                    </div>
                ) }
            </div>
        )
    )
}