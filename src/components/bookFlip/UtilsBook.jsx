export const documentOptions = {
    cMapUrl: '/cmaps/',
    cMapPacked: true,
    disableAutoFetch: true,
    disableStream: false,
    rangeChunkSize: 524288,
    standardFontDataUrl: `${window?.location?.origin}/standard_fonts/`,
    verbosity: 0,
    pdfBug: false 
}

// export const handleResizeBook = (setIsMobile, setDimensions, isSidebarOpen) => {
//     const widthWin = window.innerWidth;
//     const heightWin = window.innerHeight;
//     const mobileCheck = widthWin < 768;
//     setIsMobile(mobileCheck);

//     if (mobileCheck) {
//         const targetHeight = heightWin * 1.0; 
//         const targetWidth = targetHeight / 1.414;
        
//         setDimensions({
//             width: Math.min(targetWidth, widthWin - 32), 
//             height: targetHeight
//         });
//     } else {
//         const maxAvailableHeight = heightWin - 120;
        
//         const availableWidth = isSidebarOpen ? (widthWin - 320 - 64) : (widthWin - 64);
//         const maxAvailableWidth = (availableWidth * 1.0) / 2;

//         let finalHeight = maxAvailableHeight;
//         let finalWidth = finalHeight / 1.414;

//         if (finalWidth > maxAvailableWidth) {
//             finalWidth = maxAvailableWidth;
//             finalHeight = finalWidth * 1.414;
//         }

//         setDimensions({
//             width: finalWidth,
//             height: finalHeight
//         });
//     }
// };

export const handleResizeBook = (
    setIsMobile,
    setDimensions,
    isSidebarOpen
) => {
    const widthWin = window.innerWidth;
    const heightWin = window.innerHeight;
    const mobileCheck = widthWin < 768;

    setIsMobile(mobileCheck);

    if (mobileCheck) {
        const targetHeight = heightWin * 1.0;
        const targetWidth = targetHeight / 1.414;

        setDimensions({ width: Math.min(targetWidth, widthWin - 32), height: targetHeight });

        return;
    }

    const maxAvailableHeight = heightWin - 120;
    const availableWidth = isSidebarOpen ? widthWin - 320 - 64 : widthWin - 64;

    const maxAvailableWidth = availableWidth / 2;

    let finalHeight = maxAvailableHeight;

    let finalWidth = finalHeight / 1.414;

    if (finalWidth > maxAvailableWidth) {
        finalWidth = maxAvailableWidth;
        finalHeight = finalWidth * 1.414;
    }

    setDimensions({
        width: finalWidth,
        height: finalHeight
    });
};