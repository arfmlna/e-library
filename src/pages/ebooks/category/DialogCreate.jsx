import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { X } from 'lucide-react'

export default function DialogCreate({
    title, 
    openToggle, 
    setOpenToggle, 
    handleAdd
}){
    const theme = localStorage.getItem('theme')
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
                <div className="overflow-hidden pr-1">
                    <form onSubmit={handleAdd} method="post" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-base-content/80">
                        Name<span className="text-error ml-0.5">*</span>
                        </label>
                        <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder="Insert Name..." 
                        required
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full h-10 mt-2 inline-flex items-center justify-center rounded-lg text-sm font-medium shadow transition-colors"
                    >
                        Submit Data
                    </button>
                    </form>
                </div>

                </div>
            </DialogPanel>
        </Dialog>

    )
}
