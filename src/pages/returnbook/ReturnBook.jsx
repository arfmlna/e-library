import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import TemplateReturnBook from './TemplateReturnBook'
import { useDebounce } from 'use-debounce'

const CountDown = ({ tgl, sisaWaktu, setSisaWaktu }) => {
    useEffect(() => {
        const hitungSisaWaktu = () => {
        const sekarang = new Date()
        const overDate = new Date(tgl)
        const selisihMilidetik = overDate.getTime() - sekarang.getTime();

        if (selisihMilidetik <= 0) {
            setSisaWaktu({ hari: 0, jam: 0, menit: 0, detik: 0, selesai: true });
            return;
        }

        const totalDetik = Math.floor(selisihMilidetik / 1000);

        setSisaWaktu({
            hari: Math.floor(totalDetik / (24 * 3600)),
            jam: Math.floor((totalDetik % (24 * 3600)) / 3600),
            menit: Math.floor((totalDetik % 3600) / 60),
            detik: totalDetik % 60,
            selesai: false
        });
        };

        hitungSisaWaktu();

        const intervalId = setInterval(hitungSisaWaktu, 1000);

        return () => clearInterval(intervalId);
    }, [tgl]);
    return(
        <div className="countdown antialiased flex flex-row gap-1 justify-center">
        <span style={{"--value":sisaWaktu?.hari}} aria-live="polite" aria-label={sisaWaktu?.hari}>00</span>Days
        <span style={{"--value":sisaWaktu?.jam}} aria-live="polite" aria-label={sisaWaktu?.jam}>00</span>Hours
        <span style={{"--value":sisaWaktu?.menit}} aria-live="polite" aria-label={sisaWaktu?.menit}>00</span>Minutes
        <span style={{"--value":sisaWaktu?.detik}} aria-live="polite" aria-label={sisaWaktu?.detik}>00</span>Seconds
        </div>
    )
}

export default function ReturnBook() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)
    
    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: pengembalian, refetch: refreshData } = useQuery({
        queryKey: ['pengembalian'],
        queryFn: async () => pb.collection('pengembalian').getList(1, 8, {
            expand: "peminjam,peminjam.peminjam,peminjam.buku,peminjam.petugas,petugas",
            sort: "-created"
        })
    })

    return (
        <TemplateReturnBook title={"Pengembalian Buku"} fullData={pengembalian} page={page} refreshData={refreshData} searchItem={searchItem} searchTerm={searchTerm} setSearchItem={setSearchItem} setPage={setPage} tb={'pengembalian'} />
    )
}
