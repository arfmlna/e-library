import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function DialogUpdate({title, openToggle, setOpenToggle, handleUpdate, password, setPassword, avatar, handlePreviewAvatar }){
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
                        <label htmlFor="name">
                            <p className='text-black'>Name<span className='text-red-600'>*</span></p>
                            <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="name" id="name" placeholder='Insert Name...' required defaultValue={openToggle?.data?.name} />
                        </label>
                        <button className='btn btn-neutral' type='submit' disabled={password}>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
