import React from 'react'

export default function SearchPage({inputPage, setInputPage, numPages, currentPage, safeTurnToPage}) {
    const handleGoToPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(inputPage, 10);

        if ( isNaN(pageNum) || pageNum < 1 || pageNum > numPages ) {
            alert(`Masukkan nomor halaman yang valid (1 - ${numPages})`);
            return;
        }

        safeTurnToPage(
            pageNum - 1
        );

        setInputPage('');
    };

    return (
        <div className="flex flex-col gap-2 pt-4 justify-start!">
            <form
            onSubmit={handleGoToPage}
            className="grid grid-cols-12 gap-2 items-center w-full"
            >
                <input
                type="number"
                placeholder="cari halaman..."
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                className="input input-ghost border-black dark:border-white text-black dark:text-white input-sm w-full col-span-9"
                min="1"
                max={numPages}
                />
                <button
                type="submit"
                className="btn btn-outline btn-sm whitespace-nowrap col-span-3"
                >
                    Pindah
                </button>
            </form>
            <div className="text-[11px] mt-1">
                Halaman saat ini:{' '}
                <span className="font-semibold">
                    {currentPage + 1}
                </span>
                {' '}dari{' '}
                <span className="font-semibold">
                    {numPages}
                </span>
            </div>
        </div>
    );
}
