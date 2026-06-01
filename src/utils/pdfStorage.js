import { openDB } from "idb"

const DBName = 'PDFDB'
const storeName = 'pdfs'

const initDB = () => openDB(DBName, 1, {
    upgrade(db){
        db.createObjectStore(storeName, {
            keyPath: 'id'
        })
    }
})

export const downloadPDF = async (url, filename) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal Download PDF')
        
        const blob = await res.blob()
        const PDFData = {
            id: filename,
            blob: blob,
            url: url,
            downloadedAt: new Date().toISOString(),
        }

        const db = await initDB()
        await db.put(storeName, PDFData)
        console.log(`PDF ${filename} tersimpan!`);
        return PDFData;
    } catch (error) {
        console.error('Error Download: ', error)
        throw error
    }
}

export const loadPDF = async (filename) => {
    const db = await initDB()
    const PDFData = await db.get(storeName, filename)
    if (PDFData) {
        return URL.createObjectURL(PDFData.blob)
    }
}

export const deletePDF = async (filename) => {
  const db = await initDB();
  await db.delete(storeName, filename);
};

export const listPDFs = async () => {
  const db = await initDB();
  return await db.getAll(storeName);
};