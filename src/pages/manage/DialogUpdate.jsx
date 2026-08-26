import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { pb } from '@/utils/pocketbase'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function DialogUpdate({
    title, 
    role=null,
    openToggle, 
    setOpenToggle, 
    handleUpdate, 
    password, 
    setPassword, 
    avatar, 
    handlePreviewAvatar 
}){
    const [showInput, setShowInput] = useState({
        email: false,
        name: false,
        role: false,
        avatar: false,
        password: false
    })

    const theme = localStorage.getItem('theme')

    const handleSetOpenToggle = () => {
        setShowInput({
            avatar: false,
            name: false,
            role: false,
            email: false,
            password: false
        })
        setOpenToggle()
    }

    const avatarUrl = pb.files.getURL(openToggle.data, openToggle.data.avatar)
    
    return (
        <Dialog data-theme={theme} open={openToggle?.status} onClose={handleSetOpenToggle}>
            {/* Backdrop transparan dengan efek blur halus */}
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
            
            {/* DialogPanel dibiarkan polos untuk tata letak dasar */}
            <DialogPanel className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-2xl transition-all sm:w-full sm:p-8 bg-base-100 text-base-content border-base-200">
                
                {/* PEMBUNGKUS UTAMA DAISYUI: Menggunakan nilai dinamis dari Local Storage */}
                <div className="w-full h-full bg-base-100 text-base-content">
                
                {/* Tombol Tutup Modern */}
                <button 
                    type="button"
                    onClick={handleSetOpenToggle} 
                    className="absolute right-4 top-4 rounded-md p-1.5 opacity-70 hover:opacity-100 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <DialogHeader className="mb-5">
                    <DialogTitle className="text-xl font-bold tracking-wide uppercase text-center text-base-content">
                    UPDATED {title}
                    </DialogTitle>
                </DialogHeader>

                {/* Form Konten dengan Scroll Aman */}
                <div className="overflow-y-auto max-h-[65vh] pr-1">
                    <form onSubmit={(e) => handleUpdate(e, openToggle?.data?.id)} method="post" className="flex flex-col gap-4">
                    
                    {/* Kelompok Input: Email */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.email ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, email: !showInput?.email}))}
                        >
                        <span>{showInput?.email ? '✕ Cancel' : '✎ Set Email'}</span>
                        </button>
                        {showInput?.email && (
                        <div className="flex flex-col gap-1.5 animate-fadeIn">
                            <label htmlFor="email" className="text-sm font-medium text-base-content/80">
                            Email<span className="text-error ml-0.5">*</span>
                            </label>
                            <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="Insert Email..." 
                            required 
                            autoComplete='email'
                            defaultValue={openToggle?.data?.email}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>

                    {/* Kelompok Input: Name */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.name ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, name: !showInput?.name}))}
                        >
                        <span>{showInput?.name ? '✕ Cancel' : '✎ Set Name'}</span>
                        </button>
                        {showInput?.name && (
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
                            autoComplete='username'
                            defaultValue={openToggle?.data?.name}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>

                    {/* Kelompok Input: Position/Role (Conditional) */}
                    {role === 'edmin' && (
                        <div className="flex flex-col gap-2">
                        <button 
                            type="button"
                            className={`btn btn-sm ${showInput?.role ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                            onClick={() => setShowInput((p) => ({...p, role: !showInput?.role}))}
                        >
                            <span>{showInput?.role ? '✕ Cancel' : '✎ Set Position'}</span>
                        </button>
                        {showInput?.role && (
                            <div className="flex flex-col gap-1.5">
                            <label htmlFor="role" className="text-sm font-medium text-base-content/80">
                                Role<span className="text-error ml-0.5">*</span>
                            </label>
                            <select 
                                name="role" 
                                id="role" 
                                defaultValue={openToggle?.data?.role}
                                className="select select-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="petugas" className="bg-base-100 text-base-content">Petugas</option>
                                <option value="users" className="bg-base-100 text-base-content">Siswa</option>
                            </select>
                            </div>
                        )}
                        </div>
                    )}

                    {/* Kelompok Input: Avatar */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.avatar ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, avatar: !showInput?.avatar}))}
                        >
                        <span>{showInput?.avatar ? '✕ Cancel' : '✎ Set Avatar'}</span>
                        </button>
                        {showInput?.avatar && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="avatar" className="text-sm font-medium text-base-content/80">
                            Avatar
                            </label>
                            <input 
                            type="file" 
                            name="avatar" 
                            id="avatar" 
                            onChange={handlePreviewAvatar}
                            className="file-input file-input-bordered file-input-primary w-full text-sm h-10 cursor-pointer" 
                            />
                            <div className="mt-2 overflow-hidden rounded-lg border border-base-300 shadow-inner bg-base-200">
                            {avatar ? (
                                <img className="w-full max-h-40 object-cover aspect-video" src={avatar} alt="avatar preview" />
                            ) : openToggle?.data?.avatar && (
                                <img className="w-full max-h-40 object-cover aspect-video" src={avatarUrl} alt="avatar current" />
                            )}
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Kelompok Input: Password */}
                    <div className="flex flex-col gap-2">
                        <button 
                        type="button"
                        className={`btn btn-sm ${showInput?.password ? 'btn-active' : 'btn-outline'} w-full justify-start gap-2`}
                        onClick={() => setShowInput((p) => ({...p, password: !showInput?.password}))}
                        >
                        <span>{showInput?.password ? '✕ Cancel' : '✎ Set Password'}</span>
                        </button>
                        {showInput?.password && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-base-content/80">
                            Password<span className="text-error ml-0.5">*</span>
                            </label>
                            <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Insert Password..." 
                            required 
                            autoComplete='new-password'
                            onChange={setPassword}
                            className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        )}
                    </div>

                    {/* Tombol Submit Utama */}
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
