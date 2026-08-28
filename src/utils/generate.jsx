import { pb } from "./pocketbase";

export async function generateKodeBuku(kodeKategori, kodeSumber) {
    const tahunSekarang = String(new Date().getFullYear()).slice(-2);
    let nomorUrutBaru = 1;

    try {
        // 1. Ambil data terakhir berdasarkan kategori untuk estimasi awal counter
        const recordTerakhir = await pb.collection('books').getFirstListItem(
            `kode_buku ~ "${kodeKategori}."`, 
            { sort: '-kode_buku' } // Urutkan dari kode buku terbesar
        );

        if (recordTerakhir) {
            const bagianKode = recordTerakhir.kode_buku.split('.');
            const nomorUrutTerakhir = parseInt(bagianKode[1], 10);
            if (!isNaN(nomorUrutTerakhir)) {
                nomorUrutBaru = nomorUrutTerakhir + 1;
            }
        }
    } catch (error) {
        nomorUrutBaru = 1;
    }

    // 2. LOOPING KUNCI: Cek apakah awalan "KATEGORI.NOMOR_URUT" sudah ada di DB
    let isUnique = false;
    let nomorUrutFormat = "";

    while (!isUnique) {
        nomorUrutFormat = String(nomorUrutBaru).padStart(5, '0');
        
        try {
            // Cek dengan operator tilde (~) untuk scan apakah prefix "02.00003." sudah terpakai
            // Ini akan memblokir nomor urut yang sama meskipun supplier / tahunnya berbeda!
            await pb.collection('books').getFirstListItem(`kode_buku ~ "${kodeKategori}.${nomorUrutFormat}."`);
            
            // Jika ketemu (tidak error), berarti nomor urut ini SUDAH PERNAH DIPAKAI. Naikkan counter!
            nomorUrutBaru++;
        } catch (error) {
            // Jika error 404 (Not Found), berarti nomor urut ini benar-benar kosong & aman digunakan
            isUnique = true;
        }
    }

    // 3. Gabungkan hasil akhir
    return `${kodeKategori}.${nomorUrutFormat}.${kodeSumber}.${tahunSekarang}`;
}


