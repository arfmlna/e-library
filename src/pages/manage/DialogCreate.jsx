import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { X } from 'lucide-react'

export default function DialogCreate({title, openToggle, setOpenToggle, handleAdd, password, setPassword, avatar, handlePreviewAvatar }){
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
                        <label htmlFor="email">
                            <p className='text-black'>Email<span className='text-red-600'>*</span></p>
                            <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="email" name="email" id="email" placeholder='Insert Email...' required />
                        </label>
                            <label htmlFor="name">
                                <p className='text-black'>Name<span className='text-red-600'>*</span></p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="name" id="name" placeholder='Insert Name...' required />
                            </label>
                        { title === 'all role' && (
                            <label htmlFor="role">
                                <p className='text-black'>Role<span className='text-red-600'>*</span></p>
                                <select name="role" id="role" className='w-full h-10 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' defaultValue="users">
                                    <option value="petugas">Petugas</option>
                                    <option value="users">Siswa</option>
                                </select>
                            </label>
                        ) }
                        <label htmlFor="avatar">
                            <p className='text-black'>Avatar</p>
                            <input className='w-full h-10 p-2 mb-1 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="file" name="avatar" id="avatar" placeholder='Insert Name...' onChange={handlePreviewAvatar} />
                            { avatar && (
                                <img className='border-2 border-black rounded-md object-cover aspect-video' src={avatar} alt="avatar" />
                            ) }
                        </label>
                        <div className="flex flex-row gap-2">
                            <label htmlFor="password">
                                <p className='text-black'>Password<span className='text-red-600'>*</span></p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="password" name="password" id="password" placeholder='Insert Password...' required onChange={setPassword} />
                            </label>
                            <label htmlFor="passwordConfirm">
                                <p className='text-black'>Confirm Password<span className='text-red-600'>*</span></p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="password" name="passwordConfirm" id="passwordConfirm" placeholder='Insert Confirm Password...' onChange={setPassword} required />
                            </label>
                        </div>
                        <button className='btn btn-neutral' type='submit' disabled={password}>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
