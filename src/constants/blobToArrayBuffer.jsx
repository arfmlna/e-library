export const blobToArrayBuffer = async (blob) => {
    if (typeof blob.arrayBuffer === 'function') {
        return await blob.arrayBuffer();
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
};