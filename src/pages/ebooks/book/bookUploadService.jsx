import { pb } from "@/utils/pocketbase";
import JSZip from "jszip";
import * as XLSX from "xlsx";

export const parseZipContent = async (zipFileObject) => {
    const zip = new JSZip();
    const unzipped = await zip.loadAsync(zipFileObject);
    
    const excelFileName = Object.keys(unzipped.files).find(
        (name) => name.endsWith(".xlsx") || name.endsWith(".xls")
    );
    if (!excelFileName) throw new Error("File Excel (.xlsx) tidak ditemukan di dalam ZIP!");

    const excelDataRaw = await unzipped.files[excelFileName].async("arraybuffer");
    const workbook = XLSX.read(excelDataRaw, { type: "array" });
    const booksData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames]);

    if (booksData.length === 0) throw new Error("Data di dalam file Excel kosong!");

    const tahunSekarang = String(new Date().getFullYear()).slice(-2);
    
    const counterTracker = {}; 
    const parsedBooks = [];

    for (const book of booksData) {
        const katKode = String(book.KodeKategori || "00").padStart(2, "0");
        const supKode = String(book.KodeSupplier || "00").padStart(2, "0");
        const keyKombinasi = `${katKode}_${supKode}`; // Contoh key: "01_02"

        if (!counterTracker[keyKombinasi]) {
            counterTracker[keyKombinasi] = await fetchLastNomorUrut(katKode, supKode);
        } else {
            counterTracker[keyKombinasi] += 1;
        }

        const currentCounter = counterTracker[keyKombinasi];
        const nomorUrutFormat = String(currentCounter).padStart(5, '0');
        const previewKodeBuku = `${katKode}.${nomorUrutFormat}.${supKode}.${tahunSekarang}`;

        parsedBooks.push({
            ...book,
            previewKodeBuku,
            hasPoster: book.PosterName ? !!unzipped.files[book.PosterName] : false,
            hasPdf: book.PdfName ? !!unzipped.files[book.PdfName] : false,
        });
    }

  return parsedBooks;
};

export const fetchIdByCode = async (collectionName, codeValue) => {
    const cleanCode = String(codeValue).padStart(2, "0");
    try {
        const record = await pb.collection(collectionName).getFirstListItem(`kode = "${cleanCode}"`);
        return record.id;
    } catch {
        throw new Error(`Kode "${cleanCode}" tidak terdaftar di database koleksi [${collectionName}]!`);
    }
};

export const fetchLastNomorUrut = async (kodeKategori, KodeSupplier) => {
    const cleanKategori = String(kodeKategori || "00").padStart(2, "0");
    const cleanSupplier = String(KodeSupplier || "00").padStart(2, "0");
    try {
        const recordTerakhir = await pb.collection('books').getFirstListItem(
            `kode_buku ~ "${cleanKategori}." && kode_buku ~ ".${cleanSupplier}."`, 
            { sort: '-kode_buku' }
        );
        if (recordTerakhir && recordTerakhir.kode_buku) {
            const bagianKode = recordTerakhir.kode_buku.split('.');
            if (bagianKode.length >= 2) {
                const nomorUrutTerakhir = parseInt(bagianKode[1], 10);
                if (!isNaN(nomorUrutTerakhir)) {
                    return nomorUrutTerakhir + 1;
                }
            }
        }
        return 1
    } catch {
        return 1;
    }
};