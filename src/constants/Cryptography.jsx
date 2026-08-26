import { blobToArrayBuffer } from "./blobToArrayBuffer";

export const getEncryptionKey = async (userId) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(`BookSecret_${userId}`),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(userId),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
};

export const encryptBlob = async (blob, key) => {
    const arrayBuffer = await blobToArrayBuffer(blob);
    const iv = crypto.getRandomValues(new Uint8Array(12)); 
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        arrayBuffer
    );
    
    const combined = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.byteLength);
    return combined.buffer;
};

export const decryptBookData = async (encryptedArrayBuffer, userId, mimeType = "application/pdf") => {
    if (!encryptedArrayBuffer) return null;
    try {
        const cryptoKey = await getEncryptionKey(userId);
        const fullBuffer = new Uint8Array(encryptedArrayBuffer);
        
        // Pisahkan kembali IV (12 byte pertama) dan data terenkripsi
        const iv = fullBuffer.slice(0, 12);
        const encryptedData = fullBuffer.slice(12);

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            encryptedData
        );

        return new Blob([decryptedBuffer], { type: mimeType });
    } catch (error) {
        console.error("Gagal mendekripsi berkas biner:", error);
        return null; // Mengembalikan null jika gagal agar aplikasi tidak crash
    }
};