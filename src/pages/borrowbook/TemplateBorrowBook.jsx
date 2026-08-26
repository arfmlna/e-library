import { dateOnlyFormatted, timeFormatted } from '@/constants/dateFormat'
import { pb } from '@/utils/pocketbase'
import React, { Fragment, useState } from 'react'
import DialogDetail from './DialogDetail'
import DialogCreate from './DialogCreate'
import Swal from 'sweetalert2'
import { UserRoundPlus, UserRoundX } from 'lucide-react'
import SearchData from '@/components/search/Search'
import DialogUpdate from './DialogUpdate'
import Layout from '@/components/ui/layout'

export default function TemplateBorrowBook({ title, fullData, tb, refreshData, searchItem, setSearchItem, page, setPage, searchTerm }) {
    const [openToggle, setOpenToggle] = useState(false)
    const [selectedIds, setSelectedIds] = useState([]);
    const [openDetail, setOpenDetail] = useState({
        status: false,
        data: []
    })
    const [openDialogUpdate, setOpenDialogUpdate] = useState({
        status: false,
        data: []
    })

    const handleChange = (result) => {
        setSelectedIds([])
        setSearchItem(result)
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        const allInputData = new FormData(e.target)
        
        const rawDate = allInputData.get('tglPeminjaman'); 

        if (rawDate) {
            const isoDate = new Date(rawDate).toISOString();
            
            allInputData.set('tglPeminjaman', isoDate);
        }

        const data = Object.fromEntries(allInputData.entries())

        Swal.fire({
            title: 'Mohon Tunggu',
            text: 'Sedang menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await pb.collection(tb).create(data);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data baru telah ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });

            e.target.reset();
            refreshData()
            setOpenToggle(false)
        } catch (error) {
            console.error("Error Detail:", error.data);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: error.message || 'Terjadi kesalahan pada server'
            });
        }
    }

    const handleUpdate = async (e, id) => {
        e.preventDefault()
        const allInputData = new FormData(e.target)
        const data = Object.fromEntries(allInputData.entries())

        Swal.fire({
            title: 'Mohon Tunggu',
            text: 'Sedang memperbaharui data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await pb.collection('peminjaman').update(id, data);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data telah update ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });

            e.target.reset();
            refreshData()
            setOpenDialogUpdate((prev) => ({...prev, status: false}))
            setOpenDetail((prev) => ({ ...prev, status: false }))
        } catch (error) {
            console.error("Error Detail:", error.data);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbaharui',
                text: error.message || 'Terjadi kesalahan pada server'
            });
        }
    }

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            return Swal.fire({
                title: 'Tidak ada data terpilih!',
                text: 'Silakan pilih setidaknya satu data yang ingin dihapus.',
                icon: 'info',
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#3085d6',
            })
        };

        const result = await Swal.fire({
            title: 'Apakah kamu yakin?',
            text: `Kamu akan menghapus ${selectedIds.length} data. Aksi ini tidak dapat dibatalkan!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus semua!',
            cancelButtonText: 'Batal'
        });
        
        if (result.isConfirmed) {
            Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            const batch = pb.createBatch();
    
            selectedIds.forEach((id) => {
                batch.collection(tb).delete(id);
            });
    
            try {
                await batch.send();
                await Swal.fire(
                    'Terhapus!',
                    'Data berhasil dihapus dari server.',
                    'success'
                ).then(() => {
                    setSelectedIds([])
                    refreshData()
                });
            } catch (err) {
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data: ' + err.message,
                    'error'
                );
            }
        }

    }

    const handleCheckAll = (e) => {
        if (e.target.checked) {
        const allIds = fullData?.items?.map((item) => item.id);
        setSelectedIds(allIds);
        } else {
        setSelectedIds([]);
        }
    };

    const handleCheckItem = (id) => {
        setSelectedIds((prev) => {
            const currentIds = prev || [];
            return currentIds?.includes(id) ? currentIds?.filter((item) => item !== id) : [...currentIds, id]
        }
        );
    };

    const handleToggleClose = () => {
        setOpenToggle(false)
    }

    const zonaWaktu = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
        <Fragment>
            <DialogCreate title={title} openToggle={openToggle} setOpenToggle={handleToggleClose} handleAdd={handleAdd} />

            <DialogDetail open={openDetail?.status} onClose={() => setOpenDetail((prev) => ({ ...prev, status: false }))} detail={openDetail?.data} setOpenEdit={setOpenDialogUpdate} />
            
            <DialogUpdate title={title} openToggle={openDialogUpdate} setOpenToggle={() => setOpenDialogUpdate((prev) => ({
                status:false,
                data: []
            }))} handleUpdate={handleUpdate} />

            <Layout title={title}>
                <div className="mt-3 mb-7 flex justify-center md:justify-end">
                    <SearchData searchItem={searchItem} setSearchItem={handleChange} />
                </div>
                <div className="flex justify-end gap-2 md:gap-5">
                    <button className='btn-xs md:btn-md btn btn-success' onClick={() => setOpenToggle(true)}>
                        <UserRoundPlus  />
                    </button>
                    <button className='btn-xs md:btn-md btn btn-error' onClick={() => handleDelete()}>
                        <UserRoundX />
                    </button>
                </div>
                <div className="p-5 overflow-x-auto">
                <table className='table table-auto relative'>
                    <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox" onChange={handleCheckAll} checked={selectedIds?.length === fullData?.items?.length && fullData?.items?.length > 0} />
                            </label>
                        </th>
                        <th>No.</th>
                        <th>Peminjam</th>
                        <th>Buku</th>
                        <th>Petugas</th>
                        <th>Tanggal Pinjam</th>
                        <th>Batas Peminjaman</th>
                        <th>Detail</th>
                    </tr>
                    </thead>
                    <tbody>
                    { fullData?.items?.map((items, i) => {
                        let peminjaman = new Date(items?.tglPeminjaman)
                        let batasPengembalian = peminjaman.setDate(peminjaman.getDate() + 7)
                        return(
                        <Fragment  key={items.id}>
                            <tr>
                                <th>
                                    <label>
                                    <input type="checkbox" className="checkbox" checked={selectedIds.includes(items.id)} onChange={() => handleCheckItem(items.id)} />
                                    </label>
                                </th>
                                <td>{i+1}</td>
                                <td className='flex flex-col'>
                                    <span className='capitalize'>{items?.expand?.peminjam?.name}</span>
                                    <span className='bg-black dark:bg-white text-white dark:text-black shadow-md shadow-blue-500/50 p-1 rounded-md text-[8px] w-fit'>
                                    {items?.peminjam}
                                    </span>
                                </td>
                                <td className='capitalize w-60'>
                                    <p className='w-60 text-justify'>
                                    {items?.expand?.buku?.title}
                                    </p>
                                </td>
                                <td className='grid grid-cols-1'>
                                    <span className='capitalize'>{items?.expand?.petugas?.name}</span>
                                    <span className='bg-black dark:bg-white text-white dark:text-black shadow-md shadow-blue-500/50 p-1 rounded-md text-[8px] w-fit'>
                                    {items?.petugas}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-xs p-1">{dateOnlyFormatted(items?.tglPeminjaman)}</span>
                                    <br />
                                    <span className="text-xs p-1">{timeFormatted(items?.tglPeminjaman)} {zonaWaktu}</span>
                                </td>
                                <td>
                                    <span className="text-xs p-1">{dateOnlyFormatted(batasPengembalian)}</span>
                                    <br />
                                    <span className="text-xs p-1">{timeFormatted(batasPengembalian)} {zonaWaktu}</span>
                                </td>
                                <td>
                                    <button className='btn btn-neutral btn-xs' onClick={() => setOpenDetail((prev) => ({ ...prev, status: true, data: items }))}>
                                    detail
                                    </button>
                                </td>
                            </tr>
                        </Fragment>
                        )
                    }) }
                    </tbody>
                </table>
                </div>
            </Layout>
        </Fragment>
    )
}
