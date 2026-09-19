import { lazy, useEffect, useState } from 'react'
import { pb } from '@/utils/pocketbase'
import { FaPeopleGroup } from 'react-icons/fa6'
import { Book, FileText, UserRoundPlus, UserRoundX, X } from 'lucide-react'
import Swal from 'sweetalert2'
import BatchUploadBook from "./BatchUploadBook";
import { validateFileSize } from '@/constants/validationFileSize'
import { useOutletContext } from 'react-router-dom'

const LayoutDashboard = lazy(() => import('@/components/ui/LayoutDashboard'))
const DialogCreate = lazy(() => import('./DialogCreate'))
const DialogDetail = lazy(() => import('./DialogDetail'))
const DialogUpdate = lazy(() => import('./DialogUpdate'))

export default function TemplateControl({ 
    title, 
    subtitle,
    fullData, 
    tb, 
    refreshData, 
    searchItem, 
    setSearchItem, 
    setPage, 
    searchTerm ,
    setBookType,
    role
}) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [openToggle, setOpenToggle] = useState(false)
    const [poster, setPoster] = useState("")
    const [file, setFile] = useState("")
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [show, setShow] = useState(false)
    
    const [openDialogUpdate, setOpenDialogUpdate] = useState({
        status: false,
        role: '',
        data: []
    })
    
    const [openDetail, setOpenDetail] = useState({
        status: false,
        data: []
    })

    const { settings } = useOutletContext()

    useEffect(() => {
        setPage(1)
    }, [searchTerm, setPage])

    const handleCheckboxChange = (cat) => {
        setSelectedCategories((prevSelected) => {
            const isExist = prevSelected.some(item => item.id === cat.id);
            if (isExist) {
                return prevSelected.filter(item => item.id !== cat.id);
            } else {
                return [...prevSelected, { id: cat.id, kode: cat.kode }];
            }
        });
    };

    const handlePreviewPoster = (e) => {
        const file = e.target.files[0]
        if (file) {
            const validation = validateFileSize(file, settings?.max_upload_size)
            if (validation.isValid) {
                const previewURL = URL.createObjectURL(file)
                setPoster(previewURL)
            } else {
                setPoster("")
                Swal.fire({
                    icon: 'error',
                    text: validation.error
                }) 
                e.target.value = ''; 
            }
        }
    }

    const handlePreviewFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            const validation = validateFileSize(file, settings?.max_upload_size)
            if (validation.isValid) {
                const previewURL = URL.createObjectURL(file)
                setFile(previewURL)
            } else {
                setFile("")
                Swal.fire({
                    icon: 'error',
                    text: validation.error
                }) 
                e.target.value = ''; 
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
                batch.collection(tb).delete(id, {
                    isDeleted: true
                });
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
                console.error("Detail Error:", err.originalError); 
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data: ' + err.message,
                    'error'
                );
            }
        }

    }

    const handleToggleClose = () => {
        setPoster("")
        setOpenDialogUpdate({
            data: [],
            status: false
        })
        setOpenToggle(false)
    }

    return (
        <>  
            <DialogCreate 
            title={title} 
            tb={tb}
            refreshData={refreshData}
            selectedCategories={selectedCategories} 
            handleCheckboxChange={handleCheckboxChange} 
            openToggle={openToggle} 
            setOpenToggle={handleToggleClose} 
            poster={poster} 
            setPoster={setPoster}
            file={file} 
            handlePreviewPoster={handlePreviewPoster} 
            handlePreviewFile={handlePreviewFile} 
            setFile={setFile}
            />

            <DialogUpdate 
            title={title} 
            tb={tb}
            refreshData={refreshData}
            selectedCategories={selectedCategories} 
            setSelectedCategories={setSelectedCategories} 
            handleCheckboxChange={handleCheckboxChange} 
            openToggle={openDialogUpdate} 
            setOpenToggle={() => setOpenDialogUpdate(() => ({ status:false, data: [] }))} 
            poster={poster} 
            setPoster={setPoster}
            file={file} 
            handlePreviewPoster={handlePreviewPoster} 
            handlePreviewFile={handlePreviewFile} 
            setOpenDialogUpdate={setOpenDialogUpdate}
            setOpenDetail={setOpenDetail}
            />

            <DialogDetail open={openDetail?.status} 
            onClose={() => setOpenDetail((prev) => ({ ...prev, status: false }))} 
            detail={openDetail?.data} 
            setOpenEdit={setOpenDialogUpdate} 
            role={role}
            />

            <BatchUploadBook
            refreshData={refreshData}
            setOpenToggle={setOpenToggle}
            show={show}
            setShow={setShow}
            />

            <LayoutDashboard 
            icon={<Book size={32} /> }
            title={title}
            subtitle={subtitle}
            fullData={fullData}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            setSelectedIds={setSelectedIds}
            >
                <div className="flex justify-end gap-2 md:gap-5">
                    <select name="bookType" id="bookType" className='select select-sm'
                    onChange={(e) => setBookType(e.target.value)}>
                        <option value="">Semua</option>
                        <option value="digital">Digital</option>
                        <option value="academic">Academic</option>
                        <option value="nonAcademic">Non Academic</option>
                    </select>
                    <div className="mx-auto"></div>
                    <button className='btn-sm md:btn-md btn btn-success' onClick={() => setOpenToggle(true)}>
                        <UserRoundPlus  />
                    </button>
                    { role === 'edmin' && (
                        <>
                            <button className='btn-sm md:btn-md btn btn-error' onClick={() => handleDelete()}>
                                <UserRoundX />
                            </button>
                            <button className='btn-sm md:btn-md btn btn-error' onClick={() => setShow(true)}>
                                Upload Batch
                            </button>
                        </>
                    )}
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
                                { role === 'edmin' && (
                                    <th>
                                        <label>
                                        <input type="checkbox" className="checkbox" onChange={handleCheckAll} checked={selectedIds?.length === fullData?.items?.length && fullData?.items?.length > 0} />
                                        </label>
                                    </th>
                                )}
                                <th>book</th>
                                <th>file</th>
                                <th>publish</th>
                                <th>category</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { fullData?.items?.map((data) => {
                                const file = pb.files.getURL(data, data?.pdfFile)
                                const poster = pb.files.getURL(data, data?.poster)
                            return (
                                <tr key={data.id}>
                                    { role === 'edmin' && (
                                        <th>
                                            <label>
                                            <input type="checkbox" className="checkbox" checked={selectedIds.includes(data.id)} onChange={() => handleCheckItem(data.id)} />
                                            </label>
                                        </th>
                                    )}
                                    <td className='w-72'>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                { data?.poster ? (
                                                    <img
                                                        src={poster}
                                                        alt={data?.title} />
                                                    ) : (
                                                    <div className="bg-[#a9a9a9] flex justify-center p-1">
                                                        <Book size={40} />
                                                    </div>
                                                ) }
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold capitalize">
                                                    {data?.title ? data?.title : 'Unknow'}
                                                </div>
                                                <div className="text-sm opacity-50">
                                                    { data?.author ? data?.author : 'N/A' }
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className=''>
                                        { 
                                        data?.pdfFile ? 
                                            role === 'edmin' 
                                            ? ( <a className='btn btn-neutral btn-xs' target='_blank' href={file}><FileText size={16} /></a> ) 
                                            : (<a className='btn btn-neutral btn-xs' target='_blank' href={`/reader/online/${data?.id}`}><FileText size={16} /></a> )
                                        : ('N/A')
                                        }
                                    </td>
                                    <td>
                                        <div className="text-sm opacity-50">
                                            { data?.expand?.uploader?.name ? data?.expand?.uploader?.name : 'N/A' }
                                        </div>
                                    </td>
                                    <td className="w-0 align-top">
                                        {data?.expand?.category?.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-1 min-w-max">
                                                {data.expand.category.map((category) => (
                                                    <span
                                                        key={category.id}
                                                        className="text-sm opacity-50 whitespace-nowrap btn btn-neutral btn-xs text-xs"
                                                    >
                                                        {category.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm opacity-50">N/A</span>
                                        )}
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
                                { role === 'edmin' && (
                                    <th>
                                        <label>
                                        <input type="checkbox" className="checkbox" onChange={handleCheckAll} checked={selectedIds?.length === fullData?.items?.length && fullData?.items?.length > 0} />
                                        </label>
                                    </th>
                                )}
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { fullData?.items?.map((data) => {
                            const posterUrl = pb.files.getURL(data, data.poster)
                            return (
                                <tr key={data.id}>
                                    { role === 'edmin' && (
                                        <th>
                                            <label>
                                            <input type="checkbox" className="checkbox" checked={selectedIds.includes(data.id)} onChange={() => handleCheckItem(data.id)} />
                                            </label>
                                        </th>
                                    )}
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar flex flex-col items-center">
                                                <div className="mask mask-squircle h-12 w-12">
                                                { data?.poster ? (
                                                    <img
                                                        src={posterUrl}
                                                        alt={data?.title} />
                                                    ) : (
                                                        <div className="bg-[#a9a9a9] flex justify-center p-1">
                                                            <Book size={40} />
                                                        </div>
                                                ) }
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-1 w-full'>
                                                <div className="font-bold">
                                                    {data?.title ? data?.title : 'N/A'}
                                                </div>
                                                <div className="text-xs opacity-50">
                                                    { data?.author ? data?.author : 'Unknown' }
                                                </div>
                                                <button className="btn btn-neutral btn-xs w-full" 
                                                onClick={() => setOpenDetail((prev) => ({ ...prev, status: true, data: data, role: role }))}>
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
