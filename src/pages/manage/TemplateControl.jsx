import { useEffect, useMemo, useState } from 'react'
import SearchData from '@/components/search/Search'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import { FaPeopleGroup } from 'react-icons/fa6'
import { formatDate, timeAgo } from '@/constants/globals'
import { UserRoundPlus, UserRoundX, X } from 'lucide-react'
import Swal from 'sweetalert2'
import { useDebounce } from 'use-debounce'
import anonim from '/anonim.jpg'
import DialogCreate from './DialogCreate'
import DialogDetail from './DialogDetail'
import DialogUpdate from './DialogUpdate'

export default function TemplateControl({ title, fullData, refreshData, searchItem, setSearchItem, page, setPage, searchTerm }) {
    // const [searchItem, setSearchItem] = useState("")
    // const [page, setPage] = useState(1)
    // const [searchTerm] = useDebounce(searchItem, 500)
    const [selectedIds, setSelectedIds] = useState([]);
    const [openToggle, setOpenToggle] = useState(false)
    const [avatar, setAvatar] = useState("")
    
    const [openDialogUpdate, setOpenDialogUpdate] = useState({
        status: false,
        data: []
    })
    const [openDetail, setOpenDetail] = useState({
        status: false,
        data: []
    })
    const [password, setPassword] = useState({
        password: "",
        passwordConfirm: ""
    })

    useEffect(() => {
        setPage(1)
    }, [searchTerm])

    const handlePreviewAvatar = (file) => {
        if (file) {
            const previewURL = URL.createObjectURL(file)
            setAvatar(previewURL)
        }
    }

    const handleChange = (result) => {
        setSelectedIds([])
        setSearchItem(result)
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPassword(prev => ({ ...prev, [name]: value }));
    };
    
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

        if (title === 'petugas') {
            data.role = 'petugas'
        } else if (title === 'siswa'){
            data.role = 'users'
        }

        data.emailVisibility = true
        data.verified = true

        Swal.fire({
            title: 'Mohon Tunggu',
            text: 'Sedang menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await pb.collection('users').create(data);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data baru telah ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });

            e.target.reset();
            setAvatar("")
            setPassword({
                password: "",
                passwordConfirm: ""
            })
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

        if (data.role) {
            if (title === 'petugas') {
                data.role = 'petugas'
            } else if (title === 'siswa'){
                data.role = 'users'
            }
        }

        Swal.fire({
            title: 'Mohon Tunggu',
            text: 'Sedang memperbaharui data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await pb.collection('users').update(id, data);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data telah update ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });

            e.target.reset();
            setAvatar("")
            setPassword({
                password: "",
                passwordConfirm: ""
            })
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
                batch.collection('users').delete(id);
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

    const handleToggleClose = () => {
        setAvatar("")
        setOpenToggle(false)
    }

    return (
        <>  
            <DialogCreate title={title} openToggle={openToggle} setOpenToggle={handleToggleClose} handleAdd={handleAdd} handlePreviewAvatar={(e) => handlePreviewAvatar(e.target.files[0])} avatar={avatar} setPassword={handlePasswordChange} password={password.password !== password.passwordConfirm || !password.password} />

            <DialogUpdate title={title} openToggle={openDialogUpdate} setOpenToggle={() => setOpenDialogUpdate((prev) => ({ status:false, data: [] }))} handleUpdate={handleUpdate} handlePreviewAvatar={(e) => handlePreviewAvatar(e.target.files[0])} avatar={avatar} setPassword={handlePasswordChange} password={password.password !== password.passwordConfirm || !password.password} />

            <DialogDetail open={openDetail?.status} onClose={() => setOpenDetail((prev) => ({ ...prev, status: false }))} detail={openDetail?.data} setOpenEdit={setOpenDialogUpdate} />

            <div className='w-full min-h-screen select-none pt-25 md:pt-28 px-5 md:px-20'>
            <h1 className='text-4xl font-bold mb-1 text-center capitalize'>
                {title}
            </h1>
            <div className="flex justify-center md:justify-end">
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
                            <th>Name</th>
                            { title === 'all role' && (
                                <th>Position</th>
                            ) }
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
                                <td>
                                    <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                        { data?.avatar ? (
                                            <img
                                                src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${data.collectionId}/${data.id}/${data?.avatar}`}
                                                alt={data?.name} />
                                            ) : (
                                            <img
                                                src={anonim}
                                                alt={'unknow'} />
                                        ) }
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">
                                            {data?.name ? data?.name : 'N/A'}
                                        </div>
                                        <div className="text-sm opacity-50">
                                            { data?.email ? data?.email : 'Hidden' }
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                { title === 'all role' && (
                                    <td className='capitalize'>{data?.role}</td>
                                ) }
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
                                        <div className="avatar flex flex-col">
                                            <div className="mask mask-squircle h-12 w-12">
                                            { data?.avatar ? (
                                                <img
                                                    src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${data.collectionId}/${data.id}/${data?.avatar}`}
                                                    alt={data?.name} />
                                                ) : (
                                                <img
                                                    src={anonim}
                                                    alt={'unknow'} />
                                            ) }
                                            </div>
                                            { title === 'all role' && (
                                                <button className="btn btn-neutral btn-xs" onClick={() => setOpenDetail((prev) => ({ ...prev, status: true, data: data }))}>
                                                    detail
                                                </button>
                                            ) }
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <div className="font-bold">
                                                {data?.name ? data?.name : 'N/A'}
                                            </div>
                                            <div className="text-xs opacity-50">
                                                { data?.email ? data?.email : 'Hidden' }
                                            </div>
                                            { title === 'all role' && (
                                                <div className="text-xs opacity-75">
                                                    { data?.role }
                                                </div>
                                            ) }
                                            { title !== 'all role' && (
                                                <button className="btn btn-neutral btn-xs" onClick={() => setOpenDetail((prev) => ({ ...prev, status: true, data: data }))}>
                                                    detail
                                                </button>
                                            ) }
                                            
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
            </div>
        </>
    )
}
