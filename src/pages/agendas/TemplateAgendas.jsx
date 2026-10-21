import { lazy, useEffect, useState } from 'react'
import { pb } from '@/utils/pocketbase'
import { FaPeopleGroup } from 'react-icons/fa6'
import { formatDate, timeAgo } from '@/constants/dateFormat'
import { ChartColumnStacked, UserRoundPlus, UserRoundX } from 'lucide-react'
import Swal from 'sweetalert2'

const LayoutDashboard = lazy(() => import('@/components/ui/LayoutDashboard'))
const DialogCreate = lazy(() => import('./DialogCreate'))
const DialogDetail = lazy(() => import('./DialogDetail'))
const DialogUpdate = lazy(() => import('./DialogUpdate'))

export default function TemplateEBook({ 
    title, 
    subtitle,
    tb,
    fullData, 
    refreshData, 
    searchItem, 
    setSearchItem,  
    setPage, 
    searchTerm 
}) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [openToggle, setOpenToggle] = useState(false)
    const [openDialogUpdate, setOpenDialogUpdate] = useState({
        status: false,
        data: []
    })
    const [openDetail, setOpenDetail] = useState({
        status: false,
        data: []
    })
    useEffect(() => {
        setPage(1)
    }, [searchTerm, setPage])

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

    const handleAdd = async (e) => {
        e.preventDefault()
        const allInputData = new FormData(e.target)
        const data = Object.fromEntries(allInputData.entries())

        data.eventDate = new Date(data.eventDate)

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
            if (import.meta.env.DEV) {
                console.error("Error Detail:", error.data);
            }
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

        data.eventDate = new Date(data.eventDate)

        Swal.fire({
            title: 'Mohon Tunggu',
            text: 'Sedang memperbaharui data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await pb.collection(tb).update(id, data);

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
            if (import.meta.env.DEV) {
                console.error("Error Detail:", error.data);
            }
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
                if (import.meta.env.DEV) {
                    console.log(err)
                }
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data: ' + err.message,
                    'error'
                );
            }
        }

    }

    const handleToggleClose = () => {
        setOpenToggle(false)
    }

    return (
        <>  
            <DialogCreate 
            title={title} 
            openToggle={openToggle} 
            setOpenToggle={handleToggleClose} 
            handleAdd={handleAdd} 
            />

            <DialogUpdate 
            title={title} 
            openToggle={openDialogUpdate} 
            setOpenToggle={() => setOpenDialogUpdate(() => ({
                status:false,
                data: []
            }))} 
            handleUpdate={handleUpdate} 
            />

            <DialogDetail 
            open={openDetail?.status} 
            onClose={() => setOpenDetail((prev) => ({ ...prev, status: false }))} 
            detail={openDetail?.data} 
            setOpenEdit={setOpenDialogUpdate} 
            />

            <LayoutDashboard 
            icon={<ChartColumnStacked size={32} />}
            title={title}
            subtitle={subtitle}
            fullData={fullData}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            setSelectedIds={setSearchItem}
            >
                <div className="flex justify-end gap-2 md:gap-5">
                    <button className='btn-sm md:btn-md btn btn-success' onClick={() => setOpenToggle(true)}>
                        <UserRoundPlus  />
                    </button>
                    <button className='btn-sm md:btn-md btn btn-error' onClick={() => handleDelete()}>
                        <UserRoundX />
                    </button>
                </div>
                { fullData?.items?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <FaPeopleGroup className='w-16 h-16 opacity-20 mb-4' />
                    <p className="text-xl font-semibold">Petugas "{searchTerm}" tidak ditemukan</p>
                    <p className="text-sm">Coba kata kunci lain atau periksa ejaan Anda.</p>
                    </div>
                ) : (
                    <div className="w-full gap-5 justify-center overflow-x-auto pb-20">
                        {/* desktop */}
                        <table className="hidden md:table shadow-md">
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                    <input type="checkbox" className="checkbox" onChange={handleCheckAll} checked={selectedIds?.length === fullData?.items?.length && fullData?.items?.length > 0} />
                                    </label>
                                </th>
                                <th>Nama Acara</th>
                                <th>Waktu Acara</th>
                                <th>Lokasi</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { fullData?.items?.map((data) => {
                            return (
                                <tr key={data.id}>
                                    <th>
                                        <label>
                                        <input type="checkbox" className="checkbox" checked={selectedIds.includes(data.id)} onChange={() => handleCheckItem(data.id)} />
                                        </label>
                                    </th>
                                    <td className='capitalize'>
                                        <div>
                                            <div className="font-bold">
                                                {data?.title ? data?.title : 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='capitalize'>
                                        <div>
                                            <div className="font-bold">
                                                {data?.eventDate ? formatDate(data?.eventDate) : 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='capitalize'>
                                        <div>
                                            <div className="font-bold">
                                                {data?.location ? data?.location : 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {formatDate(data?.created)}
                                        <br />
                                        <span className="badge badge-ghost badge-sm">{timeAgo(data?.created)}</span>
                                    </td>
                                    <td>
                                        {formatDate(data?.updated)}
                                        <br />
                                        <span className="badge badge-ghost badge-sm">{timeAgo(data?.updated)}</span>
                                    </td>
                                    <th>
                                        <button className="btn btn-neutral btn-xs" onClick={() => setOpenDetail((prev) => ({ ...prev, status: true, data: data }))}>details</button>
                                    </th>
                                </tr>
                            )
                            }) }
                        </tbody>
                        </table>
                        
                        {/* mobile */}
                        <table className="table md:hidden shadow-md">
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                    <input type="checkbox" className="checkbox" onChange={handleCheckAll} checked={selectedIds?.length === fullData?.items?.length && fullData?.items?.length > 0} />
                                    </label>
                                </th>
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { fullData?.items?.map((data) => {
                            return (
                                <tr key={data.id}>
                                    <th>
                                        <label>
                                        <input type="checkbox" className="checkbox" checked={selectedIds.includes(data.id)} onChange={() => handleCheckItem(data.id)} />
                                        </label>
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className='flex flex-col gap-1 w-full'>
                                                <div className="font-bold">
                                                    {data?.title ? data?.title : 'N/A'}
                                                </div>
                                                <div className="text-xs opacity-50">
                                                    { data?.eventDate ? formatDate(data?.eventDate) : 'N/A' }
                                                </div>
                                                <div className="text-xs opacity-50">
                                                    { data?.location ? data.location : 'N/A' }
                                                </div>
                                                <button className="btn btn-neutral btn-xs" onClick={() => setOpenDetail((prev) => ({ ...prev, status: true, data: data }))}>
                                                    detail
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                            }) }
                        </tbody>
                        </table>

                        <div className="flex flex-col items-center gap-2 my-4">
                            <div className="join">
                                <button 
                                className="join-item btn btn-sm"
                                disabled={fullData?.page <= 1}
                                onClick={() => {
                                    setPage(fullData?.page - 1)
                                    refreshData()
                                }}
                                >
                                « Prev
                                </button>
                                
                                <button className="join-item btn btn-sm no-animation">
                                Halaman {fullData?.page} dari {fullData?.totalPages}
                                </button>
                                
                                <button 
                                className="join-item btn btn-sm"
                                disabled={fullData?.page >= fullData?.totalPages}
                                onClick={() => {
                                    setPage(fullData?.page + 1)
                                    refreshData()
                                }}
                                >
                                Next »
                                </button>
                            </div>
                        </div>
                    </div>
                ) }
            </LayoutDashboard>
        </>
    )
}
