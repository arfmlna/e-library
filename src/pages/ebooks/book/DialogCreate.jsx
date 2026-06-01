import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { pb } from '@/utils/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, X } from 'lucide-react'
import { useState } from 'react';

export default function DialogCreate({title, selectedCategories, handleCheckboxChange, openToggle, setOpenToggle, handleAdd, poster, handlePreviewPoster, file, handlePreviewFile}){
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => pb.collection('category').getFullList({ sort: 'name' })
    });

    return (
        <Dialog open={openToggle} onClose={setOpenToggle}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/80"/>
            <DialogPanel
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] max-w-md sm:w-full bg-background border p-6 sm:p-10 rounded-lg shadow-lg"
            >
            <div className="float-end" onClick={setOpenToggle}>
                <X size={20} />
            </div>
            <DialogHeader>
                <DialogTitle className="text-lg text-center uppercase">CREATE {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-muted-foreground">
                <div className="overflow-hidden">
                    <form onSubmit={handleAdd} method="post" className='flex flex-col gap-2 p-1'>
                        <label htmlFor="title">
                            <p className='text-black'>Title<span className='text-red-600'>*</span></p>
                            <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="title" id="title" placeholder='Insert Title...' />
                        </label>
                        <label htmlFor="author">
                            <p className='text-black'>Author</p>
                            <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="author" id="author" placeholder='Insert Author...' />
                        </label>
                        <label htmlFor="poster">
                            <p className='text-black'>Poster</p>
                            <input className='w-full h-10 p-2 mb-1 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="file" name="poster" id="poster" placeholder='Insert Name...' onChange={handlePreviewPoster} />
                            { poster && (
                                <img className='border-2 border-black rounded-md object-cover aspect-video' src={poster} alt="poster" />
                            ) }
                        </label>
                        <label htmlFor="pdfFile">
                            <p className='text-black'>Book</p>
                            <input className='w-full h-10 p-2 mb-1 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="file" name="pdfFile" id="pdfFile" placeholder='Insert Name...' onChange={handlePreviewFile} />
                            { file && (
                                <a href={file} target='_blank' className='btn btn-neutral btn-xs'>
                                    <ExternalLink size={12} />
                                </a>
                            ) }
                        </label>
                        <label htmlFor="category">
                            <p className='text-black'>Categories</p>
                            <div className="flex flex-row flex-wrap gap-2 max-h-48 pr-2">
                                {categories?.map((cat) => (
                                    <label key={cat.id} className="label cursor-pointer justify-start gap-2 p-1">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox ring-2 ring-gray-600 checkbox-sm checked:text-black"
                                            checked={selectedCategories.includes(cat.id)}
                                            onChange={() => {handleCheckboxChange(cat.id)}}
                                        />
                                        <span className="text-black capitalize">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </label>
                        <button className='btn btn-neutral' type='submit'>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
