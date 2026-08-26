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
                        <label htmlFor="supplier" className="text-sm font-medium text-base-content/80">
                            Title<span className="text-error ml-0.5">*</span>
                        </label>
                        <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        placeholder="Insert Agenda Name..." 
                        required
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="supplier" className="text-sm font-medium text-base-content/80">
                            Event Date<span className="text-error ml-0.5">*</span>
                        </label>
                        <input 
                        type="datetime-local" 
                        name="eventDate" 
                        id="eventDate" 
                        placeholder="Insert Event Date..." 
                        required
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="supplier" className="text-sm font-medium text-base-content/80">
                            Location<span className="text-error ml-0.5">*</span>
                        </label>
                        <input 
                        type="text" 
                        name="location" 
                        id="location" 
                        placeholder="Insert Location..." 
                        required
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="supplier" className="text-sm font-medium text-base-content/80">
                            Theme<span className="text-error ml-0.5">*</span>
                        </label>
                        <select
                        name="theme" 
                        id="theme" 
                        required
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                            <option className='bg-blue-500 text-white py-1 px-2' value="blue">Blue</option>
                            <option className='bg-purple-500 text-white py-1 px-2' value="purple">Purple</option>
                            <option className='bg-green-500 text-white py-1 px-2' value="green">Green</option>
                            <option className='bg-yellow-500 text-gray-800 py-1 px-2' value="yellow">Yellow</option>
                        </select>
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
