import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DialogUpdate({title, selectedCategories, setSelectedCategories, handleCheckboxChange, openToggle, setOpenToggle, handleUpdate, poster, handlePreviewPoster, file, handlePreviewFile }){
    const [showInput, setShowInput] = useState({
        title: false,
        author: false,
        poster: false,
        book: false,
        category: false
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => pb.collection('category').getFullList({ sort: 'name' })
    });

    useEffect(() => {
        if (openToggle?.data?.category) {
            setSelectedCategories(openToggle.data.category);
        } else {
            setSelectedCategories([]); 
        }
    }, [openToggle]);


    const handleSetOpenToggle = () => {
        setOpenToggle()
    }
    
    return (
        <Dialog open={openToggle?.status} onClose={handleSetOpenToggle}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/80"/>
            <DialogPanel
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] max-w-md sm:w-full bg-background border p-6 sm:p-10 rounded-lg shadow-lg"
            >
            <div className="float-end" onClick={handleSetOpenToggle}>
                <X size={20} />
            </div>
            <DialogHeader>
                <DialogTitle className="text-lg text-center uppercase">UPDATED {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-muted-foreground">
                <div className="overflow-hidden">
                    <form onSubmit={(e) => handleUpdate(e, openToggle?.data?.id)} method="post" className='flex flex-col gap-2 p-1'>
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, title: !showInput?.title}))}>
                            Set Title
                        </div>
                        { showInput?.title && (
                            <label htmlFor="title">
                                <p className='text-black'>Title<span className='text-red-600'>*</span></p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="title" id="title" placeholder='Insert Title...' defaultValue={openToggle?.data?.title} />
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, author: !showInput?.author}))}>
                            Set author
                        </div>
                        { showInput?.author && (
                            <label htmlFor="author">
                                <p className='text-black'>Author</p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="author" id="author" placeholder='Insert Author...' defaultValue={openToggle?.data?.author} />
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, poster: !showInput?.poster}))}>
                            Set poster
                        </div>
                        { showInput?.poster && (
                            <label htmlFor="poster">
                                <p className='text-black'>Poster</p>
                                <input className='w-full h-10 p-2 mb-1 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="file" name="poster" id="poster" placeholder='Insert Name...' onChange={handlePreviewPoster} />
                                { poster ? (
                                    <img className='border-2 border-black rounded-md object-cover aspect-video' src={poster} alt="poster" />
                                ) : openToggle?.data?.poster && (
                                    <img className='border-2 border-black rounded-md object-cover aspect-video' src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${openToggle?.data?.collectionId}/${openToggle?.data?.id}/${openToggle?.data?.poster}`} alt="poster" />
                                ) }
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, book: !showInput?.book}))}>
                            Set Buku
                        </div>
                        { showInput?.book && (
                            <label htmlFor="pdfFile">
                                <p className='text-black'>Book</p>
                                <input className='w-full h-10 p-2 mb-1 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="file" name="pdfFile" id="pdfFile" placeholder='Insert Name...' onChange={handlePreviewFile} />
                                { file ? (
                                    <a href={file} target='_blank' className='btn btn-neutral btn-xs'>
                                        <ExternalLink size={12} />
                                    </a>
                                ) : openToggle?.data?.pdfFile && (
                                    <a href={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${openToggle?.data?.collectionId}/${openToggle?.data?.id}/${openToggle?.data?.pdfFile}`} target='_blank' className='btn btn-neutral btn-xs'>
                                        <ExternalLink size={12} />
                                    </a>
                                ) }
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, category: !showInput?.category}))}>
                            Set category
                        </div>
                        { showInput?.category && (
                            <label htmlFor="category">
                                <p className='text-black'>Categories</p>
                                <div className="flex flex-row flex-wrap gap-2 max-h-48 pr-2">
                                    {categories?.map((cat) => {
                                    
                                    return(
                                        <label key={cat.id} className="label cursor-pointer justify-start gap-2 p-1">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox ring-2 ring-gray-600 checkbox-sm checked:text-black"
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => {handleCheckboxChange(cat.id)}}
                                            />
                                            <span className="text-black capitalize">{cat.name}</span>
                                        </label>
                                    )})}
                                </div>
                            </label>
                        )}
                        <button className='btn btn-neutral' type='submit'>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
