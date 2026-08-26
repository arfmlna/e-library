import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { pb } from '@/utils/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DialogUpdate({
    title, 
    selectedCategories, 
    setSelectedCategories, 
    handleCheckboxChange, 
    openToggle, 
    setOpenToggle, 
    handleUpdate, 
    poster, 
    handlePreviewPoster, 
    file, 
    handlePreviewFile 
}){
    const [showInput, setShowInput] = useState({
        title: false,
        author: false,
        poster: false,
        book: false,
        category: false,
        bookType: false,
        stock: false,
        supplier: false
    })
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

    useEffect(() => {
        if (openToggle?.data?.category && openToggle?.data?.bookType) {
            const defaultData = openToggle?.data?.expand?.category?.map(cat => ({
                id: cat.id,
                kode: cat.kode
            }));

            setSelectedCategories(defaultData);
            setBookType(openToggle.data.bookType)
        } else {
            setSelectedCategories([]); 
            setBookType('digital')
        }
    }, [openToggle]);

    const handleSetOpenToggle = () => {
        setShowInput({
            title: false,
            author: false,
            poster: false,
            book: false,
            category: false,
            bookType: false,
            stock: false,
            supplier: false
        })
        setOpenToggle()
    }

    const posterUrl = pb.files.getURL(openToggle.data, openToggle.data.poster)
    const bookUrl = pb.files.getURL(openToggle.data, openToggle.data.pdfFile)
    return (
        <Dialog data-theme={theme} open={openToggle?.status} onClose={handleSetOpenToggle}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
            <DialogPanel className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-200 p-6 shadow-2xl sm:w-full sm:p-8 bg-base-100">
                <div className="w-full h-full bg-base-100 text-base-content">
                <button 
                    type="button"
                    onClick={handleSetOpenToggle} 
                    className="absolute right-4 top-4 rounded-md p-1.5 opacity-70 hover:opacity-100 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <X size={18} />
                </button>
                <DialogHeader className="mb-5">
                    <DialogTitle className="text-xl font-bold tracking-wide uppercase text-center text-base-content">
                    UPDATED {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[65vh] pr-1"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarGutter: 'stable'
                }}>
                    <form onSubmit={(e) => handleUpdate(e, openToggle?.data?.id)} method="post" className="flex flex-col gap-4">
                    {/* bookType */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.bookType ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, bookType: !showInput?.bookType}))}
                        >
                        <span>{showInput?.bookType ? '✕ Cancel' : '✎ Set Tipe Buku'}</span>
                        </button>
                        {showInput?.bookType && (
                        <div className="flex flex-col gap-1.5">
                            <label className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                                <span className="text-sm font-medium text-base-content/80">Book Type</span>
                            </label>
                            <select name="bookType" id="bookType" 
                            className='input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'
                            defaultValue={openToggle?.data?.bookType} onChange={(e) => setBookType(e.target.value)}>
                                <option value="digital">Digital</option>
                                <option value="academic">Academic</option>
                                <option value="nonAcademic">Non Academic</option>
                            </select>
                        </div>
                        )}
                    </div>
                    {/* title */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.title ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, title: !showInput?.title}))}
                        >
                        <span>{showInput?.title ? '✕ Cancel' : '✎ Set Title'}</span>
                        </button>
                        {showInput?.title && (
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
                            defaultValue={openToggle?.data?.title}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>
                    {/* author */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.author ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, author: !showInput?.author}))}
                        >
                        <span>{showInput?.author ? '✕ Cancel' : '✎ Set Author'}</span>
                        </button>
                        {showInput?.author && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="author" className="text-sm font-medium text-base-content/80">
                            Author
                            </label>
                            <input 
                            type="text" 
                            name="author" 
                            id="author" 
                            placeholder="Insert Author..." 
                            defaultValue={openToggle?.data?.author}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>
                    {/* poster */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.poster ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, poster: !showInput?.poster}))}
                        >
                        <span>{showInput?.poster ? '✕ Cancel' : '✎ Set Poster'}</span>
                        </button>
                        {showInput?.poster && (
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
                            <div className="mt-2 overflow-hidden rounded-lg border border-base-300 shadow-inner bg-base-200">
                            {poster ? (
                                <img className="w-full max-h-40 object-cover aspect-video" src={poster} alt="poster preview" />
                            ) : openToggle?.data?.poster && (
                                <img className="w-full max-h-40 object-cover aspect-video" src={posterUrl} alt="poster current" />
                            )}
                            </div>
                        </div>
                        )}
                    </div>
                    {/* book */}
                    { bookType === 'digital' && (
                        <div className="flex flex-col gap-2">
                            <button 
                            type="button"
                            className={`btn btn-sm ${showInput?.book ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                            onClick={() => setShowInput((p) => ({...p, book: !showInput?.book}))}
                            >
                            <span>{showInput?.book ? '✕ Cancel' : '✎ Set Buku'}</span>
                            </button>
                            {showInput?.book && (
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
                                {file ? (
                                    <a href={file} target="_blank" rel="noreferrer" className="btn h-10 min-h-10 px-3 border border-base-300">
                                    <ExternalLink size={16} />
                                    </a>
                                ) : openToggle?.data?.pdfFile && (
                                    <a href={bookUrl} target="_blank" rel="noreferrer" className="btn h-10 min-h-10 px-3 border border-base-300">
                                    <ExternalLink size={16} />
                                    </a>
                                )}
                                </div>
                            </div>
                            )}
                        </div>
                    ) }
                    {/* category */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.category ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, category: !showInput?.category}))}
                        >
                        <span>{showInput?.category ? '✕ Cancel' : '✎ Set Category'}</span>
                        </button>
                        {showInput?.category && (
                        <> 
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
                            <select name="category" id="category" defaultValue={`${openToggle?.data?.category?.[0]}|${openToggle?.data?.expand?.category?.[0]?.kode}`} 
                            className='input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'>
                                <option>choose category</option>
                                { categories?.map((items) => (
                                    <option key={items?.id} id={items?.id} value={`${items.id}|${items.kode}`}>{items?.name}</option>
                                )) }
                            </select>
                        </div>
                        ) }
                        </>
                        )}
                    </div>
                    {/* stock */}
                    { bookType !== 'digital' && (
                        <div className="flex flex-col gap-2">
                            <button 
                            type="button"
                            className={`btn btn-sm ${showInput?.stock ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                            onClick={() => setShowInput((p) => ({...p, stock: !showInput?.stock}))}
                            >
                            <span>{showInput?.stock ? '✕ Cancel' : '✎ Set Stock'}</span>
                            </button>
                            {showInput?.stock && (
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="stock" className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                                stock<span className="text-error ml-0.5">*</span>
                                </label>
                                <input type="number" name="stock" id="stock" required min={1} defaultValue={openToggle?.data?.stock}
                                className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            )}
                        </div>
                    )}
                    {/* supplier */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.supplier ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, supplier: !showInput?.supplier}))}
                        >
                        <span>{showInput?.supplier ? '✕ Cancel' : '✎ Set Supplier'}</span>
                        </button>
                        {showInput?.supplier && (
                        <div className="flex flex-col gap-1.5">
                            <label className="label cursor-pointer justify-start gap-2 p-1 rounded transition-colors">
                                <span className="text-sm font-medium text-base-content/80">Supplier</span>
                            </label>
                            <select name="supplier" id="supplier" 
                            defaultValue={`${openToggle?.data?.supplier}|${openToggle?.data?.expand?.supplier?.kode}`}
                            className='input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10'>
                                <option>choose supplier</option>
                                { supplier?.map((items) => (
                                    <option key={items?.id} id={items?.id} value={`${items?.id}|${items.kode}`}>{items?.supplier}</option>
                                )) }
                            </select>
                        </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full h-10 mt-4 inline-flex items-center justify-center rounded-lg text-sm font-medium shadow transition-colors"
                    >
                        Save Changes
                    </button>
                    </form>
                </div>

                </div>
            </DialogPanel>
        </Dialog>
    )
}
