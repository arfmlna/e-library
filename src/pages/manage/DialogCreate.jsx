import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { pb } from '@/utils/pocketbase'
import { X } from 'lucide-react'
import Swal from 'sweetalert2'

export default function DialogCreate({
    title, 
    role=false, 
    refreshData,
    openToggle, 
    setOpenToggle, 
    avatar, 
    handlePreviewAvatar,
    handlePasswordChange
}){
    const theme = localStorage.getItem('theme')

    const handleAdd = async (e) => {
        e.preventDefault()
        const allInputData = new FormData(e.target)
        const data = Object.fromEntries(allInputData.entries())

        if (role !== 'edmin') {
            data.role = 'users'
        }

        data.emailVisibility = true
        data.status = 'verified'
        data.passwordConfirm = data.password
        
        Swal.fire({
            title: 'Mohon Tunggu',
            text: 'Sedang menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await pb.collection('users').create(data);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data baru telah ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });

            e.target.reset();
            refreshData()
            setOpenToggle()
        } catch (error) {
            console.error("Error Detail:", error.data);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: error.message || 'Terjadi kesalahan pada server'
            });
        }
    }
    return (
        <Dialog open={openToggle} onClose={setOpenToggle} data-theme={theme} >
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/40" />
            <DialogPanel className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-2xl sm:w-full sm:p-8 bg-base-100 text-base-content border-base-200">
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
                <div className="overflow-y-auto max-h-[70vh] pr-1">
                    <form onSubmit={handleAdd} method="post" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
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
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
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
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    { role === 'edmin' && (
                        <div className="flex flex-col gap-1.5">
                        <label htmlFor="role" className="text-sm font-medium text-base-content/80">
                            Role<span className="text-error ml-0.5">*</span>
                        </label>
                        <select 
                            name="role" 
                            id="role" 
                            defaultValue="users"
                            className="select select-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                            <option value="petugas" className="bg-base-100 text-base-content">Petugas</option>
                            <option value="users" className="bg-base-100 text-base-content">Siswa</option>
                        </select>
                        </div>
                    )}
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
                        {avatar && (
                        <div className="mt-2 overflow-hidden rounded-lg border border-base-300 shadow-inner">
                            <img className="w-full max-h-40 object-cover aspect-video" src={avatar} alt="avatar preview" />
                        </div>
                        )}
                    </div>
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
                        onChange={handlePasswordChange}
                        autoComplete='new-password'
                        className="input input-bordered w-full h-10 px-3 text-sm bg-base-100 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-neutral w-full h-10 mt-2 inline-flex items-center justify-center rounded-lg text-sm font-medium shadow"
                    >
                        Submit
                    </button>
                    </form>
                </div>
                </div>
            </DialogPanel>
        </Dialog>
    )
}
