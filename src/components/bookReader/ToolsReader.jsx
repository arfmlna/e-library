import { Search, X } from 'lucide-react'
import React, { lazy, useCallback, useEffect, useState } from 'react'

const DirectPageReader = lazy(() => import('./DirectPageReader'))
const ZoomReader = lazy(() => import('./ZoomReader'))

export default function ToolsReader({
    pageWidth,
    zoom,
    setZoom,
    numPages,
    pageRefs,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    isReady,
    scrollContainerRef,
    pageTexts,
    isNavigatingRef,
    setVisibleRange
}) {
    const [searchResults, setSearchResults] = useState([])
    const [activeSearchIndex, setActiveSearchIndex] = useState(-1)
    const [showSearchWord, setShowSearchWord] = useState(false)

    const goToPage = useCallback((targetPageNum) => {
        const container = scrollContainerRef?.current
        const targetElement = pageRefs.current[targetPageNum - 1]

        if (!container || !targetElement || targetPageNum < 1 || targetPageNum > numPages) {
            return
        }

        isNavigatingRef.current = true

        setCurrentPage(targetPageNum)

        const buffer = 3

        setVisibleRange({
            start: Math.max(1, targetPageNum - buffer),
            end: Math.min(numPages, targetPageNum + buffer)
        })

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const containerRect = container.getBoundingClientRect()
                const targetRect = targetElement.getBoundingClientRect()

                const targetScrollTop =
                    targetRect.top -
                    containerRect.top +
                    container.scrollTop

                container.scrollTo({
                    top: targetScrollTop,
                    behavior: 'auto'
                })

                requestAnimationFrame(() => {
                    isNavigatingRef.current = false
                })
            })
        })
    }, [
        numPages,
        pageRefs,
        scrollContainerRef,
        isNavigatingRef,
        setCurrentPage,
        setVisibleRange
    ])

    const handleSearch = (e) => {
        e.preventDefault()

        if (!searchQuery.trim() || !isReady || !pageTexts.length) {
            return
        }

        const query = searchQuery.toLowerCase().trim()
        const results = []

        pageTexts.forEach((pageText, index) => {
            if (!pageText) return

            const normalizedText = pageText.toLowerCase()
            const matchedIndex = normalizedText.indexOf(query)

            if (matchedIndex !== -1) {
                const startIndex = Math.max(0, matchedIndex - 25)
                const snippet = pageText.substring(
                    startIndex,
                    startIndex + 80
                )

                results.push({
                    page: index + 1,
                    snippet: `${snippet}${pageText.length > startIndex + 80 ? '...' : ''}`
                })
            }
        })

        setSearchResults(results)

        if (results.length > 0) {
            setActiveSearchIndex(0)
            goToPage(results[0].page)
        } else {
            setActiveSearchIndex(-1)
            alert(`Kata "${searchQuery}" tidak ditemukan di dalam PDF ini.`)
        }
    }

    const handleSelectResult = (index) => {
        if (!searchResults[index]) return

        setActiveSearchIndex(index)
        goToPage(searchResults[index].page)
    }

    useEffect(() => {
        const handleKeyDown = (evt) => {
            if (
                (evt.ctrlKey || evt.metaKey) &&
                evt.key.toLowerCase() === 'k'
            ) {
                evt.preventDefault()
                setShowSearchWord(true)
            }

            if (evt.key === 'Escape') {
                setShowSearchWord(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([])
            setActiveSearchIndex(-1)
        }
    }, [searchQuery])

    return (
        <div className="flex justify-center w-full">
            <ZoomReader
                zoom={zoom}
                setZoom={setZoom}
            />

            {numPages && (
                <DirectPageReader
                    goToPage={goToPage}
                    currentPage={currentPage}
                    numPages={numPages}
                />
            )}

            <div className="fixed top-16 left-3 z-10">
                <button
                    type="button"
                    onClick={() => setShowSearchWord(true)}
                    className="p-2.5 bg-black/70 backdrop-blur-sm text-zinc-400 text-xs shadow-lg rounded-md border-none transition-all"
                    title="Cari"
                >
                    <Search size={20} />
                </button>
            </div>

            {showSearchWord && (
                <div className="fixed top-1/3 z-20 flex flex-col justify-center gap-2 w-fit md:w-md">
                    <div className="relative w-full flex justify-end">
                        <button
                            className="absolute z-30 -right-3 btn btn-circle btn-xs btn-neutral"
                            onClick={() => setShowSearchWord(false)}
                        >
                            <X size={10} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="bg-black/70 backdrop-blur-sm p-2 rounded-md border border-zinc-800 flex gap-2 items-center"
                    >
                        <input
                            type="text"
                            placeholder="Cari kata..."
                            value={searchQuery}
                            onChange={e => {
                                setSearchQuery(e.target.value)

                                if (!e.target.value) {
                                    setSearchResults([])
                                    setActiveSearchIndex(-1)
                                }
                            }}
                            className="bg-zinc-800 text-white text-xs px-2.5 py-1.5 rounded outline-none flex-1 border border-zinc-700 focus:border-zinc-500"
                        />

                        <button
                            type="submit"
                            className="bg-zinc-600 hover:bg-zinc-500 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
                        >
                            Cari
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="bg-black/80 backdrop-blur-sm p-2 rounded-md border border-zinc-800 max-h-60 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
                            <div className="text-zinc-400 text-[10px] font-semibold px-1 tracking-wider uppercase">
                                Ditemukan {searchResults.length} hasil:
                            </div>

                            {searchResults.map((result, idx) => (
                                <button
                                    key={`${result.page}-${idx}`}
                                    type="button"
                                    onClick={() => handleSelectResult(idx)}
                                    className={`text-left p-2 rounded text-xs transition-colors flex flex-col gap-0.5 border ${
                                        idx === activeSearchIndex
                                            ? 'bg-zinc-700/60 border-zinc-500 text-white'
                                            : 'bg-zinc-900/40 border-transparent text-zinc-400 hover:bg-zinc-800/50'
                                    }`}
                                >
                                    <span className="font-bold text-[11px] text-zinc-300">
                                        Halaman {result.page}
                                    </span>

                                    <span className="truncate w-full italic text-zinc-400 text-[11px]">
                                        "{result.snippet}"
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}