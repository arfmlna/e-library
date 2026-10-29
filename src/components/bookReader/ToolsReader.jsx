import { Search, X } from 'lucide-react'
import React, { lazy, useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'

const DirectPageReader = lazy(() => import('./DirectPageReader'))
const ZoomReader = lazy(() => import('./ZoomReader'))

export default function ToolsReader({
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
    const searchInputRef = useRef(null);

    const goToPage = useCallback((targetPageNum) => {
        const container = scrollContainerRef?.current;
        if (!container || targetPageNum < 1 || targetPageNum > numPages) return;

        isNavigatingRef.current = true;
        setCurrentPage(targetPageNum);

        const buffer = 2;
        setVisibleRange({
            start: Math.max(1, targetPageNum - buffer),
            end: Math.min(numPages, targetPageNum + buffer)
        });

        requestAnimationFrame(() => requestAnimationFrame(() => {
            const targetElement = pageRefs.current[targetPageNum - 1];

            if (targetElement) {
                const top = targetElement.getBoundingClientRect().top
                    - container.getBoundingClientRect().top
                    + container.scrollTop;

                container.scrollTo({ top, behavior: 'smooth' });
            }

            setTimeout(() => {
                isNavigatingRef.current = false;
            }, 450);
        }));
    }, [
        numPages, pageRefs, scrollContainerRef, isNavigatingRef,
        setCurrentPage, setVisibleRange
    ]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();

        const query = searchQuery.trim().toLowerCase();
        if (!query || !isReady || !pageTexts?.length) return;

        const results = [];

        pageTexts.forEach((pageText, index) => {
            if (typeof pageText !== 'string' || !pageText.trim()) return;

            const text = pageText.toLowerCase();
            const matchedIndex = text.indexOf(query);
            if (matchedIndex === -1) return;

            const start = Math.max(0, matchedIndex - 25);
            const snippet = pageText.substring(start, start + 80);

            results.push({
                page: index + 1,
                snippet: `${start > 0 ? '...' : ''}${snippet}${pageText.length > start + 80 ? '...' : ''}`
            });
        });

        setSearchResults(results);
        setActiveSearchIndex(results.length ? 0 : -1);

        if (results.length) {
            goToPage(results[0].page);
        } else {
            Swal.fire({
                icon: 'error',
                text: `Kata "${searchQuery.trim()}" tidak ditemukan di dalam PDF ini.`
            });
        }
    }, [searchQuery, isReady, pageTexts, goToPage]);

    const handleSelectResult = useCallback((index) => {
        const result = searchResults[index];
        if (!result) return;

        setActiveSearchIndex(index);
        goToPage(result.page);
        setShowSearchWord(false);
    }, [searchResults, goToPage]);

    useEffect(() => {
        const handleKeyDown = (evt) => {
            if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'k') {
                evt.preventDefault();
                setShowSearchWord(true);
                requestAnimationFrame(() => {
                    searchInputRef.current?.focus();
                    searchInputRef.current?.select();
                });
            }

            if (evt.key === 'Escape') setShowSearchWord(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setActiveSearchIndex(-1);
        }
    }, [searchQuery]);
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
                    className="p-2.5 border-2 border-black bg-white/70 backdrop-blur-sm text-black  text-xs shadow-lg rounded-md transition-all"
                    title="Cari"
                >
                    <Search size={20} />
                </button>
            </div>

            {showSearchWord && (
                <div className="fixed top-1/3 z-20 flex flex-col justify-center gap-2 w-xs md:w-md">
                    <div className="relative w-full flex justify-end">
                        <button
                            className="absolute z-30 -right-3 btn btn-circle btn-xs bg-white border-2 border-black text-black"
                            onClick={() => setShowSearchWord(false)}
                        >
                            <X size={10} className='font-black' />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="border-2 border-black bg-white/70 backdrop-blur-sm p-2 rounded-md flex gap-2 items-center"
                    >
                        <input
                            type="text"
                            placeholder="Cari kata..."
                            value={searchQuery}
                            ref={searchInputRef} 
                            onChange={e => {
                                setSearchQuery(e.target.value)

                                if (!e.target.value) {
                                    setSearchResults([])
                                    setActiveSearchIndex(-1)
                                }
                            }}
                            className="bg-white text-black text-xs px-2.5 py-1.5 rounded outline-none flex-1 border-2 border-black focus:border-gray-800"
                        />

                        <button
                            type="submit"
                            className="bg-white border-2 border-black hover:bg-gray-200 text-black text-xs px-3 py-1.5 rounded font-medium transition-colors"
                        >
                            Cari
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-md border-2 border-black max-h-60 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
                            <div className="text-black text-[10px] font-semibold px-1 tracking-wider uppercase">
                                Ditemukan {searchResults.length} hasil:
                            </div>

                            {searchResults.map((result, idx) => (
                                <button
                                    key={`${result.page}-${idx}`}
                                    type="button"
                                    onClick={() => handleSelectResult(idx)}
                                    className={`text-left p-2 rounded text-xs transition-colors flex flex-col gap-0.5 ${
                                        idx === activeSearchIndex
                                            ? 'bg-black border-2 border-black text-white'
                                            : 'bg-white border-2 border-black text-black hover:bg-gray-800/50'
                                    }`}
                                >
                                    <span className="font-bold text-[11px]">
                                        Halaman {result.page}
                                    </span>

                                    <span className="truncate w-full italic text-[11px]"
                                    onClick={() => setShowSearchWord(false)}>
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