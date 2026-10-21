import React, { useState } from 'react'

export default function SearchWord({
    searchResults,
    setSearchResults,
    currentResultIndex,
    setCurrentResultIndex,
    pdfDocument,
    searchQuery,
    setSearchQuery,
    numPages,
    safeTurnToPage,
    textCacheRef
}) {

    const [isSearching, setIsSearching] = useState(false);

    const resetSearch = () => {
        setSearchResults([]);
        setCurrentResultIndex(-1);
        setIsSearching(false);
    };

    const getPageText = async (pageNum) => {
        if (textCacheRef?.current?.has(pageNum)) {
            return textCacheRef.current.get(pageNum);
        }

        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map(item => item.str)
            .filter(str => typeof str === 'string')
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        textCacheRef?.current?.set(pageNum, pageText);

        return pageText;
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!pdfDocument || isSearching) {
            return;
        }

        const query = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ');

        if (!query) {
            resetSearch();
            return;
        }

        setIsSearching(true);
        setSearchResults([]);
        setCurrentResultIndex(-1);

        const results = [];

        try {
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const pageText = await getPageText(pageNum);
                const pageTextLower = pageText.toLowerCase();
                const matchIndex = pageTextLower.indexOf(query);

                if (matchIndex === -1) {
                    continue;
                }

                const start = Math.max(0, matchIndex - 35);
                const end = Math.min(pageText.length, matchIndex + query.length + 35);

                let snippet = pageText.substring(start, end);
                if (start > 0) {
                    snippet = '...' + snippet;
                }

                if (end < pageText.length) {
                    snippet += '...';
                }

                results.push({
                    pageIndex: pageNum - 1,
                    snippet
                });
            }

            setSearchResults(results);

            if (results.length > 0) {
                setCurrentResultIndex(0);
                safeTurnToPage(results[0].pageIndex);
            } else {
                setCurrentResultIndex(-1);
                alert('Kata tidak ditemukan');
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Gagal membaca PDF:', error);
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        setSearchQuery(value);

        if (!value.trim()) {
            resetSearch();
        }
    };

    const navigateSearch = (direction) => {

        if (searchResults.length === 0) {
            return;
        }

        let nextIndex = currentResultIndex + direction;

        if (nextIndex >= searchResults.length) {
            nextIndex = 0;
        }

        if (nextIndex < 0) {
            nextIndex = searchResults.length - 1;
        }

        setCurrentResultIndex(nextIndex);

        safeTurnToPage(searchResults[nextIndex].pageIndex);
    };

    const handleSnippetClick = (index) => {

        setCurrentResultIndex(index);

        safeTurnToPage(
            searchResults[index].pageIndex
        );
    };

    return (
        <div className="w-full">
            <form
            onSubmit={handleSearch}
            className="grid grid-cols-12 gap-2 items-center w-full"
            >
                <input
                type="text"
                placeholder="Cari kata..."
                value={searchQuery}
                onChange={handleInputChange}
                disabled={isSearching}
                className="input input-bordered input-sm col-span-9 w-full"
                />
                <button
                type="submit"
                disabled={isSearching}
                className="btn btn-primary btn-sm col-span-3"
                >
                    {isSearching ? 'Mencari...' : 'Cari'}
                </button>
            </form>

            {!isSearching &&
                searchResults.length > 0 && (
                <div className="flex flex-col items-center gap-1 mt-2 p-2 rounded-lg text-xs w-full">
                    <div className="flex items-center gap-2 text-xs">
                        <button
                        type="button"
                        onClick={() => navigateSearch(-1)}
                        className="btn btn-xs"
                        >
                            ◀
                        </button>
                        <span>
                            Hasil : {currentResultIndex + 1} dari {searchResults.length} halaman
                        </span>

                        <button
                        type="button"
                        onClick={() => navigateSearch(1)}
                        className="btn btn-xs"
                        >
                            ▶
                        </button>
                    </div>
                    <span className="text-[11px] mt-1">Page: <strong>Halaman {searchResults[currentResultIndex]?.pageIndex + 1}</strong></span>
                </div>
            )}

            {isSearching ? (
                <div className="mt-4 flex flex-col items-center justify-center gap-2 w-full p-4">
                    <span className="loading loading-infinity loading-lg text-primary"></span>
                    <p className="text-xs text-gray-500 font-medium animate-pulse">
                        Sedang memindai halaman buku...
                    </p>
                </div>
            ) : searchResults.length > 0 ? (
                <div
                className="flex flex-col gap-1 mt-2 flex-1 overflow-y-auto max-h-[35vh] rounded-lg p-2 shadow-inner"
                style={{
                    scrollbarWidth: 'thin'
                }}
                >
                    <span className="text-[11px] font-bold px-1 uppercase tracking-wider">
                        Teks Terdeteksi:
                    </span>
                    <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                        {searchResults.map((item, idx) => (
                            <button
                            key={idx}
                            type="button"
                            onClick={() =>
                                handleSnippetClick(idx)
                            }
                            className={`text-left p-2 rounded text-xs transition-all border
                                ${ idx === currentResultIndex
                                    ? `
                                        bg-primary
                                        text-primary-content
                                        border-primary
                                        font-semibold
                                        shadow-sm
                                    ` : `
                                        bg-gray-50
                                        hover:bg-gray-100
                                        text-gray-700
                                        border-gray-200
                                    `
                                }
                            `}
                            >

                                <div className="flex justify-between items-center mb-1">
                                    <span className={`badge badge-xs ${idx === currentResultIndex ? 'badge-secondary' : 'badge-neutral'}`}>
                                        Hal. {item.pageIndex + 1}
                                    </span>
                                </div>
                                <p className="line-clamp-2 italic text-[11px]"> {item.snippet}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
