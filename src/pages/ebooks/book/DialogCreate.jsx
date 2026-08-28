import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { generateKodeBuku } from '@/utils/generate';
import { pb } from '@/utils/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function DialogCreate({
    title, 
    tb,
    refreshData,
    selectedCategories, 
    handleCheckboxChange, 
    openToggle, 
    setOpenToggle, 
    poster, 
    setPoster,
    handlePreviewPoster, 
    file, 
    setFile,
    handlePreviewFile
}){
    const [bookType, setBookType] = useState('digital')
    const theme = localStorage.getItem('theme')
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => pb.collection('category').getFullList({ sort: 'name' })
    });

    const {data: supplier} = useQuery({
        queryKey: ['supplier'],
        queryFn: () => pb.collection('supplier').getFullList({ sort: 'kode' })
    })

    const handleAdd = async (e) => {
        e.preventDefault();
        const allInputData = new FormData(e.target);
        const data = Object.fromEntries(allInputData.entries());

        // 1. Ambil ID Supplier langsung dari form
        const supplierId = allInputData.get('supplier');
        if (!supplierId || supplierId === "choose supplier" || supplierId === "") {
            return Swal.fire('Error', 'Silakan pilih supplier!', 'error');
        }

        // Cari kode supplier dari state 'suppliers' lokal berdasarkan ID-nya
        const targetSupplier = supplier?.find(sup => sup.id === supplierId);
        const supplierKode = targetSupplier?.kode || "";

        data.supplier = supplierId;
        data.publishDate = new Date();
        data.uploader = pb?.authStore?.record?.id;

        // 2. Logika Pemrosesan Kategori & Generate Kode Buku
        if (data?.bookType === 'digital') {
            if (selectedCategories.length === 0) {
                return Swal.fire('Error', 'Pilih minimal satu kategori untuk buku digital!', 'error');
            }
            
            // Ambil kode dari kategori utama (pilihan pertama)
            const kategoriUtamaKode = selectedCategories[0].kode;
            
            data.kode_buku = await generateKodeBuku(kategoriUtamaKode, supplierKode);
            data.category = selectedCategories.map(item => item.id);
        } else {
            // Logika untuk Buku Fisik
            const categoryId = allInputData.get('category');
            if (!categoryId || categoryId === "choose category" || categoryId === "") {
                return Swal.fire('Error', 'Silakan pilih kategori buku fisik!', 'error');
            }

            // Cari kode kategori dari state 'categories' lokal berdasarkan ID-nya
            const targetCategory = categories?.find(cat => cat.id === categoryId);
            const categoryKode = targetCategory?.kode || "";

            data.kode_buku = await generateKodeBuku(categoryKode, supplierKode);
            data.category = [categoryId]; // Tetap dikirim sebagai array tunggal
        }
        
        // 3. Sanitasi Data (Hapus field UI agar tidak ditolak PocketBase)
        delete data.bookType;

        // 4. Proses Eksekusi Simpan Data ke Server
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
            if (typeof setPoster === 'function') setPoster("");
            if (typeof setFile === 'function') setFile("");
            setPoster("")
            setFile("")
            refreshData();
            setOpenToggle(false);
        } catch (error) {
            console.error("Error Detail:", error?.originalError);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: error.message || 'Terjadi kesalahan pada server'
            });
        }
    };

    return (
        <Dialog data-theme={theme} open={openToggle} onClose={setOpenToggle}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
            <DialogPanel className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-200 p-6 shadow-2xl sm:w-full sm:p-8 bg-base-100">
                <div className="w-full h-full bg-base-100 text-base-content">
                <button 
                    type="button"
                    onClick={setOpenToggle} 
                    className="absolute right-4 top-4 rounded-md p-1.5 opacity-70 hover:opacity-100 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <X size={18} />
                </button>
                <DialogHeader className="mb-5">
                    <DialogTitle className="text-xl font-bold tracking-wide uppercase text-center text-base-content">
                    CREATE {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[65vh] pr-1"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarGutter: 'stable'
                }}>
                    <form onSubmit={handleAdd} method="post" className="flex flex-col gap-4">
                    {/* bookType */}
                    <div className="flex flex-col gap-1.5">
                        <label className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                            <span className="text-sm font-medium text-base-content/80">Book Type</span>
                        </label>
                        <select name="bookType" id="bookType" 
                        className='input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'
                        defaultValue={bookType} onChange={(e) => setBookType(e.target.value)}>
                            <option value="digital">Digital</option>
                            <option value="academic">Academic</option>
                            <option value="nonAcademic">Non Academic</option>
                        </select>
                    </div>
                    {/* title */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="text-sm font-medium text-base-content/80">
                        Title<span className="text-error ml-0.5">*</span>
                        </label>
                        <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        placeholder="Insert Title..." 
                        required
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    {/* author */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="author" className="text-sm font-medium text-base-content/80">
                        Author
                        </label>
                        <input 
                        type="text" 
                        name="author" 
                        id="author" 
                        placeholder="Insert Author..." 
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    {/* poster */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="poster" className="text-sm font-medium text-base-content/80">
                        Poster
                        </label>
                        <input 
                        type="file" 
                        name="poster" 
                        id="poster" 
                        onChange={handlePreviewPoster}
                        className="file-input file-input-bordered file-input-primary w-full text-sm h-10 cursor-pointer" 
                        />
                        {poster && (
                        <div className="mt-2 overflow-hidden rounded-lg border border-base-300 shadow-inner bg-base-200">
                            <img className="w-full max-h-40 object-cover aspect-video" src={poster} alt="poster preview" />
                        </div>
                        )}
                    </div>
                    {/* book */}
                    { bookType === 'digital' && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="pdfFile" className="text-sm font-medium text-base-content/80">
                            Book (PDF)
                            </label>
                            <div className="flex gap-2 items-center">
                            <input 
                                type="file" 
                                name="pdfFile" 
                                id="pdfFile" 
                                onChange={handlePreviewFile}
                                className="file-input file-input-bordered file-input-accent flex-1 text-sm h-10 cursor-pointer" 
                            />
                            {file && (
                                <a href={file} target="_blank" rel="noreferrer" className="btn btn-neutral h-10 min-h-10 px-3 shadow-sm border border-base-300">
                                <ExternalLink size={16} />
                                </a>
                            )}
                            </div>
                        </div>
                    ) }
                    {/* category */}
                    { bookType === 'digital' ? (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-base-content/80">Categories</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-base-200 rounded-lg bg-base-200/50">
                        {categories?.map((cat) => (
                            <label key={cat.id} className="label cursor-pointer justify-start gap-2 p-1 hover:bg-base-200 rounded transition-colors">
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-primary checkbox-sm"
                                checked={selectedCategories.some(item => item.id === cat.id)}
                                onChange={() => handleCheckboxChange(cat)}
                            />
                            <span className="text-sm text-base-content capitalize truncate">{cat.name}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    ) : (
                    <div className="flex flex-col gap-1.5">
                        <label className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                            <span className="text-sm font-medium text-base-content/80">category</span>
                        </label>
                        <select name="category" id="category" 
                        className='input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'>
                            <option>choose category</option>
                            { categories?.map((item) => (
                                <option key={item?.id} value={item?.id}>
                                    {item?.name}
                                </option>
                            )) }
                        </select>
                    </div>
                    ) }
                    {/* stock */}
                    { bookType !== 'digital' && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="stock" className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                            stock<span className="text-error ml-0.5">*</span>
                            </label>
                            <input type="number" name="stock" id="stock" required min={1} defaultValue={1}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    ) }
                    {/* supplier */}
                    <div className="flex flex-col gap-1.5">
                        <label className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                            <span className="text-sm font-medium text-base-content/80">Supplier</span>
                        </label>
                        <select name="supplier" id="supplier" 
                        className='input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'>
                            <option>choose supplier</option>
                            { supplier?.map((items) => (
                                <option 
                                    key={items?.id} 
                                    value={items?.id}
                                >
                                    {items?.supplier}
                                </option>
                            )) }
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full h-10 mt-4 inline-flex items-center justify-center rounded-lg text-sm font-medium shadow transition-colors"
                    >
                        Submit Buku
                    </button>
                    </form>
                </div>

                </div>
            </DialogPanel>
        </Dialog>
    )
}
