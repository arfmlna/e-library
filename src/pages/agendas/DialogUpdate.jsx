import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { toInputDateTimeDefault } from '@/constants/toInputDateTimeDefault'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function DialogUpdate({title, openToggle, setOpenToggle, handleUpdate, password, setPassword, avatar, handlePreviewAvatar }){
    const [showInput, setShowInput] = useState({
        title: false,
        eventDate: false,
        location: false,
        theme: false,
    })
    const theme = localStorage.getItem('theme')

    const handleSetOpenToggle = () => {
        setShowInput({
            title: false,
            eventDate: false,
            location: false,
            theme: false,
        })
        setOpenToggle()
    }
    
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
                <div className="overflow-hidden pr-1">
                    <form onSubmit={(e) => handleUpdate(e, openToggle?.data?.id)} method="post" className="flex flex-col gap-4">
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
                            <label htmlFor="supplier" className="text-sm font-medium text-base-content/80">
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
                    {/* eventDate */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.eventDate ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, eventDate: !showInput?.eventDate}))}
                        >
                        <span>{showInput?.eventDate ? '✕ Cancel' : '✎ Set Event Date'}</span>
                        </button>
                        {showInput?.eventDate && (
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
                            defaultValue={toInputDateTimeDefault(openToggle?.data?.eventDate)}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>
                    {/* location */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.location ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, location: !showInput?.location}))}
                        >
                        <span>{showInput?.location ? '✕ Cancel' : '✎ Set Location'}</span>
                        </button>
                        {showInput?.location && (
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
                            defaultValue={openToggle?.data?.location}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>
                    {/* theme */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.theme ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, theme: !showInput?.theme}))}
                        >
                        <span>{showInput?.theme ? '✕ Cancel' : '✎ Set Theme'}</span>
                        </button>
                        {showInput?.theme && (
                        <select
                        name="theme" 
                        id="theme" 
                        required
                        defaultValue={openToggle?.data?.theme}
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                            <option className='bg-blue-500 text-white py-1 px-2' value="blue">Blue</option>
                            <option className='bg-purple-500 text-white py-1 px-2' value="purple">Purple</option>
                            <option className='bg-green-500 text-white py-1 px-2' value="green">Green</option>
                            <option className='bg-yellow-500 text-gray-800 py-1 px-2' value="yellow">Yellow</option>
                        </select>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={password}
                        className="btn btn-primary w-full h-10 mt-2 inline-flex items-center justify-center rounded-lg text-sm font-medium shadow transition-colors"
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
