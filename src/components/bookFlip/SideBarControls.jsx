import React, { lazy, useCallback } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = lazy(() => import('./SearchPage'));
const ZoomBook = lazy(() => import('./ZoomBook'));
const SearchWord = lazy(() => import('./SearchWord'))

// export default function SideBarControls({
//     isSidebarOpen,
//     setIsSidebarOpen,
//     currentPage,
//     currentResultIndex,
//     setCurrentResultIndex,
//     flipBookRef,
//     numPages,
//     pdfDocument,
//     searchQuery,
//     setSearchQuery,
//     searchResults,
//     setSearchResults,
//     inputPage,
//     setInputPage,
//     zoom,
//     setZoom,
// }) {
//     const navigate = useNavigate()
    
//     const safeTurnToPage = useCallback((pageIndex) => {
//         if (!flipBookRef?.current) return;
//         const pageFlipInstance = flipBookRef?.current?.pageFlip();
//         if (pageFlipInstance && typeof pageFlipInstance?.turnToPage === 'function') {
//             if (pageFlipInstance?.getCurrentPageIndex() !== pageIndex) {
//                 pageFlipInstance?.turnToPage(pageIndex);
//             }
//         }
//     }, []);
//     return (
//         <div className={`
//         flex flex-col gap-4 bg-white dark:bg-gray-800 p-5 shadow-xl md:shadow-sm backdrop-blur-md
        
//         transition-all duration-300 ease-in-out z-40
        
//         h-screen max-h-[25vh] rounded-t-md fixed bottom-0 left-0 right-0 w-full overflow-y-auto transform origin-bottom
//         ${isSidebarOpen 
//         ? 'translate-y-0 opacity-100' 
//         : 'translate-y-full opacity-0 pointer-events-none'
//         }
//         md:relative md:bottom-auto md:left-auto md:right-auto md:translate-y-0
//         md:max-h-none md:origin-left md:rounded-t-none md:rounded-r-md
//         ${isSidebarOpen 
//         ? 'md:w-[320px] md:opacity-100 md:scale-100 md:pointer-events-auto' 
//         : 'md:w-0 md:h-auto md:p-0 md:opacity-0 md:scale-95 md:pointer-events-none md:overflow-hidden'
//         }
//         `}
//         >      
//             <div className="flex justify-between items-center md:hidden border-b border-slate-200 dark:border-slate-800">
//                 <span className="font-semibold text-sm text-slate-500">Menu Navigasi</span>
//                 <button onClick={() => setIsSidebarOpen(false)} className="p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
//                     <X size={18} />
//                 </button>
//             </div>
            
//             <div className={`${!isSidebarOpen && 'hidden md:block'}`}>
//                 <button className='px-2 py-1 btn btn-sm justify-start mb-5' onClick={() => navigate(-1)}>
//                     <ArrowLeft size={16} className='inline'/>
//                     kembali
//                 </button>              
//                 <SearchWord currentResultIndex={currentResultIndex} flipBookRef={flipBookRef} numPages={numPages} pdfDocument={pdfDocument} searchQuery={searchQuery} searchResults={searchResults} setCurrentResultIndex={setCurrentResultIndex} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} safeTurnToPage={safeTurnToPage} />
//                 <SearchPage currentPage={currentPage} inputPage={inputPage} numPages={numPages} safeTurnToPage={safeTurnToPage} setInputPage={setInputPage} />
//                 <ZoomBook zoom={zoom} setZoom={setZoom} />
//             </div>
//         </div>
//     );
// }

export default function SideBarControls({
    isSidebarOpen,
    setIsSidebarOpen,
    currentPage,
    currentResultIndex,
    setCurrentResultIndex,
    flipBookRef,
    numPages,
    pdfDocument,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    inputPage,
    setInputPage,
    zoom,
    setZoom,
    textCacheRef,
    showArrow,
    setShowArrow
}) {

    const navigate = useNavigate();

    const safeTurnToPage = useCallback((pageIndex) => {

        if (!flipBookRef?.current) {
            return;
        }

        if (typeof pageIndex !== 'number' || pageIndex < 0 || pageIndex >= numPages) {
            return;
        }

        const pageFlipInstance = flipBookRef.current.pageFlip();

        if (pageFlipInstance && typeof pageFlipInstance.turnToPage === 'function') {
            const currentIndex = pageFlipInstance.getCurrentPageIndex();

            if (currentIndex !== pageIndex) {
                pageFlipInstance.turnToPage(pageIndex);
            }
        }
    }, [flipBookRef, numPages]);

    return (
        <div
        className={`
            flex flex-col gap-4 bg-white dark:bg-gray-800 p-5 shadow-xl md:shadow-sm backdrop-blur-md transition-all duration-300 ease-in-out z-40 h-screen max-h-[25vh] rounded-t-md fixed bottom-0 left-0 right-0 w-full overflow-y-auto transform origin-bottom
            
            ${ isSidebarOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
                
            md:relative md:bottom-auto md:left-auto md:right-auto md:translate-y-0 md:max-h-none md:origin-left md:rounded-t-none md:rounded-r-md
            ${ isSidebarOpen ? 'md:w-[320px] md:opacity-100 md:scale-100 md:pointer-events-auto' : 'md:w-0 md:h-auto md:p-0 md:opacity-0 md:scale-95 md:pointer-events-none md:overflow-hidden'}
        `}
        >
            <div className="flex justify-between items-center md:hidden border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-sm text-slate-500">
                    Menu Navigasi
                </span>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1"
                >
                    <X size={18} />
                </button>
            </div>
            <div className={`${!isSidebarOpen && 'hidden md:block'}`}>
                <div className="flex justify-between w-full items-center mb-5">
                    <button
                    className="px-2 py-1 btn btn-sm justify-start"
                    onClick={() => navigate(-1)}
                    >
                        <ArrowLeft
                        size={16}
                        className="inline"
                        />
                        kembali
                    </button>
                    <div className="text-sm inline items-center">
                        <label htmlFor="showArrow" className='text-md mr-1'> Show Arrow </label>
                        <input type="checkbox" name="showArrow" id="showArrow" 
                        className='checkbox checkbox-sm'
                        onChange={(e) => setShowArrow(e.target.checked)} 
                        defaultChecked={showArrow}/>
                    </div>
                </div>
                <SearchWord
                currentResultIndex={currentResultIndex}
                numPages={numPages}
                pdfDocument={pdfDocument}
                searchQuery={searchQuery}
                searchResults={searchResults}
                setCurrentResultIndex={setCurrentResultIndex}
                setSearchQuery={setSearchQuery}
                setSearchResults={setSearchResults}
                safeTurnToPage={safeTurnToPage}
                textCacheRef={textCacheRef}
                />
                <SearchPage
                currentPage={currentPage}
                inputPage={inputPage}
                numPages={numPages}
                safeTurnToPage={safeTurnToPage}
                setInputPage={setInputPage}
                />
                <ZoomBook
                zoom={zoom}
                setZoom={setZoom}
                />
            </div>
        </div>
    );
}