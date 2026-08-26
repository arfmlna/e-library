import { pb } from "./pocketbase";

export async function generateKodeBuku(kodeKategori, kodeSumber) {
    try {
        const recordTerakhir = await pb.collection('books').getFirstListItem(
            `kode_buku ~ "${kodeKategori}."`, 
            { sort: '-created' }
        );

        let nomorUrutBaru = 1;

        if (recordTerakhir) {
            const bagianKode = recordTerakhir.kode_buku.split('.');
            const nomorUrutTerakhir = parseInt(bagianKode[1], 10);
            nomorUrutBaru = nomorUrutTerakhir + 1;
        }

        const nomorUrutFormat = String(nomorUrutBaru).padStart(5, '0');

        const tahunSekarang = String(new Date().getFullYear()).slice(-2);

        const kodeBukuFinal = `${kodeKategori}.${nomorUrutFormat}.${kodeSumber}.${tahunSekarang}`;
        
        return kodeBukuFinal;

    } catch (error) {
        const nomorUrutFormat = "00001";
        const tahunSekarang = String(new Date().getFullYear()).slice(-2);
        return `${kodeKategori}.${nomorUrutFormat}.${kodeSumber}.${tahunSekarang}`;
    }
}
